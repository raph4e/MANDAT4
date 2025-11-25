/* Récupère les éléments nécessaires */
const divNomUtilisateur = document.getElementById("divNomUtilisateur")
const divNumTel = document.getElementById("divNumTel")

/* S'éxécute lorsque la fenêtre est chargé */
window.onload =  async function() {

    /* Récupère l'utilisateur connecté si il y a lieu */
    try {
        const response = await fetch('/getLoginUser', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const numResponse = await fetch('/getLoginUserNumTel', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            console.log("Erreur récupération utilisateur :", response.status);
            return;
        }

        /* Le store dans une variable */
        const utilisateurConnexion = await response.json();
        const utilisateurConnexionNumTel = await numResponse.json();

        /* Modifie la valeur du texte des deux div pour mettre les informations de l'utilisateur connecté */
        divNomUtilisateur.innerHTML = `<span class="info-profil">${utilisateurConnexion.name}</span>`;
        divNumTel.innerHTML = `<span class="info-profil">${utilisateurConnexionNumTel?.numTel || "Numéro non disponible"}</span>`;
     
    } catch (err) {

        /* En cas d'erreur serveur, redirige vers la page connexion */
        console.error(err)
        window.location.href = "/connexion-inscription/client/connexion.html"
    }

}