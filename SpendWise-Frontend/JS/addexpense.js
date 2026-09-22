
async function getCategories() {
    try{
const response=await fetch("https://spendwise-api.runasp.net/api/Category/getcategories");
    if(!response.ok){
        throw new Error("Failed to load categories");
        
    }
    const categories=await response.json();
    const categorySelect=document.getElementById("categoryid");
    categories.forEach(cat => {
        const option=document.createElement("option");
        option.value=cat.categoryID;
        option.textContent=cat.categoryNmae;
        categorySelect.appendChild(option);
    });}
    catch(error){
        console.error("Error loading categories:",error);
    }
    
}
getCategories();

const form = document.getElementById("addexpense");
form.addEventListener("submit", async function (event) {

    event.preventDefault();
    const expenseamount =Number( document.getElementById("expenseamount").value);
    const expensetime = document.getElementById("expensetime").value;
    const categoryId=Number( document.getElementById("categoryid").value);
    const token =localStorage.getItem("token")

    const response = await fetch("https://spendwise-api.runasp.net/api/Expenses/addExpense", {
        method: "POST",
        headers: {
            "content-type":"application/json",
            "Authorization":`Bearer ${token}`,
        },
        body: JSON.stringify ({
        expenseAmount:expenseamount,
        expenseTime:expensetime,
        categoryId:categoryId,

        })

    });
const data=await response.json();
if(!response.ok){
console.log(data);
console.log(response.status);
return;
}
alert(data.massege);

});
