const bouttonPost = document.getElementById("button-formulaire-post")
const img = document.getElementById('image')
const description = document.getElementById("desc")
const confirmation = document.getElementById("confirmationPost")
const fichier = document.getElementById('fichier')

// Prévisualisation sécurisée avec validation
if (fichier) {
  fichier.addEventListener('change', function (e) {
    const file = e.target?.files && e.target.files[0]
    if (!file) {
      console.error('Aucun fichier sélectionné')
      return
    }
    if (!file.type || !file.type.startsWith('image/')) {
      console.error('Fichier non image:', file?.type)
      return
    }

    const src = URL.createObjectURL(file)
    if (img) {
      img.src = src
      img.onload = () => URL.revokeObjectURL(src)
    } else {
      console.warn('Élément <img id="image"> introuvable')
      URL.revokeObjectURL(src)
    }
  })
}

// transformer l'image en base64 pour l'envoi en json
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

if (bouttonPost) {
  bouttonPost.addEventListener('click', async (event) => {
    event.preventDefault()
    if (!fichier || !fichier.files || fichier.files.length === 0) {
      if (confirmation) {
        confirmation.classList.remove('confirm')
        confirmation.classList.add('error')
        confirmation.textContent = "Veuillez choisir une image pour la publication"
      }
      return
    }

    try {
      const imgBase64 = await toBase64(fichier.files[0])

      // route pour ajouter un post
      const resultat = await fetch("/addPublication", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imgBase64,
          biographie: description?.value || ''
        })
      })

      if (resultat.ok) {
        // reset la page lors de la publication et msg de confirmation
        fichier.value = ''
        if (img) img.src = ''
        if (confirmation) {
          confirmation.classList.remove('error')
          confirmation.classList.add('confirm')
          confirmation.textContent = 'Publication enregistrée avec succès'
        }
      } else {
        const text = await resultat.text().catch(() => '')
        console.error('Erreur serveur upload:', resultat.status, text)
        if (confirmation) {
          confirmation.classList.remove('confirm')
          confirmation.classList.add('error')
          confirmation.textContent = "Erreur lors de la publication"
        }
        return
      }

      console.log('Publication envoyée')
    } catch (err) {
      console.error('Erreur traitement publication:', err)
      if (confirmation) {
        confirmation.classList.remove('confirm')
        confirmation.classList.add('error')
        confirmation.textContent = "Erreur lors de la publication"
      }
    }
  })
}