
// export function ajoutListenerEnvoyerLogIn() {
//     const form = document.querySelector(".logIn__username")
    
//     form.addEventListener("submit", async function(event) {
//         event.preventDefault()
//         const log = {
//             email: event.target.querySelector("[name=email").value,
//             password: event.target.querySelector("[name=password").value,
            
//         }
//         const sendLogIn = JSON.stringify(log);
//         const reponse = await fetch("http://localhost:5678/api/users/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: sendLogIn
//         });

//         if (reponse.ok) {
//             let save = await reponse.json()
            
//             window.localStorage.setItem("token", save.token);
//             window.location.href = "../index.html"
//         } else {
//             const error = document.querySelector(".logIn__error")
//             error.textContent = "Identifiants incorrects, veuillez réessayer."
//             console.error("Erreur lors de la connexion :", error)
//         }
//     })
// }


// ajoutListenerEnvoyerLogIn()


function initLogIn() {
    const form = document.querySelector(".logIn__username")
    form.addEventListener("submit", handleSubmitLogIn)
}

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

initLogIn()