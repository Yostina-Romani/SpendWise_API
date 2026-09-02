const token = localStorage.getItem("token");
if (!token) {
    window.location.href="Login.html";
}
const logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener("click", function (event) {
    localStorage.removeItem("token");
    window.location.href = "Login.html";
});