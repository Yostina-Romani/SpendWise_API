
const form = document.getElementById("register_form");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordConfirmationInput =
        document.getElementById("passwordConfirmation");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirmation = passwordConfirmationInput.value;

    // Clear previous errors
    showError("nameerror", "");
    showError("emailerror", "");
    showError("passworderror", "");
    showError("passwordConfiramtionError", "");

    // =========================
    // Name Validation
    // =========================

    if (name === "") {
        showError("nameerror", "This field is required.");
        nameInput.focus();
        return;
    }

    if (name.length <= 3) {
        showError(
            "nameerror",
            "Name must be more than 3 characters."
        );
        nameInput.focus();
        return;
    }

    // =========================
    // Email Validation
    // =========================

    if (email === "") {
        showError("emailerror", "This field is required.");
        emailInput.focus();
        return;
    }

    // =========================
    // Password Validation
    // =========================

    if (password === "") {
        showError("passworderror", "This field is required.");
        passwordInput.focus();
        return;
    }

    if (password.length < 8) {
        showError(
            "passworderror",
            "Password must be at least 8 characters."
        );
        passwordInput.focus();
        return;
    }

    if (!/[0-9]/.test(password)) {
        showError(
            "passworderror",
            "Password must contain at least one number."
        );
        passwordInput.focus();
        return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`+=;]/.test(password)) {
        showError(
            "passworderror",
            "Password must contain at least one special character."
        );
        passwordInput.focus();
        return;
    }

    // =========================
    // Password Confirmation
    // =========================

    if (passwordConfirmation === "") {
        showError(
            "passwordConfiramtionError",
            "This field is required."
        );
        passwordConfirmationInput.focus();
        return;
    }

    if (passwordConfirmation !== password) {
        showError(
            "passwordConfiramtionError",
            "Passwords do not match."
        );
        passwordConfirmationInput.focus();
        return;
    }

    // =========================
    // API Request
    // =========================

    try {

        const response = await fetch(
            "https://spendwise-api.runasp.net/api/Auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    yourname: name,
                    Email: email,
                    password: password,
                    passwordConfirmation: passwordConfirmation
                })
            }
        );

        const data = await response.json().catch(() => null);

        // =========================
        // Backend Errors
        // =========================

        if (!response.ok) {

            console.log("API response:", data);

            if (Array.isArray(data)) {

                const errorMessages = data
                    .map(error => error.description || error.Description)
                    .filter(message => message);

                if (errorMessages.length > 0) {

                    showError(
                        "passworderror",
                        errorMessages.join(" ")
                    );

                } else {

                    showError(
                        "passworderror",
                        "Registration failed. Please check your information."
                    );
                }

            } else {

                showError(
                    "emailerror",
                    data?.message || "Registration failed."
                );
            }

            return;
        }

        // =========================
        // Success
        // =========================

        alert(data?.message || "Registration successful.");

        window.location.href = "Login.html";

    }
    catch (error) {

        console.error("Registration Error:", error);

        showError(
            "emailerror",
            "Unable to connect to the server."
        );
    }
});


// =========================
// Show Error
// =========================

function showError(elementId, message) {

    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = message;
    }
}
