import React, { useEffect, useState } from "react";
import axios from "axios";
import "./orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:5000/orders")
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // analytics
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  const totalSavings = orders.reduce((sum, order) => {

    if (!order.items) return sum;

    const saved = order.items.reduce((s, item) => {

      return s + (item.price * item.studentDiscount) / 100;

    }, 0);

    return sum + saved;

  }, 0);

  const downloadInvoice = (order) => {

    const content = `
CampusKart Invoice
-------------------------
Order ID: ${order._id}
Status: ${order.status}

Items:
${order.items.map(i =>
      `${i.name} - ₹${i.price}`
    ).join("\n")}

Total: ₹${order.total}
`;

    const blob = new Blob([content], { type: "text/plain" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "invoice.txt";

    a.click();

  };

  return (

    <div className="orders-container">

      <h2 className="orders-title">📦 Order History</h2>

      {/* ANALYTICS */}

      <div className="orders-analytics">

        <div className="analytics-card">
          <h4>Total Orders</h4>
          <p>{orders.length}</p>
        </div>

        <div className="analytics-card">
          <h4>Total Spent</h4>
          <p>₹{totalSpent}</p>
        </div>

        <div className="analytics-card">
          <h4>Student Savings</h4>
          <p>₹{Math.round(totalSavings)}</p>
        </div>

      </div>

      {orders.map((order, index) => (

        <div key={index} className="order-card">

          <div className="order-header">

            <h3>Order #{index + 1}</h3>

            <span className={`status ${order.status}`}>
              {order.status}
            </span>

          </div>

          {/* ORDER TIMELINE */}

          <div className="timeline">

            <div className="step active">Ordered</div>
            <div className={`step ${order.status !== "pending" ? "active" : ""}`}>Shipped</div>
            <div className={`step ${order.status === "completed" || order.status === "delivered" ? "active" : ""}`}>Delivered</div>

          </div>

          {/* ITEMS */}

          <div className="order-items">

            {order.items && order.items.map((item, i) => (

              <div key={i} className="order-item">

               

                <div>

                  <p>{item.name}</p>

                  <small>
                    ₹{item.price - (item.price * item.studentDiscount) / 100}
                  </small>

                </div>

              </div>

            ))}

          </div>

          <div className="order-footer">

            <h4>Total: ₹{order.total}</h4>

            <button
              className="invoice-btn"
              onClick={() => downloadInvoice(order)}
            >
              Download Invoice
            </button>

          </div>

        </div>

      ))}

    </div>

  );

}

export default Orders;