import React, { useEffect, useState } from "react";
import axios from "axios";

function Checkout({ cart }) {

  const [wallet, setWallet] = useState(0);

  const total = cart.reduce((sum, item) => {
    const finalPrice =
      item.price - (item.price * item.studentDiscount) / 100;
    return sum + finalPrice;
  }, 0);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/wallet")
      .then(res => setWallet(res.data.balance));
  }, []);

  const payNow = () => {

    axios.post("http://127.0.0.1:5000/wallet/pay", {
      amount: total,
      items: cart
    })
    .then(res => {
      alert("Payment successful!");
      setWallet(res.data.balance);
    })
    .catch(err => {
      alert("Insufficient wallet balance");
    });

  };

  return (
    <div style={{padding:"30px"}}>

      <h1>Checkout</h1>

      <h3>Total Amount: ₹{total}</h3>

      <h3>Wallet Balance: ₹{wallet}</h3>

      <button
        onClick={payNow}
        style={{
          padding:"10px",
          background:"green",
          color:"white",
          border:"none",
          cursor:"pointer"
        }}
      >
        Pay with Wallet
      </button>

    </div>
  );
}

export default Checkout;