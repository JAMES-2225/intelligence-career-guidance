import React, { useState } from "react";

const SAMPLE_SKILLS = [
  "Python, Machine Learning, SQL",
  "ReactJS, HTML, CSS, JavaScript",
  "AWS, Linux, Docker, Kubernetes",
  "Networking, Ethical Hacking",
  "Java, Python, Problem Solving",
];

const INTERESTS = [
  "Data Science",
  "Web Development",
  "Artificial Intelligence",
  "Cloud Computing",
  "Cyber Security",
  "Software Development",
];

function CareerForm({ onSubmit, loading }) {
  const [skills, setSkills] = useState("");
  const [interest, setInterest] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skills.trim() && !interest.trim()) return;
    onSubmit(skills, interest);
  };

  const fillSample = (sample) => setSkills(sample);

  return (
    <section className="form-card">
      <h2 className="form-title">Find Your Ideal Career Path</h2>
      <p className="form-desc">
        Enter your current skills and areas of interest. Our AI engine will
        match you with top career paths and show you exactly what to learn next.
      </p>

      <form onSubmit={handleSubmit} className="career-form">
        <div className="form-group">
          <label htmlFor="skills">Your Current Skills</label>
          <textarea
            id="skills"
            rows={3}
            placeholder="e.g. Python, Machine Learning, SQL, Data Visualization"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <div className="sample-chips">
            <span className="chips-label">Quick fill:</span>
            {SAMPLE_SKILLS.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                onClick={() => fillSample(s)}
              >
                {s.split(",")[0]}…
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="interest">Area of Interest</label>
          <select
            id="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          >
            <option value="">-- Select an interest (optional) --</option>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`submit-btn ${loading ? "loading" : ""}`}
          disabled={loading || (!skills.trim() && !interest.trim())}
        >
          {loading ? (
            <>
              <span className="spinner" /> Analysing Profile…
            </>
          ) : (
            "🚀 Get Career Recommendations"
          )}
        </button>
      </form>
    </section>
  );
}

export default CareerForm;
