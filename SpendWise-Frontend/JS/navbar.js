document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    const themeToggle = document.getElementById("themeToggle");
    const mobileThemeToggle = document.getElementById("mobileThemeToggle");

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {

            mobileMenu.classList.toggle("active");

            const icon = menuToggle.querySelector("i");

            if (mobileMenu.classList.contains("active")) {
                icon.classList.remove("bi-list");
                icon.classList.add("bi-x");
            } else {
                icon.classList.remove("bi-x");
                icon.classList.add("bi-list");
            }
        });
    }

    /* =====================================================
       THEME
    ===================================================== */

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

        const newTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        updateThemeIcons(newTheme);
    }

    function updateThemeIcons(theme) {
        const icons = document.querySelectorAll(
            "#themeToggle i, #mobileThemeToggle i"
        );

        icons.forEach((icon) => {
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

    /* =====================================================
       CLOSE MOBILE MENU AFTER CLICKING A LINK
    ===================================================== */

    const mobileLinks = document.querySelectorAll(
        "#mobileMenu a"
    );

    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");

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

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("token");

            window.location.href = "./Login.html";
        });
    }

});