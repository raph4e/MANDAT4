/* Récupère le bouton inscription, le texte de confirmation et les inputs sur inscription.html */
const boutonInscription = document.getElementById("button-formulaire-inscription")
const nomUtilisateur = document.getElementById("nomUtilisateur")
const motDePasse = document.getElementById("motDePasse")
const divPasDeCompte = document.getElementById("divPasDeCompte")
const numTelephone = document.getElementById("numTelephone")

/* S'éxécute lorsque le contenu de la page est chargé */
window.addEventListener('DOMContentLoaded', () => {
    try {

        /* S'éxécute si l'utilisateur est sur la page de connexion */
        if (window.location.href.endsWith("/connexion.html")) {

            /* Appelle la fonction qui permet de charger les cookies si il y en a */
            chargerDonneesDepuisCookies()

        };

    } catch (error) {

        /* Indique l'erreur si c'est le cas */
        console.error("Erreur lors de la récupération et l'affichage des cookies : ", error)

    }
})

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

        /* Store les infos entrées dans un cookie */
        document.cookie = `nomUtilisateur=${encodeURIComponent(nomUtilisateur.value)}; path=/`;
        document.cookie = `motDePasse=${encodeURIComponent(motDePasse.value)}; path=/`;

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

    } else if (window.location.href.endsWith("/connexion.html")) {

        /* Préviens les actions par défaut du formulaire */
        e.preventDefault();

        /* Appelle la fonction qui permet de charger les cookies si il y en a */
        chargerDonneesDepuisCookies()

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

            /* Store les infos entrées dans un cookie */
            document.cookie = `nomUtilisateur=${encodeURIComponent(nomUtilisateur.value)}; path=/`;
            document.cookie = `motDePasse=${encodeURIComponent(motDePasse.value)}; path=/`;

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

                /* Redirection vers la page d'accueil */
                setTimeout(() => {
                    divPasDeCompte.innerHTML = `
                        <span>Pas de compte?</span>
                        <a href="inscription.html">S'inscrire</a>
                    `
                }, 2000);

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

function chargerDonneesDepuisCookies() {
    /* Récupère les cookies et les divise en paires clé-valeur */
    const cookies = document.cookie.split('; ');

    /* Parcoure chaque cookie et remplit les champs de formulaire correspondants */
    cookies.forEach(cookie => {

        /* Divise chaque cookie en clé et valeur */
        const [clé, valeur] = cookie.split('=');

        /* Remplit les champs de formulaire correspondants */
        const input = document.getElementById(clé);

        /* Vérifie si l'input existe avant de lui assigner une valeur */
        if (input) {

            /* Décode la valeur et l'assigne à l'input */
            input.value = decodeURIComponent(valeur);

            /* Ajoute une classe pour indiquer que l'input est rempli */
            input.classList.add('input-filled');
        }
    });
}