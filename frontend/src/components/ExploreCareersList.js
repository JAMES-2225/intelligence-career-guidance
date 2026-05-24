import React, { useEffect, useState } from "react";

const DOMAIN_ICONS = {
  "Data Science": "📊",
  "Artificial Intelligence": "🤖",
  "Web Development": "🌐",
  "Cloud Computing": "☁️",
  "Cyber Security": "🔒",
  "Software Development": "💻",
};

function ExploreCareersList() {
  const [careers, setCareers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/careers")
      .then((r) => r.json())
      .then((data) => {
        setCareers(data.careers);
        setDomains(["All", ...data.domains]);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load careers. Make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  const filtered =
    selectedDomain === "All"
      ? careers
      : careers.filter((c) => c.Domain === selectedDomain);

  if (loading) return <div className="loading-msg">Loading careers…</div>;
  if (error) return <div className="error-card"><span className="error-icon">⚠️</span><p>{error}</p></div>;

  return (
    <section className="explore-section">
      <h2>Explore All Career Paths</h2>
      <div className="domain-filter">
        {domains.map((d) => (
          <button
            key={d}
            className={`domain-btn ${selectedDomain === d ? "active" : ""}`}
            onClick={() => setSelectedDomain(d)}
          >
            {DOMAIN_ICONS[d] || "🔍"} {d}
          </button>
        ))}
      </div>
      <div className="careers-grid">
        {filtered.map((c) => (
          <div key={c.Career} className="explore-career-card">
            <div className="explore-domain-icon">{DOMAIN_ICONS[c.Domain] || "💼"}</div>
            <h3>{c.Career}</h3>
            <span className="domain-badge">{c.Domain}</span>
            <p>{c.Description}</p>
            <div className="explore-card-footer">
              <span className="salary">${c.Avg_Salary.toLocaleString()}/yr</span>
              <span className="demand-label">Demand: {c.Job_Demand}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExploreCareersList;
