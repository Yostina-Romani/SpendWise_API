const form=document.getElementById("catform");
form.addEventListener("submit",async function (event) {
    event.preventDefault();
    const catname=document.getElementById("catname").value.trim();
    const catdescription=document.getElementById("catdescription").value.trim();
    const image=document.getElementById("catimage").files[0];
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
    const formdata=new FormData();
    formdata.append("categoryNmae",catname);
    formdata.append("CategoryDescription",catdescription);
    if(image){
    formdata.append("image",image);

    }
 const response= await fetch("http://127.0.0.1:5253/api/Category/addCategory",{
    method:"Post",
    headers:{
        "Authorization":`Bearer ${token}`,
    },
    body:formdata
 });

 const text=await response.text();

    if(!response.ok){
        console.log("status",response.status);
        return;
    }
    const data=JSON.parse(text);
    alert(data.message);
    window.location.href="categories.html";

});



function showError(elementid,message){
    document.getElementById(elementid).textContent=message;
}