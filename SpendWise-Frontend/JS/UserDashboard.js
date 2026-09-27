document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "https://spendwise-api.runasp.net/api/UserDashboard";
    const API_BASE_URL = "https://spendwise-api.runasp.net";

    const token = localStorage.getItem("token");

    let categoryChart = null;

    // =========================
    // Authentication
    // =========================

    if (!token) {
        window.location.href = "./Login.html";
        return;
    }

    // =========================
    // DOM Elements
    // =========================

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


    // =========================
    // Format Money
    // =========================

    function formatMoney(amount) {

        const number = Number(amount) || 0;

        return `${number.toLocaleString("en-EG", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })} EGP`;
    }


    // =========================
    // Format Date
    // =========================

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


    // =========================
    // Display Current Month
    // =========================

    function displayCurrentMonth() {

        if (!currentMonth) {
            return;
        }

        const now = new Date();

        currentMonth.textContent = now.toLocaleDateString("en-EG", {
            month: "long",
            year: "numeric"
        });
    }


    // =========================
    // Convert Image URL
    // =========================

    function getImageUrl(imageUrl) {

        if (!imageUrl) {
            return null;
        }

        imageUrl = String(imageUrl).trim();

        if (!imageUrl) {
            return null;
        }

        // Already a complete URL
        if (
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
        ) {
            return imageUrl;
        }

        // Relative URL from API
        if (imageUrl.startsWith("/")) {
            return `${API_BASE_URL}${imageUrl}`;
        }

        // Relative URL without /
        return `${API_BASE_URL}/${imageUrl}`;
    }


    // =========================
    // Load Dashboard
    // =========================

    async function loadDashboard() {

        try {

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });


            // Unauthorized
            if (response.status === 401) {

                localStorage.removeItem("token");

                window.location.href = "./Login.html";

                return;
            }


            // Other errors
            if (!response.ok) {

                throw new Error(
                    `Request failed with status ${response.status}`
                );
            }


            const data = await response.json();

            console.log("Dashboard Data:", data);

            console.log(
                "Category Breakdown:",
                data.categoryBreakdown
            );


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


    // =========================
    // Update User
    // =========================

    function updateUser(user) {

        if (!user) {
            return;
        }

        if (userName) {
            userName.textContent =
                user.name || "User";
        }
    }


    // =========================
    // Update Summary
    // =========================

    function updateSummary(summary) {

        if (!summary) {
            return;
        }

        if (totalBalance) {
            totalBalance.textContent =
                formatMoney(summary.balance);
        }

        if (totalIncome) {
            totalIncome.textContent =
                formatMoney(summary.totalIncome);
        }

        if (totalExpenses) {
            totalExpenses.textContent =
                formatMoney(summary.totalExpenses);
        }
    }


    // =========================
    // Update Budget
    // =========================

    function updateBudget(budget) {

        if (!budget) {

            if (monthlyBudget) {
                monthlyBudget.textContent = "0";
            }

            if (monthlyExpense) {
                monthlyExpense.textContent = "0";
            }

            if (remainingBudget) {
                remainingBudget.textContent = "0";
            }

            if (budgetPercentage) {
                budgetPercentage.textContent = "0%";
            }

            if (budgetProgress) {
                budgetProgress.style.width = "0%";
            }

            if (budgetMessage) {
                budgetMessage.textContent =
                    "No budget set for this month.";
            }

            return;
        }


        const budgetAmount =
            Number(budget.monthlyBudget) || 0;

        const expenseAmount =
            Number(budget.monthlyExpense) || 0;


        const remaining =
            budgetAmount - expenseAmount;


        const percentage =
            budgetAmount > 0
                ? Math.max(
                    0,
                    Math.min(
                        100,
                        (remaining / budgetAmount) * 100
                    )
                )
                : 0;


        if (monthlyBudget) {

            monthlyBudget.textContent =
                budgetAmount.toFixed(2);
        }


        if (monthlyExpense) {

            monthlyExpense.textContent =
                expenseAmount.toFixed(2);
        }


        if (remainingBudget) {

            remainingBudget.textContent =
                remaining.toFixed(2);
        }


        if (budgetPercentage) {

            budgetPercentage.textContent =
                `${percentage.toFixed(0)}%`;
        }


        if (budgetProgress) {

            budgetProgress.style.width =
                `${percentage}%`;
        }


        if (budgetMessage) {

            if (budgetAmount === 0) {

                budgetMessage.textContent =
                    "No budget set for this month.";

            }
            else if (remaining <= 0) {

                budgetMessage.textContent =
                    "You have exceeded your budget.";

            }
            else if (percentage <= 20) {

                budgetMessage.textContent =
                    "Your remaining budget is low.";

            }
            else {

                budgetMessage.textContent =
                    "You're doing well with your budget.";
            }
        }
    }


    // =========================
    // Update Categories
    // =========================

    function updateCategories(categories) {

        if (!categoryList) {
            return;
        }


        categoryList.innerHTML = "";


        // No categories
        if (
            !categories ||
            categories.length === 0
        ) {

            categoryList.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-bar-chart"></i>
                    <p>No category expenses yet.</p>
                </div>
            `;

            createCategoryChart([], []);

            return;
        }


        // Create category items
        categories.forEach((category, index) => {

            const item =
                document.createElement("div");

            item.className =
                "category-item";


            const categoryName =
                category.categoryName ||
                "Unknown";


            const imageUrl =
                getImageUrl(
                    category.categoryUrl
                );


            // Default icon
            let categoryIconHtml = `
                <span
                    class="category-dot"
                    style="background: ${getChartColor(index)}">
                </span>
            `;


            // Category image
            if (imageUrl) {

                categoryIconHtml = `
                    <img
                        src="${escapeHtml(imageUrl)}"
                        alt="${escapeHtml(categoryName)}"
                        class="category-image"
                        onerror="this.onerror=null; this.style.display='none';"
                    >
                `;
            }


            item.innerHTML = `
                <div class="category-item-left">

                    <div class="category-image-wrapper">
                        ${categoryIconHtml}
                    </div>

                    <span class="category-name">
                        ${escapeHtml(categoryName)}
                    </span>

                </div>

                <span class="category-amount">
                    ${formatMoney(category.totalAmount)}
                </span>
            `;


            categoryList.appendChild(item);
        });


        // Chart data

        const labels =
            categories.map(
                category =>
                    category.categoryName ||
                    "Unknown"
            );


        const values =
            categories.map(
                category =>
                    Number(category.totalAmount) || 0
            );


        createCategoryChart(
            labels,
            values
        );
    }


    // =========================
    // Create Category Chart
    // =========================

    function createCategoryChart(
        labels,
        values
    ) {

        const canvas =
            document.getElementById(
                "categoryChart"
            );


        if (!canvas) {
            return;
        }


        if (categoryChart) {

            categoryChart.destroy();

            categoryChart = null;
        }


        categoryChart =
            new Chart(canvas, {

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

                                label: function (context) {

                                    return ` ${formatMoney(
                                        context.raw
                                    )}`;
                                }
                            }
                        }
                    }
                }
            });
    }


    // =========================
    // Chart Colors
    // =========================

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


    // =========================
    // Update Recent Expenses
    // =========================

    function updateRecentExpenses(expenses) {

        if (!recentExpenses) {
            return;
        }


        recentExpenses.innerHTML = "";


        if (
            !expenses ||
            expenses.length === 0
        ) {

            recentExpenses.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-receipt"></i>
                    <p>No expenses recorded yet.</p>
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
                expense.category ||
                "Unknown";


            const imageUrl =
                getImageUrl(
                    expense.categoryUrl
                );


            let iconHtml = `
                <i class="bi bi-receipt"></i>
            `;


            if (imageUrl) {

                iconHtml = `
                    <img
                        src="${escapeHtml(imageUrl)}"
                        alt="${escapeHtml(category)}"
                        onerror="this.onerror=null; this.style.display='none';"
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


    // =========================
    // Dashboard Error
    // =========================

    function showDashboardError() {

        if (!recentExpenses) {
            return;
        }


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


    // =========================
    // Escape HTML
    // =========================

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }


        return String(value)

            .replaceAll("&", "&amp;")

            .replaceAll("<", "&lt;")

            .replaceAll(">", "&gt;")

            .replaceAll('"', "&quot;")

            .replaceAll("'", "&#039;");
    }


    // =========================
    // Sidebar
    // =========================

    function setupSidebar() {

        const sidebar =
            document.getElementById(
                "dashboardSidebar"
            );


        const overlay =
            document.getElementById(
                "sidebarOverlay"
            );


        const menuToggle =
            document.getElementById(
                "menuToggle"
            );


        if (
            menuToggle &&
            sidebar &&
            overlay
        ) {

            menuToggle.addEventListener(
                "click",
                function () {

                    sidebar.classList.toggle(
                        "sidebar-open"
                    );

                    overlay.classList.toggle(
                        "active"
                    );
                }
            );


            overlay.addEventListener(
                "click",
                function () {

                    sidebar.classList.remove(
                        "sidebar-open"
                    );

                    overlay.classList.remove(
                        "active"
                    );
                }
            );
        }
    }


    // =========================
    // Admin Link
    // =========================

    function setupAdminLink() {

        const adminLink =
            document.getElementById(
                "adminDashboardLink"
            );


        if (!adminLink) {
            return;
        }


        const storedToken =
            localStorage.getItem("token");


        if (!storedToken) {
            return;
        }


        try {

            const payload =
                storedToken.split(".")[1];


            const decodedPayload =
                JSON.parse(

                    atob(
                        payload
                            .replace(/-/g, "+")
                            .replace(/_/g, "/")
                    )
                );


            const role =
                decodedPayload.role ||
                decodedPayload[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ];


            const roles =
                Array.isArray(role)
                    ? role
                    : [role];


            const isAdmin =
                roles.some(
                    r =>
                        String(r)
                            .toLowerCase() ===
                        "admin"
                );


            if (isAdmin) {

                adminLink.style.display =
                    "flex";
            }

        }
        catch (error) {

            console.error(
                "Could not read user role from token:",
                error
            );
        }
    }


    // =========================
    // Logout
    // =========================

    function setupLogout() {

        const sidebarLogoutBtn =
            document.getElementById(
                "sidebarLogoutBtn"
            );


        if (!sidebarLogoutBtn) {
            return;
        }


        sidebarLogoutBtn.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "token"
                );


                window.location.href =
                    "./Home.html";
            }
        );
    }


    // =========================
    // Initialize
    // =========================

    displayCurrentMonth();

    setupSidebar();

    setupAdminLink();

    setupLogout();

    loadDashboard();

});