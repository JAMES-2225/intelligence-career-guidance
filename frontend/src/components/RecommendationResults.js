import React, { useState } from "react";
import SkillGapCard from "./SkillGapCard";
import CourseCard from "./CourseCard";

const DEMAND_COLORS = {
  "Very High": "#22c55e",
  High: "#3b82f6",
  Medium: "#f59e0b",
  Low: "#ef4444",
};

function RecommendationResults({ data }) {
  const [expandedIdx, setExpandedIdx] = useState(0);

  const { recommendations, user_skills, user_interest } = data;

  return (
    <section className="results-section">
      <div className="results-header">
        <h2>Your Career Recommendations</h2>
        <div className="user-profile-tags">
          {user_interest && (
            <span className="profile-tag interest-tag">🎯 {user_interest}</span>
          )}
          {user_skills.slice(0, 5).map((s) => (
            <span key={s} className="profile-tag skill-tag">
              {s}
            </span>
          ))}
          {user_skills.length > 5 && (
            <span className="profile-tag more-tag">+{user_skills.length - 5} more</span>
          )}
        </div>
      </div>

      {recommendations.map((rec, idx) => (
        <div
          key={rec.career}
          className={`career-card ${expandedIdx === idx ? "expanded" : ""}`}
        >
          {/* ── Card header ── */}
          <div
            className="career-card-header"
            onClick={() => setExpandedIdx(expandedIdx === idx ? -1 : idx)}
          >
            <div className="career-rank">#{idx + 1}</div>
            <div className="career-info">
              <h3>{rec.career}</h3>
              <span className="domain-badge">{rec.domain}</span>
            </div>
            <div className="career-meta">
              <div className="match-score">
                <div
                  className="score-ring"
                  style={{
                    background: `conic-gradient(#6366f1 ${rec.match_percentage * 3.6}deg, #e5e7eb 0deg)`,
                  }}
                >
                  <span>{rec.match_percentage}%</span>
                </div>
                <small>Match</small>
              </div>
              <div className="salary-info">
                <strong>${rec.avg_salary.toLocaleString()}</strong>
                <small>Avg Salary / yr</small>
              </div>
              <div className="demand-badge" style={{ color: DEMAND_COLORS[rec.job_demand] || "#6b7280" }}>
                ● {rec.job_demand} Demand
              </div>
            </div>
            <button className="expand-btn">{expandedIdx === idx ? "▲" : "▼"}</button>
          </div>

          {/* ── Expanded details ── */}
          {expandedIdx === idx && (
            <div className="career-card-body">
              <p className="career-desc">{rec.description}</p>

              {/* Skills progress */}
              <div className="skills-progress-section">
                <h4>Skills Readiness</h4>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    style={{ width: `${rec.match_percentage}%` }}
                  />
                </div>
                <p>
                  You have <strong>{rec.skills_matched}</strong> of{" "}
                  <strong>{rec.total_skills_required}</strong> required skills.
                </p>
              </div>

              {/* Skill gap */}
              {rec.skill_gap.length > 0 && (
                <SkillGapCard missingSkills={rec.skill_gap} />
              )}
              {rec.skill_gap.length === 0 && (
                <div className="all-skills-badge">
                  ✅ You already have all the core skills for this career!
                </div>
              )}

              {/* Courses */}
              {rec.recommended_courses.length > 0 && (
                <div className="courses-section">
                  <h4>📚 Recommended Courses to Bridge the Gap</h4>
                  <div className="courses-grid">
                    {rec.recommended_courses.map((c) => (
                      <CourseCard key={c.course_name} course={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

export default RecommendationResults;
