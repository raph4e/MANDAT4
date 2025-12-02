/* Récupère les éléments nécessaires */
const divNomUtilisateur = document.getElementById("divNomUtilisateur")
const divNumTel = document.getElementById("divNumTel")
const boutonSeDeconnecter = document.getElementById("boutonSeDeconnecter")
const divPasDeCompte = document.getElementById("divPasDeCompte")

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
        divNomUtilisateur.innerHTML = `<span class="info-profil formulaire-champ">${utilisateurConnexion.name}</span>`;
        divNumTel.innerHTML = `<span class="info-profil formulaire-champ">${utilisateurConnexionNumTel?.numTel || "Numéro non disponible"}</span>`;
     
    } catch (err) {

        /* En cas d'erreur serveur, redirige vers la page connexion */
        console.error(err)
        window.location.href = "/connexion-inscription/client/connexion.html"
    }

};

boutonSeDeconnecter.addEventListener("click", async () => {

    /* Appel au serveur pour vider la table */
    await fetch('/logout', { method: 'POST' });

    /* Vide les div de profil.html */
    divNomUtilisateur.innerHTML = "";
    divNumTel.innerHTML = "";

    /* L'indique côté client */
    divPasDeCompte.innerHTML = `<span style="color:green;">Déconnexion réussie ! Redirection vers la page d'accueil...</span>`

    /* Redirection vers la page d'accueil */
    setTimeout(() => {
        window.location.href = "/index.html";
    }, 2000);

})