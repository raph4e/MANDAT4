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

// Ajout des en-têtes CORS pour permettre les requêtes depuis le frontend (car sinon faisait des erreurs de politique de même origine et envoyait des requêtes bloquées)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "../../")));
app.use(express.static(path.join(__dirname, "../client")));

// Route principale - redirige vers connexion.html
app.get('/', (req, res) => {
    res.redirect('/connexion.html');
});


/////////////////////////////////////// Création de la base de données ////////////////////////////////


/* Créé la table utilisateur puis démarre le serveur */
createTable().then(() => {

    /* Vide la table utilisateurConnecte au démarrage */
    viderTable();

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

/* Requête permettant de déconnecter un utilisateur (éxécutable depuis le côté client) */
app.post('/logout', async (req, res) => {
    try {
        await db('utilisateurConnecte').del();
        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/////////////////////////////////////// Création des requêtes utilisateurs ///////////////////////////////////////


/* Requête permettant de créer un nouvel utilisateur */
app.post('/addUser', async (req, res) => {
    try {

        /* Récupère les infos de la requête */
        const { name, numTel, password } = req.body;

        /* Les store dans une variable locale */
        const user = {
            id: crypto.randomUUID(),
            name: name,
            numTel: numTel,
            password: password
        };

        /* Insère l'utilisateur avec les données de la variable locale dans la base de données */
        await db('utilisateur').insert(user);

        /* Renvoie une réponse au client avec l'utilisateur ajouté */
        res.status(201).json(user);


    } catch (error) {

        /* Envoie une erreur de code 500 au client s'il y en a une */
        console.error("Erreur lors de l'ajout d'un utilisateur : ", error);

        /* Renvoie une réponse au client */
        res.status(500).json({ error: "Erreur serveur" });
    }
})


/* Requête permettant de se connecter a un compte utilisateur déja existant */
app.post('/loginUser', async (req, res) => {
    try {

        /* Récupère les infos de la requête */
        const { name, password } = req.body;

        /* Recherche de l'utilisateur. First() s'assure que qu'il n'y ait qu'un seul résultat à cette recherche */
        const utilisateurConnexion = await db('utilisateur').where({ name: name, password: password }).select("*").first();

        /* Confirme si la connexion a bel et bien été réussi. Sinon, affiche un message l'indiquant dans la console */
        if (utilisateurConnexion) {

            /* Affiche un message de confirmation dans la console */
            console.log("connexion réussi");

            /* Renvoie une réponse au client avec l'utilisateur connecté */
            res.status(200).json(utilisateurConnexion);

            /* Récupère l'id de l'utilisateur connecté */
            const idUtilisateurConnecte = await db('utilisateur').where({ name: name, password: password }).select('id').first();

            /* Supprime l'utilisateur connecté dans la table utilisateurConnecté */
            await db('utilisateurConnecte').del();

            /* L'ajoute à la table utilisateurConnecté */
            await db('utilisateurConnecte').insert({ id: idUtilisateurConnecte.id, name: name })

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
        res.status(500).json({ error: "Erreur serveur" });
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
        const numTel = await db('utilisateur').where({ id: idUtilisateurConnecte.id }).select('numTel').first();

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
        res.status(500).json({ error: "Erreur serveur" });
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
            //res.status(404).json({ error: "Aucun utilisateur connecté" });

        }

    } catch (error) {

        /* Affiche une erreur s'il y a lieu */
        console.log("Erreur lors de la récupération de l'utilisateur connecté : ", error)

        /* Renvoie une réponse au client */
        res.status(500).json({ error: "Erreur serveur" });
    }
})

/////////////////////////////////////// Création des requêtes publications ///////////////////////////////////////

/*------------------------------ Requête qui permet d'ajouter une publication-------------------------------- */
app.post('/addPublication', async (req, res) => {
    try {
        /* Récupère les infos de la publication */
        const { id, image, video, description, photographer, idAuteur } = req.body;

        /* Vérifie si la publication existe déjà (évite les doublons) */
        const existingPublication = await db('publications').where({ id }).first(); // recherche par id
        if (existingPublication) { // si la publication existe déjà
            return res.status(200).json({ message: "Publication déjà existante", publication: existingPublication });
        }

        /* sinon crée la publication */
        const publication = {
            id,
            image: image || null,
            video: video || null,
            description: description || null,
            photographer: photographer || null,
            idAuteur: idAuteur || null, // Peut être null pour Pexels car généré automatiquement
            nombreLikes: 0
        };

        /* Insère la publication dans la base de données */
        await db('publications').insert(publication);

        res.status(201).json({ message: "Publication ajoutée", publication });

    } catch (error) {
        console.error("Erreur lors de l'ajout de la publication :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/*------------------------------ Requête pour récupérer toutes les publications------------------------------------ */
app.get('/getPublications', async (req, res) => {
    try {
        const publications = await db('publications').select('*').orderBy('dateCreation', 'desc'); // Récupère toutes les publications ordonnées par date de création décroissante
        res.status(200).json(publications);
    } catch (error) {
        console.error("Erreur lors de la récupération des publications :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
})

/////////////////////////////////////// Création des requêtes commentaires ///////////////////////////////////////

/*--------------------------------------- Requête qui permet d'ajouter un commentaire------------------- */
app.post('/addCommentaire', async (req, res) => {
    try {
        /* Récupère l'utilisateur connecté */
        const utilisateurConnecte = await db('utilisateurConnecte').select('id').first();

        // si aucun utilisateur connecté, renvoie une erreur
        if (!utilisateurConnecte) {
            return res.status(401).json({ error: "Vous devez être connecté pour commenter" });
        }

        /* Récupère les infos du commentaire */
        const { idPublication, message } = req.body;

        /* Crée le commentaire */
        const commentaire = {
            id: crypto.randomUUID(),
            idAuteur: utilisateurConnecte.id,
            idPublication: idPublication,
            message: message
        };

        /* Insère le commentaire dans la base de données */
        await db('commentaires').insert(commentaire);

        res.status(201).json({ message: "Commentaire ajouté", commentaire });

    } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/*-------------------------------- Requête pour récupérer les commentaires d'une publication--------------------------- */
app.get('/getCommentaires/:idPublication', async (req, res) => {
    try {
        const { idPublication } = req.params; // Récupère l'id de la publication depuis les paramètres

        /* Récupère les commentaires avec les infos de l'auteur */
        const commentaires = await db('commentaires') // sélectionne depuis la table commentaires
            .join('utilisateur', 'commentaires.idAuteur', 'utilisateur.id') // joint la table utilisateur pour obtenir le nom de l'auteur
            .select('commentaires.*', 'utilisateur.name as auteurName') // sélectionne toutes les colonnes de commentaires et le nom de l'auteur
            .where('commentaires.idPublication', idPublication) // filtre par id de publication
            .orderBy('commentaires.id', 'asc'); // ordonne par id de commentaire (ordre chronologique)

        res.status(200).json(commentaires);
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/////////////////////////////////////// Création des requêtes likes ///////////////////////////////////////

/*---------------------------------- Requête pour ajouter un like -----------------------------------------------------*/
app.post('/addLike', async (req, res) => {
    try {
        // Récupère l'utilisateur connecté 
        const utilisateurConnecte = await db('utilisateurConnecte').select('id').first();

        // si aucun utilisateur connecté, renvoie une erreur
        if (!utilisateurConnecte) {
            return res.status(401).json({ error: "Vous devez être connecté pour liker" });
        }

        // Récupère l'id de la publication depuis le body
        const { idPublication } = req.body;

        // Vérifie si l'utilisateur a déjà liké cette publication
        const likeExiste = await db('likes').where({
            idUtilisateur: utilisateurConnecte.id, // id de l'utilisateur connecté
            idPublication: idPublication // id de la publication à liker
        }).first();

        // si l'utilisateur a déjà liké cette publication, renvoie une erreur
        if (likeExiste) {
            return res.status(400).json({ error: "Vous avez déjà liké cette publication" });
        }

        // Ajoute le like
        await db('likes').insert({
            idUtilisateur: utilisateurConnecte.id,
            idPublication: idPublication
        });

        // Compte le nombre total de likes pour cette publication
        const nombreLikes = await db('likes').where({ idPublication: idPublication }).count('id as count').first();

        // Renvoie une réponse au client
        res.status(201).json({
            message: "Like ajouté",
            nombreLikes: nombreLikes.count
        });

        // En cas d'erreur
    } catch (error) {
        console.error("Erreur lors de l'ajout du like : ", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/*--------------------------------- Requête pour retirer un like ----------------------------------------------*/
app.delete('/removeLike', async (req, res) => {
    try {
        // Récupère l'utilisateur connecté 
        const utilisateurConnecte = await db('utilisateurConnecte').select('id').first();

        // si aucun utilisateur connecté, renvoie une erreur
        if (!utilisateurConnecte) {
            return res.status(401).json({ error: "Vous devez être connecté" });
        }

        // Récupère l'id de la publication depuis le body
        const { idPublication } = req.body;

        // Vérifie si le like existe
        const likeExiste = await db('likes').where({
            idUtilisateur: utilisateurConnecte.id, // id de l'utilisateur connecté
            idPublication: idPublication // id de la publication à retirer le like
        }).first();

        // si le like n'existe pas, renvoie une erreur
        if (!likeExiste) {
            return res.status(404).json({ error: "Vous n'avez pas liké cette publication" });
        }

        // Supprime le like
        await db('likes').where({
            idUtilisateur: utilisateurConnecte.id, // id de l'utilisateur connecté
            idPublication: idPublication // id de la publication à retirer le like
        }).del();

        // Compte le nombre total de likes pour cette publication
        const nombreLikes = await db('likes').where({ idPublication: idPublication }).count('id as count').first();

        // Renvoie une réponse au client
        res.status(200).json({
            message: "Like retiré",
            nombreLikes: nombreLikes.count
        });

        // En cas d'erreur
    } catch (error) {
        console.error("Erreur lors de la suppression du like : ", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/*------------------------------ Requête pour vérifier si l'utilisateur a liké une publication --------------------------*/
app.get('/checkLike/:idPublication', async (req, res) => {
    try {
        const utilisateurConnecte = await db('utilisateurConnecte').select('id').first(); // Récupère l'utilisateur connecté

        // si aucun utilisateur connecté, renvoie liked: false
        if (!utilisateurConnecte) {
            return res.status(200).json({ liked: false });
        }

        // Récupère l'id de la publication depuis les paramètres
        const { idPublication } = req.params;

        // Vérifie si l'utilisateur a liké cette publication
        const likeExiste = await db('likes').where({
            idUtilisateur: utilisateurConnecte.id, // id de l'utilisateur connecté
            idPublication: idPublication // id de la publication à vérifier
        }).first();

        // Renvoie une réponse au client
        res.status(200).json({ liked: !!likeExiste });

        // En cas d'erreur
    } catch (error) {
        console.error("Erreur lors de la vérification du like : ", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/*----------------------------- Requête pour obtenir le nombre de likes d'une publication -------------------------*/
app.get('/getLikes/:idPublication', async (req, res) => {
    try {
        // Récupère l'id de la publication depuis les paramètres
        const { idPublication } = req.params;

        // Compte le nombre de likes depuis la table likes
        const nombreLikes = await db('likes').where({ idPublication: idPublication }).count('id as count').first();

        // Renvoie une réponse au client
        res.status(200).json({ count: nombreLikes.count });

        // En cas d'erreur
    } catch (error) {
        console.error("Erreur lors de la récupération des likes : ", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


// requêtes pour bypass la fonctionalité de base et dicter des id randoms pour ajouter likes & commentaires
app.post('/addLikeBypass/:idPost', async (req, res) => {
    try {
        const { idPost } = req.params
        await db('likes').insert({
            idUtilisateur: crypto.randomUUID(),
            idPublication: idPost
        })
        res.status(200).json({ message: "Like ajouté" })
    }
    catch (error) {
        console.error("Erreur lors de l'ajout du like : ", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
})

app.post('/addCommentBypass/:idPost', async (req, res) => {
    try {
        const { idPost } = req.params
        const { comment } = req.body

        const commentaire = {
            id: crypto.randomUUID(),
            idAuteur: crypto.randomUUID(),
            idPublication: idPublication,
            message: message
        };
        await db('commentaires').insert(commentaire);
        res.status(200).json({ message: "Commentaire random ajouté : ", commentaire})
    }
    catch(error){
        console.error("Erreur lors de l'ajout du commentaire :", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})
