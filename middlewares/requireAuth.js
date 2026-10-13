const authDb = require('../db/authDb');

// Middleware : laisse passer la requête seulement si elle contient un access_token valide
// dans l'en-tête "Authorization: Bearer <access_token>"
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;

  // Pas d'en-tête, ou pas au format "Bearer ..."
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  const token = header.slice('Bearer '.length).trim();

  let user;
  try {
    user = await authDb.getUserFromToken(token);
  } catch (error) {
    console.error('Erreur Supabase Auth (requireAuth) :', error.message);
    return res.status(500).json({ message: "Erreur lors de la vérification de l'authentification" });
  }

  if (!user) {
    return res.status(401).json({ message: 'Jeton invalide ou expiré' });
  }

  // On garde l'utilisateur connecté dans la requête, au cas où une route en aurait besoin
  req.user = user;
  next();
};

module.exports = requireAuth;
