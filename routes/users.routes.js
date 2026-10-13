const express = require('express');
const { getAllUsers, getUserById, createUser, deleteUser } = require('../controllers/users.controller');

// Un "Router" est un mini-groupe de routes qu'on branche ensuite sur l'app
const router = express.Router();

// Les chemins sont relatifs à "/users" (défini dans index.js)
router.get('/', getAllUsers);      // GET /users
router.get('/:id', getUserById);   // GET /users/:id
router.post('/', createUser);      // POST /users
router.delete('/:id', deleteUser); // DELETE /users/:id

module.exports = router;
