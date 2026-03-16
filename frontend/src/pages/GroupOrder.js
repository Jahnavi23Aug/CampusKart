import React, {useState} from "react";
import axios from "axios";

function GroupOrder(){

const [room,setRoom] = useState("");

const createRoom = ()=>{

axios.post("http://localhost:5000/group/create",{

host:"Student"

}).then(res=>{

setRoom(res.data.room_code)

})

}

return(

<div style={{padding:"30px"}}>

<h2>Group Food Order</h2>

<button onClick={createRoom}>
Create Group Order
</button>

{room && (
<p>Room Code: {room}</p>
)}

</div>

)

}

export default GroupOrder;