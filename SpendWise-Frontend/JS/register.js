
const form = document.getElementById("register_form");
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value.trim();

    const passwordConfirmation = document.getElementById("passwordConfirmation").value;
    ////Frontend Validation
    if (name === "") {
        showError("nameerror", "name is required");
        return;
    }
    if (email === "") {
        showError("emailerror", "email is required");
        return;
    }
    if (password === "") {
        showError("passworderror", "name is required");
        return;
    }
    if (passwordConfirmation != password) {
        showError("passwordConfiramtionError", "must be match with password");
        return;
    }

    const response = await fetch("https://spendwise-api.runasp.net/api/Auth/register", {

    method: "POST",


        headers:{
        "Content-Type": "application/json"
    },
        body: JSON.stringify({
            yourname: name,
            Email: email,
            password: password,
            passwordConfirmation:passwordConfirmation,

        })

    });
    const data = await response.json();
    if (!response.ok) {
        console.log("api response :", data);
        return;
    }
    alert(data.message);
    window.location.href="Login.html";

});

function showError(elementid, message) {
    document.getElementById(elementid).textContent = message;
}