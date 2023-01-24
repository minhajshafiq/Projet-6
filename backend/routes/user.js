const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// On définit le chemin pour gérer les opérations lier à la l'inscription et à la connexion d'un utilisateur
router.post('/signup', userCtrl.signup); // Gère l'inscription
router.post('/login', userCtrl.login); // Gère la connexion

module.exports = router;