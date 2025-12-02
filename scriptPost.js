const bouttonPost = document.getElementById("button-formulaire-post")
const img = document.getElementById('image')
const description = document.getElementById("desc")
const confirmation = document.getElementById("confirmationPost")
var fichier = document.getElementById('fichier')

fichier.onchange = function () {
  var src = URL.createObjectURL(this.files[0])
  img.src = src
}

//transformer l'image en base64 pour l'envoi en json
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

bouttonPost.addEventListener('click', async (event) => {
  event.preventDefault()
  if (fichier.files.length == 0) {
    confirmation.classList.remove('confirm')
    confirmation.classList.add("error")
    confirmation.textContent = "Veuillez choisir une image pour la publication"
    return
  }
  const imgBase64 = await toBase64(fichier.files[0])

  //route pour ajouter un post
  const resultat = await fetch("/addPublication", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imgBase64,
      biographie: description.value
    })
  })

  if (resultat.ok) {
    // reset la page lors de la publication et msg de confirmationn
    fichier.value = ''
    img.src = ''
    confirmation.classList.remove('error')
    confirmation.classList.add('confirm')
    confirmation.textContent = 'Publication enregistrée avec succès'
  }
  else {
    confirmation.classList.remove('confirm')
    confirmation.classList.add("error")
    confirmation.textContent = "Erreur lors de la publication"
    return
  }

  console.log('Ta cliqué')
})