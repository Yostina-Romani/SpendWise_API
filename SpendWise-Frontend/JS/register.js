
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

    // Name validation
    if (name === "") {
        showError("nameerror", "This field is required.");
        nameInput.focus();
        return;
    }

    // Email validation
    if (email === "") {
        showError("emailerror", "This field is required.");
        emailInput.focus();
        return;
    }

    // Password validation
    if (password === "") {
        showError("passworderror", "This field is required.");
        passwordInput.focus();
        return;
    }

    // Password confirmation validation
    if (passwordConfirmation === "") {
        showError(
            "passwordConfiramtionError",
            "This field is required."
        );
        passwordConfirmationInput.focus();
        return;
    }

    // Password matching
    if (passwordConfirmation !== password) {
        showError(
            "passwordConfiramtionError",
            "Passwords do not match."
        );
        passwordConfirmationInput.focus();
        return;
    }

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

        if (!response.ok) {

            console.log("API response:", data);

            showError(
                "emailerror",
                data?.message || "Registration failed."
            );

            return;
        }

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


function showError(elementId, message) {

    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = message;
    }
}
