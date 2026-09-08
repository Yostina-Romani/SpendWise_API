function loadNavbar() {

    const navbar =
        document.getElementById("navbar");

    if (!navbar) return;

    navbar.innerHTML = `
        <nav class="navbar navbar-expand-lg spend-navbar">
            <div class="container">

                <a
                    class="navbar-brand d-flex align-items-center gap-2"
                    href="./UserDashboard.html"
                >
                    <span class="brand-icon">
                        S
                    </span>

                    <strong>
                        SpendWise
                    </strong>
                </a>


                <div class="d-flex align-items-center gap-3">

                    <a
                        href="./UserDashboard.html"
                        class="nav-link"
                    >
                        Dashboard
                    </a>


                    <button
                        id="themeToggle"
                        class="theme-btn"
                        type="button"
                    >
                        <i class="bi bi-moon"></i>
                    </button>


                    <button
                        class="btn btn-danger"
                        onclick="logout()"
                    >
                        <i class="bi bi-box-arrow-right"></i>

                        Logout
                    </button>

                </div>

            </div>
        </nav>
    `;
}


function loadFooter() {

    const footer =
        document.getElementById("footer");

    if (!footer) return;

    footer.innerHTML = `
        <footer class="py-4 mt-5">
            <div class="container text-center">

                <p class="mb-0">
                    © 2026 SpendWise
                </p>

                <small>
                    Smart expense management made simple.
                </small>

            </div>
        </footer>
    `;
}


document.addEventListener("DOMContentLoaded", () => {

    loadNavbar();
    loadFooter();

});