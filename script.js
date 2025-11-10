//=================================== GÉNÉRATION D'IMAGES VIA PEXELS API ===================================//

// Chargement d'images depuis l'API Pexels
const API_KEY = "YEmthrJDjy7vr7tybv61l9DIASRDocDqYjI7oGn28VdSMphODN3AXMXH"; // Clé API Pexels (obligatoire pour obtenir leurs images et vidéos)

// mieux avec try catch pour gérer les erreurs sinon ça plante
const LoadImage = async () => { // Fonction asynchrone pour charger des images depuis Pexels
    try {
        // Génère un numéro de page aléatoire pour obtenir des images différentes à chaque rechargement
        const randomPage = Math.floor(Math.random() * 100) + 1; // Page aléatoire entre 1 et 100
        
        const response = await fetch(`https://api.pexels.com/v1/curated?per_page=10&page=${randomPage}`, { // Requête à l'API Pexels avec une page aléatoire
            headers: { // headers indique les informations supplémentaires envoyées avec la requête HTTP
                Authorization: API_KEY // Authentification avec la clé API qui est obligatoire pour accéder aux ressources de l'API
            }
        });
        
        const data = await response.json(); // Conversion de la réponse en JSON (la méthode json() lit le corps de la réponse et le convertit en un objet JavaScript)

//-------------------------------- AFFICHAGE DES IMAGES DANS LES STORIES ----------------------------------//
        
        // Affiche plusieurs images dans le conteneur
        data.photos.forEach(photo => { // Parcourt chaque photo dans les données reçues
            const img = document.createElement("img"); // Crée un élément image HTML
            img.src = photo.src.medium; // Utilise l'URL de l'image en taille moyenne
            img.alt = photo.alt || "Image de l'utilisateur"; // Texte alternatif
            img.classList.add("story-image"); // Ajoute une classe CSS à l'image
            document.querySelector(".stories-container").appendChild(img); // Ajoute l'image au conteneur
        });

//-------------------------------- AFFICHAGE DES IMAGES DANS LES PUBLICATIONS ----------------------------------//
        
        // Affiche plusieurs images dans le conteneur
        data.photos.forEach(photo => { // Parcourt chaque photo dans les données reçues
            const img = document.createElement("img"); // Crée un élément image HTML
            img.src = photo.src.medium; // Utilise l'URL de l'image en taille moyenne
            img.alt = photo.alt || "Image de l'utilisateur"; // Texte alternatif
            img.classList.add("post-image"); // Ajoute une classe CSS à l'image
            document.querySelector(".posts-container").appendChild(img); // Ajoute l'image au conteneur
        });


        
    } catch (error) {
        console.error(error); // Affiche l'erreur dans la console
    }
};

window.onload = LoadImage; // Appelle la fonction LoadImage lorsque la fenêtre est chargée

