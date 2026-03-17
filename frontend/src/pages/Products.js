import React, { useEffect, useState } from "react";
import axios from "axios";

function Products({ addToCart }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {

    axios
      .get("https://campuskart-3.onrender.com/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });

  }, []);

  const categories = [
    "All",
    "Food",
    "Fashion",
    "Beauty",
    "Jewellery",
    "Pharmacy",
    "Books"
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>

      <h1>CampusKart Marketplace</h1>

      {/* CATEGORY MENU */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
          flexWrap: "wrap"
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px 18px",
              borderRadius: "20px",
              border: "none",
              background:
                selectedCategory === cat ? "#2563eb" : "#e5e7eb",
              color:
                selectedCategory === cat ? "white" : "#111",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "25px",
          marginTop: "30px"
        }}
      >

        {filteredProducts.map((product, index) => {

          const finalPrice =
            product.price -
            (product.price * product.studentDiscount) / 100;

          return (

            <div
              key={index}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "15px",
                background: "#fff",
                boxShadow: "0 6px 12px rgba(0,0,0,0.05)"
              }}
            >

              <img
                src={`https://campuskart-3.onrender.com${product.image}`}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "https://campuskart-3.onrender.com/images/default.jpg";
                }}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />

              <h3 style={{ marginTop: "10px" }}>{product.name}</h3>

              <p style={{ color: "#6b7280" }}>
                Category: {product.category}
              </p>

              <p>Original Price: ₹{product.price}</p>

              <p style={{ color: "green" }}>
                Student Discount: {product.studentDiscount}%
              </p>

              <h3 style={{ marginTop: "10px" }}>
                ₹{finalPrice}
              </h3>

              <button
                onClick={() => addToCart(product)}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Add to Cart
              </button>

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default Products;
