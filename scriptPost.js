const bouttonPost = document.getElementById("button-formulaire-post")
const img = document.getElementById('image')
const description = document.getElementById("desc")
const confirmation = document.getElementById("confirmationPost")
var fichier = document.getElementById('fichier')

fichier.onchange = function () {
  var src = URL.createObjectURL(this.files[0])
  img.src = src
}

bouttonPost.addEventListener('click', (event) => {
  event.preventDefault() 
  if (fichier.files.length == 0) {
    confirmation.classList.add("error")
    confirmation.textContent = "Veuillez choisir une image pour la publication"
  }
})