const express = require('express'); // Import d'Express
const mongoose = require('mongoose'); // Import de Mongoose 
const bodyParser = require("body-parser"); // Import de BodyParser
const path = require('path'); // Import de Path

// On utilise "dotenv" pour masquer les informations sensibles de la base de données 
require("dotenv").config();

// On import les routes pour les utiliser par la suite
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion à la base de données
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MDB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Lance Express
const app = express();

/**
 * Middleware de sécurité qui bloque les appels HTTP entre des serveurs différents ce qui empêche des requêtes malveillantes qui est nommé CORS « Cross Origin Resource Sharing »
 * @param res - on définit les valeurs avec 'setHeader' pour la sécurité
 * @param next - permet de terminer la fonction pour passer à la suivante
 */
app.use((req, res, next) => {
  //On peut accéder à l'API depuis n'importe quelle origine mais on peut contrôler qui a accès aux données
  res.setHeader('Access-Control-Allow-Origin', '*');
  //On ajoute les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // On définit les rêquetes que le serveur acceptera 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
  next();
});

// Transforme les données d'une requête POST en un objet JSON
app.use(bodyParser.json());

// On définit les routes 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); // On définit le middleware pour les images

// On exporte app
module.exports = app;