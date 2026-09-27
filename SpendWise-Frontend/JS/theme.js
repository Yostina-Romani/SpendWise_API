
// =====================================================
// THEME MANAGEMENT
// =====================================================

// Get saved theme
const savedTheme =
    localStorage.getItem("theme") || "light";

// Apply theme immediately
document.documentElement.setAttribute(
    "data-theme",
    savedTheme
);


// =====================================================
// UPDATE THEME ICON
// =====================================================

function updateThemeIcon() {

    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) return;

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {

        themeToggle.innerHTML =
            '<i class="bi bi-sun-fill"></i>';

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

        themeToggle.setAttribute(
            "title",
            "Light Mode"
        );

    } else {

        themeToggle.innerHTML =
            '<i class="bi bi-moon-stars-fill"></i>';

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "title",
            "Dark Mode"
        );
    }
}


// =====================================================
// TOGGLE THEME
// =====================================================

function toggleTheme() {

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    // Apply new theme
    document.documentElement.setAttribute(
        "data-theme",
        newTheme
    );

    // Save theme
    localStorage.setItem(
        "theme",
        newTheme
    );

    // Update icon
    updateThemeIcon();
}


// =====================================================
// INITIALIZE THEME
// =====================================================

function initializeTheme() {

    // Make sure saved theme is applied
    const theme =
        localStorage.getItem("theme") || "light";

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    // Update icon after navbar exists
    updateThemeIcon();
}


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

    }
);
