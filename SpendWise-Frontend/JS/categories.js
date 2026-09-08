async function getcategories() {

    const response = await fetch(
        "http://127.0.0.1:5253/api/Category/getcategories"
    );

    const categories = await response.json();

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));

    const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const table = document.getElementById("categoriesTable");

    categories.forEach(category => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${category.categoryID}</td>

            <td>${category.categoryNmae}</td>

            <td>
                ${
                    category.imageURL
                    ? `<img 
                            src="http://127.0.0.1:5253${category.imageURL}"
                            width="60"
                            height="60"
                            style="object-fit: cover; border-radius: 8px;"
                       >`
                    : "No image"
                }
            </td>

            <td>${category.categoryDescription}</td>

            <td>
                ${
                    role === "Admin"
                    ? `
                        <button type="button" class="btn btn-sm btn-primary edit-btn">
                            Edit
                        </button>

                        <button type="button" class="btn btn-sm btn-danger delete-btn">
                            Delete
                        </button>
                      `
                    : ""
                }
            </td>
        `;

        // Only Admin can edit/delete
        if (role === "Admin") {

            const editbutton = row.querySelector(".edit-btn");

            editbutton.addEventListener("click", function () {

                console.log("Clicked ID:", category.categoryID);

                const url =
                    `http://127.0.0.1:5500/HTML/editCategory.html?id=${category.categoryID}`;

                window.location.assign(url);
            });


            const Deletebutton = row.querySelector(".delete-btn");

            Deletebutton.addEventListener("click", function () {

                deleteCategory(category.categoryID);

            });
        }

        table.appendChild(row);
    });
}


async function deleteCategory(id) {

    const Isconfirm =
        confirm("Are you sure you want to delete this category?");

    if (!Isconfirm) {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `http://127.0.0.1:5253/api/Category/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert(data.message);

        window.location.href = "categories.html";

    }
    catch (error) {

        console.error("Delete error:", error);

        alert("Something went wrong.");
    }
}


getcategories();