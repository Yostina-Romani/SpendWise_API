const BUDGET_API_URL = "http://127.0.0.1:5253/api/Budget";

let currentBudgetId = null;


/* =========================================================
   TOKEN
========================================================= */

function getBudgetToken() {
    return localStorage.getItem("token");
}


/* =========================================================
   ELEMENTS
========================================================= */

const budgetMonthInput =
    document.getElementById("budgetMonth");

const budgetYearInput =
    document.getElementById("budgetYear");

const budgetAmountInput =
    document.getElementById("budgetAmount");

const saveBudgetBtn =
    document.getElementById("saveBudgetBtn");

const deleteBudgetBtn =
    document.getElementById("deleteBudgetBtn");

const budgetStatus =
    document.getElementById("budgetStatus");


/* =========================================================
   CURRENT PERIOD
========================================================= */

function setCurrentBudgetPeriod() {

    if (!budgetMonthInput || !budgetYearInput) {
        return;
    }

    const now = new Date();

    budgetMonthInput.value =
        now.getMonth() + 1;

    budgetYearInput.value =
        now.getFullYear();
}


/* =========================================================
   LOAD BUDGET
========================================================= */

async function loadBudget() {

    const token = getBudgetToken();

    if (!token) {
        handleBudgetUnauthorized();
        return;
    }

    if (!budgetMonthInput || !budgetYearInput) {
        return;
    }


    const month =
        Number(budgetMonthInput.value);

    const year =
        Number(budgetYearInput.value);


    if (
        month < 1 ||
        month > 12 ||
        year < 2000 ||
        year > 2100
    ) {
        return;
    }


    try {

        setBudgetStatus(
            "Loading budget...",
            "loading"
        );


        const response = await fetch(
            `${BUDGET_API_URL}?month=${month}&year=${year}`,
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


        /* =========================================
           UNAUTHORIZED
        ========================================= */

        if (response.status === 401) {

            handleBudgetUnauthorized();

            return;
        }


        /* =========================================
           NO BUDGET
        ========================================= */

        if (response.status === 404) {

            clearBudgetForm();

            setBudgetStatus(
                "No budget has been set for this month.",
                "info"
            );

            return;
        }


        /* =========================================
           SERVER ERROR
        ========================================= */

        if (!response.ok) {

            throw new Error(
                `Failed to load budget. Status: ${response.status}`
            );
        }


        const budget =
            await response.json();


        console.log(
            "Budget Data:",
            budget
        );


        /* =========================================
           SAVE CURRENT BUDGET ID
        ========================================= */

        currentBudgetId =
            budget.budgetId;


        /* =========================================
           FILL FORM
        ========================================= */

        if (budgetAmountInput) {

            budgetAmountInput.value =
                budget.amount ?? "";
        }


        if (deleteBudgetBtn) {

            deleteBudgetBtn.hidden = false;
        }


        setBudgetStatus(
            "Budget loaded successfully.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Budget Error:",
            error
        );


        currentBudgetId = null;


        setBudgetStatus(
            "Unable to load budget.",
            "error"
        );
    }
}



/* =========================================================
   CREATE / UPDATE BUDGET
========================================================= */

async function saveBudget() {

    const token = getBudgetToken();

    if (!token) {
        handleBudgetUnauthorized();
        return;
    }


    if (
        !budgetAmountInput ||
        !budgetMonthInput ||
        !budgetYearInput
    ) {
        return;
    }


    const amount =
        Number(budgetAmountInput.value);

    const month =
        Number(budgetMonthInput.value);

    const year =
        Number(budgetYearInput.value);


    /* =========================================
       VALIDATION
    ========================================= */

    if (!amount || amount <= 0) {

        setBudgetStatus(
            "Please enter a valid budget amount.",
            "error"
        );

        budgetAmountInput.focus();

        return;
    }


    if (month < 1 || month > 12) {

        setBudgetStatus(
            "Please select a valid month.",
            "error"
        );

        return;
    }


    if (year < 2000 || year > 2100) {

        setBudgetStatus(
            "Please enter a valid year.",
            "error"
        );

        return;
    }


    try {

        saveBudgetBtn.disabled = true;

        saveBudgetBtn.textContent =
            currentBudgetId
                ? "Updating..."
                : "Saving...";


        let response;


        /* =========================================
           UPDATE
        ========================================= */

        if (currentBudgetId) {

            response = await fetch(
                `${BUDGET_API_URL}/${currentBudgetId}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        amount: amount
                    })
                }
            );

        }


        /* =========================================
           CREATE
        ========================================= */

        else {

            response = await fetch(
                BUDGET_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        amount: amount,
                        month: month,
                        year: year
                    })
                }
            );

        }


        /* =========================================
           UNAUTHORIZED
        ========================================= */

        if (response.status === 401) {

            handleBudgetUnauthorized();

            return;
        }


        /* =========================================
           DUPLICATE BUDGET
        ========================================= */

        if (response.status === 409) {

            setBudgetStatus(
                "A budget already exists for this month.",
                "error"
            );

            return;
        }


        /* =========================================
           NOT FOUND
        ========================================= */

        if (response.status === 404) {

            setBudgetStatus(
                "Budget not found.",
                "error"
            );

            currentBudgetId = null;

            return;
        }


        /* =========================================
           OTHER ERRORS
        ========================================= */

        if (!response.ok) {

            const errorData =
                await response.json().catch(() => null);


            throw new Error(
                errorData?.message ||
                `Request failed with status ${response.status}`
            );
        }


        /* =========================================
           SUCCESS
        ========================================= */

        const budget =
            await response.json();


        console.log(
            "Saved Budget:",
            budget
        );


        currentBudgetId =
            budget.budgetId;


        if (budgetAmountInput) {

            budgetAmountInput.value =
                budget.amount;
        }


        if (deleteBudgetBtn) {

            deleteBudgetBtn.hidden = false;
        }


        setBudgetStatus(
            currentBudgetId
                ? "Budget saved successfully."
                : "Budget saved successfully.",
            "success"
        );


        showToast(
            "Budget saved successfully.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Save Budget Error:",
            error
        );


        setBudgetStatus(
            error.message ||
            "Unable to save budget.",
            "error"
        );

    }

    finally {

        if (saveBudgetBtn) {

            saveBudgetBtn.disabled = false;

            saveBudgetBtn.textContent =
                "Save Budget";
        }
    }
}



/* =========================================================
   DELETE BUDGET
========================================================= */

async function deleteBudget() {

    const token = getBudgetToken();

    if (!token) {
        handleBudgetUnauthorized();
        return;
    }


    if (!currentBudgetId) {

        setBudgetStatus(
            "There is no budget to delete.",
            "info"
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this budget?"
        );


    if (!confirmed) {
        return;
    }


    try {

        deleteBudgetBtn.disabled = true;

        deleteBudgetBtn.textContent =
            "Deleting...";


        const response =
            await fetch(
                `${BUDGET_API_URL}/${currentBudgetId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        /* =========================================
           UNAUTHORIZED
        ========================================= */

        if (response.status === 401) {

            handleBudgetUnauthorized();

            return;
        }


        /* =========================================
           NOT FOUND
        ========================================= */

        if (response.status === 404) {

            currentBudgetId = null;

            clearBudgetForm();

            setBudgetStatus(
                "Budget not found.",
                "error"
            );

            return;
        }


        if (!response.ok) {

            const errorData =
                await response.json().catch(() => null);


            throw new Error(
                errorData?.message ||
                "Failed to delete budget."
            );
        }


        /* =========================================
           SUCCESS
        ========================================= */

        currentBudgetId = null;

        clearBudgetForm();


        setBudgetStatus(
            "Budget deleted successfully.",
            "success"
        );


        showToast(
            "Budget deleted successfully.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Delete Budget Error:",
            error
        );


        setBudgetStatus(
            error.message ||
            "Unable to delete budget.",
            "error"
        );

    }

    finally {

        if (deleteBudgetBtn) {

            deleteBudgetBtn.disabled = false;

            deleteBudgetBtn.textContent =
                "Delete";
        }
    }
}



/* =========================================================
   CLEAR FORM
========================================================= */

function clearBudgetForm() {

    currentBudgetId = null;


    if (budgetAmountInput) {

        budgetAmountInput.value = "";
    }


    if (deleteBudgetBtn) {

        deleteBudgetBtn.hidden = true;
    }
}



/* =========================================================
   STATUS MESSAGE
========================================================= */

function setBudgetStatus(message, type = "info") {

    if (!budgetStatus) {
        return;
    }


    budgetStatus.textContent =
        message;


    budgetStatus.className =
        `budget-status ${type}`;
}



/* =========================================================
   UNAUTHORIZED
========================================================= */

function handleBudgetUnauthorized() {

    localStorage.removeItem("token");

    window.location.href =
        "Login.html";
}



/* =========================================================
   EVENTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setCurrentBudgetPeriod();

        loadBudget();


        /* =========================
           SAVE
        ========================= */

        if (saveBudgetBtn) {

            saveBudgetBtn.addEventListener(
                "click",
                saveBudget
            );
        }


        /* =========================
           DELETE
        ========================= */

        if (deleteBudgetBtn) {

            deleteBudgetBtn.addEventListener(
                "click",
                deleteBudget
            );
        }


        /* =========================
           CHANGE MONTH
        ========================= */

        if (budgetMonthInput) {

            budgetMonthInput.addEventListener(
                "change",
                loadBudget
            );
        }


        /* =========================
           CHANGE YEAR
        ========================= */

        if (budgetYearInput) {

            budgetYearInput.addEventListener(
                "change",
                loadBudget
            );
        }

    }
);