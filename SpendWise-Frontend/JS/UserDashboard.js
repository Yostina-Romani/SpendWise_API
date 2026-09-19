document.addEventListener("DOMContentLoaded", () => {


const API_URL = "http://127.0.0.1:5253/api/UserDashboard";

const token = localStorage.getItem("token");

let categoryChart = null;


/* =========================================
   CHECK LOGIN
========================================= */

if (!token) {

    window.location.href = "./Login.html";

    return;
}


/* =========================================
   DOM ELEMENTS
========================================= */

const userName = document.getElementById("userName");

const totalBalance = document.getElementById("totalBalance");
const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const monthlyBudget = document.getElementById("monthlyBudget");

const monthlyExpense = document.getElementById("monthlyExpense");
const remainingBudget = document.getElementById("remainingBudget");

const budgetProgress = document.getElementById("budgetProgress");
const budgetPercentage = document.getElementById("budgetPercentage");
const budgetMessage = document.getElementById("budgetMessage");

const categoryList = document.getElementById("categoryList");
const recentExpenses = document.getElementById("recentExpenses");

const currentMonth = document.getElementById("currentMonth");


/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(amount) {

    const number = Number(amount) || 0;

    return `${number.toLocaleString("en-EG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })} EGP`;
}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString("en-EG", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


/* =========================================
   CURRENT MONTH
========================================= */

function displayCurrentMonth() {

    const now = new Date();

    currentMonth.textContent = now.toLocaleDateString(
        "en-EG",
        {
            month: "long",
            year: "numeric"
        }
    );
}


/* =========================================
   LOAD DASHBOARD
========================================= */

async function loadDashboard() {

    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

        });


        /* =========================
           UNAUTHORIZED
        ========================= */

        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "./Login.html";

            return;
        }


        /* =========================
           OTHER ERRORS
        ========================= */

        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );
        }


        /* =========================
           JSON
        ========================= */

        const data = await response.json();

        console.log("Dashboard Data:", data);


        /* =========================
           UPDATE UI
        ========================= */

        updateUser(data.user);

        updateSummary(data.summary);

        updateBudget(data.budget);

        updateCategories(data.categoryBreakdown);

        updateRecentExpenses(data.recentExpenses);

    }
    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        showDashboardError();
    }
}


/* =========================================
   USER
========================================= */

function updateUser(user) {

    if (!user) {
        return;
    }

    userName.textContent = user.name || "User";
}


/* =========================================
   SUMMARY
========================================= */

function updateSummary(summary) {

    if (!summary) {
        return;
    }

    totalBalance.textContent =
        formatMoney(summary.balance);

    totalIncome.textContent =
        formatMoney(summary.totalIncome);

    totalExpenses.textContent =
        formatMoney(summary.totalExpenses);
}


/* =========================================
   BUDGET
========================================= */

function updateBudget(budget) {

    if (!budget) {
        return;
    }


    monthlyBudget.textContent =
        formatMoney(budget.monthlyBudget);


    monthlyExpense.textContent =
        `${formatMoney(budget.monthlyExpense)} spent`;


    remainingBudget.textContent =
        `${formatMoney(budget.remaining)} remaining`;


    /*
        Backend sends budgetPercentage.

        In your current backend:
        budgetPercentage =
        remaining percentage.
    */

    let percentage =
        Number(budget.budgetPercentage) || 0;


    /*
        Keep the progress between 0 and 100.
    */

    percentage =
        Math.max(0, Math.min(100, percentage));


    budgetProgress.style.width =
        `${percentage}%`;


    budgetPercentage.textContent =
        `${percentage.toFixed(0)}% remaining`;


    /* =========================
       MESSAGE
    ========================= */

    if (budget.monthlyBudget <= 0) {

        budgetMessage.innerHTML = `
            <i class="bi bi-info-circle"></i>
            <span>
                You haven't set a monthly budget yet.
            </span>
        `;

        return;
    }


    if (budget.remaining < 0) {

        budgetMessage.innerHTML = `
            <i class="bi bi-exclamation-triangle"></i>
            <span>
                You have exceeded your monthly budget.
            </span>
        `;

        return;
    }


    if (percentage <= 20) {

        budgetMessage.innerHTML = `
            <i class="bi bi-exclamation-circle"></i>
            <span>
                You're close to your monthly budget limit.
            </span>
        `;

        return;
    }


    budgetMessage.innerHTML = `
        <i class="bi bi-check-circle"></i>
        <span>
            You're keeping track of your spending.
        </span>
    `;
}


/* =========================================
   CATEGORY BREAKDOWN
========================================= */

function updateCategories(categories) {

    categoryList.innerHTML = "";


    if (!categories || categories.length === 0) {

        categoryList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-bar-chart"></i>
                <p>
                    No category expenses yet.
                </p>
            </div>
        `;

        createCategoryChart([], []);

        return;
    }


    /* =========================
       CREATE LIST
    ========================= */

    categories.forEach((category, index) => {

        const item = document.createElement("div");

        item.className = "category-item";


        item.innerHTML = `

            <div class="category-item-left">

                <span
                    class="category-dot"
                    style="background: ${getChartColor(index)}">
                </span>

                <span class="category-name">
                    ${escapeHtml(
                        category.categoryName || "Unknown"
                    )}
                </span>

            </div>

            <span class="category-amount">
                ${formatMoney(category.totalAmount)}
            </span>

        `;


        categoryList.appendChild(item);
    });


    /* =========================
       CHART DATA
    ========================= */

    const labels = categories.map(
        category =>
            category.categoryName || "Unknown"
    );


    const values = categories.map(
        category =>
            Number(category.totalAmount) || 0
    );


    createCategoryChart(labels, values);
}


/* =========================================
   CATEGORY CHART
========================================= */

function createCategoryChart(labels, values) {

    const canvas =
        document.getElementById("categoryChart");


    if (!canvas) {
        return;
    }


    if (categoryChart) {

        categoryChart.destroy();
    }


    categoryChart = new Chart(
        canvas,
        {
            type: "doughnut",

            data: {

                labels: labels,

                datasets: [
                    {
                        data: values,

                        backgroundColor: [
                            "#6366f1",
                            "#a855f7",
                            "#ec4899",
                            "#14b8a6",
                            "#f59e0b",
                            "#ef4444",
                            "#3b82f6",
                            "#8b5cf6"
                        ],

                        borderWidth: 0
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "70%",

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                return ` ${formatMoney(
                                    context.raw
                                )}`;

                            }

                        }

                    }

                }
            }
        }
    );
}


/* =========================================
   CHART COLORS
========================================= */

function getChartColor(index) {

    const colors = [
        "#6366f1",
        "#a855f7",
        "#ec4899",
        "#14b8a6",
        "#f59e0b",
        "#ef4444",
        "#3b82f6",
        "#8b5cf6"
    ];

    return colors[
        index % colors.length
    ];
}


/* =========================================
   RECENT EXPENSES
========================================= */

function updateRecentExpenses(expenses) {

    recentExpenses.innerHTML = "";


    if (!expenses || expenses.length === 0) {

        recentExpenses.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-receipt"></i>

                <p>
                    No expenses recorded yet.
                </p>
            </div>
        `;

        return;
    }


    expenses.forEach(expense => {

        const item =
            document.createElement("div");


        item.className =
            "transaction-item";


        const category =
            expense.category || "Unknown";


        const imageUrl =
            expense.categoryUrl;


        let iconHtml = `
            <i class="bi bi-receipt"></i>
        `;


        if (imageUrl) {

            iconHtml = `
                <img
                    src="${escapeHtml(imageUrl)}"
                    alt="${escapeHtml(category)}"
                    onerror="this.style.display='none';"
                >
            `;
        }


        item.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon">
                    ${iconHtml}
                </div>

                <div class="transaction-info">

                    <p class="transaction-category">
                        ${escapeHtml(category)}
                    </p>

                    <p class="transaction-date">
                        ${formatDate(
                            expense.expenseTime
                        )}
                    </p>

                </div>

            </div>


            <span class="transaction-amount">
                - ${formatMoney(
                    expense.expenseamount
                )}
            </span>

        `;


        recentExpenses.appendChild(item);
    });
}


/* =========================================
   ERROR STATE
========================================= */

function showDashboardError() {

    recentExpenses.innerHTML = `
        <div class="error-state">

            <i class="bi bi-exclamation-circle"></i>

            <p>
                We couldn't load your dashboard data.
            </p>

            <p>
                Please check that the API is running.
            </p>

        </div>
    `;
}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   START
========================================= */

displayCurrentMonth();

loadDashboard();


});
