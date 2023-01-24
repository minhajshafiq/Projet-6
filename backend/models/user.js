const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


// On crée un schéma pour l'utilisateur
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Veuillez entrer une adresse mail"],
    lowercase: true,
    unique: true, // On s'assure que l'email est unique
  },
  password: {
    type: String,
    required: [true, "Veuillez entrer un mot de passe"],
  },
});

// On vérifie si les données rentrée sont uniques dans la base de donnée MongoDB
userSchema.plugin(uniqueValidator);

// On exporte ce schéma en modèle utilisable
module.exports = mongoose.model("User", userSchema);