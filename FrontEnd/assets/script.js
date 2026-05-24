// Variables globales
let works = [];
let categories = [];
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

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
            const worksFiltrés = works.filter(work => work.categoryId === categorie.id);
           
            // Envoi du tableau filtré à la fonction d'affichage
            renderGallery(worksFiltrés);
        });
    }
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
}

// Lancement de l'application
init();

