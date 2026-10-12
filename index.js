const express = require('express');
const usersRoutes = require('./routes/users.routes');

const app = express();
const PORT = 3000;

// Route principale : vérifie que le serveur tourne
app.get('/', (req, res) => {
  res.json({ message: 'Serveur lancé avec succès 🚀' });
});

// Toutes les routes qui commencent par /users sont gérées par usersRoutes
app.use('/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
