// Variables globales
let works = [];
let categories = [];
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const changeLogin = document.querySelector(".conexion");
const portfolio = document.querySelector("#portfolio");

// 1. Récupérer les données de works via l'API (Sécurisé)
async function fetchWorks() {
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
       
        // On vérifie si le serveur a bien répondu
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
        }
       
        works = await reponse.json();
    } catch (erreur) {
        console.error("Impossible de récupérer les travaux :", erreur);
        gallery.innerHTML = "<p style='color: red; text-align: center;'>Erreur lors du chargement des projets.</p>";
    }
}

// 2. Afficher les données de works dans la gallery
function renderGallery(listeAAfficher) {
    // On vide impérativement la galerie pour effacer les anciennes images
    gallery.innerHTML = "";

    for (const work of listeAAfficher) {
        const workCard = document.createElement("figure");
        const imgWorkCard = document.createElement("img");
        const legendWorkCard = document.createElement("figcaption");

        imgWorkCard.src = work.imageUrl;
        imgWorkCard.alt = work.title;
        legendWorkCard.innerText = work.title;

        workCard.appendChild(imgWorkCard);
        workCard.appendChild(legendWorkCard);
        gallery.appendChild(workCard);
    }
}

// 3. Récupérer les données de categories via l'API (Sécurisé)
async function fetchCategories() {
    try {
        const reponse = await fetch("http://localhost:5678/api/categories");
       
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
        }
       
        categories = await reponse.json();
    } catch (erreur) {
        console.error("Impossible de récupérer les catégories :", erreur);
    }
}

// 4. Afficher les boutons filtres et gérer le tri au clic
function renderBtnFilter() {
    // On s'assure que la zone des filtres est vide au départ
    filters.innerHTML = "";
   
    // Création manuelle du bouton "Tous"
    const btnAll = document.createElement("button");
    btnAll.classList.add("filters__btn", "filters__btn--active");
    btnAll.dataset.categoriesId = "all";
    btnAll.innerText = "Tous";
    filters.appendChild(btnAll);

    // Écouteur sur le bouton "Tous" -> Réaffiche le tableau initial complet
    btnAll.addEventListener("click", () => {
        document.querySelector(".filters__btn--active")?.classList.remove("filters__btn--active");
        btnAll.classList.add("filters__btn--active");
       
        renderGallery(works);
    });

    // Boucle "for...of" sur les catégories reçues de l'API pour créer les autres boutons
    for (const categorie of categories) {
        const btn = document.createElement("button");
        btn.classList.add("filters__btn");
        btn.innerText = categorie.name;
        btn.dataset.categoriesId = categorie.id;
        filters.appendChild(btn);

        // Écouteur sur chaque bouton de catégorie
        btn.addEventListener("click", () => {
            document.querySelector(".filters__btn--active")?.classList.remove("filters__btn--active");
            btn.classList.add("filters__btn--active");

            // Filtrage dynamique du tableau global
            const worksFiltres = works.filter(work => work.categoryId === categorie.id);
           
            // Envoi du tableau filtré à la fonction d'affichage
            renderGallery(worksFiltres);
        });
    }
}


//connexion et deconnexion
function activeConexion() {
    const tokenPresent = localStorage.getItem("token");
    
    if (tokenPresent !== null) {
        //login/logout et barre noir
        changeLogin.innerText = "logout";

        const editionMode = document.createElement("div");
        editionMode.classList.add("editionMode");

        const editionModeImg = document.createElement("img");
        const editionModeP = document.createElement("p");

        editionModeImg.src = "assets/icons/edition.png";
        editionModeImg.alt = "logo d'édition";
        editionModeP.innerText = "Mode édition";

        document.body.prepend(editionMode);
        editionMode.appendChild(editionModeImg);
        editionMode.appendChild(editionModeP);

        //bouton modifier
        const editBtn = document.createElement("div");
        editBtn.id = "editBtn";

        portfolio.prepend(editBtn);

        const h2 = portfolio.querySelector("h2");
        editBtn.appendChild(h2);

        const editBtnDiv = document.createElement("div");
        const editBtnImg = document.createElement("img");
        const editBtnBtn = document.createElement("button");

        editBtnImg.src = "assets/icons/editionBlack.png";
        editBtnImg.alt = "logo edition";
        editBtnBtn.innerText = "modifier";

        editBtn.appendChild(editBtnDiv);
        editBtnDiv.appendChild(editBtnImg);
        editBtnDiv.appendChild(editBtnBtn);
    } 
}

function connexion() {
    
    changeLogin.addEventListener("click", () => {
        const tokenPresent = localStorage.getItem("token");
        if (tokenPresent === null) {
        window.location.href = "page/login.html";
            } else {
                localStorage.removeItem("token");
                changeLogin.innerText = "login";
                document.querySelector(".editionMode").remove();
                const h2 = document.querySelector("#editBtn h2");
                portfolio.prepend(h2);
                document.querySelector("#editBtn").remove();
            }
    })
}

// Point d'entrée unique de l'application
async function init() {
    // On attend le chargement des deux routes API
    await fetchWorks();
    await fetchCategories();
   
    // Si des travaux ont été récupérés, on affiche la galerie par défaut
    if (works.length > 0) {
        renderGallery(works);
    }
   
    // On génère les boutons de filtres
    renderBtnFilter();
    connexion();
    activeConexion();
}

// Lancement de l'application
init();

