
export function ajoutListenerEnvoyerLogIn() {
    const form = document.querySelector(".logIn__username")
    
    form.addEventListener("submit", async function(event) {
        event.preventDefault()
        const log = {
            email: event.target.querySelector("[name=email").value,
            password: event.target.querySelector("[name=password").value,
            
        }
        console.log(log)
        const sendLogIn = JSON.stringify(log);
        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: sendLogIn
        });

        if (reponse.ok) {
            let save = await reponse.json()
            
            window.localStorage.setItem("token", save.token);
            window.location.href = "../index.html"
        } else {
            const error = document.querySelector(".logIn__error")
            error.textContent = "Identifiants incorrects, veuillez réessayer."
            console.error("Erreur lors de la connexion :", error)
        }

        console.log(Error)
        console.log(sendLogIn)
        console.log(token)
        
    })
}


ajoutListenerEnvoyerLogIn()

