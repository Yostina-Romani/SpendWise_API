
const btngoogle=document.getElementById("googleLoginBtn");
btngoogle.addEventListener("click",()=>{
window.location.href="http://localhost:5253/api/Auth/google-login";
});


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

    if (!response.ok) {
        const errorMessage=await response.text();
        showError("emailerror",errorMessage);
        console.log("api response", data);
        return;
    }

     const data = await response.json();

    const token = data.token;
    localStorage.setItem("token", token);

    const payload=JSON.parse(atob(token.split(".")[1]));
    const role=payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if(role==="Admin"){
    window.location.href="DashBoard.html";

    }
    else{
        window.location.href="UserDahboard.html";
    }
});
function showError(elementid, message) {
    document.getElementById(elementid).textContent = message;
}