const bouttonPost = document.getElementById("button-formulaire-post")
const img = document.getElementById('image')
const description = document.getElementById("desc")
const confirmation = document.getElementById("confirmationPost")
var fichier = document.getElementById('fichier')

fichier.onchange = function () {
  var src = URL.createObjectURL(this.files[0])
  img.src = src
}

bouttonPost.addEventListener('click', async (event) => {
  event.preventDefault()
  if (fichier.files.length == 0) {
    confirmation.classList.add("error")
    confirmation.textContent = "Veuillez choisir une image pour la publication"
  }

  //route pour ajouter un post
  const resultat = await fetch("/addPublication", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image:fichier,
      biographie: description 
    })
  })

  if (resultat.ok){
  // reset la page lors de la publication et msg de confirmationn
  fichier.value = ''
  img.value = ''
  confirmation.classList.add('confirm')
  confirmation.textContent = 'Publication enregistrée avec succès'
  }

  console.log('Ta cliqué')
})