/* =========================================================
   SPENDWISE - EXPENSES
========================================================= */

const API_URL =
    "https://spendwise-api.runasp.net/api/Expenses/myExpenses";

const BACKEND_URL =
    "";


/* =========================================================
   ELEMENTS
========================================================= */

const tableBody =
    document.getElementById("extablebody");

const totalExpensesElement =
    document.getElementById("totalExpenses");

const expenseCountElement =
    document.getElementById("expenseCount");

const categoryCountElement =
    document.getElementById("categoryCount");

const loadingElement =
    document.getElementById("expensesLoading");

const emptyElement =
    document.getElementById("expensesEmpty");

const errorElement =
    document.getElementById("expensesError");

const errorMessageElement =
    document.getElementById("errorMessage");

const tableWrapper =
    document.getElementById("expensesTableWrapper");

const retryButton =
    document.getElementById("retryBtn");


/* =========================================================
   GET TOKEN
========================================================= */

function getToken() {
    return localStorage.getItem("token");
}


/* =========================================================
   UI STATES
========================================================= */

function showLoading() {

    loadingElement.hidden = false;
    emptyElement.hidden = true;
    errorElement.hidden = true;
    tableWrapper.hidden = true;
}


function showEmpty() {

    loadingElement.hidden = true;
    emptyElement.hidden = false;
    errorElement.hidden = true;
    tableWrapper.hidden = true;
}


function showError(message) {

    loadingElement.hidden = true;
    emptyElement.hidden = true;
    errorElement.hidden = false;
    tableWrapper.hidden = true;

    errorMessageElement.textContent =
        message || "Something went wrong.";
}


function showTable() {

    loadingElement.hidden = true;
    emptyElement.hidden = true;
    errorElement.hidden = true;
    tableWrapper.hidden = false;
}


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(amount) {

    return Number(amount || 0).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


/* =========================================================
   CATEGORY IMAGE URL
========================================================= */

function getCategoryImageUrl(imageUrl) {

    if (!imageUrl) {
        return null;
    }

    /*
       Full URL
       https://...
    */

    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
    ) {
        return imageUrl;
    }


    /*
       /uploads/categories/food.png
    */

    if (imageUrl.startsWith("/")) {
        return BACKEND_URL + imageUrl;
    }


    /*
       uploads/categories/food.png
    */

    return BACKEND_URL + "/" + imageUrl;
}


/* =========================================================
   LOAD EXPENSES
========================================================= */

async function loadExpenses() {

    showLoading();

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
                API_URL,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        /* ==========================================
           UNAUTHORIZED
        ========================================== */

        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "./login.html";

            return;
        }


        /* ==========================================
           OTHER ERROR
        ========================================== */

        if (!response.ok) {

            const errorData =
                await response.json()
                    .catch(() => null);

            throw new Error(
                errorData?.message ||
                `Request failed with status ${response.status}`
            );
        }


        const expenses =
            await response.json();


        console.log(
            "My Expenses:",
            expenses
        );


        /* ==========================================
           EMPTY
        ========================================== */

        if (
            !Array.isArray(expenses) ||
            expenses.length === 0
        ) {

            updateSummary([]);

            showEmpty();

            return;
        }


        /* ==========================================
           SUCCESS
        ========================================== */

        updateSummary(expenses);

        renderExpenses(expenses);

        showTable();

    }

    catch (error) {

        console.error(
            "Load Expenses Error:",
            error
        );

        showError(
            error.message ||
            "Unable to load your expenses."
        );
    }
}


/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary(expenses) {

    const total =
        expenses.reduce(
            (sum, expense) => {

                return sum +
                    Number(
                        expense.expenseAmount || 0
                    );

            },
            0
        );


    /*
       Category IDs
    */

    const uniqueCategories =
        new Set(
            expenses
                .map(
                    expense =>
                        expense.category?.categoryID
                )
                .filter(Boolean)
        );


    totalExpensesElement.textContent =
        `$${formatMoney(total)}`;


    expenseCountElement.textContent =
        expenses.length;


    categoryCountElement.textContent =
        uniqueCategories.size;
}


/* =========================================================
   RENDER EXPENSES
========================================================= */

function renderExpenses(expenses) {

    tableBody.innerHTML = "";


    expenses.forEach(
        expense => {

            const row =
                document.createElement("tr");


            /* ======================================
               AMOUNT
            ====================================== */

            const amountCell =
                document.createElement("td");

            amountCell.className =
                "expense-amount";

            amountCell.textContent =
                `$${formatMoney(
                    expense.expenseAmount
                )}`;


            /* ======================================
               DATE
            ====================================== */

            const dateCell =
                document.createElement("td");

            dateCell.className =
                "expense-date";

            dateCell.textContent =
                formatDate(
                    expense.expenseTime
                );


            /* ======================================
               CATEGORY
            ====================================== */

            const categoryCell =
                document.createElement("td");


            const category =
                expense.category;


            const categoryWrapper =
                document.createElement("div");

            categoryWrapper.className =
                "expense-category";


            /* ======================================
               IMAGE WRAPPER
            ====================================== */

            const imageWrapper =
                document.createElement("div");

            imageWrapper.className =
                "category-image-wrapper";


            const imageUrl =
                getCategoryImageUrl(
                    category?.imageURL
                );


            if (imageUrl) {

                const image =
                    document.createElement("img");

                image.className =
                    "category-image";

                image.src =
                    imageUrl;

                image.alt =
                    category?.categoryNmae ||
                    "Category";

                image.loading =
                    "lazy";


                /*
                   Image fallback
                */

                image.onerror =
                    function () {

                        image.style.display =
                            "none";

                        const icon =
                            document.createElement("i");

                        icon.className =
                            "bi bi-tag category-image-fallback";

                        imageWrapper.appendChild(
                            icon
                        );
                    };


                imageWrapper.appendChild(
                    image
                );

            }

            else {

                const icon =
                    document.createElement("i");

                icon.className =
                    "bi bi-tag category-image-fallback";

                imageWrapper.appendChild(
                    icon
                );
            }


            /* ======================================
               CATEGORY NAME
            ====================================== */

            const categoryName =
                document.createElement("span");

            categoryName.className =
                "category-name";

            categoryName.textContent =
                category?.categoryNmae ||
                "Unknown";


            /* ======================================
               BUILD CATEGORY
            ====================================== */

            categoryWrapper.appendChild(
                imageWrapper
            );

            categoryWrapper.appendChild(
                categoryName
            );


            categoryCell.appendChild(
                categoryWrapper
            );


            /* ======================================
               BUILD ROW
            ====================================== */

            row.appendChild(
                amountCell
            );

            row.appendChild(
                dateCell
            );

            row.appendChild(
                categoryCell
            );


            tableBody.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   RETRY
========================================================= */

if (retryButton) {

    retryButton.addEventListener(
        "click",
        loadExpenses
    );
}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    loadExpenses
);