// Accès à l'authentification Supabase (les comptes sont dans la table auth.users, gérée par Supabase)
const { createClient } = require('@supabase/supabase-js');
const supabase = require('./supabaseClient');

// Crée un client Supabase neuf, utilisé pour une seule connexion puis jeté.
// Sinon, la session de l'utilisateur connecté resterait dans le client partagé
// et toutes les requêtes suivantes vers la base partiraient avec SON jeton.
const createTemporaryClient = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

// Crée un compte déjà confirmé (pas d'email de confirmation à cliquer)
const createAccount = async (email, password) => {
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  return data.user;
};

// Connecte un utilisateur et renvoie sa session (qui contient l'access_token)
const signIn = async (email, password) => {
  const client = createTemporaryClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
};

// Renvoie l'utilisateur correspondant à un access_token, ou null si le jeton est invalide ou expiré
const getUserFromToken = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    // Erreur 4xx : le jeton est refusé par Supabase
    if (error.status >= 400 && error.status < 500) return null;
    // Autre erreur : problème de communication avec Supabase
    throw error;
  }
  return data.user;
};

module.exports = { createAccount, signIn, getUserFromToken };
