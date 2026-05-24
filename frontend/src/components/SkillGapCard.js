import React from "react";

function SkillGapCard({ missingSkills }) {
  return (
    <div className="skill-gap-card">
      <h4>⚡ Skill Gap Analysis</h4>
      <p>The following skills are required but missing from your profile:</p>
      <div className="skill-tags-wrap">
        {missingSkills.map((skill) => (
          <span key={skill} className="missing-skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillGapCard;
