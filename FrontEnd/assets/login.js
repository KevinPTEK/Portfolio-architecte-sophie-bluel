

// Evenement au clic sur le formulaire 
async function handleSubmitLogIn(event) {
    event.preventDefault()

    const credentials = {
        email: event.target.querySelector("[name=email").value,
        password: event.target.querySelector("[name=password").value,
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

//Dialogue avec le serveur
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

function initLogIn() {
    const form = document.querySelector(".logIn__username")
    form.addEventListener("submit", handleSubmitLogIn)
}

initLogIn()