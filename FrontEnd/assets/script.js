const gallery = document.querySelector(".gallery")

async function loadWorks() {
    const reponse = await fetch("http://localhost:5678/api/works")
    const works = await reponse.json()

    for (let i = 0; i < works.length; i++) {
        const work = works[i]

        const workCard = document.createElement("figure")
        const imgWorkCard = document.createElement("img")
        const legendWorkCard = document.createElement("figcaption")

        imgWorkCard.src = work.imageUrl
        imgWorkCard.alt = work.title
        legendWorkCard.innerText = work.title

        workCard.appendChild(imgWorkCard)
        workCard.appendChild(legendWorkCard)
        gallery.appendChild(workCard)
    }
}

loadWorks()