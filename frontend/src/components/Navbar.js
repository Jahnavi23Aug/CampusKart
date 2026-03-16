import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";


function Navbar({ cartCount }) {

  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);  
  const [showBooks, setShowBooks] = useState(false);
  const [location, setLocation] = useState("Hyderabad");
  const [search, setSearch] = useState("");

  useEffect(() => {
  const loggedUser = localStorage.getItem("user");
  if (loggedUser) {
    setUser(JSON.parse(loggedUser));
  }
}, []);

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500"
  };

  const navbarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 40px",
    background: "#111827",
    color: "white",
    position: "sticky",
    top: "0",
    zIndex: "1000"
  };

  const cartStyle = {
    background: "#2563eb",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    textDecoration: "none"
  };

  return (
    <div style={navbarStyle}>

      {/* LEFT SIDE */}
      <div style={{display:"flex", alignItems:"center", gap:"20px"}}>

        {/* Logo */}
        <Link to="/" style={{color:"white", textDecoration:"none"}}>
          <h2 style={{cursor:"pointer"}}>CampusKart 🛒</h2>
        </Link>

        {/* Location */}
        <div style={{fontSize:"13px" , display:"flex", flexDirection:"column"}}>
          <div style={{display:"flex", alignItems:"center", gap:"5px"}}>
            <IoLocationOutline size={18} />
            <span>Location</span>
            </div>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{padding:"3px", borderRadius:"4px"}}
          >
            <option>Hyderabad</option>
            <option>Warangal</option>
            <option>Vizag</option>
            <option>Vijayawada</option>
            <option>Tirupati</option>
          </select>
        </div>

      </div>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width:"30%",
          padding:"8px",
          borderRadius:"5px",
          border:"none"
        }}
      />

      {/* RIGHT SIDE MENU */}
      <div style={{display:"flex", gap:"25px", alignItems:"center"}}>

        <Link to="/" style={linkStyle}>
          Home
        </Link>

        {/* BOOKS DROPDOWN */}
        <div
          style={{position:"relative"}}
          onMouseEnter={() => setShowBooks(true)}
          onMouseLeave={() => setShowBooks(false)}
        >

          <span style={{cursor:"pointer"}}>Books ▾</span>

          {showBooks && (
            <div style={{
              position:"absolute",
              top:"30px",
              right:"0",
              background:"white",
              color:"black",
              padding:"10px",
              borderRadius:"6px",
              minWidth:"200px",
              boxShadow:"0 4px 10px rgba(0,0,0,0.2)"
            }}>

              <Link
                to="/books/buy"
                style={{display:"block", padding:"8px", color:"black", textDecoration:"none"}}
              >
                📚 Buy Second-Hand Books
              </Link>

              <Link
                to="/books/sell"
                style={{display:"block", padding:"8px", color:"black", textDecoration:"none"}}
              >
                📤 Sell Used Books
              </Link>

            </div>
          )}

        </div>

        {/* Orders */}
        <Link to="/orders" style={linkStyle}>
          Orders 📦
        </Link>

        {/* Cart */}
        <Link to="/cart" style={cartStyle}>
          Cart 🛒 ({cartCount})
        </Link>

        {!user ? (
  <>
    <Link to="/login" style={{color:"white"}}>Login</Link>
    <Link to="/signup" style={{color:"white"}}>Signup</Link>
    <Link to="/dashboard">Dashboard</Link>
  </>
) : (
  <div
    style={{position:"relative"}}
    onMouseEnter={()=>setShowProfile(true)}
    onMouseLeave={()=>setShowProfile(false)}
  >
    <span style={{cursor:"pointer"}}>
      👤 {user.name} ▾
    </span>

    {showProfile && (
      <div style={{
        position:"absolute",
        right:"0",
        top:"30px",
        background:"white",
        color:"black",
        borderRadius:"6px",
        boxShadow:"0 4px 8px rgba(0,0,0,0.2)"
      }}>

        <Link to="/loan" style={{display:"block",padding:"10px"}}>
          💰 Loan
        </Link>

        <div
          style={{padding:"10px",cursor:"pointer"}}
          onClick={()=>{
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          🚪Logout
        </div>

      </div>
    )}
  </div>
)}
      </div>

    </div>
  );
}

export default Navbar;