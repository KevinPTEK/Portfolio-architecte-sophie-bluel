

// Intercepte la soumission du formulaire de connexion
// Appelle fetchLogIn, stocke le token en localStorage et redirige vers l'accueil
// Affiche un message d'erreur si les identifiants sont incorrects
async function handleSubmitLogIn(event) {
    event.preventDefault()

    const credentials = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    }

    try {
        const token = await fetchLogIn(credentials)
        localStorage.setItem("token", token)
        window.location.href = "../index.html"
    } catch (erreur) {
        const messageErreur = document.querySelector(".logIn__error")
        messageErreur.textContent = "Identifiants incorrects, veuillez réessayer."
    }
}

// Envoie les identifiants à l'API via POST et retourne le token JWT
// Lève une erreur si la réponse HTTP n'est pas OK (mauvais identifiants, serveur KO...)
async function fetchLogIn(credentials) {
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    })

    if (!reponse.ok) {
        throw new Error(`Erreur serveur : ${reponse.status}`)
    }

    const data = await reponse.json()
    return data.token
}

// Branche l'écouteur de soumission sur le formulaire de connexion
function initLogIn() {
    const form = document.querySelector(".logIn__username")
    form.addEventListener("submit", handleSubmitLogIn)
}

initLogIn()