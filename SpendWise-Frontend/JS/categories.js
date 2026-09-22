/* =========================================================
   SPENDWISE - CATEGORIES
========================================================= */

const API_URL =
    "https://spendwise-api.runasp.net/api/Category/getcategories";

const BACKEND_URL =
    "";


/* =========================================================
   ELEMENTS
========================================================= */

const categoriesGrid =
    document.getElementById("categoriesGrid");

const categoriesLoading =
    document.getElementById("categoriesLoading");

const categoriesEmpty =
    document.getElementById("categoriesEmpty");

const categoriesError =
    document.getElementById("categoriesError");

const errorMessage =
    document.getElementById("errorMessage");

const retryBtn =
    document.getElementById("retryBtn");

const categoriesCount =
    document.getElementById("categoriesCount");

const addCategoryBtn =
    document.getElementById("addCategoryBtn");

const emptyAddCategoryBtn =
    document.getElementById("emptyAddCategoryBtn");

const adminNotice =
    document.getElementById("adminNotice");

const userNotice =
    document.getElementById("userNotice");


/* =========================================================
   GET TOKEN
========================================================= */

function getToken() {

    return localStorage.getItem("token");

}


/* =========================================================
   DECODE JWT
========================================================= */

function decodeToken(token) {

    try {

        const parts =
            token.split(".");

        if (parts.length !== 3) {

            return null;

        }

        const payload =
            parts[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/");

        const decoded =
            decodeURIComponent(
                atob(payload)
                    .split("")
                    .map(
                        char =>
                            "%" +
                            (
                                "00" +
                                char
                                    .charCodeAt(0)
                                    .toString(16)
                            ).slice(-2)
                    )
                    .join("")
            );

        return JSON.parse(decoded);

    } catch (error) {

        console.error(
            "JWT Decode Error:",
            error
        );

        return null;

    }

}


/* =========================================================
   CHECK ADMIN ROLE
========================================================= */

function isAdmin() {

    const token =
        getToken();

    if (!token) {

        return false;

    }

    const payload =
        decodeToken(token);

    if (!payload) {

        return false;

    }


    /*
        ASP.NET Core Identity may store
        the role claim using:

        http://schemas.microsoft.com/ws/2008/06/identity/claims/role

        or simply:

        role

        It may also be an array.
    */

    const roleClaim =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";


    const roles =
        payload[roleClaim] ||
        payload["role"] ||
        payload["roles"];


    if (Array.isArray(roles)) {

        return roles.some(
            role =>
                String(role).toLowerCase() === "admin"
        );

    }


    return (
        String(roles || "")
            .toLowerCase() === "admin"
    );

}


/* =========================================================
   SET USER INTERFACE
========================================================= */

function setupRoleBasedUI() {

    const admin =
        isAdmin();


    if (admin) {

        /*
            ADMIN
        */

        if (addCategoryBtn) {

            addCategoryBtn.hidden = false;

        }

        if (emptyAddCategoryBtn) {

            emptyAddCategoryBtn.hidden = false;

        }

        if (adminNotice) {

            adminNotice.hidden = false;

        }

        if (userNotice) {

            userNotice.hidden = true;

        }

    } else {

        /*
            NORMAL USER
        */

        if (addCategoryBtn) {

            addCategoryBtn.hidden = true;

        }

        if (emptyAddCategoryBtn) {

            emptyAddCategoryBtn.hidden = true;

        }

        if (adminNotice) {

            adminNotice.hidden = true;

        }

        if (userNotice) {

            userNotice.hidden = false;

        }

    }

}


/* =========================================================
   UI STATES
========================================================= */

function showLoading() {

    categoriesLoading.hidden = false;

    categoriesEmpty.hidden = true;

    categoriesError.hidden = true;

    categoriesGrid.hidden = true;

}


function showEmpty() {

    categoriesLoading.hidden = true;

    categoriesEmpty.hidden = false;

    categoriesError.hidden = true;

    categoriesGrid.hidden = true;

}


function showError(message) {

    categoriesLoading.hidden = true;

    categoriesEmpty.hidden = true;

    categoriesError.hidden = false;

    categoriesGrid.hidden = true;

    errorMessage.textContent =
        message ||
        "Something went wrong.";

}


function showCategories() {

    categoriesLoading.hidden = true;

    categoriesEmpty.hidden = true;

    categoriesError.hidden = true;

    categoriesGrid.hidden = false;

}


/* =========================================================
   IMAGE URL
========================================================= */

function getImageUrl(imageUrl) {

    if (!imageUrl) {

        return null;

    }


    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
    ) {

        return imageUrl;

    }


    if (imageUrl.startsWith("/")) {

        return BACKEND_URL + imageUrl;

    }


    return BACKEND_URL + "/" + imageUrl;

}


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadCategories() {

    showLoading();


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );

        }


        const categories =
            await response.json();


        console.log(
            "Categories:",
            categories
        );


        if (
            !Array.isArray(categories) ||
            categories.length === 0
        ) {

            categoriesCount.textContent = "0";

            showEmpty();

            return;

        }


        categoriesCount.textContent =
            categories.length;


        renderCategories(
            categories
        );


        showCategories();


    } catch (error) {

        console.error(
            "Load Categories Error:",
            error
        );


        showError(
            error.message ||
            "Unable to load categories."
        );

    }

}


/* =========================================================
   RENDER CATEGORIES
========================================================= */

function renderCategories(categories) {

    categoriesGrid.innerHTML = "";


    const admin =
        isAdmin();


    categories.forEach(
        (category, index) => {

            const card =
                document.createElement("article");

            card.className =
                "category-item";


            /*
                Animation delay
            */

            card.style.animationDelay =
                `${index * 0.05}s`;


            /* ================= IMAGE ================= */

            const imageContainer =
                document.createElement("div");

            imageContainer.className =
                "category-image-container";


            const imageUrl =
                getImageUrl(
                    category.imageURL
                );


            if (imageUrl) {

                const image =
                    document.createElement("img");

                image.src =
                    imageUrl;

                image.alt =
                    category.categoryNmae ||
                    "Category";

                image.className =
                    "category-image";

                image.loading =
                    "lazy";


                image.onerror =
                    function () {

                        image.style.display =
                            "none";


                        const fallback =
                            document.createElement("i");

                        fallback.className =
                            "bi bi-tag category-image-fallback";


                        imageContainer.appendChild(
                            fallback
                        );

                    };


                imageContainer.appendChild(
                    image
                );

            } else {

                const fallback =
                    document.createElement("i");

                fallback.className =
                    "bi bi-tag category-image-fallback";


                imageContainer.appendChild(
                    fallback
                );

            }


            /* ================= NAME ================= */

            const name =
                document.createElement("h3");

            name.className =
                "category-name";

            name.textContent =
                category.categoryNmae ||
                "Unnamed Category";


            /* ================= DESCRIPTION ================= */

            const description =
                document.createElement("p");

            description.className =
                "category-description";

            description.textContent =
                category.CategoryDescription ||
                "No description available.";


            card.appendChild(
                imageContainer
            );

            card.appendChild(
                name
            );

            card.appendChild(
                description
            );


            /* =================================================
               ADMIN ACTIONS
            ================================================= */

            if (admin) {

                const actions =
                    document.createElement("div");

                actions.className =
                    "category-actions";


                /* ================= EDIT ================= */

                const editBtn =
                    document.createElement("button");

                editBtn.type =
                    "button";

                editBtn.className =
                    "category-action-btn edit-category-btn";

                editBtn.title =
                    "Edit category";

                editBtn.innerHTML =
                    '<i class="bi bi-pencil"></i>';


                editBtn.addEventListener(
                    "click",
                    () => {

                        editCategory(
                            category
                        );

                    }
                );


                /* ================= DELETE ================= */

                const deleteBtn =
                    document.createElement("button");

                deleteBtn.type =
                    "button";

                deleteBtn.className =
                    "category-action-btn delete-category-btn";

                deleteBtn.title =
                    "Delete category";

                deleteBtn.innerHTML =
                    '<i class="bi bi-trash3"></i>';


                deleteBtn.addEventListener(
                    "click",
                    () => {

                        deleteCategory(
                            category.categoryID
                        );

                    }
                );


                actions.appendChild(
                    editBtn
                );

                actions.appendChild(
                    deleteBtn
                );


                card.appendChild(
                    actions
                );

            }


            categoriesGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   EDIT CATEGORY
========================================================= */

function editCategory(category) {

    /*
        For now we send the category ID
        to the edit page.

        Example:

        editCategory.html?id=5
    */

    const categoryId =
        category.categoryID;


    window.location.href =
        `./editCategory.html?id=${categoryId}`;

}


/* =========================================================
   DELETE CATEGORY
========================================================= */

async function deleteCategory(categoryId) {

    if (!isAdmin()) {

        alert(
            "You are not authorized to delete categories."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmed) {

        return;

    }


    const token =
        getToken();


    if (!token) {

        window.location.href =
            "./login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `/api/Category/${categoryId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const result =
            await response.json()
                .catch(() => null);


        if (response.status === 401) {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "./login.html";

            return;

        }


        if (response.status === 403) {

            alert(
                "You are not authorized to delete this category."
            );

            return;

        }


        if (!response.ok) {

            throw new Error(
                result?.message ||
                "Unable to delete category."
            );

        }


        alert(
            result?.message ||
            "Category deleted successfully."
        );


        await loadCategories();


    } catch (error) {

        console.error(
            "Delete Category Error:",
            error
        );


        alert(
            error.message ||
            "Something went wrong while deleting the category."
        );

    }

}


/* =========================================================
   RETRY
========================================================= */

if (retryBtn) {

    retryBtn.addEventListener(
        "click",
        loadCategories
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRoleBasedUI();

        loadCategories();

    }
);