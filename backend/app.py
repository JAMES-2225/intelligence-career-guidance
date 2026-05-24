from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re

app = Flask(__name__)
CORS(app)

# ── Load datasets ──────────────────────────────────────────────────────────────
career_df = pd.read_csv("career_dataset.csv")
courses_df = pd.read_csv("skill_courses_dataset.csv")

# Pre-process: lower-case skills for matching
career_df["Skills_List"] = career_df["Skills"].apply(
    lambda s: [x.strip().lower() for x in s.split()]
)
career_df["Interest_Lower"] = career_df["Interest"].str.lower()
career_df["Domain_Lower"] = career_df["Domain"].str.lower()


# ── Helper functions ────────────────────────────────────────────────────────────

def tokenise(text: str) -> list[str]:
    """Split a free-text skills / interest string into individual tokens."""
    # Split on comma, space, semicolon, or newline
    tokens = re.split(r"[,\s;/\n]+", text.strip())
    return [t.strip().lower() for t in tokens if t.strip()]


def compute_match_score(user_skills: list[str], user_interest: str,
                         row: pd.Series) -> float:
    """Return a 0-1 similarity score between user profile and a career row."""
    career_skills = row["Skills_List"]
    total_career_skills = len(career_skills) or 1

    # Skill overlap (partial match allowed)
    matched = sum(
        1 for us in user_skills
        for cs in career_skills
        if us in cs or cs in us
    )
    skill_score = min(matched / total_career_skills, 1.0)

    # Interest / domain match boost
    interest_boost = 0.0
    if user_interest:
        ui = user_interest.lower()
        if ui in row["Interest_Lower"] or row["Interest_Lower"] in ui:
            interest_boost = 0.4
        elif ui in row["Domain_Lower"] or row["Domain_Lower"] in ui:
            interest_boost = 0.2

    return round(min(skill_score * 0.6 + interest_boost, 1.0), 3)


def get_skill_gap(user_skills: list[str], career_row: pd.Series) -> list[str]:
    """Return list of skills required for a career that the user is missing."""
    required = career_row["Skills_List"]
    missing = []
    for req in required:
        # User has it if any user skill partially matches
        has_it = any(req in us or us in req for us in user_skills)
        if not has_it:
            missing.append(req.title())
    return missing


def get_courses_for_skills(missing_skills: list[str]) -> list[dict]:
    """Return recommended courses for the given missing skills."""
    courses = []
    seen_courses = set()
    for skill in missing_skills:
        skill_lower = skill.lower()
        matched = courses_df[
            courses_df["Skill"].str.lower().str.contains(skill_lower, na=False)
        ]
        for _, row in matched.iterrows():
            key = row["Course_Name"]
            if key not in seen_courses:
                seen_courses.add(key)
                courses.append({
                    "skill": row["Skill"],
                    "course_name": row["Course_Name"],
                    "platform": row["Platform"],
                    "url": row["URL"],
                    "duration": row["Duration"],
                    "level": row["Level"],
                })
    return courses[:10]  # cap at 10


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Career Guidance API is running", "version": "1.0.0"})


@app.route("/careers", methods=["GET"])
def list_careers():
    """Return all available career domains for display in the UI."""
    domains = career_df["Domain"].unique().tolist()
    careers = career_df[["Career", "Domain", "Description", "Avg_Salary", "Job_Demand"]].to_dict(orient="records")
    return jsonify({"domains": domains, "careers": careers})


@app.route("/recommend", methods=["POST"])
def recommend():
    """
    Body: { "skills": "Python Machine Learning SQL", "interest": "Data Science" }
    Returns top-3 career recommendations with skill gaps and courses.
    """
    data = request.get_json(force=True)
    raw_skills = data.get("skills", "").strip()
    raw_interest = data.get("interest", "").strip()

    if not raw_skills and not raw_interest:
        return jsonify({"error": "Please provide at least skills or interest."}), 400

    user_skills = tokenise(raw_skills)
    user_interest = raw_interest.lower()

    # Score every career row
    career_df["score"] = career_df.apply(
        lambda row: compute_match_score(user_skills, user_interest, row), axis=1
    )

    top_careers = career_df.sort_values("score", ascending=False).head(3)

    recommendations = []
    for _, row in top_careers.iterrows():
        missing = get_skill_gap(user_skills, row)
        courses = get_courses_for_skills(missing)

        # How many skills the user already has
        total_skills = len(row["Skills_List"])
        matched_count = total_skills - len(missing)

        recommendations.append({
            "career": row["Career"],
            "domain": row["Domain"],
            "description": row["Description"],
            "avg_salary": row["Avg_Salary"],
            "job_demand": row["Job_Demand"],
            "match_score": row["score"],
            "match_percentage": round(row["score"] * 100, 1),
            "skills_matched": matched_count,
            "total_skills_required": total_skills,
            "skill_gap": missing,
            "recommended_courses": courses,
        })

    return jsonify({
        "user_skills": [s.title() for s in user_skills],
        "user_interest": raw_interest,
        "recommendations": recommendations,
    })


@app.route("/skill-gap", methods=["POST"])
def skill_gap():
    """
    Body: { "skills": "...", "career": "Data Scientist" }
    Returns skill gap and course recommendations for a specific career.
    """
    data = request.get_json(force=True)
    raw_skills = data.get("skills", "").strip()
    career_name = data.get("career", "").strip()

    if not raw_skills or not career_name:
        return jsonify({"error": "Both 'skills' and 'career' are required."}), 400

    user_skills = tokenise(raw_skills)

    match = career_df[career_df["Career"].str.lower() == career_name.lower()]
    if match.empty:
        return jsonify({"error": f"Career '{career_name}' not found in dataset."}), 404

    row = match.iloc[0]
    missing = get_skill_gap(user_skills, row)
    courses = get_courses_for_skills(missing)

    total = len(row["Skills_List"])
    matched = total - len(missing)

    return jsonify({
        "career": row["Career"],
        "required_skills": [s.title() for s in row["Skills_List"]],
        "user_skills": [s.title() for s in user_skills],
        "matched_skills": [s.title() for s in user_skills if any(s in cs or cs in s for cs in row["Skills_List"])],
        "missing_skills": missing,
        "completion_percentage": round((matched / total) * 100, 1) if total else 0,
        "recommended_courses": courses,
    })


@app.route("/courses", methods=["GET"])
def all_courses():
    """Return all available courses, optionally filtered by skill query param."""
    skill_filter = request.args.get("skill", "").lower()
    if skill_filter:
        filtered = courses_df[courses_df["Skill"].str.lower().str.contains(skill_filter, na=False)]
    else:
        filtered = courses_df
    return jsonify(filtered.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
