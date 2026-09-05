const form=document.getElementById("resetPasswordEmail");
form.addEventListener("submit",async function(event){
event.preventDefault();
const email=document.getElementById("email").value;
const response=await fetch("http://127.0.0.1:5253/api/Auth/forgetPassword",{

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