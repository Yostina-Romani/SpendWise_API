document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://127.0.0.1:5253/api/Profile/getprofile";

    const token = localStorage.getItem("token");

    const loading = document.getElementById("loading");

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");


    // Check if user is logged in
    if (!token) {
        window.location.href = "./Login.html";
        return;
    }


    async function loadProfile() {

        try {

            const response = await fetch(API_URL, {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });


            // Token expired or invalid
            if (response.status === 401) {

                localStorage.removeItem("token");

                window.location.href = "./Login.html";

                return;
            }


            if (!response.ok) {

                throw new Error(
                    `Request failed with status ${response.status}`
                );

            }


            const data = await response.json();

            console.log("Profile Data:", data);


            // Display user information

            profileName.textContent =
                data.name || "Not provided";

            profileEmail.textContent =
                data.email || "Not provided";

            profilePhone.textContent =
                data.phoneNumber || "Not provided";


            // Hide loading message

            loading.style.display = "none";


        }
        catch (error) {

            console.error("Profile Error:", error);

            loading.textContent =
                "Unable to load your profile.";

        }

    }


    loadProfile();

});