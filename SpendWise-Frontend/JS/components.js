// ======================================================
// SpendWise - Shared Components
// Navbar + Footer
// ======================================================


// ======================================================
// NAVBAR
// ======================================================

function loadNavbar() {

    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    navbar.innerHTML = `

        <nav class="navbar navbar-expand-lg spend-navbar">

            <div class="container">

                <!-- Brand -->
                <a class="navbar-brand" href="./home.html">

                    <span class="brand-icon">
                        <i class="bi bi-wallet2"></i>
                    </span>

                    <span class="brand-text">
                        SpendWise
                    </span>

                </a>

                <!-- Mobile Toggle -->
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


                <!-- Navbar -->
                <div class="collapse navbar-collapse" id="spendNavbar">


                    <!-- Main Links -->
                    <ul class="navbar-nav mx-auto mb-2 mb-lg-0">

                        <li class="nav-item">

                            <a class="nav-link"
                               href="./home.html">

                                Home

                            </a>

                        </li>


                        <li class="nav-item">

                            <a class="nav-link"
                               href="./home.html#about">

                                About

                            </a>

                        </li>


                        <li class="nav-item">

                            <a class="nav-link"
                               href="./home.html#features">

                                Features

                            </a>

                        </li>


                        <li class="nav-item">

                            <a class="nav-link"
                               href="./home.html#contact">

                                Contact

                            </a>

                        </li>

                    </ul>


                    <!-- Right Side -->
                    <div class="d-flex align-items-center gap-2">


                        ${
                            isLoggedIn

                            ?

                            `

                            <!-- Profile -->
                            <a
                                href="./Profile.html"
                                class="nav-link profile-link">

                                <i class="bi bi-person-circle me-1"></i>

                                Profile

                            </a>


                            <!-- Dashboard -->
                            <a
                                href="./UserDahboard.html"
                                class="btn btn-primary navbar-dashboard-btn">

                                <i class="bi bi-speedometer2 me-1"></i>

                                Dashboard

                            </a>


                            <!-- Logout -->
                            <button
                                type="button"
                                id="logoutBtn"
                                class="btn btn-outline-danger">

                                <i class="bi bi-box-arrow-right me-1"></i>

                                Logout

                            </button>

                            `

                            :

                            `

                            <!-- Login -->
                            <a
                                href="./Login.html"
                                class="btn btn-outline-primary">

                                Login

                            </a>


                            <!-- Register -->
                            <a
                                href="./Register.html"
                                class="btn btn-primary">

                                Register

                            </a>

                            `

                        }

                    </div>

                </div>

            </div>

        </nav>

    `;


    // ==================================================
    // LOGOUT
    // ==================================================

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            // Remove authentication data
            localStorage.removeItem("token");

            // Remove stored user data if exists
            localStorage.removeItem("user");

            // Redirect to login
            window.location.href = "./Login.html";

        });

    }

}


// ======================================================
// FOOTER
// ======================================================

function loadFooter() {

    const footer = document.getElementById("footer");

    if (!footer) return;


    footer.innerHTML = `

        <footer class="spend-footer">

            <div class="container">

                <div class="row gy-4">


                    <!-- Brand -->
                    <div class="col-lg-5 col-md-6">

                        <a
                            href="./home.html"
                            class="footer-brand">

                            <i class="bi bi-wallet2"></i>

                            SpendWise

                        </a>


                        <p class="footer-description">

                            Take control of your money,
                            track your expenses,
                            manage your budget,
                            and build better financial habits.

                        </p>


                        <div class="footer-socials">

                            <a href="#" aria-label="Facebook">

                                <i class="bi bi-facebook"></i>

                            </a>


                            <a href="#" aria-label="Instagram">

                                <i class="bi bi-instagram"></i>

                            </a>


                            <a href="#" aria-label="LinkedIn">

                                <i class="bi bi-linkedin"></i>

                            </a>


                            <a href="#" aria-label="GitHub">

                                <i class="bi bi-github"></i>

                            </a>

                        </div>

                    </div>


                    <!-- Quick Links -->
                    <div class="col-lg-2 col-md-6">

                        <h5>Quick Links</h5>

                        <ul>

                            <li>
                                <a href="./home.html">
                                    Home
                                </a>
                            </li>

                            <li>
                                <a href="./home.html#about">
                                    About
                                </a>
                            </li>

                            <li>
                                <a href="./home.html#features">
                                    Features
                                </a>
                            </li>

                            <li>
                                <a href="./home.html#contact">
                                    Contact
                                </a>
                            </li>

                        </ul>

                    </div>


                    <!-- Account -->
                    <div class="col-lg-2 col-md-6">

                        <h5>Account</h5>

                        <ul>

                            ${
                                isUserLoggedIn()

                                ?

                                `

                                <li>
                                    <a href="./Profile.html">
                                        Profile
                                    </a>
                                </li>

                                <li>
                                    <a href="./UserDahboard.html">
                                        Dashboard
                                    </a>
                                </li>

                                `

                                :

                                `

                                <li>
                                    <a href="./Login.html">
                                        Login
                                    </a>
                                </li>

                                <li>
                                    <a href="./Register.html">
                                        Register
                                    </a>
                                </li>

                                `

                            }

                        </ul>

                    </div>


                    <!-- Contact -->
                    <div class="col-lg-3 col-md-6">

                        <h5>Contact</h5>

                        <ul>

                            <li>

                                <i class="bi bi-envelope me-2"></i>

                                support@spendwise.com

                            </li>

                            <li>

                                <i class="bi bi-globe me-2"></i>

                                SpendWise

                            </li>

                        </ul>

                    </div>

                </div>


                <!-- Bottom -->
                <div class="footer-bottom">

                    <p>

                        © ${new Date().getFullYear()}
                        SpendWise.
                        All rights reserved.

                    </p>

                    <p>

                        Built with ❤️ for smarter money management.

                    </p>

                </div>

            </div>

        </footer>

    `;

}


// ======================================================
// CHECK LOGIN
// ======================================================

function isUserLoggedIn() {

    const token = localStorage.getItem("token");

    return !!token;

}


// ======================================================
// ACTIVE NAVBAR LINK
// ======================================================

function setActiveNavbarLink() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const navLinks =
        document.querySelectorAll(".spend-navbar .nav-link");


    navLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;


        const linkPage =
            href
                .split("/")
                .pop()
                .split("#")[0]
                .toLowerCase();


        if (
            linkPage &&
            linkPage === currentPage
        ) {

            link.classList.add("active");

        }

    });

}


// ======================================================
// INITIALIZE COMPONENTS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Load Navbar
        loadNavbar();


        // Load Footer
        loadFooter();


        // Active link
        setActiveNavbarLink();

    }
);