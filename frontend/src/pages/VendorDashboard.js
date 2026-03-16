import React, {useState} from "react";
import axios from "axios";

function VendorDashboard(){

const [name,setName] = useState("");
const [price,setPrice] = useState("");

const addProduct = ()=>{

axios.post("http://localhost:5000/vendor/product",{

name:name,
category:"Food",
price:price,
discount:10,
image:"/images/burger.jpg"

})

alert("Product Added")

}

return(

<div style={{padding:"30px"}}>

<h2>Vendor Dashboard</h2>

<input
placeholder="Product Name"
onChange={(e)=>setName(e.target.value)}
/>

<br/><br/>

<input
placeholder="Price"
onChange={(e)=>setPrice(e.target.value)}
/>

<br/><br/>

<button onClick={addProduct}>
Add Product
</button>

</div>

)

}

export default VendorDashboard;