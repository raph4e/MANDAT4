// Récupère chaque élément par leur id

const button = document.getElementById("button-formulaire");
const texteConfirmation = document.getElementById("confirmation");
const nomUtilisateur = document.getElementById("nomUtilisateur");
const motDePasse = document.getElementById("motDePasse");
const messageErreurNomUtilisateur = document.getElementById("messageErreurNomUtilisateur")
const messageErreurMotDePasse = document.getElementById("messageErreurMotDePasse")

// Fonction lorsque le bouton envoyer est cliqué

button.addEventListener("click", (event)=> {
    event.preventDefault();

    if (nomUtilisateur.value.trim().length > 0) {
        texteConfirmation.textContent = "Bien recu!";
    } else {
        // Affiche un message d'erreur 
       messageErreurNomUtilisateur.textContent = "Veuillez entrer un nom d'utilisateur"

    }

    if (motDePasse.value.trim().length > 0) {
        texteConfirmation.textContent = "Bien recu!";
    } else {
        // Affiche un message d'erreur 
       messageErreurMotDePasse.textContent = "Veuillez entrer un mot de passe"

    }
});