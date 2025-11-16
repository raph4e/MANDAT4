/////////////////////////////////////// Création du serveur ////////////////////////////////////////////


const express = require('express');
const app = express();
const crypto = require('crypto');

/* Permet au serveur de traiter des données au format Json */
app.use(express.json());

/* Importe la base de données de db.js */
const { db, createTable } = require('./db');
const { default: knex } = require('knex');


/////////////////////////////////////// Création de la base de données ////////////////////////////////


/* Créé la table utilisateur puis démarre le serveur */
createTable().then(() => {

    /* Vérifie et active le serveur sur le port 3000 */
    app.listen(3000, () => {
        console.log("serveur en cours d'exécution sur le port 3000");
    });

}).catch((error) => {
    /* En cas d'erreur lors de la création de la table utilisateur, on l'affiche dans la console */
    console.error("Erreur lors de la création de la table utilisateur :", error);

    /* On quitte le processus avec un code d'erreur */
    process.exit(1);
})


/////////////////////////////////////// Création des requêtes ///////////////////////////////////////


/* Requête permettant de créer un nouvel utilisateur */
app.post('/addUser', async (req, res) => {
    try {

        /* Récupère les infos de la requête */
        const {name, password} = req.body;

        /* Les store dans une variable locale */
        const user = {
            id : crypto.randomUUID(),
            name : name,
            password : password
        };

        /* Insère l'utilisateur avec les données de la variable locale dans la base de données */
        await db('utilisateur').insert(user);

        /* Renvoie une réponse au client avec l'utilisateur ajouté */
        res.status(201).json(user);

        
    } catch (error) {
        
        /* Envoie une erreur de code 500 au client s'il y en a une */
        console.error("Erreur lors de l'ajout d'un utilisateur : ", error);

        /* Renvoie une réponse au client */
        res.status(500).json({ error : "Erreur serveur" });
    }
})


/* Requête permettant de se connecter a un compte utilisateur déja existant */
app.post('/loginUser', async (req, res) => {
    try {

        /* Récupère les infos de la requête */
        const {name, password} = req.body;

        /* Recherche de l'utilisateur. First() s'assure que qu'il n'y ait qu'un seul résultat à cette recherche */
        const utilisateurConnexion = await db('utilisateur').where({name : name, password : password}).select("*").first();

        /* Confirme si la connexion a bel et bien été réussi. Sinon, affiche un message l'indiquant dans la console */
        if (utilisateurConnexion) {

            /* Affiche un message de confirmation dans la console */
            console.log("connexion réussi");

            /* Renvoie une réponse au client avec l'utilisateur connecté */
            res.status(201).json(utilisateurConnexion);


        } else {

            /* Affiche un message qui indique que la connexion a échoué */
            console.log("nom d'utilisateur ou mot de passe incorrect.");

        }
    } catch (error) {

        /* Envoie une erreur de code 500 au client s'il y en a une */
        console.error("Erreur lors de la connexion : ", error);

        /* Renvoie une réponse au client */
        res.status(500).json({ error : "Erreur serveur" });
    }
});