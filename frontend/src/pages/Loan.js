import React, { useState, useEffect } from "react";
import axios from "axios";
import "./loan.css";

function Loan() {

  const student = "Student";

  const [loan, setLoan] = useState(null);
  const [amount, setAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [method, setMethod] = useState("wallet");

  // Fetch Loan Details
  const fetchLoan = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/loan/${student}`
      );

      if (res.data.message) {
        setLoan(null);
      } else {
        setLoan(res.data);
      }

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    fetchLoan();
  }, []);

  // Apply Loan
  const applyLoan = async () => {

    if (!amount) {
      alert("Enter loan amount");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/loan/apply",
        {
          student: student,
          amount: Number(amount)
        }
      );

      alert("Loan approved!");
      setAmount("");
      fetchLoan();

    } catch (error) {

      const msg =
        error.response?.data?.message ||
        "Error applying loan";

      alert(msg);

    }

  };

  // Repay Loan
  const repayLoan = async () => {

    if (!repayAmount) {
      alert("Enter repayment amount");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/loan/repay",
        {
          student: student,
          amount: Number(repayAmount),
          method: method
        }
      );

      alert("Payment successful");
      setRepayAmount("");
      fetchLoan();

    } catch (error) {

      const msg =
        error.response?.data?.message ||
        "Payment failed";

      alert(msg);

    }

  };

  // Pay Monthly Interest
  const payInterest = async () => {

    try {

      await axios.post(
        "http://localhost:5000/loan/pay-interest",
        {
          student: student,
          method: method
        }
      );

      alert("Monthly interest paid");
      fetchLoan();

    } catch (error) {

      alert("Interest payment failed");

    }

  };

  // Pay Full Principal
  const payPrincipal = async () => {

    try {

      await axios.post(
        "http://localhost:5000/loan/pay-principal",
        {
          student: student,
          method: method
        }
      );

      alert("Loan fully repaid");
      fetchLoan();

    } catch (error) {

      alert("Payment failed");

    }

  };

  return (

  <div className="loan-container">

    <h2 className="loan-title">🎓 Student Mini Loan</h2>

    {/* APPLY LOAN */}

    <div className="loan-card">

      <h3>Apply Loan</h3>

      <input
        className="loan-input"
        placeholder="Enter loan amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="loan-btn" onClick={applyLoan}>
        Apply Loan
      </button>

    </div>


    {/* BNPL CARD */}

    <div className="bnpl-card">

      <h3>CampusKart Pay Later</h3>

      <p>Available Credit</p>

      <h1>₹{loan ? loan.remaining_principal : 0}</h1>

      <p>Next Payment: {loan?.next_payment_date}</p>

    </div>


    {/* LOAN DETAILS */}

    {loan && (

      <div className="loan-card">

        <h3>Loan Details</h3>

        <div className="loan-grid">

          <div>
            <span>Principal</span>
            <h4>₹{loan.principal}</h4>
          </div>

          <div>
            <span>Monthly Interest</span>
            <h4>₹{loan.monthly_interest}</h4>
          </div>

          <div>
            <span>Remaining</span>
            <h4>₹{loan.remaining_principal}</h4>
          </div>

          <div>
            <span>Months Left</span>
            <h4>{loan.months_remaining}</h4>
          </div>

          <div>
            <span>Next Payment</span>
            <h4>{loan.next_payment_date}</h4>
          </div>

          <div className="credit-box">

            <span>Credit Score</span>

            <div className="credit-bar">

              <div
                className="credit-fill"
                style={{
                  width: `${(loan.credit_score / 850) * 100}%`
                }}
              ></div>

            </div>

            <p>{loan.credit_score} / 850</p>

          </div>

          <div>
            <span>Late Penalty</span>
            <h4 className="penalty">₹{loan.late_fees}</h4>
          </div>

        </div>

      </div>

    )}


    {/* LOAN PROGRESS */}

    {loan && (

    <div className="loan-progress">

      <h4>Loan Repayment Progress</h4>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${((loan.principal - loan.remaining_principal) / loan.principal) * 100}%`
          }}
        ></div>

      </div>

      <p>
        Paid ₹{loan.principal - loan.remaining_principal} of ₹{loan.principal}
      </p>

    </div>

    )}


    {/* REPAYMENT */}

    {loan && (

      <div className="loan-card">

        <h3>Repay Loan</h3>

        <input
          className="loan-input"
          placeholder="Enter repayment amount"
          value={repayAmount}
          onChange={(e) => setRepayAmount(e.target.value)}
        />

        <select
          className="loan-select"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >

          <option value="wallet">Wallet</option>
          <option value="phonepe">PhonePe</option>
          <option value="paytm">Paytm</option>
          <option value="upi">UPI</option>

        </select>

        <div className="loan-buttons">

          <button className="loan-btn" onClick={repayLoan}>
            Pay Loan
          </button>

          <button className="loan-btn interest" onClick={payInterest}>
            Pay Monthly Interest
          </button>

          <button className="loan-btn danger" onClick={payPrincipal}>
            Pay Full Principal
          </button>

        </div>

      </div>

    )}


    {/* PAYMENT HISTORY */}

    {loan && (

      <div className="loan-card">

        <h3>Payment History</h3>

        <table className="history-table">

          <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
          </thead>

          <tbody>

          <tr>
            <td>2026-03-01</td>
            <td>₹200</td>
            <td>Wallet</td>
            <td className="paid">Paid</td>
          </tr>

          <tr>
            <td>2026-02-01</td>
            <td>₹100</td>
            <td>UPI</td>
            <td className="paid">Paid</td>
          </tr>

          </tbody>

        </table>

      </div>

    )}

  </div>

  );

}

export default Loan;