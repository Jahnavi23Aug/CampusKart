import React,{useState} from "react";
import axios from "axios";

function Signup(){

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [pan,setPan] = useState(null);
 const [studentId,setStudentId] = useState(null);

 const register = async () => {
  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("pan", pan);
    formData.append("student_id", studentId);

    const res = await axios.post(
      "https://campuskart-3.onrender.com/signup",
      formData
    );

    alert(res.data.message);
  } catch (err) {
    console.error(err);
    alert("Signup failed ❌");
  }
};

 return(

  <div style={{padding:"40px"}}>

   <h2>Student Signup</h2>

   <input placeholder="Name"
   onChange={(e)=>setName(e.target.value)} />

   <br/><br/>

   <input placeholder="Email"
   onChange={(e)=>setEmail(e.target.value)} />

   <br/><br/>

   <input type="password"
   placeholder="Password"
   onChange={(e)=>setPassword(e.target.value)} />

   <br/><br/>

   <label>PAN Card Upload</label>
   <input type="file"
   onChange={(e)=>setPan(e.target.files[0])} />

   <br/><br/>

   <label>Student ID Upload</label>
   <input type="file"
   onChange={(e)=>setStudentId(e.target.files[0])} />

   <br/><br/>

   <button onClick={register}>
     Signup
   </button>

  </div>

 );

}

export default Signup;
