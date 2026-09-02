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
const prams=new URLSearchParams(window.location.search);
const id=prams.get("id");
console.log(id);
const response=await fetch(`http://localhost:5253/api/Category/${id}`,{
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