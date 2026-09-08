const token = localStorage.getItem("token");

async function getMyExpenses() {

    const response = await fetch(
        "http://127.0.0.1:5253/api/Expenses/myExpenses",
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

        if (!response.ok) {
            const error = await response.text();
            console.log("Status:", response.status);
            console.log("Error:", error);
            return;
        }
    

    const expenses = await response.json();

    const tableBody = document.getElementById("extablebody");

    expenses.forEach(expense => {

        const row = document.createElement("tr");

        const amountCell = document.createElement("td");
        amountCell.textContent = expense.expenseAmount;

        const dateCell = document.createElement("td");
        dateCell.textContent = expense.expenseTime;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category.categoryNmae;
        const image = document.createElement("img");

        image.src = "http://127.0.0.1:5253" + expense.category.imageURL;
        image.width = 40;

        categoryCell.append(image);

        row.append(amountCell, dateCell, categoryCell);

        tableBody.append(row);
    });
}

getMyExpenses();