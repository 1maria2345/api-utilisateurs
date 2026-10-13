// Charge les variables du fichier .env dans process.env (fonction intégrée à Node.js)
process.loadEnvFile();

const express = require('express');
const usersRoutes = require('./routes/users.routes');

const app = express();
const PORT = 3000;

// Route principale : vérifie que le serveur tourne
app.get('/', (req, res) => {
  res.json({ message: 'Serveur lancé avec succès 🚀' });
});

// Middleware : permet à Express de lire le JSON envoyé dans le corps des requêtes
app.use(express.json());

// Toutes les routes qui commencent par /users sont gérées par usersRoutes
app.use('/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
