// Import de la "base de données" temporaire
const users = require('../data/users');

// GET /users : renvoie tous les utilisateurs,
// ou seulement ceux de certaines villes avec ?ville=Paris,Lyon
const getAllUsers = (req, res) => {
  const { ville } = req.query;

  // Pas de filtre demandé : on renvoie tout le monde
  if (!ville) {
    return res.status(200).json(users);
  }

  // "Paris,Lyon" -> ["paris", "lyon"]
  const villes = String(ville)
    .split(',')
    .map((v) => v.trim().toLowerCase());

  const resultat = users.filter((u) => villes.includes(u.ville.toLowerCase()));

  res.status(200).json(resultat);
};

// GET /users/:id : renvoie un seul utilisateur selon son id
const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  res.status(200).json(user);
};

module.exports = { getAllUsers, getUserById };
