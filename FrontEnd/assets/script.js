// Variables globales
let works = []
let categories = []
const gallery = document.querySelector(".gallery")
const filters = document.querySelector(".filters")
const changeLogin = document.querySelector("#conexion")
const portfolio = document.querySelector("#portfolio")
const modal = document.querySelector("#modal")
const modalClose = document.querySelector("#modalCloseBtn")
const modalGallery = document.querySelector("#modalGallery")

// 1. Récupérer les données de works via l'API (Sécurisé)
async function fetchWorks() {
    try {
        const reponse = await fetch("http://localhost:5678/api/works")
       
        // On vérifie si le serveur a bien répondu
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`)
        }
       
        works = await reponse.json()
    } catch (erreur) {
        console.error("Impossible de récupérer les travaux :", erreur)
        gallery.innerHTML = "<p class='error-message'>Erreur lors du chargement des projets.</p>"
    }
}

// Vide la galerie et la reconstruit depuis la liste passée en paramètre
// Appelée avec `works` au démarrage, avec une liste filtrée au clic sur un bouton
function renderGallery(listeAAfficher) {
    // On vide impérativement la galerie pour effacer les anciennes images
    gallery.innerHTML = ""

    for (const work of listeAAfficher) {
        const workCard = document.createElement("figure")
        const imgWorkCard = document.createElement("img")
        const legendWorkCard = document.createElement("figcaption")

        imgWorkCard.src = work.imageUrl
        imgWorkCard.alt = work.title
        legendWorkCard.textContent = work.title

        workCard.appendChild(imgWorkCard)
        workCard.appendChild(legendWorkCard)
        gallery.appendChild(workCard)
    }
}

// Interroge l'API et remplit le tableau global `categories`
async function fetchCategories() {
    try {
        const reponse = await fetch("http://localhost:5678/api/categories")
       
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`)
        }
       
        categories = await reponse.json()
    } catch (erreur) {
        console.error("Impossible de récupérer les catégories :", erreur)
    }
}

// Crée dynamiquement les boutons de filtre depuis le tableau `categories`
// Branche un écouteur sur chaque bouton pour filtrer et réafficher la galerie
function renderBtnFilter() {
    // On s'assure que la zone des filtres est vide au départ
    filters.innerHTML = ""
   
    // Création manuelle du bouton "Tous"
    const btnAll = document.createElement("button")
    btnAll.classList.add("filters__btn", "filters__btn--active")
    btnAll.dataset.categoriesId = "all"
    btnAll.textContent = "Tous"
    filters.appendChild(btnAll)

    // Écouteur sur le bouton "Tous" -> Réaffiche le tableau initial complet
    btnAll.addEventListener("click", () => {
        document.querySelector(".filters__btn--active")?.classList.remove("filters__btn--active")
        btnAll.classList.add("filters__btn--active")
       
        renderGallery(works)
    });

    // Boucle "for...of" sur les catégories reçues de l'API pour créer les autres boutons
    for (const category of categories) {
        const btn = document.createElement("button")
        btn.classList.add("filters__btn")
        btn.textContent = category.name
        btn.dataset.categoriesId = category.id
        filters.appendChild(btn)

        // Écouteur sur chaque bouton de catégorie
        btn.addEventListener("click", () => {
            document.querySelector(".filters__btn--active")?.classList.remove("filters__btn--active")
            btn.classList.add("filters__btn--active")

            // Filtrage dynamique du tableau global
            const worksFiltres = works.filter(work => work.categoryId === category.id)
           
            // Envoi du tableau filtré à la fonction d'affichage
            renderGallery(worksFiltres)
        });
    }
}


// Vérifie la présence du token en localStorage
// Si connecté : affiche la barre mode édition, change login→logout,
// ajoute le bouton modifier et masque les filtres
function setupEditionMode() {
    const tokenPresent = localStorage.getItem("token")
    
    if (tokenPresent !== null) {
        //login/logout et barre noir
        changeLogin.textContent = "logout"

        const editionMode = document.createElement("div")
        editionMode.classList.add("editionMode")

        const editionModeImg = document.createElement("img")
        const editionModeP = document.createElement("p")

        editionModeImg.src = "assets/icons/edition.png"
        editionModeImg.alt = "logo d'édition"
        editionModeP.textContent = "Mode édition"

        document.body.prepend(editionMode)
        editionMode.appendChild(editionModeImg)
        editionMode.appendChild(editionModeP)

        //bouton modifier
        const editBtn = document.createElement("div")
        editBtn.id = "editBtn"

        portfolio.prepend(editBtn)

        const h2 = portfolio.querySelector("h2")
        editBtn.appendChild(h2)

        const editBtnDiv = document.createElement("div")
        const editBtnImg = document.createElement("img")
        const editBtnBtn = document.createElement("button")
        editBtnBtn.id = "editGallery"

        editBtnImg.src = "assets/icons/editionBlack.png"
        editBtnImg.alt = "logo edition"
        editBtnBtn.textContent = "modifier"

        editBtn.appendChild(editBtnDiv)
        editBtnDiv.appendChild(editBtnImg)
        editBtnDiv.appendChild(editBtnBtn)

        filters.classList.add("hidden")
    } 
}

// Branche l'écouteur sur le lien login/logout de la navigation
// Redirige vers la page login si déconnecté,
// ou supprime le token et restaure l'UI complète si connecté
function setupAuthLink() {
    
    changeLogin.addEventListener("click", () => {
        const tokenPresent = localStorage.getItem("token")
        if (tokenPresent === null) {
        window.location.href = "page/login.html"
            } else {
                localStorage.removeItem("token")
                changeLogin.textContent = "login"
                document.querySelector(".editionMode").remove()
                const h2 = document.querySelector("#editBtn h2")
                portfolio.prepend(h2)
                document.querySelector("#editBtn").remove()
                filters.classList.remove("hidden")
            }
    })
}

// Vide et reconstruit la galerie de la modale depuis le tableau global `works`
// Branche un écouteur de suppression sur chaque item
function renderModalGallery() {
    modalGallery.innerHTML = ""

    for (const work of works) {
        const li = document.createElement("li")
        li.classList.add("modal__gallery-item")

        const img = document.createElement("img")
        img.src = work.imageUrl
        img.alt = work.title
        img.classList.add("modal__gallery-img")

        const btnSupprimer = document.createElement("button")
        btnSupprimer.dataset.id = work.id
        btnSupprimer.classList.add("modal__gallery-delete")

        const iconeDelete = document.createElement("img")
        iconeDelete.src = "assets/icons/delete.svg"
        iconeDelete.alt = "supprimer"

        btnSupprimer.appendChild(iconeDelete)
        li.appendChild(img)
        li.appendChild(btnSupprimer)
        modalGallery.appendChild(li)

        btnSupprimer.addEventListener("click", async () => {
        const succes = await deleteWork(work.id)
        if (succes) li.remove()
        })
    }
}

// Envoie une requête DELETE à l'API pour supprimer un travail par son id
// Met à jour le state global `works` et resynchronise la galerie principale
async function deleteWork(id) {
    const token = localStorage.getItem("token")
    try {
        const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!reponse.ok) {
            throw new Error(`Erreur serveur : ${reponse.status}`);
        }

        works = works.filter(work => work.id !== id);
        renderGallery(works);
        return true;

    } catch (erreur) {
        console.error("Impossible de supprimer le travail :", erreur);
        return false; 
    }
}

// Branche tous les écouteurs de la modale :
// ouverture, fermeture (croix + backdrop), navigation entre les deux pages
// Délègue l'initialisation de la preview image et du formulaire
function initModal() {
    const editGalleryBtn = document.getElementById("editGallery")
    if (editGalleryBtn) {
        editGalleryBtn.addEventListener("click", () => {
            renderModalGallery()
            showModalPage("page 1")
            modal.showModal()
        })
    }

    modalClose.addEventListener("click", () => modal.close())

    // Navigation entre les pages
    document.getElementById("modalAddBtn").addEventListener("click", () => {
        showModalPage("form")
    })

    document.getElementById("modalBackBtn").addEventListener("click", () => {
        showModalPage("page 1")
    })

    // Fermer en cliquant sur le backdrop
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close()
        }
    })
    initImagePreview()
    document.getElementById("modalForm").addEventListener("submit", handleFormSubmit)
}

// Affiche la page demandée et cache l'autre via la classe modal__page--hidden
// "page 1" → galerie de la modale | "form" → formulaire d'ajout
function showModalPage(page) {
    const pageGallery = document.getElementById("modalPageGallery")
    const pageForm = document.getElementById("modalPageForm")

    if (page === "page 1") {
        pageGallery.classList.remove("modal__page--hidden")
        pageForm.classList.add("modal__page--hidden")
    } else {
        pageGallery.classList.add("modal__page--hidden")
        pageForm.classList.remove("modal__page--hidden")
    }
}

// Peuple le <select> des catégories du formulaire d'ajout
// depuis le tableau global `categories` — appelée une seule fois au démarrage
function renderCategoryOptions() {
    const select = document.getElementById("photoCategory")

    for (const categorie of categories) {
        const option = document.createElement("option")
        option.value = categorie.id
        option.textContent = categorie.name
        select.appendChild(option)
    }
}

// Branche l'écouteur sur l'input fichier
// Génère et affiche une prévisualisation via URL.createObjectURL() dès qu'une image est choisie
function initImagePreview() {
    const photoInput = document.getElementById("photoInput")
    const uploadArea = document.getElementById("modalUploadArea")
    const uploadLabel = uploadArea.querySelector(".modal__upload-label")

    photoInput.addEventListener("change", () => {
        const fichier = photoInput.files[0]
        if (!fichier) return  // l'utilisateur a annulé le sélecteur

        // Supprimer une éventuelle preview précédente
        const anciennePreview = uploadArea.querySelector(".modal__preview-img")
        if (anciennePreview) anciennePreview.remove()

        // Créer l'URL temporaire et construire l'élément image
        const urlPreview = URL.createObjectURL(fichier)
        const imgPreview = document.createElement("img")
        imgPreview.src = urlPreview
        imgPreview.alt = "prévisualisation"
        imgPreview.classList.add("modal__preview-img")

        // Cacher l'icône et afficher la preview
        uploadLabel.classList.add("modal__upload-label--hidden")
        uploadArea.appendChild(imgPreview)
    })
}

// Intercepte la soumission du formulaire d'ajout
// Valide les champs, envoie un POST multipart à l'API,
// puis met à jour le state et resynchronise les deux galeries en cas de succès
async function handleFormSubmit(event) {
    event.preventDefault()  // empêche le rechargement de page

    const photoInput     = document.getElementById("photoInput")
    const titleInput     = document.getElementById("photoTitle")
    const categorySelect = document.getElementById("photoCategory")
    const formError      = document.getElementById("formError")

    // Réinitialiser le message d'erreur
    formError.textContent = ""

    // Validation : est-ce que tous les champs sont remplis ?
    if (!photoInput.files[0] || !titleInput.value.trim() || !categorySelect.value) {
        formError.textContent = "Veuillez remplir tous les champs."
        return
    }

    const fichier = photoInput.files[0]
    if (fichier.type !== "image/jpeg" && fichier.type !== "image/png"){
        formError.textContent = "type de fichier incorrect."
        return
    }
    if (fichier.size > 4 * 1024 * 1024) {
        formError.textContent = "Fichier trop volumineux (4 Mo max)."
        return
    }

    // Construction du FormData
    // Les noms correspondent exactement aux champs attendus par l'API (voir Swagger)
    const formData = new FormData()
    formData.append("image", photoInput.files[0])
    formData.append("title", titleInput.value.trim())
    formData.append("category", categorySelect.value)

    try {
        const token = localStorage.getItem("token")

        const reponse = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        if (!reponse.ok) throw new Error(`Erreur serveur : ${reponse.status}`)

        // L'API renvoie le nouveau travail créé, avec son id généré en base
        const nouveauTravail = await reponse.json()

        // Mettre à jour le state centralisé
        nouveauTravail.categoryId = parseInt(nouveauTravail.categoryId)
        works.push(nouveauTravail)

        // Re-render les deux galeries avec la liste à jour
        renderGallery(works)
        renderModalGallery()

        // Revenir à la page galerie de la modale
        showModalPage("page 1")

        // Remettre le formulaire dans son état initial
        resetForm()

    } catch (erreur) {
        console.error("Impossible d'ajouter le travail :", erreur)
        formError.textContent = "Une erreur est survenue. Réessayez."
    }
}

// Remet le formulaire dans son état initial après un ajout réussi :
// réinitialise les champs natifs et retire la prévisualisation d'image
function resetForm() {
    document.getElementById("modalForm").reset()

    const uploadArea  = document.getElementById("modalUploadArea")
    const uploadLabel = uploadArea.querySelector(".modal__upload-label")
    const previewImg  = uploadArea.querySelector(".modal__preview-img")

    uploadLabel.classList.remove("modal__upload-label--hidden")
    if (previewImg) previewImg.remove()
}

// Observe l'état des trois champs du formulaire en temps réel
// et applique le style actif au bouton Valider uniquement quand tout est rempli
function initFormValidationStyle() {
    const photoInput     = document.getElementById("photoInput")
    const titleInput     = document.getElementById("photoTitle")
    const categorySelect = document.getElementById("photoCategory")
    const submitBtn      = document.getElementById("modalSubmitBtn")

    function updateButtonStyle() {
        if (photoInput.files[0] && titleInput.value.trim() && categorySelect.value) {
            submitBtn.classList.add("modal__submit-btn--active")    // tout rempli → vert
        } else {
            submitBtn.classList.remove("modal__submit-btn--active") // incomplet → couleur normale
        }
    }

    photoInput.addEventListener("change", updateButtonStyle)
    titleInput.addEventListener("input", updateButtonStyle)
    categorySelect.addEventListener("change", updateButtonStyle)
}


// Point d'entrée unique — charge les données depuis l'API,
// puis initialise tous les composants de la page dans l'ordre
async function init() {
    // On attend le chargement des deux routes API
    await fetchWorks()
    await fetchCategories()
   
    // Si des travaux ont été récupérés, on affiche la galerie par défaut
    if (works.length > 0) {
        renderGallery(works)
    }
   
    // On génère les boutons de filtres
    renderBtnFilter()
    renderCategoryOptions()
    setupAuthLink()
    setupEditionMode()
    initModal()
    showModalPage("page 1")
    initFormValidationStyle()
}

// Lancement de l'application
init()

