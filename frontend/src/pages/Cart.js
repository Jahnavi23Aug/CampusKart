import React from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, removeFromCart }) {

  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    const finalPrice =
      item.price - (item.price * item.studentDiscount) / 100;
    return sum + finalPrice;
  }, 0);

  return (
    <div style={{ padding: "30px" }}>

      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>

          {cart.map((item, index) => {

            const finalPrice =
              item.price - (item.price * item.studentDiscount) / 100;

            return (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "8px"
                }}
              >

                <h3>{item.name}</h3>

                <p>Price: ₹{finalPrice}</p>

                <button
                  onClick={() => removeFromCart(index)}
                  style={{                    
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"                  
                    }}
                >
                  Remove
                </button>

              </div>
            );
          })}

          <h2>Total: ₹{total}</h2>

          <button
            onClick={() => navigate("/checkout")}
            style={{
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "6px",
              marginTop: "10px"
            }}
          >
            Checkout
          </button>

        </div>
      )}

    </div>
  );
}

export default Cart;