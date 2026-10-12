// Base de données temporaire : un simple tableau en mémoire.
// ⚠️ Les données sont perdues à chaque redémarrage du serveur.
const users = [
  { id: 1, nom: 'Alice', age: 28, ville: 'Paris' },
  { id: 2, nom: 'Karim', age: 35, ville: 'Lyon' },
  { id: 3, nom: 'Sofia', age: 22, ville: 'Marseille' },
];

module.exports = users;
