/* Récupère le bouton inscription, le texte de confirmation et les inputs sur inscription.html */
const boutonInscription = document.getElementById("button-formulaire-inscription")
const confirmationInscription = document.getElementById("confirmationInscription")
const nomUtilisateur = document.getElementById("nomUtilisateur")
const motDePasse = document.getElementById("motDePasse")

/* Ajoute un utilisateur à la base de données lorsque que le bouton pour s'inscrire est cliqué */
boutonInscription.addEventListener("click", (e) => {
    e.preventDefault();

    /* Récupère la méthode permettant d'ajouter un produit */
    fetch('/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name : nomUtilisateur.value,
            password : motDePasse.value
        })
    })

    confirmationInscription.textContent = "Inscription !"

    

})