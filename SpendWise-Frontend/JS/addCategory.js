const form=document.getElementById("catform");
form.addEventListener("submit",async function (event) {
    event.preventDefault();
    const catname=document.getElementById("catname").value.trim();
    const catdescription=document.getElementById("catdescription").value.trim();
    if(catname===""){
      showError("catname","this field is required");
      return;
    }
    else{
              showError("catname","");

    }
    if(catdescription===""){
       showError("catdescription","this field is required");
       return;
    }
    else{
                      showError("catdescription","");

    }
    const token=localStorage.getItem("token");
    if(!token){
                alert("You must login first");
        return;
    }
 const response= await fetch("http://127.0.0.1:5253/api/Category/addCategory",{
    method:"Post",
    headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token} `,
    },
    body:JSON.stringify({
        
        categoryNmae:catname,
        CategoryDescription:catdescription
    
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