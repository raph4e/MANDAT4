###################################### MANDAT4 ###########################################


1) À propos
============
Notre *** Clone d'Instagram *** est une application Web full-stack permettant de partager, liker et commenter des publications. Le projet utilise l'API Pexels pour générer dynamiquement des images et vidéos, avec une gestion complète des utilisateurs et interactions sociales.


2) Fonctionnalités
===================

*** Recherche ***
Une barre de recherche permet de rechecher des images et utlisateurs via des mots-clé

*** Authentification ***
- Inscription exige un nom d'utlisateur, mot de passe et numéro de téléphone
- Connexion exige le nom d'utilisateur et le mot de passe
- Déconnexion est un lien dans la navbar qui redirige l'utilisateur vers un bouton "Se déconnecter"

*** Interactions ***
- Likes Like/unlike en cliquant sur l'icône de coeur (bouton) stockés dans une base de données
- Commentaires sont visibles dans les publications
- L'ajout de commentaires est possible en cliquant sur l'icône de bulle de conversation et stockés eux aussi dans la base de données

*** Interface ***
- Stories : défilement horizontal via une barre de défilement
- Publications : flux dynamique généré à partir de Pexels
- Suggestions d'amis : flux dynamique généré à partir de Pexels
- Design responsive : adaptation à plusieurs types d'écran via la règle CSS @media et la balise HTML <meta name="viewport">


3) Technologies
================

*** Frontend ***
- HTML5 : structure sémantique
- CSS3 : appliquer des styles/règles à la structure
- JavaScript Vanilla : logique du côté client pour rendre le site dynamique
- Font Awesome : icônes
- Google fonts : style de la police "Noto Sans"

*** Backend ***
- Node.js : environnement d'exécution JavaScript
- Express.js : framework pour Node.js
- SQLite3 : base de données légère
- Knex.js : constructeur de requêtes SQL

*** API ***
Appels via fetch pour accéder aux images et vidéos du serveur de Pexels 


4) Installation
================

1. Télécharger le projet (MANDAT4).
2. Extraire les fichiers du dossier compressé.
2. Ouvrir un terminal dans le dossier .\connexion-inscription\app via VS Code.
3. Installer les dépendances en tapant la commande : npm install express knex sqlite.
4. Démarrer le serveur en tapant la commande : node .\app.js.
6. Un message dans le terminal devrait afficher : serveur en cours d'exécution sur le port 3000.


5) Démarrage
=============

1. Taper dans le navigateur l’adresse du serveur : http : //localhost :3000.
2. Une page de connexion s’ouvrira. 
3. Si l’utilisateur n’a pas encore de compte, il faudra cliquer sur le lien "S'inscrire" (en-dessous des champs de connexion).
4. Dans le cas d’une inscription, l’utilisateur devra entrer un nom d’utilisateur, un numéro de téléphone et un mot de passe, puis appuyer sur le bouton "Créer un compte".
5. Dans le cas d’une connexion, l’utilisateur devra entrer son nom d'utilsateur et son mot de passe, puis appuyer le bouton "Envoyer".



6) Arborescence du projet
==========================
***à insérer à la fin du projet


