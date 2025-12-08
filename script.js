//================================== GÉNÉRATION D'IMAGES ET VIDÉOS VIA PEXELS API ==================================//

// Clé API Pexels
const API_KEY = "YEmthrJDjy7vr7tybv61l9DIASRDocDqYjI7oGn28VdSMphODN3AXMXH";


//==============================================   IMAGES DES STORIES ET SUGGESTIONS (NON STOCKÉES DANS LA BASE DE DONNÉES) ===================================================================

// Fonction pour charger SEULEMENT les stories et suggestions depuis Pexels (pas de sauvegarde dans la base de données)
const LoadStoriesAndSuggestions = async () => {
    try {
        const randomPage = Math.floor(Math.random() * 50) + 1; // Génère un numéro de page aléatoire entre 1 et 50
        const response = await fetch(`https://api.pexels.com/v1/curated?per_page=10&page=${randomPage}`, { // Requête à l'API Pexels pour obtenir des images
            headers: { Authorization: API_KEY } // Ajoute la clé API dans les en-têtes de la requête
        });
        const data = await response.json(); // convertit la réponse en JSON pour qu'on puisse l'utiliser

        //------------------------------ stories --------------------------------------------------
        data.photos.forEach(photo => { // vient parcourir chaque photo reçue
            const img = document.createElement("img"); // vient créer un élément image en HTML
            img.src = photo.src.medium; // vient définir la source de l'image
            img.alt = photo.alt || "Image de l'utilisateur"; // définit le texte alternatif de l'image
            img.classList.add("story-image"); // ajoute une classe CSS à l'image
            document.querySelector(".stories-container").appendChild(img); // ajoute l'image au conteneur des stories en HTML
        });

        //----------------------------- suggestions d'amis -------------------------------------------------
        data.photos.slice(0, 5).forEach((photo, index) => { // vient parcourir les 5 premières photos reçues
            const suggestionItem = document.createElement("div"); // crée un conteneur pour chaque suggestion
            suggestionItem.classList.add("suggestion-item", "noto-sans-0"); // ajoute des classes CSS au conteneur
            
            const img = document.createElement("img"); // crée un élément image pour la suggestion
            img.src = photo.src.small; // définit la source de l'image
            img.alt = photo.alt || "Image de suggestion"; // définit le texte alternatif de l'image
            img.classList.add("suggestion-image"); // ajoute une classe CSS à l'image
            
            const userName = document.createElement("span"); // crée un élément span pour le nom d'utilisateur
            userName.textContent = photo.photographer || `utilisateur_${index + 1}`; // utilise le nom du photographe ou un nom par défaut
            userName.classList.add("suggestion-name"); // ajoute une classe CSS au nom d'utilisateur

            const followLink = document.createElement("a"); // crée un élément lien pour s'abonner
            followLink.textContent = "S'abonner"; // texte du lien
            followLink.href = "#"; // lien vide pour l'instant
            followLink.classList.add("follow-link"); // ajoute une classe CSS au lien
            
            suggestionItem.appendChild(img); // ajoute l'image au conteneur de la suggestion
            suggestionItem.appendChild(userName); // ajoute le nom d'utilisateur au conteneur de la suggestion
            suggestionItem.appendChild(followLink); // ajoute le lien d'abonnement au conteneur de la suggestion
            
            document.querySelector(".suggestions-container").appendChild(suggestionItem); // ajoute la suggestion au conteneur des suggestions en HTML
        });
    } catch (error) {
        console.error("Erreur lors du chargement des stories et suggestions:", error);
    }
};

//==============================================   IMAGES ET VIDÉOS DES PUBLICATIONS (STOCKÉES DANS LA BASE DE DONNÉES) ===================================================================

//------------Fonction pour charger les publications depuis Pexels (photos et vidéos)--------------------------------------------------------
const LoadImages = async () => {
    try {
        // Charger plusieurs pages de photos et vidéos de Pexels pour avoir envirn 50 publications
        const promises = [];
        
        // 10 pages x 5 images = 5 images qu'on va stocker dans la base de données ensuite
        for (let page = 1; page <= 5; page++) {
            promises.push( // elles sont d'abord toutes stockées dans un tableau de promesses
                fetch(`https://api.pexels.com/v1/curated?per_page=5&page=${page}`, { // Requête à l'API Pexels pour obtenir des images
                    headers: { Authorization: API_KEY } // Ajoute la clé API dans les en-têtes de la requête
                }).then(res => res.json()).then(data => ({ type: 'photo', data })) // chaque promesse résout en un objet avec le type et les données
            );
        }
        
        // 10 pages x 5 vidéos = 5 vidéos
        for (let page = 1; page <= 5; page++) { // elles seront stockées dans la base de données ensuite
            promises.push( // elles sont d'abord toutes stockées dans un tableau de promesses
                fetch(`https://api.pexels.com/videos/popular?per_page=5&page=${page}`, { // Requête à l'API Pexels pour obtenir des vidéos
                    headers: { Authorization: API_KEY } // Ajoute la clé API dans les en-têtes de la requête
                }).then(res => res.json()).then(data => ({ type: 'video', data })) // chaque promesse résout en un objet avec le type et les données
            );
        }
        
        const allData = await Promise.all(promises); // Attend que toutes les promesses soient résolues pour éviter les problèmes d'asynchronicité
        
//---------------- Stockage des photos du tableau dans la base de données (environ 25)------------------------------------------------
// *** IMPORTANT : LE PREMIER CHARGEMENT EST PLUS LONG MAIS LORS DES PROCHAINS CHARGEMENTS, LES DONNÉES SONT DÉJÀ DANS LA BASE DE DONNÉES ET IL N'Y AURA PAS BESOIN DE RECHARGER DE PEXELS DONC BEAUCOUP PLUS RAPIDE ***    
        for (const item of allData) { // vient parcourir chaque élément du tableau
            if (item.type === 'photo') { // si c'est une photo
                for (const photo of item.data.photos) { // vient parcourir chaque photo reçue
                    try {
                        await fetch('/addPublication', { // appelle la requête pour ajouter une publication dans la base de données
                            method: 'POST', // méthode POST
                            headers: { 'Content-Type': 'application/json' }, // type de contenu JSON
                            body: JSON.stringify({ // JSON.stringify pour convertir en chaîne JSON car on envoie des données qui doivent être sérialisées
                                id: `pexels_photo_${photo.id}`, // ID unique pour chaque photo
                                image: photo.src.large, // URL de l'image
                                video: null, // pas de vidéo pour une photo
                                description: photo.alt || "", // Description optionnelle
                                photographer: photo.photographer, // Nom du photographe
                                idAuteur: null // pas d'auteur car c'est une publication chargée automatiquement depuis Pexels
                            })
                        });
                    } catch (error) {
                        console.error("Erreur lors de la sauvegarde de la photo:", error);
                    }
                }
//------------ Stockage des vidéos du tableau dans la base de données (environ 25)------------------------------------------------
            } else if (item.type === 'video') { // si c'est une vidéo
                for (const video of item.data.videos) { // vient parcourir chaque vidéo reçue
                    try {
                        await fetch('/addPublication', { // appelle la requête pour ajouter une publication dans la base de données
                            method: 'POST', // méthode POST
                            headers: { 'Content-Type': 'application/json' }, // type de contenu JSON
                            body: JSON.stringify({ // JSON.stringify pour convertir en chaîne JSON car on envoie des données qui doivent être sérialisées
                                id: `pexels_video_${video.id}`, // ID unique pour chaque vidéo
                                image: video.image, // URL de l'image miniature de la vidéo
                                video: video.video_files[0].link, // URL de la vidéo (on prend la première qualité disponible)
                                description: "", // pas de description pour les vidéos
                                photographer: video.user.name, // Nom du vidéaste qui servira à afficher le nom dans la publication
                                idAuteur: null // pas d'auteur car c'est une publication chargée automatiquement depuis Pexels
                            })
                        });
                    } catch (error) {
                        console.error("Erreur lors de la sauvegarde de la vidéo:", error);
                    }
                }
            }
        }
        
        console.log("200 publications (100 photos + 100 vidéos) chargées et sauvegardées depuis Pexels");
    } catch (error) {
        console.error("Erreur lors du chargement des publications:", error);
    }
};


//====================================== CHARGEMENT DU CONTENU DE LA PAGE ==================================

//------------------- Fonction pour créer une publication (HTML) ----------------------------------------
function createPostElement(publication) { // publication est un objet avec les données de la publication
    const postItem = document.createElement("div"); // conteneur principal de la publication
    postItem.classList.add("post-item"); // ajoute une classe CSS au conteneur
    postItem.dataset.publicationId = publication.id; // ajoute un attribut de données pour l'ID de la publication
    
    // En-tête
    const postHeader = document.createElement("div"); // conteneur de l'en-tête
    postHeader.classList.add("post-header"); // ajoute une classe CSS à l'en-tête
    
    const profileImg = document.createElement("img"); // image de profil
    profileImg.src = publication.image; // Utilise l'image comme photo de profil
    profileImg.alt = "Photo de profil"; // texte alternatif
    profileImg.classList.add("post-profile-image"); // ajoute une classe CSS à l'image de profil
    
    const userName = document.createElement("span"); // nom d'utilisateur
    userName.textContent = publication.photographer || "utilisateur"; // utilise le nom du photographe ou un nom par défaut
    userName.classList.add("post-username", "noto-sans-0"); // ajoute des classes CSS au nom d'utilisateur

    const moreIcon = document.createElement("span"); // icône "plus" pour les options supplémentaires
    moreIcon.classList.add("fa-solid", "fa-ellipsis", "post-more-icon"); // ajoute des classes CSS à l'icône
    
    postHeader.appendChild(profileImg); // ajoute l'image de profil à l'en-tête
    postHeader.appendChild(userName); // ajoute le nom d'utilisateur à l'en-tête
    postHeader.appendChild(moreIcon); // ajoute l'icône "plus" à l'en-tête
    
//------------------------------Média de la publication (image ou vidéo)-----------------------------------------
// cette partie ici vient vérifier si la publication est une image ou une vidéo et crée l'élément HTML approprié
    let mediaElement; // élément média (image ou vidéo)
    if (publication.video) { // si la publication a une vidéo
        // C'est une vidéo
        mediaElement = document.createElement("video"); // crée un élément vidéo
        mediaElement.src = publication.video; // définit la source de la vidéo
        mediaElement.controls = true; // ajoute les contrôles de lecture qui permettent de jouer, mettre en pause, etc.
        mediaElement.style.width = "28em"; // définit la largeur
        mediaElement.style.height = "36em"; // définit la hauteur
        mediaElement.style.objectFit = "cover"; // ajuste la vidéo pour couvrir toute la zone sans déformation
        mediaElement.classList.add("post-image"); // ajoute une classe CSS à la vidéo
        mediaElement.setAttribute("preload", "metadata"); // précharge seulement les métadonnées pour un chargement plus rapide
    } else {
        // C'est une image
        mediaElement = document.createElement("img"); // crée un élément image
        mediaElement.src = publication.image; // définit la source de l'image
        mediaElement.alt = publication.description || "Publication"; // définit le texte alternatif de l'image
        mediaElement.style.width = "28em"; // définit la largeur
        mediaElement.style.height = "36em"; // définit la hauteur
        mediaElement.style.objectFit = "cover"; // ajuste l'image pour couvrir toute la zone sans déformation
        mediaElement.classList.add("post-image"); // ajoute une classe CSS à l'image
    }
    
//---------------------------------- Actions (like, commentaire, partage) -----------------------------------------
    const postActions = document.createElement("div"); // conteneur des actions (like, commentaire, partage)
    postActions.classList.add("post-actions"); // ajoute une classe CSS au conteneur des actions
    
    const likeIcon = document.createElement("button"); // icône de like
    likeIcon.classList.add("fa-regular", "fa-heart", "post-action-icon"); // ajoute des classes CSS à l'icône de like
    
    const commentIcon = document.createElement("button");   // icône de commentaire
    commentIcon.classList.add("fa-regular", "fa-comment", "post-action-icon"); // ajoute des classes CSS à l'icône de commentaire
    
    // Gestion des commentaires
    commentIcon.addEventListener('click', async () => { // lorsqu'on clique sur l'icône de commentaire
        const response = await fetch('/getLoginUser'); // vérifie si un utilisateur est connecté
        
        // Si aucun utilisateur n'est connecté, affiche un message d'erreur
        if (!response.ok) {
            commentIcon.disabled = true; // désactive le bouton pour éviter les clics multiples
            const messageErreur = document.createElement("p"); // crée un élément paragraphe pour le message d'erreur
            messageErreur.textContent = "Il faut être connecté pour écrire un commentaire"; // texte du message d'erreur
            messageErreur.style.color = "red"; // couleur rouge pour le message d'erreur
            messageErreur.style.marginLeft = "1.5em"; // marge à gauche
            postItem.appendChild(messageErreur); // ajoute le message d'erreur à la publication
            
            // setTimeout pour enlever le message d'erreur après 2 secondes
            setTimeout(() => {
                messageErreur.remove(); // enlève le message d'erreur
                commentIcon.disabled = false; // réactive le bouton commentaire
            }, 2000); // 2000 millisecondes = 2 secondes
            return;
        }
        
        // Si un utilisateur est connecté, récupère ses informations
        const loginUser = await response.json(); // récupère les données de l'utilisateur connecté
        commentIcon.disabled = true; // désactive le bouton pour éviter les clics multiples
        
        // Crée les éléments pour écrire un commentaire
        const commentaire = document.createElement("textarea"); // zone de texte pour le commentaire
        commentaire.placeholder = "Écrivez votre commentaire ici..."; // texte d'instruction
        commentaire.style.width = "24em"; // largeur de la zone de texte
        commentaire.style.height = "7em"; // hauteur de la zone de texte
        commentaire.style.marginTop = "1em"; // marge en haut
        commentaire.style.marginLeft = "1.5em"; // marge à gauche
        
        const boutonEnvoyer = document.createElement("button"); // bouton pour envoyer le commentaire
        boutonEnvoyer.textContent = "Envoyer"; // texte du bouton
        
        // met sur écoute le clic sur le bouton envoyer
        boutonEnvoyer.addEventListener('click', async () => {
            // Sauvegarder le commentaire dans la base de données
            try {
                const idPublication = postItem.dataset.publicationId; // Récupère l'ID de la publication
                const saveResponse = await fetch('/addCommentaire', { // appelle la requête pour ajouter un commentaire
                    method: 'POST', // méthode POST
                    headers: { 'Content-Type': 'application/json' }, // type de contenu JSON
                    body: JSON.stringify({ // JSON.stringify pour convertir en chaîne JSON
                        idPublication: idPublication, // ID de la publication
                        message: commentaire.value // contenu du commentaire
                    })
                });

                // si la réponse n'est pas ok, lance une erreur
                if (!saveResponse.ok) {
                    throw new Error('Erreur lors de la sauvegarde du commentaire');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la sauvegarde du commentaire');
                return;
            }

            // sinon affiche le commentaire sous la publication
            const ligneCommentaire = document.createElement("div"); // conteneur du commentaire
            ligneCommentaire.style.display = "flex"; // utilise flexbox pour l'alignement
            ligneCommentaire.style.flexDirection = "row"; // direction en ligne
            ligneCommentaire.style.gap = "0.5em"; // espace entre les éléments
            
            // crée les éléments pour afficher le commentaire
            const utilisateurCommentaire = document.createElement("p"); // nom de l'utilisateur
            utilisateurCommentaire.textContent = loginUser.name; // utilise le nom de l'utilisateur connecté
            utilisateurCommentaire.style.fontWeight = "bold"; // met le nom en gras
            utilisateurCommentaire.style.marginLeft = "1.5em"; // marge à gauche
            
            // crée l'élément pour le contenu du commentaire
            const contenuCommentaire = document.createElement("p"); // contenu du commentaire
            contenuCommentaire.textContent = commentaire.value; // utilise le texte du commentaire
            contenuCommentaire.style.marginLeft = "0.5em"; // marge à gauche
            
            // ajoute le nom et le contenu du commentaire au conteneur
            ligneCommentaire.appendChild(utilisateurCommentaire); // ajoute le nom de l'utilisateur
            ligneCommentaire.appendChild(contenuCommentaire); // ajoute le contenu du commentaire
            postItem.appendChild(ligneCommentaire); // ajoute le commentaire à la publication
            
            // Nettoyer la zone de texte et réactiver le bouton commentaire
            commentaire.remove(); // enlève la zone de texte
            boutonEnvoyer.remove(); // enlève le bouton envoyer
            commentIcon.disabled = false; // réactive le bouton commentaire
        });
        
        // Style du bouton envoyer
        boutonEnvoyer.style.marginTop = "2em";
        boutonEnvoyer.style.width = "12em";
        boutonEnvoyer.style.marginLeft = "1.5em";
        
        // Ajoute la zone de texte et le bouton envoyer à la publication
        postItem.appendChild(commentaire); // ajoute la zone de texte
        postItem.appendChild(boutonEnvoyer); // ajoute le bouton envoyer
    });
    
    // Icône de partage
    const shareIcon = document.createElement("button");  // icône de partage
    shareIcon.classList.add("fa-regular", "fa-bookmark", "post-action-icon"); // ajoute des classes CSS à l'icône de partage
    
    // Ajoute les icônes au conteneur des actions
    postActions.appendChild(likeIcon); // ajoute l'icône de like
    postActions.appendChild(commentIcon); // ajoute l'icône de commentaire
    postActions.appendChild(shareIcon); // ajoute l'icône de partage
    
    //------------------------------ Nombre de likes -----------------------------------------
    
    // Afficher le nombre de likes
    const likesCount = document.createElement("p"); // élément pour afficher le nombre de likes
    likesCount.classList.add("likes-count"); // ajoute une classe CSS au compteur de likes
    likesCount.style.marginLeft = "1.5em"; // marge à gauche
    likesCount.style.fontWeight = "bold"; // met le texte en gras
    const count = publication.nombreLikes || 0; // utilise le nombre de likes de la publication ou 0 par défaut
    if (count > 0) { // n'affiche le compteur que s'il y a au moins 1 like pour éviter d'avoir "0 likes"
        likesCount.textContent = count;
    } else {
        likesCount.style.display = "none";
    }
    
    // Assemble tous les éléments de la publication
    postItem.appendChild(postHeader); // ajoute l'en-tête à la publication
    postItem.appendChild(mediaElement); // ajoute le média (image ou vidéo) à la publication
    postItem.appendChild(postActions); // ajoute les actions à la publication
    postItem.appendChild(likesCount); // ajoute le compteur de likes à la publication
    
    return postItem;
}

//=================================== FONCTION POUR CHARGER LES COMMENTAIRES DES PUBLICATIONS=========================

// elle sert lors du chargement des publications pour afficher les commentaires déjà présents dans la base de données
async function loadCommentsForPost(idPublication, postElement) { // idPublication est l'ID de la publication, postElement est l'élément HTML de la publication
    try {
        const response = await fetch(`/getCommentaires/${encodeURIComponent(idPublication)}`); // vient chercher les commentaires (encodeURIComponent pour s'assurer que l'ID est correctement encodé dans l'URL)
        // si la réponse est ok, traite les commentaires
        if (response.ok) {
            const commentaires = await response.json(); // convertit la réponse en JSON pour qu'on puisse l'utiliser
            commentaires.forEach(comment => { // vient parcourir chaque commentaire reçu
                const ligneCommentaire = document.createElement("div"); // conteneur du commentaire
                ligneCommentaire.style.display = "flex"; // utilise flexbox pour l'alignement
                ligneCommentaire.style.flexDirection = "row"; // direction en ligne
                ligneCommentaire.style.gap = "0.2em"; // espace entre les éléments
                
                // crée les éléments pour afficher le commentaire
                const utilisateurCommentaire = document.createElement("p"); // nom de l'utilisateur
                utilisateurCommentaire.textContent = comment.auteurName; // utilise le nom de l'auteur du commentaire
                utilisateurCommentaire.style.fontWeight = "bold"; // met le nom en gras
                utilisateurCommentaire.style.marginLeft = "1.5em"; // marge à gauche
                
                // crée l'élément pour le contenu du commentaire
                const contenuCommentaire = document.createElement("p"); // contenu du commentaire
                contenuCommentaire.textContent = comment.message; // utilise le texte du commentaire
                contenuCommentaire.style.marginLeft = "0.5em"; // marge à gauche
                
                // ajoute le nom et le contenu du commentaire au conteneur
                ligneCommentaire.appendChild(utilisateurCommentaire); // ajoute le nom de l'utilisateur
                ligneCommentaire.appendChild(contenuCommentaire); // ajoute le contenu du commentaire
                postElement.appendChild(ligneCommentaire); // ajoute le commentaire à la publication
            });
        }
    } catch (error) {
        console.error("Erreur lors du chargement des commentaires:", error);
    }
}

//===================================== FONCTION POUR VÉRIFIER/METTRE À JOUR L'ÉTAT DU LIKE =======================================

// elle sert lors du chargement des publications pour afficher les likes déjà faits par l'utilisateur (via la base de données) connecté sinon le cœur reste vide
async function checkAndUpdateLikeStatus(idPublication, postElement) {
    try {
        const response = await fetch(`/checkLike/${encodeURIComponent(idPublication)}`); // vient vérifier si l'utilisateur a liké cette publication (encodeURIComponent pour s'assurer que l'ID est correctement encodé dans l'URL)
        // si la réponse est ok, traite les données
        if (response.ok) {
            const data = await response.json(); // convertit la réponse en JSON pour qu'on puisse l'utiliser
            const likeIcon = postElement.querySelector('.fa-heart'); // sélectionne l'icône de like dans la publication
            if (data.liked) { // si l'utilisateur a liké cette publication
                likeIcon.classList.remove('fa-regular'); // retire la classe du coeur vide
                likeIcon.classList.add('fa-solid', 'liked'); // ajoute la classe du coeur plein et la classe rouge (la classe rouge est dans la page CSS)
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du like:", error);
    }
}

//========================================= FONCTION POUR METTRE À JOUR LE COMPTEUR DE LIKES =========================================

// elle sert lors du chargement des publications pour afficher le nombre de likes actuels depuis la base de données
async function updateLikesCount(idPublication, postElement) { // idPublication est l'ID de la publication, postElement est l'élément HTML de la publication
    try {
        const response = await fetch(`/getLikes/${encodeURIComponent(idPublication)}`); // vient chercher le nombre de likes (encodeURIComponent pour s'assurer que l'ID est correctement encodé dans l'URL)
        // si la réponse est ok, traite les données
        if (response.ok) {
            const data = await response.json(); // convertit la réponse en JSON pour qu'on puisse l'utiliser
            const likesCount = postElement.querySelector('.likes-count'); // sélectionne l'élément du compteur de likes dans la publication
            if (likesCount && data.count > 0) { // si le compteur existe et qu'il y a au moins 1 like
                likesCount.textContent = data.count; // met à jour le texte du compteur
                likesCount.style.display = "block"; // s'assure que le compteur est visible
            }
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des likes:", error);
    }
}

//==================================== FONCTION POUR CHARGER LES PUBLICATIONS DE LA BASE DE DONNÉES ====================================

// elle sert lors du chargement de la page pour afficher les publications stockées dans la base de données
// la différence entre createPostElement(publication) et LoadPublicationsFromDB() est que la première crée l'élément HTML d'une publication tandis que la seconde charge les publications depuis la base de données et utilise la première pour les afficher
async function LoadPublicationsFromDB() { 
    try {
        const response = await fetch('/getPublications'); // vient chercher les publications dans la base de données
        // si la réponse n'est pas ok, lance une erreur
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des publications');
        }
        
        // sinon récupère les données de la réponse et les convertit en JSON
        const publications = await response.json();
        
        // si il y a des publications, les affiche
        if (publications.length > 0) {
            console.log(`${publications.length} publications disponibles en BDD`);
            
            // Sélectionner 10 publications aléatoires
            const shuffled = publications.sort(() => 0.5 - Math.random()); // mélange les publications de manière aléatoire
            const selectedPublications = shuffled.slice(0, 50); // prend les 10 premières publications du tableau mélangé
            
            console.log(`Affichage de ${selectedPublications.length} publications aléatoires`);
            
//--------------------------- Afficher chaque publication------------------------------------------------------
            for (const pub of selectedPublications) { // vient parcourir chaque publication sélectionnée
                const postElement = createPostElement(pub); // crée l'élément HTML de la publication
                document.querySelector(".posts-container").appendChild(postElement); // ajoute la publication au conteneur des publications en HTML
                
                // Charger les commentaires pour cette publication
                await loadCommentsForPost(pub.id, postElement); 
                
                // Vérifier si l'utilisateur a liké cette publication
                await checkAndUpdateLikeStatus(pub.id, postElement);
                
                // Charger le nombre de likes
                await updateLikesCount(pub.id, postElement);
            }
            
            return true; // Publications chargées
        }
        return false; // Aucune publication
    } catch (error) {
        console.error("Erreur:", error);
        return false;
    }
}

//====================================== CHARGEMENT INITIAL DE LA PAGE ==================================

// sert à charger le contenu de la page au chargement initial
// la différence ce qui se pass ici et dans LoadPublicationsFromDB() est que cette fonction gère le flux global de chargement (stories, suggestions, publications) tandis que l'autre se concentre uniquement sur le chargement des publications depuis la base de données
window.onload = async () => {
    // 1. Charger TOUJOURS les stories et suggestions depuis Pexels (fraîches à chaque fois)
    await LoadStoriesAndSuggestions();
    
    // 2. Essayer de charger les publications depuis la base de données
    const hasPublications = await LoadPublicationsFromDB();
    
    // 3. Si pas de publications dans la base de données, charger depuis Pexels (et elles seront sauvegardées)
    if (!hasPublications) {
        console.log("Aucune publication en BDD, chargement depuis Pexels...");
        await LoadImages(); // Charge 100 photos + 100 vidéos et les sauvegarde en BDD
        // Puis recharge depuis la base pour les afficher
        await LoadPublicationsFromDB();
    }
}

// cela fait en sorte que si l'utilisateur rafraîchit la page, les publications sont rechargées depuis la base de données sans avoir à recharger depuis Pexels à chaque fois (ce qui serait lent et inefficace)


//====================================== GESTION DES LIKES =======================================================================

// Fonction pour liker/unliker une publication
async function toggleLike(idPublication, likeIcon) {
    try {
        // Récupère le conteneur de la publication pour trouver le compteur
        const postItem = likeIcon.closest('.post-item'); // trouve l'élément parent le plus proche avec la classe 'post-item'
        const likesCount = postItem.querySelector('.likes-count'); // sélectionne l'élément du compteur de likes dans la publication
        
        // Debugging logs
        console.log('toggleLike - idPublication:', idPublication);
        console.log('toggleLike - likesCount element:', likesCount);
        
        // Vérifie si déjà liké
        const checkResponse = await fetch(`/checkLike/${encodeURIComponent(idPublication)}`); // encodeURIComponent pour s'assurer que l'ID est correctement encodé dans l'URL
        
        // si la réponse n'est pas ok, lance une erreur
        if (!checkResponse.ok) {
            throw new Error('Erreur de connexion au serveur');
        }
        
        // sinon on récupère les données de la réponse et les convertit en JSON
        const checkData = await checkResponse.json();

        // si la publication est déjà likée
        if (checkData.liked) {
//----------------------------------- Retirer le like--------------------------------------------------------
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
                
                // Met à jour le compteur pour refléter le retrait du like
                const currentLikes = await fetch(`/getLikes/${encodeURIComponent(idPublication)}`); // récupère le nombre actuel de likes
                const likesData = await currentLikes.json(); // convertit la réponse en JSON
                console.log('Données likes reçues:', likesData); // log pour le debugging
                if (likesCount) { // vérifie si l'élément du compteur existe
                    if (likesData.count > 0) { // si le nombre de likes est supérieur à 0
                        likesCount.textContent = likesData.count; // met à jour le texte du compteur
                        likesCount.style.display = "block"; // s'assure que le compteur est visible
                    } else {
                        likesCount.style.display = "none"; // cache le compteur s'il n'y a plus de likes
                    }
                }
                
                console.log('Like retiré');
            } else {
                const errorData = await response.json(); // récupère les données d'erreur
                console.error('Erreur:', errorData); // affiche l'erreur dans la console
                alert(errorData.error || 'Erreur lors du retrait du like');
            }
            
        } else {
//-------------------------------------- Ajouter le like----------------------------------------------------------------
            const response = await fetch('/addLike', { // envoie une requête pour ajouter le like
                method: 'POST', // méthode POST
                headers: { 'Content-Type': 'application/json' }, // type de contenu JSON
                body: JSON.stringify({ idPublication }) // envoie l'ID de la publication à liker
            });
            
            // si la réponse est ok
            if (response.ok) {
                // Change l'icône en cœur plein
                likeIcon.classList.remove('fa-regular'); // retire la classe du coeur vide
                likeIcon.classList.add('fa-solid'); // ajoute la classe du coeur plein
                likeIcon.classList.add('liked'); // ajoute la classe rouge qui est dans la page CSS
                
                // Met à jour le compteur
                const currentLikes = await fetch(`/getLikes/${encodeURIComponent(idPublication)}`); // récupère le nombre actuel de likes
                const likesData = await currentLikes.json(); // convertit la réponse en JSON
                console.log('Données likes reçues:', likesData); // log pour le debugging
                if (likesCount) { // vérifie si l'élément du compteur existe
                    if (likesData.count > 0) { // si le nombre de likes est supérieur à 0
                        likesCount.textContent = likesData.count; // met à jour le texte du compteur
                        likesCount.style.display = "block"; // s'assure que le compteur est visible
                    } else {
                        likesCount.style.display = "none"; // cache le compteur s'il n'y a pas de likes (peu probable ici)
                    }
                }
                
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

//----------------------------------------------------- Écoute les clics sur les icônes de like-------------------------------
// sert à détecter les clics sur les icônes de like (cœurs) et appelle la fonction toggleLike avec l'ID de la publication correspondante
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-heart')) { // vérifie si l'élément cliqué est une icône de coeur
        const postItem = e.target.closest('.post-item'); // trouve l'élément parent le plus proche avec la classe 'post-item'
        const idPublication = postItem.dataset.publicationId; // Récupère l'ID stocké dans data-publication-id
        
        toggleLike(idPublication, e.target); // appelle la fonction toggleLike avec l'ID de la publication et l'icône cliquée
    }
});


// ----------------- Fonction pour ajouter des likes & commentaires randoms -----------------

async function populateLikesComments() {
    try {
        const resultat = await fetch('/getPublications')
        if (!resultat.ok) {throw new Error("Erreur du côté serveur lors de la récupération des publications")}
        const publications = await resultat.json()
        for (const pub of publications){
            const commentaire = await fetch('/')
        }
    }


}


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


//===================================== GESTION DE LA CONNEXION/INSCRIPTION ============================

/* S'éxécute lorsque la page est loadé */
window.addEventListener('DOMContentLoaded', async () => {

    try {

        /* Récupère l'utilisateur connecté si il y a lieu */
        res = await fetch('/getLoginUser', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        /* Convertit la réponse en JSON */
        utilisateurConnecte = await res.json()

        /* Redirige l'utilisateur vers la page connexion/inscription s'il n'est pas connecté et essaie d'accéder à profil.html */
        if (utilisateurConnecte.res === 200 && !utilisateurConnecte.name) {
            window.location.href = "/connexion-inscription/client/connexion.html"
        }

    } catch (error) {

        /* Indique l'erreur si c'est le cas */
        console.error("Erreur lors de la récupération de l'utilisateur connecté : ", error)
    }
});