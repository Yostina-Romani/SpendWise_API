const form=document.getElementById("editCategory");
form.addEventListener("submit",async function(event){
event.preventDefault();
const name=document.getElementById("namecat").value.trim();
const description=document.getElementById("catdescription").value.trim();
if(name===""){
    showError("namecat","this field is required");
    return;
}
else{
        showError("namecat","");

}
if(description===""){
    showError("catdescription","this field is required");
    return;
}
else{
        showError("catdescription","");

}

const token=localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("FULL URL:", window.location.href);
console.log("CATEGORY ID:", id);
const response=await fetch(`https://spendwise-api.runasp.net/api/Category/${id}`,{
    method:"PUT",
    headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
    },
    body:JSON.stringify({
        categoryNmae:name,
         CategoryDescription:description
    })

});

const data=await response.json();
if(!response.ok){

console.log(data);

}

alert(data.message);
});

function showError(elementid,message){
document.getElementById(elementid).textContent=message;
}