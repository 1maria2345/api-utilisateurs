// Accès à l'authentification Supabase (le controller ne parle jamais directement à Supabase)
const authDb = require('../db/authDb');

// Vérifie l'email et le mot de passe envoyés dans le corps (signup et signin)
// Renvoie un message d'erreur si quelque chose ne va pas, ou null si tout est valide
const validateCredentials = ({ email, password }) => {
  if (email === undefined || password === undefined) {
    return 'email et password sont requis';
  }

  // Format simple : du texte, sans espace, avec un @ et un point après (ex : lina@mail.com)
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "L'email n'est pas valide";
  }

  // Supabase exige au moins 6 caractères
  if (typeof password !== 'string' || password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }

  return null;
};

// POST /auth/signup : crée un nouveau compte
const signUp = async (req, res) => {
  const data = req.body || {};

  const erreur = validateCredentials(data);
  if (erreur) {
    return res.status(400).json({ message: erreur });
  }

  const email = data.email.trim().toLowerCase();

  let account;
  try {
    account = await authDb.createAccount(email, data.password);
  } catch (error) {
    // 409 = "Conflict" : un compte existe déjà avec cet email
    if (error.code === 'email_exists') {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }
    console.error('Erreur Supabase Auth (signUp) :', error.message);
    return res.status(500).json({ message: 'Erreur lors de la création du compte' });
  }

  res.status(201).json({ id: account.id, email: account.email });
};

// POST /auth/signin : connecte un utilisateur et renvoie son access_token
const signIn = async (req, res) => {
  const data = req.body || {};

  const erreur = validateCredentials(data);
  if (erreur) {
    return res.status(400).json({ message: erreur });
  }

  const email = data.email.trim().toLowerCase();

  let session;
  try {
    session = await authDb.signIn(email, data.password);
  } catch (error) {
    // On ne précise pas si c'est l'email ou le mot de passe qui est faux
    if (error.code === 'invalid_credentials') {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    console.error('Erreur Supabase Auth (signIn) :', error.message);
    return res.status(500).json({ message: 'Erreur lors de la connexion' });
  }

  res.status(200).json({
    access_token: session.access_token,
    expires_in: session.expires_in, // durée de validité du jeton, en secondes
    user: { id: session.user.id, email: session.user.email },
  });
};

module.exports = { signUp, signIn };
