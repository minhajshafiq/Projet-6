const http = require('http'); // Import du package HTTP
const app = require('./app'); // Import du fichier app 

// La fonction normalizePort renvoie supérieur ou égal à 0 avec la méthode parseInt pour renvoyer un nombre entier
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Si aucun port n'est fourni on écoutera sur le port 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // Définie le port pour les connexions entrantes

// La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée puis est enregistrée dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur 
const server = http.createServer(app);

// Lance le serveur et indique sur quel port il doit se connecter ou gérer les erreurs 
server.on('error', errorHandler);
server.on('listening', () => { 
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

// Le serveur est prêt à reçevoir les rêquetes qui arriveront sur le port
server.listen(port); 