// 1. On importe Express (la bibliothèque installée avec npm install express)
const express = require('express');

// On importe notre "base de données" temporaire (le tableau d'utilisateurs)
const users = require('./data/users');

// 2. On crée notre application (notre serveur)
const app = express();

// 3. Le port sur lequel le serveur va écouter
const PORT = 3000;

// 4. Route principale : quand on visite http://localhost:3000/
//    - req (request)  : ce que le client envoie
//    - res (response) : ce que le serveur renvoie
app.get('/', (req, res) => {
  res.json({ message: 'Serveur lancé avec succès 🚀' });
});

// Route GET /users : renvoie tous les utilisateurs,
// ou seulement ceux de certaines villes si on ajoute ?ville=... dans l'URL
app.get('/users', (req, res) => {
  const { ville } = req.query;

  // Pas de filtre demandé : on renvoie tout le monde
  if (!ville) {
    return res.status(200).json(users);
  }

  // On transforme le filtre en liste de villes en minuscules
  // "Paris,Lyon" -> ["paris", "lyon"]
  const villes = String(ville)
    .split(',')
    .map((v) => v.trim().toLowerCase());

  // On garde seulement les utilisateurs dont la ville est dans la liste
  const resultat = users.filter((u) => villes.includes(u.ville.toLowerCase()));

  res.status(200).json(resultat);
});

// Route GET /users/:id : renvoie un seul utilisateur selon son id
app.get('/users/:id', (req, res) => {
  // L'id arrive dans l'URL sous forme de texte ("2"), on le convertit en nombre
  const id = Number(req.params.id);

  // On cherche l'utilisateur qui a cet id dans le tableau
  const user = users.find((u) => u.id === id);

  // S'il n'existe pas : erreur 404 (introuvable)
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  // Sinon : on le renvoie avec le statut 200
  res.status(200).json(user);
});

// 5. On démarre le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
