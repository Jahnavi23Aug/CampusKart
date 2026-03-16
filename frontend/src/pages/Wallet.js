import React, {useEffect, useState} from "react";
import axios from "axios";

function Wallet(){

const [balance,setBalance] = useState(0);

useEffect(()=>{

axios.get("http://localhost:5000/wallet")
.then(res=>{
setBalance(res.data.balance);
});

},[]);

return(

<div style={{padding:"30px"}}>

<h2>My Wallet</h2>

<h3>Balance: ₹{balance}</h3>

</div>

)

}

export default Wallet;