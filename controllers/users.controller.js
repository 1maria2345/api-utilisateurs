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

// POST /users : crée un nouvel utilisateur à partir du corps de la requête
const createUser = (req, res) => {
  // req.body vaut undefined si le client n'envoie pas de JSON : on prend alors un objet vide
  const { nom, age, ville } = req.body || {};

  // Vérification minimale : les 3 champs doivent être présents
  if (!nom || age === undefined || !ville) {
    return res.status(400).json({ message: 'nom, ville et age sont requis' });
  }

  // Nouvel id = plus grand id existant + 1 (ou 1 si la liste est vide)
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = { id: newId, nom, age, ville };
  users.push(newUser);

  // 201 = "Created" : la ressource a bien été créée
  res.status(201).json(newUser);
};

module.exports = { getAllUsers, getUserById, createUser };
