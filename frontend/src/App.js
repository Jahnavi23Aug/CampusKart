import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import GroupRoom from "./pages/GroupRoom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Loan from "./pages/Loan";

/* NEW BOOK PAGES */
import BuyBooks from "./pages/BuyBooks";
import SellBook from "./pages/SellBook";
import Dashboard from "./pages/Dashboard";
function App() {

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  return (

    <BrowserRouter>

      <Navbar cartCount={cart.length} />

      <Routes>

        {/* Products */}
        <Route
          path="/"
          element={<Products addToCart={addToCart} />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
            />
          }
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout cart={cart} />}
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* GROUP ORDER */}
        <Route
          path="/group/create"
          element={<CreateRoom />}
        />

        <Route
          path="/group/join"
          element={<JoinRoom />}
        />

        <Route
          path="/group/:roomCode"
          element={<GroupRoom />}
        />

        {/* BOOK MARKETPLACE */}
        <Route
          path="/books/buy"
          element={<BuyBooks />}
        />

        <Route
          path="/books/sell"
          element={<SellBook />}
        />

        {/* LOAN PAGE */}
        <Route
          path="/loan"
          element={<Loan />}
        />

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;