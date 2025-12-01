console.log("APP LOADED");
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
console.log("API KEY:", import.meta.env.VITE_OPENROUTER_API_KEY);

function App() {
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Load CSV
  useEffect(() => {
    Papa.parse("/ElectronicsData.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setProducts(result.data);
      },
    });
  }, []);

  const getRecommendations = async () => {
  setLoading(true);

  // Clear old results
  setRecommendations([]);
  setError("");

  const cleanedProducts = products.map((p) => ({
    Title: p.Title,
    Category: p.Category,
    Price: p.Price,
    Discount: p.Discount,
    Rating: p.Rating,
  }));

  const prompt = `
Here is a list of electronics:
${JSON.stringify(cleanedProducts)}

User request: "${query}"

Return ONLY a JSON array of product Titles.
Example:
["Duracell 40-count Batteries", "GoPro HERO10"]
  `;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Product Recommender"
        },
        body: JSON.stringify({
          model: "tngtech/tng-r1t-chimera:free",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      setError("AI returned no results.");
      setLoading(false);
      return;
    }

    let aiText = data.choices[0].message.content.trim();

    const jsonMatch = aiText.match(/\[.*\]/s);

    if (!jsonMatch) {
      setError("Model did not return a recognizable list.");
      setLoading(false);
      return;
    }

    const names = JSON.parse(jsonMatch[0]);

    const filtered = products.filter((p) => names.includes(p.Title));
    // console.log("API Key:", import.meta.env.VITE_OPENROUTER_API_KEY);
    setRecommendations(filtered);

  } catch (error) {
    console.log(error);
    setError("API request failed.");
  }

  setLoading(false);
};


  return (
    <div style={styles.container}>
      <LeftPanel products={products} styles={styles} />
      <RightPanel
    query={query}
    setQuery={setQuery}
    loading={loading}
    recommendations={recommendations}
    getRecommendations={getRecommendations}
    styles={styles}
    error={error}
/>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#121212",
    color: "white",
    fontFamily: "Arial",
    overflow: "hidden"
  },
  leftPane: {
    width: "50%",
    padding: 20,
    overflowY: "scroll",
    borderRight: "1px solid #333",
    backgroundColor: "#121212",
  },
  rightPane: {
    width: "50%",
    padding: 20,
    overflowY: "scroll", 
    height: "100vh",
    backgroundColor: "#121212"
  },
  heading: {
    color: "#76a9fa",
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 8,
    border: "1px solid #333",
    marginBottom: 12,
  },
  recommendCard: {
    backgroundColor: "#1a2a1a",
    padding: 15,
    borderRadius: 8,
    border: "1px solid #2f4f2f",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#9CDCFE",
  },
  textBox: {
    width: "100%",
    height: 80,
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: 8,
    padding: 10,
    color: "white",
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4A90E2",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 20,
    color: "white",
    fontSize: 16,
  },
};

export default App;
