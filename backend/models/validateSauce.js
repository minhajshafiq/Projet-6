const Joi = require('joi');

// On définit les paramètres à vérifier de ce que l'utilsateur à rentrer 
const sauceValidationSchema = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().trim().min(1).required(),
    manufacturer: Joi.string().trim().min(1).required(),
    description: Joi.string().min(1).trim().required(),
    mainPepper: Joi.string().trim().min(1).required(),
    heat: Joi.number().min(1).max(10).required()
});


// On vérifie si tous est correct et on retourne les données si c'est le cas
const validateSauce = (sauce) => {
    const { value, error } = sauceValidationSchema.validate(sauce);
    if (error) {
        return { error: error.message };
    }
    return { value };
}

// On export les données pour pouvoir les utiliser dans le controller
module.exports = {
    sauceValidationSchema,
    validateSauce
}

