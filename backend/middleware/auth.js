const jwToken = require("jsonwebtoken");

/**
 * Middleware d'authentification qui va vérifier que l'utilisateur utilise bien son token
 * @param req - On récupère le token, on le vérifie puis on le transmet aux autres middlewares et au gestionnaire de route
 * @param res - Affiche une erreur si le token n'est pas valide et montrera le statut "Unauthorized"
 * @param next - On termine l'exécution de la fonction
 */
module.exports = (req, res, next) => {
  try {
    // Récupération du token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwToken.verify(token, process.env.RANDOM_TOKEN_SECRET);
    // Récupération du token de l'userId
    const userId = decodedToken.userId;
    // On déclare que c'est l'utilisateur qui a fait la requête
    req.auth = { userId: userId };
    // On vérifie que l'utilisiteur est le même que celui qui fait la requête
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID invalide";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};