//================================== GÉNÉRATION D'IMAGES ET VIDÉOS VIA PEXELS API ==================================//

// Clé API Pexels
const API_KEY = "YEmthrJDjy7vr7tybv61l9DIASRDocDqYjI7oGn28VdSMphODN3AXMXH";


//------------------------------ Chargement des images depuis Pexels -----------------------------

// Ici on vient charger des images depuis l'API Pexels
const LoadImages = async () => { // async function pour charger des images
    try {
        const randomPage = Math.floor(Math.random() * 50) + 1; // Génère un numéro de page aléatoire entre 1 et 50
        const response = await fetch(`https://api.pexels.com/v1/curated?per_page=10&page=${randomPage}`, { // Requête à l'API Pexels pour obtenir des images (await fetch permet d'attendre la réponse)
            headers: { Authorization: API_KEY } // Ajoute la clé API dans les en-têtes de la requête
        });
        const data = await response.json(); // convertit la réponse en JSON pour qu'on puisse l'utiliser

        // Affichage dans les stories
        data.photos.forEach(photo => { // vient parcourir chaque photo reçue
            const img = document.createElement("img"); // vient créer un élément image en HTML
            img.src = photo.src.medium; // vient définir la source de l'image
            img.alt = photo.alt || "Image de l'utilisateur"; // définit le texte alternatif de l'image
            img.classList.add("story-image"); // ajoute une classe CSS à l'image
            document.querySelector(".stories-container").appendChild(img); // ajoute l'image au conteneur des stories en HTML
        });

        // Affichage dans les publications
        data.photos.forEach(photo => { // vient parcourir chaque photo reçue
            const img = document.createElement("img"); // vient créer un élément image en HTML
            img.src = photo.src.large; // vient définir la source de l'image
            img.alt = photo.alt || "Image de l'utilisateur"; // définit le texte alternatif de l'image
            img.classList.add("post-image"); // ajoute une classe CSS à l'image
            document.querySelector(".posts-container").appendChild(img); // ajoute l'image au conteneur des publications en HTML
        });

        // Affichage dans les suggestions (maximum 5)
        data.photos.slice(0, 5).forEach((photo, index) => { // slice(0, 5) limite à 5 photos maximum
            const suggestionItem = document.createElement("div"); // Crée un conteneur pour chaque suggestion
            suggestionItem.classList.add("suggestion-item", "noto-sans-0"); // Ajoute une classe CSS au conteneur
            
            // Création de la photo de la suggestion
            const img = document.createElement("img"); // crée l'élément image
            img.src = photo.src.small; // définit la source de l'image
            img.alt = photo.alt || "Image de suggestion"; // définit le texte alternatif de l'image
            img.classList.add("suggestion-image"); // ajoute une classe CSS à l'image
            
            // Création du nom de l'utilisateur
            const userName = document.createElement("span"); // crée l'élément span pour le nom
            userName.textContent = photo.photographer || `utilisateur_${index + 1}`; // utilise le nom de l'utilisateur fourni par l'API (photographeur mais utilisé ici comme nom d'utilisateur)
            userName.classList.add("suggestion-name"); // ajoute une classe CSS au nom

            // Création du lien "S'abonner"
            const followLink = document.createElement("a"); // crée l'élément lien
            followLink.textContent = "S'abonner"; // définit le texte du lien
            followLink.href = "#"; // définit l'attribut href du lien
            followLink.classList.add("follow-link"); // ajoute une classe CSS au lien
            
            
            // Ajoute l'image et le nom au conteneur
            suggestionItem.appendChild(img);
            suggestionItem.appendChild(userName);
            suggestionItem.appendChild(followLink);
            
            // Ajoute le conteneur aux suggestions
            document.querySelector(".suggestions-container").appendChild(suggestionItem);
        });
    } catch (error) {
        console.error(error);
    }
};

//-------------------------------------- Chargement des vidéos depuis Pexels -------------------

// Ici on vient charger des vidéos depuis l'API Pexels
const LoadVideos = async () => { // async function pour charger des vidéos
    try {
        const randomPage = Math.floor(Math.random() * 50) + 1; // Génère un numéro de page aléatoire entre 1 et 50
        const response = await fetch(`https://api.pexels.com/videos/popular?per_page=10&page=${randomPage}`, { // Requête à l'API Pexels pour obtenir des vidéos
            headers: { Authorization: API_KEY } // Ajoute la clé API dans les en-têtes de la requête
        });
        const data = await response.json(); // convertit la réponse en JSON pour qu'on puisse l'utiliser

        // Affichage des vidéos dans les stories
        data.videos.forEach(video => { // vient parcourir chaque vidéo reçue
            const videoElement = document.createElement("video"); // vient créer un élément vidéo en HTML
            videoElement.src = video.video_files[0].link; // vient définir la source de la vidéo
            videoElement.controls = true; // ajoute des contrôles à la vidéo servant à lire, mettre en pause, etc.
            videoElement.classList.add("story-image"); // ajoute une classe CSS à la vidéo
            videoElement.setAttribute("preload", "metadata"); // définit l'attribut preload de la vidéo pour charger les métadonnées avant la lecture
            document.querySelector(".stories-container").appendChild(videoElement); // ajoute la vidéo au conteneur des stories en HTML
        });
        
        // Affichage des vidéos dans les publications
        data.videos.forEach(video => { // vient parcourir chaque vidéo reçue
            const videoElement = document.createElement("video"); // vient créer un élément vidéo en HTML
            videoElement.src = video.video_files[0].link; // vient définir la source de la vidéo
            videoElement.controls = true; // ajoute des contrôles à la vidéo servant à lire, mettre en pause, etc.
            videoElement.classList.add("post-image"); // ajoute une classe CSS à la vidéo
            videoElement.setAttribute("preload", "metadata"); // définit l'attribut preload de la vidéo pour charger les métadonnées avant la lecture
            document.querySelector(".posts-container").appendChild(videoElement); // ajoute la vidéo au conteneur des publications en HTML
        });
    } catch (error) {
        console.error(error);
    }
};

//-------------------------------- Chargement du contenu au chargement de la page -----------------------------

/*
IL VA FALLOIR TROUVER UNE FONCTION POUR CHARGER ALÉATOIREMENT LES IMAGES ET VIDÉOS (J'AI ESSAYÉ 
AVEC RANDOM MAIS ÇA NE MARCHAIT PAS)
*/
window.onload = async () => { // window.onload permet d'exécuter le code une fois que la page est complètement chargée
    await LoadImages(); 
    await LoadVideos(); 
}




