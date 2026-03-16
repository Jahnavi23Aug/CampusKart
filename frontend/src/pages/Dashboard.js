import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {

  const [orders,setOrders] = useState([]);
  const [loan,setLoan] = useState(null);

  useEffect(()=>{

    axios.get("http://localhost:5000/orders")
    .then(res=>{
      setOrders(res.data || []);
    })
    .catch(err=>{
      console.log(err);
    });

    axios.get("http://localhost:5000/loan/Student")
    .then(res=>{
      if(!res.data.message){
        setLoan(res.data);
      }
    })
    .catch(err=>{
      console.log(err);
    });

  },[]);

  // TOTAL SPENT
 const totalSpent = orders.reduce((sum, order) => {

  if (!order.items || !Array.isArray(order.items)) return sum;

  const orderTotal = order.items.reduce((itemSum, item) => {

    const price = parseFloat(item.price) || 0;
    const discount = parseFloat(item.studentDiscount) || 0;

    const finalPrice = price - (price * discount) / 100;

    return itemSum + finalPrice;

  }, 0);

  return sum + orderTotal;

}, 0);

  // STUDENT SAVINGS
  const totalSavings = orders.reduce((sum, o) => {

    if (!o.items) return sum;

    const save = o.items.reduce((s, i) => {
      const price = Number(i.price) || 0;
      const discount = Number(i.studentDiscount) || 0;

      return s + (price * discount) / 100;
    }, 0);

    return sum + save;

  }, 0);

  // CHART DATA
  const chartData = orders.map((order, i) => {

  if (!order.items) {
    return { name: `Order ${i+1}`, amount: 0 };
  }

  const total = order.items.reduce((sum, item) => {

    const price = parseFloat(item.price) || 0;
    const discount = parseFloat(item.studentDiscount) || 0;

    return sum + (price - (price * discount) / 100);

  }, 0);

  return {
    name: `Order ${i+1}`,
    amount: total
  };

});

  return (

    <div className="dashboard">

      <h2>📊 CampusKart Dashboard</h2>

      <div className="stats">

        <div className="stat-card">
          <h4>Total Orders</h4>
          <p>{orders.length}</p>
        </div>

        <div className="stat-card">
          <h4>Total Spent</h4>
          <p>₹{Math.round(totalSpent)}</p>
        </div>

        <div className="stat-card">
          <h4>Student Savings</h4>
          <p>₹{Math.round(totalSavings)}</p>
        </div>

        <div className="stat-card">
          <h4>BNPL Balance</h4>
          <p>₹{loan ? loan.remaining_principal : 0}</p>
        </div>

      </div>

      {loan && (

      <div className="credit-section">

        <h3>Credit Score</h3>

        <div className="credit-bar">

          <div
            className="credit-fill"
            style={{width:`${loan.credit_score/8.5}%`}}
          ></div>

        </div>

        <p>{loan.credit_score} / 850</p>

      </div>

      )}

      <div className="chart-card">

        <h3>Spending Overview</h3>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={chartData}>

            <XAxis dataKey="name"/>

            <YAxis/>

            <Tooltip/>

            <Bar dataKey="amount"/>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default Dashboard;