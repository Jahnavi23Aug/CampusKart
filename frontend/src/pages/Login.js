import React, { useState } from "react";
import axios from "axios";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await axios.post("http://localhost:5000/login",{
        email,
        password
      });

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify({
        name: res.data.name,
        wallet: res.data.wallet
      }));

      alert(res.data.message);

    } catch(err) {

      alert("Invalid login");

    }

  };

  return(

    <div style={{padding:"40px"}}>

      <h2>Student Login</h2>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleLogin}>
        Login
      </button>

    </div>

  );
}

export default Login;