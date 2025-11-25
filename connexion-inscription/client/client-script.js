/* Récupère le bouton inscription, le texte de confirmation et les inputs sur inscription.html */
const boutonInscription = document.getElementById("button-formulaire-inscription")
const nomUtilisateur = document.getElementById("nomUtilisateur")
const motDePasse = document.getElementById("motDePasse")
const divPasDeCompte = document.getElementById("divPasDeCompte")
const numTelephone = document.getElementById("numTelephone")

/* Ajoute un utilisateur à la base de données lorsque que le bouton pour s'inscrire est cliqué */
boutonInscription.addEventListener("click", async (e) => {

    /* Vérifie si l'utilisateur est sur inscription.html ou connexion.html; Adapte le script en fonction */
    if (window.location.href.endsWith("/inscription.html")) {

        /* Préviens les actions par défaut du formulaire */
        e.preventDefault();

        /* Récupère la méthode permettant d'ajouter un client */
        const response = await fetch('/addUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name : nomUtilisateur.value,
                numTel : numTelephone.value,
                password : motDePasse.value
            })
        })

        /* Réinitialise les inputs */
        nomUtilisateur.value = ""
        numTelephone.value = ""
        motDePasse.value = ""

        /* Message de confirmation et redirection vers la page connexion.html */
        if (response.ok) {
            divPasDeCompte.innerHTML = `<span style="color:green;">Inscription réussie ! Redirection vers la connexion...</span>`
            setTimeout(() => {
                window.location.href = "/connexion.html";
            }, 2000);
        } else {
            divPasDeCompte.innerHTML = `<span style="color:red;">Erreur lors de l'inscription.</span>`
        }

        /* Remet le texte initiale 
        divPasDeCompte.innerHTML = `
            <span>Pas de compte?</span>
            <a href="inscription.html">S'inscrire</a>
        ` */

    } else if (window.location.href.endsWith("/connexion.html")) {

        /* Préviens les actions par défaut du formulaire */
        e.preventDefault();

        /* Appel de la requête connexion lorsqu'un utilisateur clique sur connexion */
        try {
            /* Récupère la requête permettant de connecter un utilisateur */
            const response = await fetch('/loginUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name : nomUtilisateur.value,
                    password : motDePasse.value
                })
            });

            /* Store dans une variable */
            if (response.ok) {

                /* Indique que la connexion a réussie */
                divPasDeCompte.innerHTML = `<span style="color:green;">Connexion réussie ! Redirection...</span>`;

                /* Redirection vers la page d'accueil */
                setTimeout(() => {
                    window.location.href = "/index.html"; 
                }, 2000);

            } else {

                const data = await response.json();

                /* Affiche un message d'erreur si la connexion a échoué */
                divPasDeCompte.innerHTML = `<span style="color:red;">${data.error || "Nom d'utilisateur ou mot de passe incorrect."}</span>`;

                /* Réinitialise les inputs */
                nomUtilisateur.value = ""
                motDePasse.value = ""

                /* Met le curseur sur le nom utilisateur */
                nomUtilisateur.focus();
            }

        } catch (err) {

            /* Affiche une erreur en cas de problème serveur */
            console.error(err);
            divPasDeCompte.innerHTML = `<span style="color:red;">Erreur serveur. Veuillez réessayer plus tard.</span>`;
        }

    } else {

        /* Envoie une erreur si la page n'est pas trouvé */
        console.log("Page html introuvable")
    }
});
