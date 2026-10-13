// Import de la "base de données" temporaire
const users = require('../data/users');

// Vérifie qu'un id reçu dans l'URL est un entier positif (1, 2, 42...)
// ^[1-9]\d*$ : un chiffre de 1 à 9, suivi de n'importe quels chiffres, et rien d'autre
const isValidId = (id) => /^[1-9]\d*$/.test(id);

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
  // L'id doit être un entier positif, sinon la requête est invalide
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "L'id doit être un entier positif" });
  }

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

// DELETE /users/:id : supprime un utilisateur selon son id
const deleteUser = (req, res) => {
  // L'id doit être un entier positif, sinon la requête est invalide
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "L'id doit être un entier positif" });
  }

  const id = Number(req.params.id);

  // On cherche la POSITION de l'utilisateur dans le tableau (-1 s'il n'existe pas)
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  // On retire 1 élément à cette position ; splice renvoie un tableau des éléments retirés
  const [deletedUser] = users.splice(index, 1);

  res.status(200).json({ message: 'Utilisateur supprimé', user: deletedUser });
};

// PUT /users/:id : remplace les informations d'un utilisateur existant
const updateUser = (req, res) => {
  // L'id doit être un entier positif, sinon la requête est invalide
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "L'id doit être un entier positif" });
  }

  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  // L'utilisateur doit exister
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  const { nom, age, ville } = req.body || {};

  // Comme pour POST : les 3 champs sont obligatoires
  if (!nom || age === undefined || !ville) {
    return res.status(400).json({ message: 'nom, ville et age sont requis' });
  }

  // On modifie directement l'objet trouvé dans le tableau (l'id ne change pas)
  user.nom = nom;
  user.age = age;
  user.ville = ville;

  res.status(200).json(user);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
