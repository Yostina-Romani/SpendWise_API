
const PROFILE_API_URL =
    "https://spendwise-api.runasp.net/api/Profile";

const PROFILE_API_BASE_URL =
    "https://spendwise-api.runasp.net";


// =========================================================
// TOKEN
// =========================================================

function getToken() {
    return localStorage.getItem("token");
}


// =========================================================
// BUILD IMAGE URL
// =========================================================

function buildImageUrl(imagePath) {

    if (!imagePath) {
        return `${PROFILE_API_BASE_URL}/Images/default-avatar.png`;
    }

    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    return `${PROFILE_API_BASE_URL}${imagePath}`;
}


// =========================================================
// LOAD PROFILE
// =========================================================

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


        // =====================================================
        // PROFILE INFORMATION
        // =====================================================

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


        // =====================================================
        // PROFILE IMAGE
        // =====================================================

        const profileImage =
            document.getElementById("profileImage");

        const imageUrl =
            buildImageUrl(profile.imageurl);


        if (profileImage) {

            profileImage.src =
                imageUrl;
        }


        // =====================================================
        // SIDEBAR PROFILE
        // =====================================================

        const sidebarName =
            document.getElementById(
                "sidebarProfileName"
            );

        const sidebarImage =
            document.getElementById(
                "sidebarProfileImage"
            );


        if (sidebarName) {

            sidebarName.textContent =
                profile.name || "User";
        }


        if (sidebarImage) {

            sidebarImage.src =
                imageUrl;
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


// =========================================================
// UPLOAD PROFILE IMAGE
// =========================================================

async function uploadProfileImage(file) {

    const token = getToken();

    if (!token) {

        handleUnauthorized();
        return;
    }


    if (!file) {
        return;
    }


    // =====================================================
    // VALIDATE FILE TYPE
    // =====================================================

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


    // =====================================================
    // VALIDATE FILE SIZE
    // MAXIMUM = 5 MB
    // =====================================================

    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        showToast(
            "Image size must be less than 5MB.",
            "error"
        );

        return;
    }


    try {

        const formData =
            new FormData();


        formData.append(
            "image",
            file
        );


        const response =
            await fetch(
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
                await response
                    .json()
                    .catch(() => null);


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


        // =====================================================
        // BUILD FULL IMAGE URL
        // =====================================================

        const uploadedImageUrl =
            buildImageUrl(
                result.imageurl
            );


        // =====================================================
        // UPDATE MAIN PROFILE IMAGE
        // =====================================================

        const profileImage =
            document.getElementById(
                "profileImage"
            );


        if (
            profileImage &&
            result.imageurl
        ) {

            profileImage.src =
                uploadedImageUrl;
        }


        // =====================================================
        // UPDATE SIDEBAR IMAGE
        // =====================================================

        const sidebarImage =
            document.getElementById(
                "sidebarProfileImage"
            );


        if (
            sidebarImage &&
            result.imageurl
        ) {

            sidebarImage.src =
                uploadedImageUrl;
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


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    localStorage.removeItem("token");

    window.location.href =
        "Login.html";
}


// =========================================================
// HANDLE UNAUTHORIZED
// =========================================================

function handleUnauthorized() {

    localStorage.removeItem("token");

    window.location.href =
        "Login.html";
}


// =========================================================
// TOAST
// =========================================================

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.className =
        `toast-message ${type} show`;


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3000);
}


// =========================================================
// DARK MODE
// =========================================================

function initializeDarkMode() {

    const darkModeBtn =
        document.getElementById(
            "darkModeBtn"
        );


    const darkModeIcon =
        document.getElementById(
            "darkModeIcon"
        );


    const darkModeText =
        document.getElementById(
            "darkModeText"
        );


    const savedTheme =
        localStorage.getItem(
            "theme"
        );


    // =====================================================
    // LOAD SAVED THEME
    // =====================================================

    if (savedTheme === "dark") {

        document.documentElement.setAttribute(
            "data-theme",
            "dark"
        );


        if (darkModeIcon) {

            darkModeIcon.textContent =
                "☀";
        }


        if (darkModeText) {

            darkModeText.textContent =
                "Light Mode";
        }
    }


    // =====================================================
    // DARK MODE BUTTON
    // =====================================================

    if (darkModeBtn) {

        darkModeBtn.addEventListener(
            "click",
            () => {

                const isDark =
                    document.documentElement
                        .getAttribute(
                            "data-theme"
                        ) === "dark";


                // =================================================
                // SWITCH TO LIGHT
                // =================================================

                if (isDark) {

                    document.documentElement
                        .removeAttribute(
                            "data-theme"
                        );


                    localStorage.setItem(
                        "theme",
                        "light"
                    );


                    if (darkModeIcon) {

                        darkModeIcon.textContent =
                            "☾";
                    }


                    if (darkModeText) {

                        darkModeText.textContent =
                            "Dark Mode";
                    }

                }


                // =================================================
                // SWITCH TO DARK
                // =================================================

                else {

                    document.documentElement
                        .setAttribute(
                            "data-theme",
                            "dark"
                        );


                    localStorage.setItem(
                        "theme",
                        "dark"
                    );


                    if (darkModeIcon) {

                        darkModeIcon.textContent =
                            "☀";
                    }


                    if (darkModeText) {

                        darkModeText.textContent =
                            "Light Mode";
                    }
                }
            }
        );
    }
}


// =========================================================
// CHECK ADMIN ROLE
// =========================================================

function checkAdminRole() {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {
        return;
    }


    try {

        // =====================================================
        // JWT STRUCTURE
        // HEADER.PAYLOAD.SIGNATURE
        // =====================================================

        const tokenParts =
            token.split(".");


        if (tokenParts.length !== 3) {

            console.error(
                "Invalid JWT token."
            );

            return;
        }


        const payload =
            JSON.parse(
                atob(
                    tokenParts[1]
                )
            );


        console.log(
            "JWT Payload:",
            payload
        );


        // =====================================================
        // GET ROLE
        // =====================================================

        const role =
            payload.role ||
            payload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];


        console.log(
            "User Role:",
            role
        );


        // =====================================================
        // ADMIN LINK
        // =====================================================

        const adminLink =
            document.getElementById(
                "adminDashboardLink"
            );


        // =====================================================
        // SIDEBAR ROLE
        // =====================================================

        const sidebarRole =
            document.getElementById(
                "sidebarProfileRole"
            );


        // =====================================================
        // ADMIN
        // =====================================================

        if (role === "Admin") {

            if (adminLink) {

                adminLink.hidden =
                    false;
            }


            if (sidebarRole) {

                sidebarRole.textContent =
                    "Administrator";
            }

        }


        // =====================================================
        // NORMAL USER
        // =====================================================

        else {

            if (adminLink) {

                adminLink.hidden =
                    true;
            }


            if (sidebarRole) {

                sidebarRole.textContent =
                    "User";
            }
        }

    }
    catch (error) {

        console.error(
            "Unable to read user role:",
            error
        );
    }
}


// =========================================================
// SIDEBAR
// =========================================================

function initializeSidebar() {

    const sidebar =
        document.getElementById(
            "profileSidebar"
        );


    const toggle =
        document.getElementById(
            "sidebarToggle"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (!sidebar || !toggle) {
        return;
    }


    // =====================================================
    // OPEN / CLOSE SIDEBAR
    // =====================================================

    toggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );


            if (overlay) {

                overlay.classList.toggle(
                    "show"
                );
            }
        }
    );


    // =====================================================
    // CLOSE USING OVERLAY
    // =====================================================

    if (overlay) {

        overlay.addEventListener(
            "click",
            () => {

                sidebar.classList.remove(
                    "open"
                );


                overlay.classList.remove(
                    "show"
                );
            }
        );
    }


    // =====================================================
    // CLOSE SIDEBAR AFTER LINK CLICK
    // =====================================================

    const sidebarLinks =
        document.querySelectorAll(
            ".sidebar-nav a"
        );


    sidebarLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    sidebar.classList.remove(
                        "open"
                    );


                    if (overlay) {

                        overlay.classList.remove(
                            "show"
                        );
                    }
                }
            );
        }
    );
}


// =========================================================
// SIDEBAR LOGOUT
// =========================================================

function initializeSidebarLogout() {

    const sidebarLogoutBtn =
        document.getElementById(
            "sidebarLogoutBtn"
        );


    if (sidebarLogoutBtn) {

        sidebarLogoutBtn.addEventListener(
            "click",
            logout
        );
    }
}


// =========================================================
// IMAGE UPLOAD EVENT
// =========================================================

function initializeImageUpload() {

    const imageInput =
        document.getElementById(
            "profileImageInput"
        );


    if (!imageInput) {
        return;
    }


    imageInput.addEventListener(
        "change",
        async function () {

            const file =
                this.files?.[0];


            if (!file) {
                return;
            }


            await uploadProfileImage(
                file
            );


            // Reset input
            // Allows selecting the same image again.

            this.value = "";
        }
    );
}


// =========================================================
// SECURITY LOGOUT
// =========================================================

function initializeSecurityLogout() {

    const securityLogoutBtn =
        document.getElementById(
            "securityLogoutBtn"
        );


    if (securityLogoutBtn) {

        securityLogoutBtn.addEventListener(
            "click",
            logout
        );
    }
}


// =========================================================
// INITIALIZE PAGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Load profile
        loadProfile();


        // Check Admin role
        checkAdminRole();


        // Dark Mode
        initializeDarkMode();


        // Sidebar
        initializeSidebar();


        // Sidebar Logout
        initializeSidebarLogout();


        // Profile Image Upload
        initializeImageUpload();


        // Security Logout
        initializeSecurityLogout();

    }
);
