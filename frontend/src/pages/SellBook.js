import React, { useState } from "react";
import axios from "axios";

function SellBook(){

const [title,setTitle]=useState("");
const [price,setPrice]=useState("");
const [seller,setSeller]=useState("");
const [condition,setCondition]=useState("");
const [image,setImage]=useState(null);
const [preview,setPreview]=useState(null);

const handleImageChange = (e)=>{
  const file = e.target.files[0];
  setImage(file);

  if(file){
    setPreview(URL.createObjectURL(file));
  }
}

const handleSubmit = async (e)=>{
  e.preventDefault();

  const formData = new FormData();
  formData.append("title",title);
  formData.append("price",price);
  formData.append("seller",seller);
  formData.append("condition",condition);
  formData.append("image",image);

  await axios.post("http://localhost:5000/books",formData,{
    headers:{
      "Content-Type":"multipart/form-data"
    }
  });

  alert("Book Listed Successfully");

}

return(

<div style={{padding:"30px"}}>

<h2>📤 Sell Used Book</h2>

<form onSubmit={handleSubmit}>

<input
placeholder="Book Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<br/><br/>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<br/><br/>

<input
placeholder="Your Name"
value={seller}
onChange={(e)=>setSeller(e.target.value)}
/>

<br/><br/>

<input
placeholder="Condition"
value={condition}
onChange={(e)=>setCondition(e.target.value)}
/>

<br/><br/>

<input type="file" onChange={handleImageChange} />

<br/><br/>

{preview && (
  <img 
  src={preview} 
  alt="preview"
  style={{width:"150px",borderRadius:"5px"}}
  />
)}

<br/><br/>

<button type="submit">
List Book
</button>

</form>

</div>

)

}

export default SellBook;