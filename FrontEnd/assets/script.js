// 1ere version :
// const gallery = document.querySelector(".gallery")

// async function loadWorks() {
//     const reponse = await fetch("http://localhost:5678/api/works")
//     const works = await reponse.json()

//     for (let i = 0; i < works.length; i++) {
//         const work = works[i]

//         const workCard = document.createElement("figure")
//         const imgWorkCard = document.createElement("img")
//         const legendWorkCard = document.createElement("figcaption")

//         imgWorkCard.src = work.imageUrl
//         imgWorkCard.alt = work.title
//         legendWorkCard.innerText = work.title

//         workCard.appendChild(imgWorkCard)
//         workCard.appendChild(legendWorkCard)
//         gallery.appendChild(workCard)
//     }
// }

// loadWorks()

// 2eme Version 
// variable global 
let works = []
let categories = []
const gallery = document.querySelector(".gallery")
const filters = document.querySelector(".filters")


// récupérer les données de works pour la gallery
async function fetchWorks() {
    const reponse = await fetch("http://localhost:5678/api/works")
    works = await reponse.json()
}

// afficher les données de works pour la gallery
function renderGallery () {

    for (let i = 0; i < works.length; i++){
        const work = works[i]
        
        const workCard = document.createElement("figure")
        const imgWorkCard = document.createElement("img")
        const legendWorkCard = document.createElement("figcaption")

        imgWorkCard.src = work.imageUrl
        imgWorkCard.alt = work.title
        legendWorkCard.innerText = work.title

        gallery.appendChild(workCard)
        workCard.appendChild(imgWorkCard)
        workCard.appendChild(legendWorkCard)

    }
}


// Récupérer les données de categories pour les boutons filtres
async function fetchCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories")
    categories = await reponse.json()
}

// afficher les données de categories pour les boutons filtres
function renderBtnFilter () {
    
    //Création du bouton "Tous"
    const btnAll = document.createElement("button")
    btnAll.classList.add("filters__btn")
    btnAll.innerText = ("Tous")
    filters.appendChild(btnAll)

    for (let i = 0; i < categories.length; i++) {
        const categorie = categories[i]

        const btn = document.createElement("button")
        btn.classList.add("filters__btn")
        btn.innerText = categorie.name
        filters.appendChild(btn)
    }
    
}

// point d'entrée unique 
async function init() {
    await fetchWorks()
    await fetchCategories()
    renderGallery()
    renderBtnFilter()
}

//init
init()
