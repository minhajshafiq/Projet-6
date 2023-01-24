const sauceModels = require('../models/sauce');
const fs = require('fs');
const { sauceValidationSchema, validateSauce } = require('../models/validateSauce');

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const { error } = validateSauce(sauceObject);   
    if (error) {
        return res.status(400).json({ error: error });
    }
    // Sauvegarde les données de la sauce valide dans la base de données
    const newSauce = new sauceModels({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    newSauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistré !' })})
    .catch(error => { res.status(400).json({ error })})
}



/**
 * Middleware de récupération de toutes les sauces
 * @param res - Si on récupère toutes les sauces le status sera "OK" sinon "Not Found"
 */
exports.getAllSauces = (req, res) => {
    sauceModels.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
}

/**
 * Middleware de récupération d'une seule sauce
 * @param req - On récupère l'id d'une sauce
 * @param res 
 */
exports.getOneSauce = (req, res) => {
    sauceModels.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

/**
 * Middleware de modification d'une sauce
 * @param req - On récupère l'id puis l'ensemble des éléments du 'body'
 * @param res 
 */
exports.modifySauce = (req, res) => {
    sauceModels.findOne({ _id: req.params.id })
        .then(sauce => {
            if(sauce.userId !== req.auth.userId) return res.status(403).json({ message: 'Opération non-autorisée' });

            const sauceObject = req.file ? {
                ...JSON.parse(req.body.sauce), 
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };

            delete sauceObject.userId;

            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauceModels.updateOne({
                    _id: req.params.id
                }, {
                    // L'opérateur spread "..." permet de faire une copie de tous les éléments de 'sauceObject'
                    ...sauceObject,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
                .catch(error => res.status(400).json({ error }));
            })
        });
}

/**
 * Middleware de suppression d'une sauce
 * @param req - On récupère l'id et on fait une vérification entre l'id d'un utilisateur et celle de la sauce
 * @param res
 */
exports.deleteSauce = (req, res) => {
    sauceModels.findOne({ _id: req.params.id })
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({ message : 'Non-autorisé' });
        } 
        
        const filename = sauce.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`, () => {
            sauceModels.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                .catch(error => res.status(400).json({ error }));
            });
    })
    
    .catch(error => { res.status(500).json({ error })})
}

/**
 * Middleware j'aime ou je n'aime pas une sauce
 * @param req - On récupère l'id de l'utilisateur, de la sauce et de 'like'
 * @param res
 */
exports.likesAndDislikes = (req, res) => {
    sauceModels.findOne({ _id: req.params.id })
        .then(sauce => {
            switch(req.body.like) {
                // Vérification que l'utilisateur n'a pas déjà liké la sauce (n'existe pas dans le tableau des utilisateurs)
                case 1:
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        sauceModels.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: 1 },
                                $push: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "J'aime cette sauce !" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
                // Vérification que l'utilisateur n'a pas déjà disliké la sauce (n'existe pas dans le tableau des utilisateurs)
                case -1:
                    if (!sauce.usersDisliked.includes(req.body.userId)) {
                        sauceModels.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: 1 },
                                $push: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Je n'aime pas cette sauce !" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
                // Vérification que l'utilisateur n'a pas déjà liké ou disliké la sauce (existe dans le tableau des utilisateurs)
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauceModels.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Votre 'j'aime' a bien été retiré" }))
                            .catch((error) => res.status(400).json({ error }));
                    }

                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauceModels.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Votre 'je n'aime pas' a bien été retiré" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
                default:
                    return new Error('Exception non gérée par le système');
            }
        })

        .catch(error => { res.status(500).json({ error })});
}