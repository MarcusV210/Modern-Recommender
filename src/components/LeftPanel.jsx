import React from "react";

export default function LeftPanel({ products, styles }) {
  return (
    <div style={styles.leftPane}>
      <h2 style={styles.heading}>All Electronics available</h2>

      {products.length === 0 && (
        <p style={{ color: "#bbb" }}>Loading data...</p>
      )}

      {products.map((p, i) => (
        <div key={i} style={styles.card}>
          <h3 style={styles.cardTitle}>{p.Title}</h3>

          {p.Category && <p>📦 Category: {p.Category}</p>}
          {p.Price && <p>💲 Price: {p.Price}</p>}
          {p.Discount && <p>🏷 Discount: {p.Discount}</p>}
          {p.Rating && <p>⭐ Rating: {p.Rating}</p>}
        </div>
      ))}
    </div>
  );
}
