// Connexion à la base de données Supabase (table "users")
const supabase = require('../config/supabase');

// Vérifie qu'un id reçu dans l'URL est un entier positif (1, 2, 42...)
// ^[1-9]\d*$ : un chiffre de 1 à 9, suivi de n'importe quels chiffres, et rien d'autre
const isValidId = (id) => /^[1-9]\d*$/.test(id);

// Vérifie les données d'un utilisateur envoyées dans le corps (POST et PUT)
// Renvoie un message d'erreur si quelque chose ne va pas, ou null si tout est valide
const validateUserData = ({ nom, age, ville }) => {
  // Champs manquants
  if (nom === undefined || age === undefined || age === null || ville === undefined) {
    return 'nom, ville et age sont requis';
  }

  // nom et ville : du texte, pas vide (les espaces seuls ne comptent pas)
  if (typeof nom !== 'string' || nom.trim() === '') {
    return 'nom doit être un texte non vide';
  }
  if (typeof ville !== 'string' || ville.trim() === '') {
    return 'ville doit être un texte non vide';
  }

  // age : un nombre entier, positif ou nul
  if (!Number.isInteger(age) || age < 0) {
    return 'age doit être un entier positif ou nul';
  }

  return null;
};

// GET /users : renvoie tous les utilisateurs,
// ou seulement ceux de certaines villes avec ?ville=Paris,Lyon
const getAllUsers = async (req, res) => {
  // On attend (await) la réponse de Supabase : { data, error }
  const { data: users, error } = await supabase.from('users').select('*').order('id');

  // Problème côté base de données (table absente, Supabase injoignable...)
  if (error) {
    console.error('Erreur Supabase (getAllUsers) :', error.message);
    return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }

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
const getUserById = async (req, res) => {
  // L'id doit être un entier positif, sinon la requête est invalide
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "L'id doit être un entier positif" });
  }

  const id = Number(req.params.id);

  // maybeSingle() : renvoie l'utilisateur, ou null s'il n'existe pas
  const { data: user, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('Erreur Supabase (getUserById) :', error.message);
    return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  res.status(200).json(user);
};

// POST /users : crée un nouvel utilisateur à partir du corps de la requête
const createUser = async (req, res) => {
  // req.body vaut undefined si le client n'envoie pas de JSON : on prend alors un objet vide
  const data = req.body || {};

  // On vérifie les données ; s'il y a une erreur, on répond 400 avec le message
  const erreur = validateUserData(data);
  if (erreur) {
    return res.status(400).json({ message: erreur });
  }

  // On enlève les espaces autour du nom et de la ville avant d'enregistrer
  const nom = data.nom.trim();
  const ville = data.ville.trim();
  const { age } = data;

  // L'id est généré automatiquement par la base de données
  // select().single() : renvoie l'utilisateur créé (avec son id)
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({ nom, age, ville })
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (createUser) :', error.message);
    return res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
  }

  // 201 = "Created" : la ressource a bien été créée
  res.status(201).json(newUser);
};

// DELETE /users/:id : supprime un utilisateur selon son id
const deleteUser = async (req, res) => {
  // L'id doit être un entier positif, sinon la requête est invalide
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "L'id doit être un entier positif" });
  }

  const id = Number(req.params.id);

  // select().maybeSingle() : renvoie l'utilisateur supprimé, ou null s'il n'existait pas
  const { data: deletedUser, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Erreur Supabase (deleteUser) :', error.message);
    return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }

  if (!deletedUser) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  res.status(200).json({ message: 'Utilisateur supprimé', user: deletedUser });
};

// PUT /users/:id : remplace les informations d'un utilisateur existant
const updateUser = async (req, res) => {
  // L'id doit être un entier positif, sinon la requête est invalide
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "L'id doit être un entier positif" });
  }

  const id = Number(req.params.id);
  const data = req.body || {};

  // Comme pour POST : on vérifie les données
  const erreur = validateUserData(data);
  if (erreur) {
    return res.status(400).json({ message: erreur });
  }

  // On enlève les espaces autour du nom et de la ville avant d'enregistrer
  const nom = data.nom.trim();
  const ville = data.ville.trim();
  const { age } = data;

  // select().maybeSingle() : renvoie l'utilisateur modifié, ou null s'il n'existe pas (l'id ne change pas)
  const { data: user, error } = await supabase
    .from('users')
    .update({ nom, age, ville })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Erreur Supabase (updateUser) :', error.message);
    return res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur" });
  }

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  res.status(200).json(user);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
