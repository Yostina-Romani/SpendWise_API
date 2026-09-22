/* =========================================================
   SPENDWISE ADMIN DASHBOARD
========================================================= */

const API_URL =
    "https://spendwise-api.runasp.net/api/AdminDashboard";

const BACKEND_URL =
    "";


/* =========================================================
   ELEMENTS
========================================================= */

const sidebar =
    document.getElementById("adminSidebar");

const sidebarToggle =
    document.getElementById("sidebarToggle");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const sidebarLogoutBtn =
    document.getElementById("sidebarLogoutBtn");

const sidebarThemeBtn =
    document.getElementById("sidebarThemeBtn");

const topThemeBtn =
    document.getElementById("topThemeBtn");

const retryDashboardBtn =
    document.getElementById("retryDashboardBtn");

const dashboardError =
    document.getElementById("dashboardError");

const dashboardErrorMessage =
    document.getElementById(
        "dashboardErrorMessage"
    );


/* =========================================================
   TOKEN
========================================================= */

function getToken() {
    return localStorage.getItem("token");
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "./login.html";
}


if (sidebarLogoutBtn) {

    sidebarLogoutBtn.addEventListener(
        "click",
        logout
    );
}


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

    if (sidebar) {
        sidebar.classList.add("open");
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.add("show");
    }
}


function closeSidebar() {

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("show");
    }
}


if (sidebarToggle) {

    sidebarToggle.addEventListener(
        "click",
        openSidebar
    );
}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );
}


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {

    const currentTheme =
        document.documentElement.getAttribute(
            "data-theme"
        );

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

    updateThemeIcons(
        newTheme
    );
}


function updateThemeIcons(theme) {

    const icons =
        document.querySelectorAll(
            "#sidebarThemeBtn i, #topThemeBtn i"
        );

    icons.forEach(icon => {

        if (theme === "dark") {

            icon.className =
                "bi bi-sun";

        } else {

            icon.className =
                "bi bi-moon-stars";
        }

    });
}


if (sidebarThemeBtn) {

    sidebarThemeBtn.addEventListener(
        "click",
        toggleTheme
    );
}


if (topThemeBtn) {

    topThemeBtn.addEventListener(
        "click",
        toggleTheme
    );
}


/* =========================================================
   DATE
========================================================= */

function setCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );

    if (!element) {
        return;
    }

    const now =
        new Date();

    element.textContent =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
}


/* =========================================================
   MONEY
========================================================= */

function formatMoney(value) {

    const amount =
        Number(value || 0);

    return amount.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


/* =========================================================
   NUMBER
========================================================= */

function formatNumber(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US"
    );
}


/* =========================================================
   UPDATE ADMIN NAME
========================================================= */

function updateAdminName(data) {

    const name =
        data?.admin?.name ||
        "Admin";

    const adminName =
        document.getElementById(
            "adminName"
        );

    const welcomeName =
        document.getElementById(
            "welcomeName"
        );

    if (adminName) {

        adminName.textContent =
            name;
    }

    if (welcomeName) {

        welcomeName.textContent =
            name;
    }
}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats(data) {

    const summary =
        data?.summary || {};


    const totalUsers =
        summary.totalUsers ?? 0;


    const totalExpenses =
        summary.totalExpenses ?? 0;


    const totalExpenseAmount =
        summary.totalExpenseAmount ?? 0;


    const totalIncome =
        summary.totalIncome ?? 0;


    const totalIncomeAmount =
        summary.totalIncomeAmount ?? 0;


    const totalCategories =
        summary.totalCategories ?? 0;


    /* Users */

    const usersElement =
        document.getElementById(
            "totalUsers"
        );

    if (usersElement) {

        usersElement.textContent =
            formatNumber(
                totalUsers
            );
    }


    /* Expenses */

    const expensesElement =
        document.getElementById(
            "totalExpenses"
        );

    if (expensesElement) {

        expensesElement.textContent =
            `$${formatMoney(
                totalExpenseAmount
            )}`;
    }


    /* Income */

    const incomeElement =
        document.getElementById(
            "totalIncome"
        );

    if (incomeElement) {

        incomeElement.textContent =
            `$${formatMoney(
                totalIncomeAmount
            )}`;
    }


    /* Categories */

    const categoriesElement =
        document.getElementById(
            "totalCategories"
        );

    if (categoriesElement) {

        categoriesElement.textContent =
            formatNumber(
                totalCategories
            );
    }


    updateOverview(
        totalIncomeAmount,
        totalExpenseAmount
    );
}


/* =========================================================
   OVERVIEW
========================================================= */

function updateOverview(
    income,
    expenses
) {

    const incomeAmount =
        Number(income || 0);

    const expenseAmount =
        Number(expenses || 0);


    const balance =
        incomeAmount -
        expenseAmount;


    const ratio =
        incomeAmount > 0
            ? (
                expenseAmount /
                incomeAmount
            ) * 100
            : 0;


    const safeRatio =
        Math.min(
            100,
            Math.max(
                0,
                ratio
            )
        );


    const overviewExpenses =
        document.getElementById(
            "overviewExpenses"
        );

    if (overviewExpenses) {

        overviewExpenses.textContent =
            `$${formatMoney(
                expenseAmount
            )}`;
    }


    const overviewIncome =
        document.getElementById(
            "overviewIncome"
        );

    if (overviewIncome) {

        overviewIncome.textContent =
            `$${formatMoney(
                incomeAmount
            )}`;
    }


    const overviewSpent =
        document.getElementById(
            "overviewSpent"
        );

    if (overviewSpent) {

        overviewSpent.textContent =
            `$${formatMoney(
                expenseAmount
            )}`;
    }


    const overviewBalance =
        document.getElementById(
            "overviewBalance"
        );

    if (overviewBalance) {

        overviewBalance.textContent =
            `$${formatMoney(
                balance
            )}`;
    }


    const expenseRatio =
        document.getElementById(
            "expenseRatio"
        );

    if (expenseRatio) {

        expenseRatio.textContent =
            `${safeRatio.toFixed(0)}%`;
    }


    const expenseProgress =
        document.getElementById(
            "expenseProgress"
        );

    if (expenseProgress) {

        expenseProgress.style.width =
            `${safeRatio}%`;
    }
}


/* =========================================================
   BUDGET
========================================================= */

function updateBudget(data) {

    const budget =
        data?.budget || {};


    const monthlyBudget =
        Number(
            budget.monthlyBudget || 0
        );


    const monthlyExpenses =
        Number(
            budget.monthlyExpenses || 0
        );


    const remaining =
        Number(
            budget.remaining || 0
        );


    const usedPercentage =
        Number(
            budget.usedPercentage || 0
        );


    const monthlyBudgetElement =
        document.getElementById(
            "monthlyBudget"
        );

    if (monthlyBudgetElement) {

        monthlyBudgetElement.textContent =
            `$${formatMoney(
                monthlyBudget
            )}`;
    }


    const monthlyExpensesElement =
        document.getElementById(
            "monthlyExpenses"
        );

    if (monthlyExpensesElement) {

        monthlyExpensesElement.textContent =
            `$${formatMoney(
                monthlyExpenses
            )}`;
    }


    const remainingElement =
        document.getElementById(
            "remainingBudget"
        );

    if (remainingElement) {

        remainingElement.textContent =
            `$${formatMoney(
                Math.max(
                    0,
                    remaining
                )
            )}`;
    }


    const percentageElement =
        document.getElementById(
            "budgetPercentage"
        );

    if (percentageElement) {

        percentageElement.textContent =
            `${usedPercentage.toFixed(0)}%`;
    }


    updateBudgetCircle(
        usedPercentage
    );
}


/* =========================================================
   BUDGET CIRCLE
========================================================= */

function updateBudgetCircle(
    percentage
) {

    const circle =
        document.querySelector(
            ".budget-circle"
        );

    if (!circle) {
        return;
    }


    const safePercentage =
        Math.min(
            100,
            Math.max(
                0,
                Number(
                    percentage || 0
                )
            )
        );


    const degrees =
        safePercentage * 3.6;


    circle.style.background =
        `conic-gradient(
            #7c3aed 0deg,
            #ec4899 ${degrees}deg,
            #eeeaf5 ${degrees}deg
        )`;
}


/* =========================================================
   RECENT EXPENSES
========================================================= */

function updateRecentExpenses(
    expenses
) {

    const tbody =
        document.getElementById(
            "recentExpensesBody"
        );

    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (
        !Array.isArray(expenses) ||
        expenses.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="table-loading">
                    No recent expenses found.
                </td>
            </tr>
        `;

        return;
    }


    expenses
        .slice(0, 5)
        .forEach(expense => {

            const category =
                expense.category || {};


            const imageUrl =
                getImageUrl(
                    category.imageURL
                );


            const row =
                document.createElement(
                    "tr"
                );


            const categoryName =
                escapeHtml(
                    category.categoryNmae ||
                    "Unknown"
                );


            row.innerHTML = `
                <td>

                    <div
                        class="category-table-cell">

                        ${
                            imageUrl
                                ? `
                                    <img
                                        src="${imageUrl}"
                                        class="category-mini-image"
                                        alt="${categoryName}">
                                  `
                                : `
                                    <div
                                        class="category-mini-image
                                               d-flex
                                               align-items-center
                                               justify-content-center">

                                        <i
                                            class="bi bi-tag">
                                        </i>

                                    </div>
                                  `
                        }

                        <strong>
                            ${categoryName}
                        </strong>

                    </div>

                </td>

                <td class="amount-cell">

                    $${formatMoney(
                        expense.expenseAmount
                    )}

                </td>

                <td class="date-cell">

                    ${formatDate(
                        expense.expenseTime
                    )}

                </td>

                <td>

                    <span
                        class="status-pill">

                        Recorded

                    </span>

                </td>
            `;


            tbody.appendChild(
                row
            );

        });
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   IMAGE URL
========================================================= */

function getImageUrl(
    imageUrl
) {

    if (!imageUrl) {
        return null;
    }


    if (
        imageUrl.startsWith(
            "http://"
        ) ||
        imageUrl.startsWith(
            "https://"
        )
    ) {

        return imageUrl;
    }


    if (
        imageUrl.startsWith("/")
    ) {

        return BACKEND_URL +
            imageUrl;
    }


    return BACKEND_URL +
        "/" +
        imageUrl;
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
    value
) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

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
   ERROR
========================================================= */

function showDashboardError(
    message
) {

    if (!dashboardError) {
        return;
    }


    dashboardError.hidden =
        false;


    if (dashboardErrorMessage) {

        dashboardErrorMessage.textContent =
            message ||
            "Unable to load dashboard data.";
    }
}


/* =========================================================
   LOAD DASHBOARD
========================================================= */

async function loadDashboard() {

    if (dashboardError) {

        dashboardError.hidden =
            true;
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


        console.log(
            "Admin Dashboard Status:",
            response.status
        );


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "./login.html";

            return;
        }


        if (
            response.status === 403
        ) {

            showDashboardError(
                "You are not authorized to access the Admin Dashboard."
            );

            return;
        }


        if (!response.ok) {

            const errorData =
                await response
                    .json()
                    .catch(
                        () => null
                    );


            throw new Error(
                errorData?.message ||
                `Request failed with status ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "Admin Dashboard Data:",
            data
        );


        updateAdminName(
            data
        );


        updateStats(
            data
        );


        updateBudget(
            data
        );


        updateRecentExpenses(
            data.recentExpenses || []
        );


    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );


        showDashboardError(
            error.message
        );
    }
}


/* =========================================================
   RETRY
========================================================= */

if (retryDashboardBtn) {

    retryDashboardBtn.addEventListener(
        "click",
        loadDashboard
    );
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setCurrentDate();


        const savedTheme =
            localStorage.getItem(
                "theme"
            );


        if (savedTheme) {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    savedTheme
                );

            updateThemeIcons(
                savedTheme
            );
        }


        loadDashboard();
    }
);