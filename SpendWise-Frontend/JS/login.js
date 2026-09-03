alert("h1");
const form = document.getElementById("formid");
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (email === "") {
        showError("emailerror", "email is required");
        return;
    }
    if (password === "") {
        showError("passworderror", "password is required");
        return;
    }
    const response = await fetch("http://127.0.0.1:5253/api/Auth/login", {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            email: email,
            password:password
        })
    });

    const data = await response.json();
    if (!response.ok) {
        console.log("api response", data);
        return;
    }
    const token = data.token;
    localStorage.setItem("token", token)
    window.location.href="DashBoard.html";
});
function showError(elementid, message) {
    document.getElementById(elementid).textContent = message;
}