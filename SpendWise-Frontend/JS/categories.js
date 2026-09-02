async function getcategories() {

    const response = await fetch(
        "http://localhost:5253/api/Category/getcategories"
    );

    const categories = await response.json();

    const table = document.getElementById("categoriesTable");

    categories.forEach(category => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${category.categoryID}</td>
            <td>${category.categoryNmae}</td>
            <td>${category.categoryDescription}</td>
            <td>
                <button type="button" class="edit-btn">
                    Edit
                </button>
            </td>
        `;

        const button = row.querySelector(".edit-btn");

        button.addEventListener("click", function () {

            console.log("Clicked ID:", category.categoryID);

            window.location.href =
                `http://localhost:5500/HTML/editCategory.html?id=${category.categoryID}`;
        });

        table.appendChild(row);
    });
}

getcategories();