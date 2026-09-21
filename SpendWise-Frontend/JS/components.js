
// =====================================================
// NAVBAR
// =====================================================

function loadNavbar() {

    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    const token = localStorage.getItem("token");

    const isLoggedIn = !!token;

    navbar.innerHTML = `
        <nav class="navbar navbar-expand-lg spend-navbar">

            <div class="container">

                <!-- Brand -->
                <a class="navbar-brand" href="home.html">

                    <span class="brand-icon">
                        <i class="bi bi-wallet2"></i>
                    </span>

                    <span>
                        SpendWise
                    </span>

                </a>


                <!-- Mobile Button -->
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#spendNavbar"
                    aria-controls="spendNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation">

                    <span class="navbar-toggler-icon"></span>

                </button>


                <!-- Navbar Content -->
                <div
                    class="collapse navbar-collapse"
                    id="spendNavbar">


                    <!-- Links -->
                    <ul class="navbar-nav mx-auto">

                        <li class="nav-item">
                            <a
                                class="nav-link active"
                                href="home.html">
                                Home
                            </a>
                        </li>

                        <li class="nav-item">
                            <a
                                class="nav-link"
                                href="home.html#about">
                                About
                            </a>
                        </li>

                        <li class="nav-item">
                            <a
                                class="nav-link"
                                href="home.html#features">
                                Features
                            </a>
                        </li>

                        <li class="nav-item">
                            <a
                                class="nav-link"
                                href="home.html#contact">
                                Contact
                            </a>
                        </li>

                        ${
                            isLoggedIn
                                ? `
                                    <li class="nav-item">
                                        <a
                                            class="nav-link"
                                            href="UserDahboard.html">
                                            Dashboard
                                        </a>
                                    </li>

                                    <li class="nav-item">
                                        <a
                                            class="nav-link"
                                            href="Profile.html">
                                            Profile
                                        </a>
                                    </li>
                                  `
                                : ""
                        }

                    </ul>


                    <!-- Actions -->
                    <div class="navbar-actions">

                        <!-- Theme -->
                        <button
                            type="button"
                            class="theme-btn"
                            id="themeToggle"
                            aria-label="Toggle theme">

                            <i class="bi bi-moon-stars-fill"></i>

                        </button>


                        ${
                            isLoggedIn
                                ? `
                                    <!-- Logout -->
                                    <button
                                        type="button"
                                        class="nav-login-btn"
                                        id="navbarLogoutBtn">

                                        Logout

                                    </button>
                                  `
                                : `
                                    <!-- Login -->
                                    <a
                                        href="login.html"
                                        class="nav-login-btn">

                                        Login

                                    </a>


                                    <!-- Register -->
                                    <a
                                        href="register.html"
                                        class="nav-register-btn">

                                        Register

                                    </a>
                                  `
                        }

                    </div>

                </div>

            </div>

        </nav>
    `;


    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutBtn =
        document.getElementById("navbarLogoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("token");

            window.location.href = "login.html";

        });

    }
}


// =====================================================
// FOOTER
// =====================================================

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


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadNavbar();
    loadFooter();

});
