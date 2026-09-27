const form = document.getElementById("editCategory");

const nameInput = document.getElementById("namecat");
const descriptionInput = document.getElementById("catdescription");
const imageInput = document.getElementById("categoryImage");

const currentImage = document.getElementById("currentImage");
const noCurrentImage = document.getElementById("noCurrentImage");

const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");

const imagePreview =
    document.getElementById("imagePreview");

const saveButton =
    document.getElementById("saveButton");


// =========================
// Get Category ID
// =========================

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("FULL URL:", window.location.href);
console.log("CATEGORY ID:", id);


// =========================
// Check ID
// =========================

if (!id) {
    alert("Category ID is missing.");
    window.location.href = "./categories.html";
}


// =========================
// Load Category
// =========================

async function loadCategory() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "./Login.html";
        return;
    }

    try {

        const response = await fetch(
            `https://spendwise-api.runasp.net/api/Category/getcategories`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const categories = await response.json();

        if (!response.ok) {
            console.log(categories);
            alert("Failed to load categories.");
            return;
        }

        // Find category by ID
        const category = categories.find(
            c => c.categoryID == id
        );

        if (!category) {
            alert("Category not found.");
            window.location.href = "./categories.html";
            return;
        }

        console.log("CATEGORY:", category);

        // Fill form
        nameInput.value = category.categoryNmae || "";

        descriptionInput.value =
            category.CategoryDescription || "";

        // Display current image
        if (category.imageURL) {

            currentImage.src =
                `https://spendwise-api.runasp.net${category.imageURL}`;

            currentImage.classList.remove("d-none");

            noCurrentImage.classList.add("d-none");

        } else {

            currentImage.classList.add("d-none");

            noCurrentImage.classList.remove("d-none");
        }

    } catch (error) {

        console.error("Load category error:", error);

        alert("Something went wrong while loading the category.");
    }
}


// =========================
// Image Preview
// =========================

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {

        imagePreviewContainer.classList.add("d-none");

        imagePreview.src = "";

        return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image.");

        imageInput.value = "";

        imagePreviewContainer.classList.add("d-none");

        return;
    }

    // Preview
    const imageURL = URL.createObjectURL(file);

    imagePreview.src = imageURL;

    imagePreviewContainer.classList.remove("d-none");
});


// =========================
// Submit Form
// =========================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        nameInput.value.trim();

    const description =
        descriptionInput.value.trim();


    // =========================
    // Validation
    // =========================

    if (name === "") {

        showError(
            "namecat",
            "This field is required"
        );

        return;

    } else {

        showError(
            "namecat",
            ""
        );
    }


    if (description === "") {

        showError(
            "catdescription",
            "This field is required"
        );

        return;

    } else {

        showError(
            "catdescription",
            ""
        );
    }


    // =========================
    // Token
    // =========================

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert("Please login first.");

        window.location.href =
            "./Login.html";

        return;
    }


    // =========================
    // FormData
    // =========================

    const formData = new FormData();

    formData.append(
        "categoryNmae",
        name
    );

    formData.append(
        "CategoryDescription",
        description
    );


    // Add image only if user selected a new one
    if (imageInput.files.length > 0) {

        formData.append(
            "image",
            imageInput.files[0]
        );
    }


    // =========================
    // Disable Button
    // =========================

    saveButton.disabled = true;

    saveButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2"></span>
        Saving...
    `;


    try {

        const response = await fetch(
            `https://spendwise-api.runasp.net/api/Category/${id}`,
            {
                method: "PUT",

                headers: {
                    "Authorization": `Bearer ${token}`
                },

                body: formData
            }
        );


        const data =
            await response.json();


        console.log("STATUS:", response.status);
        console.log("RESPONSE:", data);


        if (!response.ok) {

            alert(
                data.message ||
                data.Message ||
                "Failed to update category."
            );

            return;
        }


        // =========================
        // Success
        // =========================

        alert(
            data.message ||
            "Category updated successfully."
        );

        window.location.href =
            "./categories.html";


    } catch (error) {

        console.error(
            "Update category error:",
            error
        );

        alert(
            "Something went wrong while updating the category."
        );

    } finally {

        saveButton.disabled = false;

        saveButton.innerHTML = `
            <i class="bi bi-check2-circle me-2"></i>
            Save Changes
        `;
    }
});


// =========================
// Show Error
// =========================

function showError(elementid, message) {

    const element =
        document.getElementById(elementid);

    // Your HTML currently doesn't have
    // separate error spans, so we can use
    // Bootstrap validation styling.

    if (message) {

        element.classList.add("is-invalid");

    } else {

        element.classList.remove("is-invalid");
    }
}


// =========================
// Load category when page opens
// =========================

loadCategory();