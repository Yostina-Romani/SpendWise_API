
document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // AUTHENTICATION STATE
    // =====================================================

    const token = localStorage.getItem("token");

    const loginLinks = document.querySelectorAll(".login-link");
    const registerLinks = document.querySelectorAll(".register-link");

    const dashboardLinks = document.querySelectorAll(".dashboard-link");
    const profileLinks = document.querySelectorAll(".profile-link");

    const logoutButtons = document.querySelectorAll(".logout-btn");


    // =====================================================
    // UPDATE NAVBAR BASED ON LOGIN STATUS
    // =====================================================

    if (token) {

        // User is logged in
        loginLinks.forEach(link => {
            link.style.display = "none";
        });

        registerLinks.forEach(link => {
            link.style.display = "none";
        });

        dashboardLinks.forEach(link => {
            link.style.display = "";
        });

        profileLinks.forEach(link => {
            link.style.display = "";
        });

        logoutButtons.forEach(button => {
            button.style.display = "";
        });

    } else {

        // User is NOT logged in
        dashboardLinks.forEach(link => {
            link.style.display = "none";
        });

        profileLinks.forEach(link => {
            link.style.display = "none";
        });

        logoutButtons.forEach(button => {
            button.style.display = "none";
        });

    }


    // =====================================================
    // MOBILE MENU
    // =====================================================

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    const themeToggle = document.getElementById("themeToggle");
    const mobileThemeToggle = document.getElementById("mobileThemeToggle");


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click", () => {

            mobileMenu.classList.toggle("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {

                if (mobileMenu.classList.contains("active")) {
                    icon.classList.remove("bi-list");
                    icon.classList.add("bi-x");
                } else {
                    icon.classList.remove("bi-x");
                    icon.classList.add("bi-list");
                }

            }

        });

    }


    // =====================================================
    // THEME
    // =====================================================

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.documentElement.setAttribute("data-theme", "dark");

        updateThemeIcons("dark");

    } else {

        document.documentElement.setAttribute("data-theme", "light");

        updateThemeIcons("light");

    }


    function toggleTheme() {

        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute(
            "data-theme",
            newTheme
        );

        localStorage.setItem("theme", newTheme);

        updateThemeIcons(newTheme);

    }


    function updateThemeIcons(theme) {

        const icons = document.querySelectorAll(
            "#themeToggle i, #mobileThemeToggle i"
        );

        icons.forEach(icon => {

            if (theme === "dark") {

                icon.classList.remove("bi-moon");
                icon.classList.add("bi-sun");

            } else {

                icon.classList.remove("bi-sun");
                icon.classList.add("bi-moon");

            }

        });

    }


    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener("click", toggleTheme);
    }


    // =====================================================
    // CLOSE MOBILE MENU AFTER CLICKING A LINK
    // =====================================================

    const mobileLinks = document.querySelectorAll(
        "#mobileMenu a"
    );

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (mobileMenu) {
                mobileMenu.classList.remove("active");
            }

            const icon = menuToggle?.querySelector("i");

            if (icon) {
                icon.classList.remove("bi-x");
                icon.classList.add("bi-list");
            }

        });

    });


    // =====================================================
    // LOGOUT
    // =====================================================

    logoutButtons.forEach(button => {

        button.addEventListener("click", () => {

            localStorage.removeItem("token");

            window.location.href = "./Login.html";

        });

    });

});
