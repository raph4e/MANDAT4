//================================== GÉNÉRATION D'IMAGES ET VIDÉOS VIA PEXELS API ==================================//

// À FAIRE : POUVOIR METTRE LE NOMBRE DE LIKES ET DE COMMENTAIRES SUR LES PUBLICATIONS

// Clé API Pexels
const API_KEY = "YEmthrJDjy7vr7tybv61l9DIASRDocDqYjI7oGn28VdSMphODN3AXMXH";


//==============================================   IMAGES ===================================================================

// Ici on vient charger des images depuis l'API Pexels
const LoadImages = async () => { // async function pour charger des images
    try {
        const randomPage = Math.floor(Math.random() * 50) + 1; // Génère un numéro de page aléatoire entre 1 et 50
        const response = await fetch(`https://api.pexels.com/v1/curated?per_page=10&page=${randomPage}`, { // Requête à l'API Pexels pour obtenir des images (await fetch permet d'attendre la réponse)
            headers: { Authorization: API_KEY } // Ajoute la clé API dans les en-têtes de la requête
        });
        const data = await response.json(); // convertit la réponse en JSON pour qu'on puisse l'utiliser

//------------------------------ stories--------------------------------------------------

        // Affichage dans les stories
        data.photos.forEach(photo => { // vient parcourir chaque photo reçue
            const img = document.createElement("img"); // vient créer un élément image en HTML
            img.src = photo.src.medium; // vient définir la source de l'image
            img.alt = photo.alt || "Image de l'utilisateur"; // définit le texte alternatif de l'image
            img.classList.add("story-image"); // ajoute une classe CSS à l'image
            document.querySelector(".stories-container").appendChild(img); // ajoute l'image au conteneur des stories en HTML
        });

//----------------------------- publications -------------------------------------------------

        // Affichage dans les publications
        data.photos.forEach(photo => { // vient parcourir chaque photo reçue
            // Créer un conteneur pour chaque publication
            const postItem = document.createElement("div");
            postItem.classList.add("post-item"); // ajoute une classe CSS au conteneur
            
            // Créer l'en-tête de la publication avec photo et nom
            const postHeader = document.createElement("div");
            postHeader.classList.add("post-header"); // ajoute une classe CSS à l'en-tête
            
            // Photo de profil
            const profileImg = document.createElement("img"); // crée un élément image pour la photo de profil
            profileImg.src = photo.src.small; // définit la source de l'image de profil
            profileImg.alt = "Photo de profil"; // définit le texte alternatif de la photo de profil
            profileImg.classList.add("post-profile-image"); // ajoute une classe CSS à la photo de profil
            
            // Nom d'utilisateur
            const userName = document.createElement("span"); // crée un élément span pour le nom
            userName.textContent = photo.photographer || "utilisateur"; // utilise le nom de l'utilisateur fourni par l'API (photographeur mais utilisé ici comme nom d'utilisateur)
            userName.classList.add("post-username", "noto-sans-0"); // ajoute une classe CSS au nom
            
            // Icône de 3 points
            const moreIcon = document.createElement("button"); // crée un élément button pour l'icône
            moreIcon.classList.add("fa-solid", "fa-ellipsis", "post-more-icon"); // ajoute des classes CSS à l'icône
            
            // Ajouter la photo et le nom à l'en-tête
            postHeader.appendChild(profileImg); // ajoute la photo de profil à l'en-tête
            postHeader.appendChild(userName); // ajoute le nom d'utilisateur à l'en-tête
            postHeader.appendChild(moreIcon); // ajoute l'icône de 3 points à l'en-tête
            
            // Créer l'image de la publication
            const img = document.createElement("img"); // vient créer un élément image en HTML
            // définir la taille de l'image
            img.style.width = "28em";
            img.style.height = "36em";
            img.style.objectFit = "cover"; // pour que l'image garde ses proportions tout en remplissant le conteneur
            img.src = photo.src.large; // vient définir la source de l'image
            img.alt = photo.alt || "Image de l'utilisateur"; // définit le texte alternatif de l'image
            img.classList.add("post-image"); // ajoute une classe CSS à l'image
            
            // Créer les icônes d'interaction
            const postActions = document.createElement("div"); // crée un conteneur pour les icônes d'interaction
            postActions.classList.add("post-actions"); // ajoute une classe CSS au conteneur
            
            // Icône coeur
            const likeIcon = document.createElement("button"); // crée un élément button pour l'icône coeur
            likeIcon.classList.add("fa-regular", "fa-heart", "post-action-icon"); // ajoute des classes CSS à l'icône coeur

            
            // Icône bulle de conversation
            const commentIcon = document.createElement("button"); // crée un élément button pour l'icône bulle de conversation
            commentIcon.classList.add("fa-regular", "fa-comment", "post-action-icon"); // ajoute des classes CSS à l'icône bulle de conversation
            
            // S'éxécute lorsque quelqu'un clique sur commentaire 
            commentIcon.addEventListener('click', async ()=> {

                // Récupère l'utilisateur connecté
                const response = await fetch('/getLoginUser')

                if(!response.ok) {

                    // Désactive le bouton commentaire
                    commentIcon.disabled = true

                    // Indique au client qu'il faut être connecté pour écrire un commentaire
                    const messageErreur = document.createElement("p")
                    messageErreur.textContent = "Il faut être connecté pour écrire un commentaire"

                    // Style pour le message erreur
                    messageErreur.style.color = "red"
                    messageErreur.style.marginLeft = "1.5em"

                    // L'ajoute au HTML
                    postItem.appendChild(messageErreur)

                    // Attends 2 secondes puis supprime le message 
                    setTimeout(() => {
                        messageErreur.remove();
                        commentIcon.disabled = false
                    }, 2000);                    

                    // Arrête le bloc de code
                    return;
                }

                // Récupère l'utilisateur connecté
                const loginUser = await response.json();

                // Désactive le bouton commentaire 
                commentIcon.disabled = true

                // Créer le textarea qui permet l'écriture du commentaire
                const commentaire = document.createElement("textarea")
                commentaire.placeholder = "Écrivez votre commentaire ici..."

                // Style pour le textarea
                commentaire.style.width = "24em"
                commentaire.style.height = "7em"
                commentaire.style.marginTop = "1em"
                commentaire.style.marginLeft = "1.5em"      

                // Créer le bouton envoyer
                const boutonEnvoyer = document.createElement("button")
                boutonEnvoyer.textContent = "Envoyer"

                // S'éxécute lorsque le bouton envoyer est cliqué
                boutonEnvoyer.addEventListener('click', async ()=> {

                    // conteneur qui met côte à côte
                    const ligneCommentaire = document.createElement("div");
                    ligneCommentaire.style.display = "flex";
                    ligneCommentaire.style.flexDirection = "row";
                    ligneCommentaire.style.gap = "0.5em";                  

                    // Affiche l'utilisateur
                    const utilisateurCommentaire = document.createElement("p")
                    utilisateurCommentaire.textContent = loginUser.name;

                    // Style pour utilisateurCommentaire
                    utilisateurCommentaire.style.fontWeight = "bold";
                    utilisateurCommentaire.style.marginLeft = "1.5em"

                    // Affiche le commentaire
                    const contenuCommentaire = document.createElement("p")
                    contenuCommentaire.textContent = commentaire.value;

                    // Style pour contenu commentaire
                    contenuCommentaire.style.marginLeft = "0.5em"

                    // Ajoute le contenu au HTML
                    ligneCommentaire.appendChild(utilisateurCommentaire)
                    ligneCommentaire.appendChild(contenuCommentaire)
                    postItem.appendChild(ligneCommentaire)

                    // Supprime le textarea et le bouton
                    commentaire.remove();
                    boutonEnvoyer.remove();

                    // Réactive le bouton commentaire 
                    commentIcon.disabled = false
                })

                // Style pour le bouton envoyer
                boutonEnvoyer.style.marginTop = "2em"
                boutonEnvoyer.style.width = "12em"
                boutonEnvoyer.style.marginLeft = "1.5em"   

                // Les ajoute au HTML
                postItem.appendChild(commentaire)
                postItem.appendChild(boutonEnvoyer)
                
            })
            
            // Icône bookmark
            const shareIcon = document.createElement("button"); // crée un élément button pour l'icône bookmark
            shareIcon.classList.add("fa-regular", "fa-bookmark", "post-action-icon"); // ajoute des classes CSS à l'icône bookmark
            
            // Ajouter les icônes au conteneur d'actions
            postActions.appendChild(likeIcon); // ajoute l'icône coeur au conteneur
            postActions.appendChild(commentIcon); // ajoute l'icône bulle de conversation au conteneur
            postActions.appendChild(shareIcon); // ajoute l'icône bookmark au conteneur
            
            // Ajouter l'en-tête et l'image au conteneur de la publication
            postItem.appendChild(postHeader); // ajoute l'en-tête au conteneur
            postItem.appendChild(img); // ajoute l'image au conteneur
            postItem.appendChild(postActions); // ajoute les icônes d'action au conteneur
            
            document.querySelector(".posts-container").appendChild(postItem); // ajoute la publication au conteneur

        });

//----------------------------- suggestions d'amis -------------------------------------------------

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

//=================================================   VIDÉOS ===================================================================

// Ici on vient charger des vidéos depuis l'API Pexels
const LoadVideos = async () => { // async function pour charger des vidéos
    try {
        const randomPage = Math.floor(Math.random() * 50) + 1; // Génère un numéro de page aléatoire entre 1 et 50
        const response = await fetch(`https://api.pexels.com/videos/popular?per_page=10&page=${randomPage}`, { // Requête à l'API Pexels pour obtenir des vidéos
            headers: { Authorization: API_KEY } // Ajoute la clé API dans les en-têtes de la requête
        });
        const data = await response.json(); // convertit la réponse en JSON pour qu'on puisse l'utiliser

//-------------------------------------- stories -------------------------------------------------

        // Affichage des vidéos dans les stories
        data.videos.forEach(video => { // vient parcourir chaque vidéo reçue
            const videoElement = document.createElement("video"); // vient créer un élément vidéo en HTML
            videoElement.src = video.video_files[0].link; // vient définir la source de la vidéo
            videoElement.controls = true; // ajoute des contrôles à la vidéo servant à lire, mettre en pause, etc.
            videoElement.classList.add("story-image"); // ajoute une classe CSS à la vidéo
            videoElement.setAttribute("preload", "metadata"); // définit l'attribut preload de la vidéo pour charger les métadonnées avant la lecture
            document.querySelector(".stories-container").appendChild(videoElement); // ajoute la vidéo au conteneur des stories en HTML
        });

//-------------------------------------- publications -------------------------------------------------

        // Affichage des vidéos dans les publications
        data.videos.forEach(video => { // vient parcourir chaque vidéo reçue
            // Créer un conteneur pour chaque publication vidéo
            const postItem = document.createElement("div");
            postItem.classList.add("post-item"); // ajoute une classe CSS au conteneur
            
            // Créer l'en-tête de la publication avec photo et nom
            const postHeader = document.createElement("div");
            postHeader.classList.add("post-header"); // ajoute une classe CSS à l'en-tête
            
            // Photo de profil
            const profileImg = document.createElement("img"); // crée un élément image pour la photo de profil
            profileImg.src = video.image; // définit la source de l'image de profil
            profileImg.alt = "Photo de profil"; // définit le texte alternatif de la photo de profil
            profileImg.classList.add("post-profile-image"); // ajoute une classe CSS à la photo de profil
            
            // Nom d'utilisateur
            const userName = document.createElement("span"); // crée un élément span pour le nom
            userName.textContent = video.user.name || "utilisateur"; // utilise le nom de l'utilisateur fourni par l'API
            userName.classList.add("post-username", "noto-sans-0"); // ajoute une classe CSS au nom
            
            // Icône de 3 points
            const moreIcon = document.createElement("i"); // crée un élément i pour l'icône
            moreIcon.classList.add("fa-solid", "fa-ellipsis", "post-more-icon"); // ajoute des classes CSS à l'icône
            
            // Ajouter la photo et le nom à l'en-tête
            postHeader.appendChild(profileImg); // ajoute la photo de profil à l'en-tête
            postHeader.appendChild(userName); // ajoute le nom d'utilisateur à l'en-tête
            postHeader.appendChild(moreIcon); // ajoute l'icône de 3 points à l'en-tête
            
            // Créer la vidéo
            const videoElement = document.createElement("video"); // vient créer un élément vidéo en HTML
            videoElement.src = video.video_files[0].link; // vient définir la source de la vidéo
            videoElement.controls = true; // ajoute des contrôles à la vidéo servant à lire, mettre en pause, etc.
            videoElement.classList.add("post-image"); // ajoute une classe CSS à la vidéo
            videoElement.setAttribute("preload", "metadata"); // définit l'attribut preload de la vidéo pour charger les métadonnées avant la lecture
            
            // Créer les icônes d'interaction
            const postActions = document.createElement("div"); // crée un conteneur pour les icônes d'interaction
            postActions.classList.add("post-actions"); // ajoute une classe CSS au conteneur
            
            // Icône coeur
            const likeIcon = document.createElement("i"); // crée un élément i pour l'icône coeur
            likeIcon.classList.add("fa-regular", "fa-heart", "post-action-icon"); // ajoute des classes CSS à l'icône coeur
            
            // Icône bulle de conversation
            const commentIcon = document.createElement("i"); // crée un élément i pour l'icône bulle de conversation
            commentIcon.classList.add("fa-regular", "fa-comment", "post-action-icon"); // ajoute des classes CSS à l'icône bulle de conversation

            // S'éxécute lorsque quelqu'un clique sur commentaire 
            commentIcon.addEventListener('click', async ()=> {

                // Récupère l'utilisateur connecté
                const response = await fetch('/getLoginUser')

                if(!response.ok) {

                    // Désactive le bouton commentaire
                    commentIcon.disabled = true

                    // Indique au client qu'il faut être connecté pour écrire un commentaire
                    const messageErreur = document.createElement("p")
                    messageErreur.textContent = "Il faut être connecté pour écrire un commentaire"

                    // Style pour le message erreur
                    messageErreur.style.color = "red"
                    messageErreur.style.marginLeft = "1.5em"

                    // L'ajoute au HTML
                    postItem.appendChild(messageErreur)

                    // Attends 2 secondes puis supprime le message 
                    setTimeout(() => {
                        messageErreur.remove();
                        commentIcon.disabled = false
                    }, 2000);                    

                    // Arrête le bloc de code
                    return;
                }

                // Récupère l'utilisateur connecté
                const loginUser = await response.json();

                // Désactive le bouton commentaire 
                commentIcon.disabled = true

                // Créer le textarea qui permet l'écriture du commentaire
                const commentaire = document.createElement("textarea")
                commentaire.placeholder = "Écrivez votre commentaire ici..."

                // Style pour le textarea
                commentaire.style.width = "24em"
                commentaire.style.height = "7em"
                commentaire.style.marginTop = "1em"
                commentaire.style.marginLeft = "1.5em"      

                // Créer le bouton envoyer
                const boutonEnvoyer = document.createElement("button")
                boutonEnvoyer.textContent = "Envoyer"

                // S'éxécute lorsque le bouton envoyer est cliqué
                boutonEnvoyer.addEventListener('click', async ()=> {

                    // conteneur qui met côte à côte
                    const ligneCommentaire = document.createElement("div");
                    ligneCommentaire.style.display = "flex";
                    ligneCommentaire.style.flexDirection = "row";
                    ligneCommentaire.style.gap = "0.5em";                  

                    // Affiche l'utilisateur
                    const utilisateurCommentaire = document.createElement("p")
                    utilisateurCommentaire.textContent = loginUser.name;

                    // Style pour utilisateurCommentaire
                    utilisateurCommentaire.style.fontWeight = "bold";
                    utilisateurCommentaire.style.marginLeft = "1.5em"

                    // Affiche le commentaire
                    const contenuCommentaire = document.createElement("p")
                    contenuCommentaire.textContent = commentaire.value;

                    // Style pour contenu commentaire
                    contenuCommentaire.style.marginLeft = "0.5em"

                    // Ajoute le contenu au HTML
                    ligneCommentaire.appendChild(utilisateurCommentaire)
                    ligneCommentaire.appendChild(contenuCommentaire)
                    postItem.appendChild(ligneCommentaire)

                    // Supprime le textarea et le bouton
                    commentaire.remove();
                    boutonEnvoyer.remove();

                    // Réactive le bouton commentaire 
                    commentIcon.disabled = false
                })

                // Style pour le bouton envoyer
                boutonEnvoyer.style.marginTop = "2em"
                boutonEnvoyer.style.width = "12em"
                boutonEnvoyer.style.marginLeft = "1.5em"   

                // Les ajoute au HTML
                postItem.appendChild(commentaire)
                postItem.appendChild(boutonEnvoyer)
                
            })
            
            // Icône bookmark
            const shareIcon = document.createElement("i"); // crée un élément i pour le bookmark
            shareIcon.classList.add("fa-regular", "fa-bookmark", "post-action-icon"); // ajoute des classes CSS à l'icône bookmark
            
            // Ajouter les icônes au conteneur d'actions
            postActions.appendChild(likeIcon); // ajoute l'icône coeur au conteneur 
            postActions.appendChild(commentIcon); // ajoute l'icône bulle de conversation au conteneur
            postActions.appendChild(shareIcon); // ajoute l'icône bookmark au conteneur
            
            // Ajouter l'en-tête et la vidéo au conteneur de la publication
            postItem.appendChild(postHeader); // ajoute l'en-tête au conteneur de la publication
            postItem.appendChild(videoElement); // ajoute la vidéo au conteneur de la publication
            postItem.appendChild(postActions); // ajoute les icônes d'action au conteneur de la publication
            
            document.querySelector(".posts-container").appendChild(postItem); // ajoute la publication au conteneur
        });
    } catch (error) {
        console.error(error);
    }
};

//====================================== CHARGEMENT DU CONTENU DE LA PAGE ==================================


window.onload = async () => { // window.onload permet d'exécuter le code une fois que la page est complètement chargée
    await LoadImages(); 
    await LoadVideos(); 
}


//====================================== GESTION DES LIKES ====================================

// Fonction pour liker/unliker une publication
async function toggleLike(idPublication, likeIcon) {
    try {
        // Vérifie si déjà liké
        const checkResponse = await fetch(`/checkLike/${encodeURIComponent(idPublication)}`); // encodeURIComponent pour s'assurer que l'ID est correctement encodé dans l'URL
        
        // si la réponse n'est pas ok, lance une erreur
        if (!checkResponse.ok) {
            throw new Error('Erreur de connexion au serveur');
        }
        
        // Récupère les données de la réponse et les convertit en JSON
        const checkData = await checkResponse.json();

        // si la publication est déjà likée
        if (checkData.liked) {
            // Retirer le like
            const response = await fetch('/removeLike', { // envoie une requête pour retirer le like
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPublication }) // envoie l'ID de la publication à retirer
            });
            
            // si la réponse est ok
            if (response.ok) {
                // Change l'icône en cœur vide
                likeIcon.classList.remove('fa-solid'); // retire la classe du coeur plein
                likeIcon.classList.add('fa-regular'); // ajoute la classe du coeur vide
                likeIcon.classList.remove('liked'); // retire la classe rouge
                console.log('Like retiré');
            } else {
                const errorData = await response.json(); // récupère les données d'erreur
                console.error('Erreur:', errorData); // affiche l'erreur dans la console
                alert(errorData.error || 'Erreur lors du retrait du like');
            }
            
        } else {
            // Ajouter le like
            const response = await fetch('/addLike', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPublication })
            });
            
            // si la réponse est ok
            if (response.ok) {
                // Change l'icône en cœur plein
                likeIcon.classList.remove('fa-regular'); // retire la classe du coeur vide
                likeIcon.classList.add('fa-solid'); // ajoute la classe du coeur plein
                likeIcon.classList.add('liked'); // ajoute la classe rouge
                console.log('Like ajouté');
            } else {
                const errorData = await response.json(); // récupère les données d'erreur
                console.error('Erreur:', errorData); // affiche l'erreur dans la console
                alert(errorData.error || 'Erreur lors de l\'ajout du like');
            }
        }
    // En cas d'erreur
    } catch (error) {
        console.error('Erreur lors du toggle like:', error);
        alert('Vous devez être connecté pour liker');
    }
}

// Écoute les clics sur les icônes de like
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-heart')) { // vérifie si l'élément cliqué est une icône de coeur
        const postItem = e.target.closest('.post-item'); // trouve l'élément parent le plus proche avec la classe 'post-item'
        const postMedia = postItem.querySelector('.post-image'); // récupère l'image ou la vidéo de la publication
        const idPublication = postMedia.src; // Utilise l'URL comme ID temporaire
        
        toggleLike(idPublication, e.target); // appelle la fonction toggleLike avec l'ID de la publication et l'icône cliquée
    }
});


//==================================== Lorsqu'un utilisateur clique sur profil ============================

/* Récupère le bouton */
const boutonConnexionInscription = document.getElementById("boutonConnexionInscription")

boutonConnexionInscription.addEventListener('click', async (e) => {

    /* Préviens le comportement de base */
    e.preventDefault();

    /* Récupère l'utilisateur connecté si il y a lieu */
    try {
        const response = await fetch('/getLoginUser', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        /* Si il y a un utilisateur connecté, redirige vers la page profil. Sinon, vers la page connexion */
        if (response.ok) {
            window.location.href = "/connexion-inscription/client/profil.html"
        } else {
            window.location.href = "/connexion-inscription/client/connexion.html"
        }

    } catch (err) {

        /* En cas d'erreur serveur, redirige vers la page connexion */
        console.error(err)
        window.location.href = "/connexion-inscription/client/connexion.html"
    }
    
})
//====================================Barre de recherche============================
const btnSearch = document.getElementById("btnSearch");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Gère l'affichage de la barre de recherche et les recherches d'utilisateurs
btnSearch.addEventListener("click", () => {
    searchBox.style.display = searchBox.style.display === "block" ? "none" : "block";
    searchInput.value = "";
    searchResults.innerHTML = "";
});

// Ferme la barre de recherche si on clique en dehors
document.addEventListener("click", (event) => {
    if (!searchBox.contains(event.target) && event.target !== btnSearch) {
        searchBox.style.display = "none";
        searchInput.value = "";
        searchResults.innerHTML = "";
    }
});
// Gère la recherche d'utilisateurs au fur et à mesure de la saisie
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length === 0) {
        searchResults.innerHTML = "";
        return;
    }
    try {
        const response = await fetch(`/searchUsers?query=${encodeURIComponent(query)}`);
        if (response.ok) {
            const users = await response.json();
            searchResults.innerHTML = "";
            users.forEach(user => {
                const userDiv = document.createElement("div");
                userDiv.classList.add("search-result-item");
                userDiv.textContent = user.username;
                searchResults.appendChild(userDiv);
            });
        } else {
            console.error("Erreur lors de la recherche d'utilisateurs");
        }
    } catch (error) {
        console.error("Erreur lors de la recherche d'utilisateurs:", error);
    }
});
