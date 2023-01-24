const multer = require('multer');

// On définit les extensions des images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/**
 * On configure multer avec la destination de sauvegarde de l'image et son nom
 * @param file - On récupère le nom de l'image et on s'assure que l'image envoyée correspond à l'extension de la liste établie si dessus
 * @param callback - Le nom du dossier de sauvegarde et le nom de l'image avec son extension
 */

// On utilise multer pour sauvegarder les images
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// On exporte multer en indiquant qu'il s'agit de fichier image uniquement
module.exports = multer({storage: storage}).single('image');