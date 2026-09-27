
const btngoogle = document.getElementById("googleLoginBtn");

btngoogle.addEventListener("click", () => {
    window.location.href =
        "https://spendwise-api.runasp.net/api/Auth/google-login";
});


const form = document.getElementById("formid");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear previous errors
    showError("emailError", "");
    showError("passwordError", "");

    // Validate Email
    if (email === "") {
        showError("emailError", "This field is required.");
        emailInput.focus();
        return;
    }

    // Validate Password
    if (password === "") {
        showError("passwordError", "This field is required.");
        passwordInput.focus();
        return;
    }

    try {

        const response = await fetch(
            "https://spendwise-api.runasp.net/api/Auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {

            showError(
                "emailError",
                data?.message || "Invalid email or password."
            );

            return;
        }

        const token = data.token;

        localStorage.setItem("token", token);

        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        const role =
            payload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

        if (role === "Admin") {
            window.location.href = "DashBoard.html";
        }
        else {
            window.location.href = "UserDahboard.html";
        }

    }
    catch (error) {

        console.error("Login Error:", error);

        showError(
            "emailError",
            "Unable to connect to the server."
        );
    }
});


function showError(elementId, message) {

    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = message;
    }
}
