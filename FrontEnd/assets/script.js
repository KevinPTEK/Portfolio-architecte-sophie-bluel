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
const gallery = document.querySelector(".gallery")

// Responsabilité 1 : récupérer les données
async function fetchWorks() {
    const reponse = await fetch("http://localhost:5678/api/works")
    works = await reponse.json()
}

// Responsabilité 2 : afficher les données
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

// point d'entrée unique 
async function initGallery() {
    await fetchWorks()
    renderGallery()
}

//init
initGallery()