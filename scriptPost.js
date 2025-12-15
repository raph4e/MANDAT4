// Récupération des éléments du DOM
const bouttonPost = document.getElementById("button-formulaire-post")
const img = document.getElementById('image')
const description = document.getElementById("desc")
const confirmation = document.getElementById("confirmationPost")
const fichier = document.getElementById('fichier')

// Prévisualisation sécurisée avec validation
if (fichier) {
  fichier.addEventListener('change', function (e) { // vient mettre sur écoute le changement de fichier
    const file = e.target?.files && e.target.files[0] // Récupère le premier fichier sélectionné
    if (!file) { // si aucun fichier n'est sélectionné
      console.error('Aucun fichier sélectionné')
      return
    }
    if (!file.type || !file.type.startsWith('image/')) { // si le type de fichier n'est pas une image (type et startsWith pour vérifier le début de la chaîne)
      console.error('Fichier non image:', file?.type) // log de l'erreur
      return
    }

    const src = URL.createObjectURL(file) // Crée une URL temporaire pour l'image
    if (img) { // si l'élément img existe
      img.src = src // assigne l'URL temporaire à l'attribut src de l'image
      img.onload = () => URL.revokeObjectURL(src) // libère la mémoire une fois l'image chargée
    } else { // sinon l'élément img n'existe pas
      console.warn('Élément <img id="image"> introuvable')
      URL.revokeObjectURL(src) // libère la mémoire immédiatement
    }
  })
}

// transformer l'image en base64 pour l'envoi en json
function toBase64(file) {
  return new Promise((resolve, reject) => { // crée une promesse pour la conversion (resolve et reject pour gérer le succès et l'erreur)
    const reader = new FileReader() // crée un nouvel objet FileReader (API Web pour lire les fichiers)
    reader.readAsDataURL(file) // lit le fichier en tant qu'URL de données (base64)
    reader.onload = () => resolve(reader.result) // résout la promesse avec le résultat de la lecture
    reader.onerror = reject // rejette la promesse en cas d'erreur
  })
}

// Ajout de l'événement click sur le bouton de publication
bouttonPost.addEventListener('click', async (event) => { // écoute l'événement click
  event.preventDefault() // empêche le comportement par défaut du formulaire (refresh)
  if (!fichier || !fichier.files || fichier.files.length === 0) { // si aucun fichier n'est sélectionné (files.length pour vérifier la longueur et files pour vérifier l'existence)
    confirmation.classList.remove('confirm') // retire la classe de confirmation
    confirmation.classList.add('error') // ajoute la classe d'erreur
    confirmation.textContent = "Veuillez choisir une image pour la publication" // affiche un message d'erreur
    return
  }

  // essaie d'envoyer la publication
  try {
    const imgBase64 = await toBase64(fichier.files[0]) // convertit l'image en base64 pour le premier fichier sélectionné

    // route pour ajouter un post
    const resultat = await fetch("/addPublication", { // envoie une requête fetch à la route /addPublication
      method: 'POST', // méthode POST
      headers: { 'Content-Type': 'application/json' }, // en-tête pour indiquer que le corps est en JSON
      body: JSON.stringify({ // JSON.stringify pour convertir l'objet en chaîne JSON
        image: imgBase64, // image en base64
        biographie: description?.value || '' // description de la publication (valeur de l'input ou chaîne vide si non définie)
      })
    })

    // si la requête est un succès
    if (resultat.ok) {
      // reset la page lors de la publication et msg de confirmation
      fichier.value = '' // réinitialise l'input de fichier
      img.src = '' // réinitialise l'image de prévisualisation
      confirmation.classList.remove('error') // retire la classe d'erreur
      confirmation.classList.add('confirm') // ajoute la classe de confirmation
      confirmation.textContent = 'Publication enregistrée avec succès' // affiche un message de confirmation
      // sinon, gère l'erreur
    } else {
      const text = await resultat.text().catch(() => '') // essaie de lire le texte de la réponse, sinon retourne une chaîne vide
      console.error('Erreur serveur upload:', resultat.status, text)
      confirmation.classList.remove('confirm') // retire la classe de confirmation
      confirmation.classList.add('error') // ajoute la classe d'erreur
      confirmation.textContent = "Erreur lors de la publication" // affiche un message d'erreur
      return
    }

    // log de succès
    console.log('Publication envoyée')
  } catch (err) {
    // gère les erreurs lors du traitement de la publication
    console.error('Erreur traitement publication:', err)

    confirmation.classList.remove('confirm')
    confirmation.classList.add('error')
    confirmation.textContent = "Erreur lors de la publication"

  }
})
