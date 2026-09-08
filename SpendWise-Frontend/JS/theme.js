const savedTheme = localStorage.getItem("theme") || "light";

document.documentElement.setAttribute(
    "data-theme",
    savedTheme
);


function updateThemeIcon() {

    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) return;

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    themeToggle.innerHTML =
        currentTheme === "dark"
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon"></i>';
}


function toggleTheme() {

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    document.documentElement.setAttribute(
        "data-theme",
        newTheme
    );

    localStorage.setItem(
        "theme",
        newTheme
    );

    updateThemeIcon();
}


document.addEventListener("DOMContentLoaded", () => {

    updateThemeIcon();

    const themeToggle =
        document.getElementById("themeToggle");

    if (themeToggle) {
        themeToggle.addEventListener(
            "click",
            toggleTheme
        );
    }

});