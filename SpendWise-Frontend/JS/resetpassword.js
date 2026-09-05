const form=document.getElementById("resetPassword");
form.addEventListener("submit",async function(event) {
    event.preventDefault();
    const password=document.getElementById("newPassword").value.trim();
    const confirmPassword=document.getElementById("confirmPassword").value.trim();
    if(password!=confirmPassword){
        alert("Passwords do not match.");
        return;
    }
    const prams=new URLSearchParams(window.location.search)
    const emai=prams.get("email");
    const token=prams.get("token");
    const response=await fetch("http://127.0.0.1:5253/api/Auth/resetPassword",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
             email:emai,
             token:token ,
             password:password
        })

    });
    const data=await response.json();
    if(!response.ok){
      return(data.message);
    }
    return(data.message);
    
});