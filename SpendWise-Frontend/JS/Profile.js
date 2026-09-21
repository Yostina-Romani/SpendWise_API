const PROFILE_API_URL =
    "http://127.0.0.1:5253/api/Profile";


/* =========================================================
   TOKEN
========================================================= */

function getToken() {
    return localStorage.getItem("token");
}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    const token = getToken();

    if (!token) {
        window.location.href = "Login.html";
        return;
    }


    try {

        const response = await fetch(
            `${PROFILE_API_URL}/getprofile`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        if (response.status === 401) {
            handleUnauthorized();
            return;
        }


        if (!response.ok) {

            throw new Error(
                `Failed to load profile. Status: ${response.status}`
            );

        }


        const profile = await response.json();

        console.log("Profile Data:", profile);


        /* =========================================
           PROFILE INFORMATION
        ========================================= */

        const profileName =
            document.getElementById("profileName");

        const profileEmail =
            document.getElementById("profileEmail");

        const nameInput =
            document.getElementById("name");

        const emailInput =
            document.getElementById("email");

        const phoneInput =
            document.getElementById("phone");


        if (profileName) {

            profileName.textContent =
                profile.name || "User";

        }


        if (profileEmail) {

            profileEmail.textContent =
                profile.email || "No email";

        }


        if (nameInput) {

            nameInput.value =
                profile.name || "";

        }


        if (emailInput) {

            emailInput.value =
                profile.email || "";

        }


        if (phoneInput) {

            phoneInput.value =
                profile.phoneNumber || "";

        }


        /* =========================================
           PROFILE IMAGE
        ========================================= */

        const profileImage =
            document.getElementById("profileImage");


                const imageUrl = profile.profileImageUrl || profile.imageurl;

                if (profileImage && imageUrl) {
                    profileImage.src = imageUrl.startsWith("http")
                        ? imageUrl
                        : `http://127.0.0.1:5253${imageUrl}`;
                }

    }

    catch (error) {

        console.error(
            "Profile Error:",
            error
        );

        showToast(
            "Unable to load profile.",
            "error"
        );

    }
}



/* =========================================================
   UPLOAD PROFILE IMAGE
========================================================= */

async function uploadProfileImage(file) {

    const token = getToken();

    if (!token) {

        handleUnauthorized();

        return;

    }


    if (!file) {
        return;
    }


    /* =========================================
       VALIDATE FILE TYPE
    ========================================= */

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];


    if (!allowedTypes.includes(file.type)) {

        showToast(
            "Please select JPG, PNG or WEBP image.",
            "error"
        );

        return;

    }


    /* =========================================
       VALIDATE FILE SIZE
       MAX = 5 MB
    ========================================= */

    const maxSize = 5 * 1024 * 1024;


    if (file.size > maxSize) {

        showToast(
            "Image size must be less than 5MB.",
            "error"
        );

        return;

    }


    try {

        const formData = new FormData();

        formData.append("image", file);


        const response = await fetch(
            PROFILE_API_URL,
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                },

                body: formData
            }
        );


        if (response.status === 401) {

            handleUnauthorized();

            return;

        }


        if (!response.ok) {

            const errorData =
                await response.json().catch(() => null);

            throw new Error(
                errorData?.message ||
                "Image upload failed."
            );

        }


        const result =
            await response.json();


        console.log(
            "Upload Result:",
            result
        );


        /* =========================================
           UPDATE IMAGE
        ========================================= */

        const profileImage =
            document.getElementById("profileImage");


        if (
            profileImage &&
            result.imageurl
        ) {

            profileImage.src =
                result.imageurl;

        }


        showToast(
            "Profile image uploaded successfully.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Upload Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to upload image.",
            "error"
        );

    }

}



/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem("token");

    window.location.href = "Login.html";
}


function handleUnauthorized() {

    localStorage.removeItem("token");

    window.location.href = "Login.html";
}



/* =========================================================
   TOAST
========================================================= */

function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");


    if (!toast) {
        return;
    }


    toast.textContent = message;

    toast.className =
        `toast-message ${type} show`;


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}



/* =========================================================
   EVENTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =========================
           LOAD PROFILE
        ========================= */

        loadProfile();


        /* =========================
           IMAGE UPLOAD
        ========================= */

        const imageInput =
            document.getElementById(
                "profileImageInput"
            );


        if (imageInput) {

            imageInput.addEventListener(
                "change",
                async function () {

                    const file =
                        this.files?.[0];

                    if (!file) {
                        return;
                    }


                    await uploadProfileImage(file);


                    /*
                     * Reset input so the user
                     * can select the same file again.
                     */

                    this.value = "";

                }
            );

        }


        /* =========================
           LOGOUT BUTTONS
        ========================= */

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        const securityLogoutBtn =
            document.getElementById(
                "securityLogoutBtn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logout();

                }
            );

        }


        if (securityLogoutBtn) {

            securityLogoutBtn.addEventListener(
                "click",
                logout
            );

        }

    }
);