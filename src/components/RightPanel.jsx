import React from "react";

export default function RightPanel({
  query,
  setQuery,
  loading,
  recommendations,
  getRecommendations,
  styles,
  error
}) {
  return (
    <div style={styles.rightPane}>
      <h2 style={styles.heading}>AI Recommendations</h2>

      <textarea
        style={styles.textBox}
        placeholder="Describe what you want (e.g., best phone under $500)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button style={styles.button} onClick={getRecommendations}>
        {loading ? "Loading..." : "Get Recommendations"}
      </button>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Results */}
      <div style={{ marginTop: 20 }}>
        {recommendations.length > 0 && (
          <h3 style={{ color: "#76a9fa" }}>Recommended Products</h3>
        )}

        {recommendations.map((item, index) => (
          <div key={index} style={styles.recommendCard}>
            <h3 style={styles.cardTitle}>{item.Title}</h3>
            <p>💲 {item.Price}</p>
            <p>📦 {item.Category}</p>
            <p>🏷 {item.Discount}</p>
            <p>⭐ {item.Rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
