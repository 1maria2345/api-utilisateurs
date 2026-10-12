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

// Route GET /users : renvoie la liste de tous les utilisateurs
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// 5. On démarre le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
