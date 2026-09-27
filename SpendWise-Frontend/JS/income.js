const INCOME_API_URL =
    "https://spendwise-api.runasp.net/api/Income";


async function addIncome() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "Login.html";
        return;
    }

    const incomeInput =
        document.getElementById("incomeAmount");

    const amount =
        parseFloat(incomeInput.value);

    if (!amount || amount <= 0) {

        showToast(
            "Please enter a valid income amount.",
            "error"
        );

        return;
    }

    const incomeData = {
        amount: amount,
        incomeTime: new Date().toISOString()
    };

    try {

        const saveButton =
            document.getElementById("saveIncomeBtn");

        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        const response = await fetch(
            INCOME_API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(incomeData)
            }
        );

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        const result =
            await response.json().catch(() => null);

        if (!response.ok) {

            throw new Error(
                result?.message ||
                "Failed to add income."
            );
        }

        console.log("Income added:", result);

        incomeInput.value = "";

        showToast(
            "Income added successfully.",
            "success"
        );

    }
    catch (error) {

        console.error(
            "Income Error:",
            error
        );

        showToast(
            error.message ||
            "Unable to add income.",
            "error"
        );

    }
    finally {

        const saveButton =
            document.getElementById("saveIncomeBtn");

        saveButton.disabled = false;
        saveButton.textContent = "Save Income";
    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const saveIncomeBtn =
            document.getElementById("saveIncomeBtn");

        if (saveIncomeBtn) {

            saveIncomeBtn.addEventListener(
                "click",
                addIncome
            );
        }
    }
);