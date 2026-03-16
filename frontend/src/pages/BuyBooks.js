import React, { useEffect, useState } from "react";
import axios from "axios";
import BookChat from "./BookChat";

function BuyBooks(){

const [books,setBooks]=useState([]);
const [selectedBook,setSelectedBook]=useState(null);

useEffect(()=>{

axios.get("http://localhost:5000/books")
.then(res=>{
setBooks(res.data);
});

},[]);

return(

<div style={{padding:"30px"}}>

<h2>Buy Second-Hand Books</h2>

<div style={{
display:"flex",
flexWrap:"wrap"
}}>

{books.map((book,index)=>(

<div key={index} style={{
border:"1px solid #ddd",
padding:"15px",
margin:"10px",
width:"250px",
borderRadius:"10px"
}}>

<img
src={`http://localhost:5000${book.image}`}
alt={book.title}
style={{
width:"100%",
height:"150px",
objectFit:"cover",
borderRadius:"5px"
}}
/>

<h3>{book.title}</h3>

<p>Price: ₹{book.price}</p>

<p>Condition: {book.condition}</p>

<p>Seller: {book.seller}</p>

<button
onClick={()=>setSelectedBook(book)}
style={{
background:"#4CAF50",
color:"white",
border:"none",
padding:"8px",
cursor:"pointer",
borderRadius:"5px"
}}
>
Contact Seller
</button>

</div>

))}

</div>

{/* Chat Popup */}

{selectedBook && (

<BookChat
book={selectedBook}
closeChat={()=>setSelectedBook(null)}
/>

)}

</div>

);

}

export default BuyBooks;