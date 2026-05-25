
export function ajoutListenerEnvoyerLogIn() {
    const form = document.querySelector(".logIn__username")
    
    form.addEventListener("submit", function(event) {
        event.preventDefault()
        const log = {
            email: event.target.querySelector("[name=email").value,
            password: event.target.querySelector("[name=password").value,
            
        }
        console.log(log)
        const sendLogIn = JSON.stringify(log);
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: sendLogIn
        });
        console.log(sendLogIn)
        
    })
}

ajoutListenerEnvoyerLogIn()
