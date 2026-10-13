const express = require('express');
const { signUp, signIn } = require('../controllers/auth.controller');

const router = express.Router();

// Les chemins sont relatifs à "/auth" (défini dans index.js)
router.post('/signup', signUp); // POST /auth/signup
router.post('/signin', signIn); // POST /auth/signin

module.exports = router;
