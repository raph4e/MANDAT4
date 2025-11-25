/////////////////////////////////////// Création du serveur ////////////////////////////////////////////


const express = require('express');
const app = express();
const crypto = require('crypto');

/* Permet au serveur de traiter des données au format Json */
app.use(express.json());

/* Path permet de gérer les chemins de fichiers */
const path = require('path');

/* Importe la base de données de db.js */
const { db, createTable } = require('./db');
const { default: knex } = require('knex');

/* Route vers la page inscription */
app.use(express.static(path.join(__dirname, "../../")));
app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/inscription.html"));
});

/////////////////////////////////////// Création de la base de données ////////////////////////////////


/* Créé la table utilisateur puis démarre le serveur */
createTable().then( () => {

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

/////////////////////////////////////// Réinitialise la table utilisateurConnecte ///////////////////
async function viderTable() {
   await db('utilisateurConnecte').del();
}

viderTable();

/////////////////////////////////////// Création des requêtes ///////////////////////////////////////


/* Requête permettant de créer un nouvel utilisateur */
app.post('/addUser', async (req, res) => {
    try {

        /* Récupère les infos de la requête */
        const {name, numTel, password} = req.body;

        /* Les store dans une variable locale */
        const user = {
            id : crypto.randomUUID(),
            name : name,
            numTel : numTel,
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
            res.status(200).json(utilisateurConnexion);

            /* Récupère l'id de l'utilisateur connecté */
            const idUtilisateurConnecte = await db('utilisateur').where({name : name, password : password}).select('id').first();

            /* Supprime l'utilisateur connecté dans la table utilisateurConnecté */
            await db('utilisateurConnecte').del();

            /* L'ajoute à la table utilisateurConnecté */
            await db('utilisateurConnecte').insert({id : idUtilisateurConnecte, name : name})

        } else {

            /* Affiche un message qui indique que la connexion a échoué */
            console.log("nom d'utilisateur ou mot de passe incorrect.");

            /* Envoie une réponse sous forme d'erreur */
            res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." }); 

        }
    } catch (error) {

        /* Envoie une erreur de code 500 au client s'il y en a une */
        console.error("Erreur lors de la connexion : ", error);

        /* Renvoie une réponse au client */
        res.status(500).json({ error : "Erreur serveur" });
    }
});

/* Requête permettant de récupérer le numéro de téléphone de l'utilisateur connecté */
app.get('/getLoginUserNumTel', async (req, res) => {
    try {
        /* Récupère l'id de l'utilisateur connecté */
        const idUtilisateurConnecte = await db('utilisateurConnecte').select('id').first();

        /* Vérifie si l'utilisateur existe */
        if (!idUtilisateurConnecte) {
            return res.status(404).json({ error: "Aucun utilisateur connecté" });
        }

        /* Récupère le numéro de téléphone correspondant à l'id de l'utilisateur connecté */
        const numTel = await db('utilisateur').where({id : idUtilisateurConnecte.id}).select('numTel').first();

        /* Vérifie si numTel existe */
        if (!numTel) {
            return res.status(404).json({ error: "Numéro introuvable" });
        }

        /* Renvoie le numéro */
        res.status(200).json(numTel)

    } catch (error) {
        
        /* Affiche une erreur s'il y a lieu */
        console.log("Erreur lors de la récupération du numéro de téléphone de l'utilisateur connecté : ", error)

        /* Renvoie une réponse au client */
        res.status(500).json({ error : "Erreur serveur" });
    }
})

/* Requête permettant de récupérer l'utilisateur connecté */
app.get('/getLoginUser', async (req, res) => {
    try {

        /* Récupère l'utilisateur connecté dans la base de données */
        const utilisateurConnecte = await db('utilisateurConnecte').select('*');

        /* Vérifie si l'utilisateur connecté existe */
        if (utilisateurConnecte.length > 0) {

            /* Renvoie l'utilisateur connecté */
            res.status(200).json(utilisateurConnecte[0])
            console.log(utilisateurConnecte)

        } else {

            /* Sinon, l'indique */
            console.log("Aucun utilisateur connecté")
            res.status(404).json({ error: "Aucun utilisateur connecté" });

        }

    } catch (error) {

        /* Affiche une erreur s'il y a lieu */
        console.log("Erreur lors de la récupération de l'utilisateur connecté : ", error)

        /* Renvoie une réponse au client */
        res.status(500).json({ error : "Erreur serveur" });
    }
})

/* Requête qui permet d'ajouter une publication */
app.post('/addPublication', async (req, res) => {
    try {

        /* Récupère l'utilisateur connecté dans la base de données qui fait la publication */
        const idUtilisateurConnecte = await db('utilisateurConnecte').select('id');

        /* Récupère les infos de la publication */
        const {name, image, biographie} = req.body;

        /* Les store dans une variable */        
        const publication = {
            id : crypto.randomUUID(),
            name : name,
            idAuteur : idUtilisateurConnecte,
            nombreDeLikes : 0
        }

        /* Insère la publication avec les données de la variable locale dans la base de données */
        await db('publications').insert(publication);

    } catch (error) {

    }
})

