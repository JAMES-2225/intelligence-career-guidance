import React, { useState } from "react";
import "./styles/App.css";
import Header from "./components/Header";
import CareerForm from "./components/CareerForm";
import RecommendationResults from "./components/RecommendationResults";
import ExploreCareersList from "./components/ExploreCareersList";
import Footer from "./components/Footer";

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("recommend"); // "recommend" | "explore"
  const [error, setError] = useState("");

  const handleRecommend = async (skills, interest) => {
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, interest }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />

      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === "recommend" ? "active" : ""}`}
          onClick={() => setActiveTab("recommend")}
        >
          🎯 Get Recommendations
        </button>
        <button
          className={`tab-btn ${activeTab === "explore" ? "active" : ""}`}
          onClick={() => setActiveTab("explore")}
        >
          🗺️ Explore Careers
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "recommend" && (
          <>
            <CareerForm onSubmit={handleRecommend} loading={loading} />
            {error && (
              <div className="error-card">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}
            {results && <RecommendationResults data={results} />}
          </>
        )}
        {activeTab === "explore" && <ExploreCareersList />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
