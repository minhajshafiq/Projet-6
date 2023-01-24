const mongoose = require('mongoose');

// On crée un schéma de données qui contient les champs souhaités pour chaque Sauce
const sauceSchema = mongoose.Schema({
  // ID de l'utilisateur qui a crée la sauce
  userId: { type: String, required: true,},
  name: { type: String, required: true },
  // Fabricant de la sauce
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  // Le principal ingrédient épicé de la sauce
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  // Note décrivant la sauce
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  // Tableau des identifiants des utilisateurs qui ont aimé la sauce
  usersLiked: { type: [String], default: [] },
  // Tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
  usersDisliked: { type: [String], default: [] },
});

// On exporte ce schéma en modèle
module.exports = mongoose.model('Sauce', sauceSchema);