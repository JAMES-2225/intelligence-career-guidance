# System Architecture

## Overview

The platform follows a **3-tier architecture**:

```
┌─────────────────────────────────┐
│        React Frontend           │
│  (CareerForm → Results → Courses│
│     → SkillGap → Explore)       │
└────────────┬────────────────────┘
             │  REST API (JSON)
             │  POST /recommend
             │  POST /skill-gap
             │  GET  /careers
             │  GET  /courses
┌────────────▼────────────────────┐
│        Flask Backend            │
│  - Input validation             │
│  - Profile tokenisation         │
│  - Similarity scoring engine    │
│  - Skill gap computation        │
│  - Course lookup                │
└────────────┬────────────────────┘
             │  Pandas DataFrames
┌────────────▼────────────────────┐
│      CSV Dataset Layer          │
│  career_dataset.csv             │
│  skill_courses_dataset.csv      │
└─────────────────────────────────┘
```

## Recommendation Algorithm

1. **Tokenise** user skills (split on comma/space/semicolon)
2. **Score** each career row:
   - `skill_score` = matched_skills / total_required_skills (capped at 1.0)
   - `interest_boost` = +0.4 if interest matches exactly, +0.2 if domain matches
   - `final_score` = skill_score × 0.6 + interest_boost
3. **Sort** descending, return top 3

## Skill Gap Computation

For the recommended career row, compare each required skill against user's skill list using substring matching (handles "ML" matching "Machine Learning").

## Course Mapping

`skill_courses_dataset.csv` maps each skill keyword to one or more courses. The system fetches the first 10 courses for the list of missing skills.

## Data Flow

```
User Input (skills + interest)
    ↓
tokenise() → list of skill tokens
    ↓
compute_match_score() per career row
    ↓
sort by score → top 3 careers
    ↓
get_skill_gap() for each career
    ↓
get_courses_for_skills() per gap list
    ↓
JSON response → React renders results
```
