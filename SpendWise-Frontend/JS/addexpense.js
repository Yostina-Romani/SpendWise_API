const form = document.getElementById("addexpense");
form.addEventListener("submit", async function (event) {

    event.preventDefault();
    const expenseamount =Number( document.getElementById("expenseamount").value);
    const expensetime = document.getElementById("expensetime").value;
    const categoryId=Number( document.getElementById("categoryid").value);
    const token =localStorage.getItem("token")

    const response = await fetch("http://localhost:5253/api/Expenses/addExpense", {
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
