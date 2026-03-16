import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function BookChat({ book, closeChat }) {

const [message,setMessage] = useState("");
const [messages,setMessages] = useState([]);

const room = book.title;

useEffect(()=>{

socket.emit("join_book_chat",{room});

socket.on("receive_book_message",(data)=>{
setMessages((prev)=>[...prev,data]);
});

return ()=>{
socket.off("receive_book_message");
};

},[room]);

const sendMessage = ()=>{

if(message.trim()==="") return;

socket.emit("send_book_message",{
room: room,
user: "Buyer",
text: message
});

setMessage("");

};

return(

<div style={{
position:"fixed",
bottom:"20px",
right:"20px",
width:"300px",
background:"white",
border:"1px solid #ccc",
borderRadius:"10px",
boxShadow:"0 0 10px rgba(0,0,0,0.2)"
}}>

{/* Header */}

<div style={{
background:"#4CAF50",
color:"white",
padding:"10px",
borderTopLeftRadius:"10px",
borderTopRightRadius:"10px",
display:"flex",
justifyContent:"space-between"
}}>

<span>Chat with {book.seller}</span>

<button
onClick={closeChat}
style={{
background:"transparent",
border:"none",
color:"white",
fontSize:"16px",
cursor:"pointer"
}}
>
X
</button>

</div>

{/* Messages */}

<div style={{
height:"200px",
overflowY:"auto",
padding:"10px"
}}>

{messages.map((msg,index)=>(
<div key={index}>
<b>{msg.user}</b>: {msg.text}
</div>
))}

</div>

{/* Input */}

<div style={{display:"flex",padding:"10px"}}>

<input
style={{flex:1}}
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Type message..."
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</div>

);

}

export default BookChat;