const form=document.getElementById("resetPasswordEmail");
form.addEventListener("submit",async function(event){
event.preventDefault();
const email=document.getElementById("email").value;
const response=await fetch("https://spendwise-api.runasp.net/api/Auth/forgetPassword",{

    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        email:email
    })
});
const data=await response.json();
if(!response.ok){
    return(data.message);
}
return(data.message);

});