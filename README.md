# 🧠 CareerIQ — Intelligent Career Guidance & Skill Recommendation Platform

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Pandas](https://img.shields.io/badge/Pandas-2.x-150458?style=flat&logo=pandas&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

> IT4609 — Mini Project | St. Joseph's Institute of Technology, Chennai

An intelligent, data-driven platform that provides **personalized career recommendations**, performs **skill gap analysis**, and suggests **online courses** to bridge those gaps — all in one unified system.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Supported Career Domains](#supported-career-domains)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)

---

## Overview

Students today struggle to choose the right career path due to rapidly changing industry requirements and the sheer number of options available. **CareerIQ** solves this by:

1. **Collecting** the user's current skills and areas of interest.
2. **Matching** the profile against a curated career dataset using intelligent similarity scoring.
3. **Identifying skill gaps** — skills required for the top career matches that the user doesn't yet have.
4. **Recommending courses** from platforms like Coursera, Udemy, and freeCodeCamp to bridge those gaps.

---

## Features

| Feature | Description |
|---|---|
| 🎯 Career Recommendation | Top-3 career matches ranked by match percentage |
| ⚡ Skill Gap Analysis | Identifies missing skills for each recommended career |
| 📚 Course Recommendations | Curated online courses per missing skill |
| 🗺️ Explore Careers | Browse all 20 career paths across 6 domains |
| 💰 Salary & Demand Info | Average salary and job demand indicator per career |
| 📱 Responsive UI | Works on desktop and mobile browsers |

---

## Tech Stack

### Backend
- **Python 3.10+**
- **Flask** — REST API framework
- **Flask-CORS** — Cross-origin support
- **Pandas / NumPy** — Data processing and recommendation logic
- **CSV-based dataset** — Career and course data

### Frontend
- **React 18** — Component-based UI
- **Axios** — HTTP client
- **CSS (custom)** — Inter font, responsive grid layout

---

## Project Structure

```
intelligence-career-guidance/
├── backend/
│   ├── app.py                   # Flask API (recommendation engine)
│   ├── requirements.txt         # Python dependencies
│   ├── career_dataset.csv       # 20 career profiles with skills & salary data
│   └── skill_courses_dataset.csv# 33 courses mapped to skills & platforms
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js               # Root component, routing between tabs
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── CareerForm.js    # Skills & interest input form
│   │   │   ├── RecommendationResults.js  # Top-3 results cards
│   │   │   ├── SkillGapCard.js  # Missing skills display
│   │   │   ├── CourseCard.js    # Individual course tile
│   │   │   └── ExploreCareersList.js     # Browse all careers
│   │   └── styles/
│   │       ├── index.css
│   │       └── App.css
│   └── package.json
│
├── docs/
│   └── architecture.md
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Create a virtual environment (recommended)
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the Flask server
python app.py
```

The backend will start at **http://127.0.0.1:5000**

### Frontend Setup

```bash
# 1. Navigate to the frontend folder (in a new terminal)
cd frontend

# 2. Install npm packages
npm install

# 3. Start the development server
npm start
```

The React app will open at **http://localhost:3000**

> **Note:** Make sure the Flask backend is running before starting the frontend, otherwise the API calls will fail.

---

## API Reference

All endpoints return JSON.

### `GET /`
Health check.

**Response:**
```json
{ "status": "Career Guidance API is running", "version": "1.0.0" }
```

---

### `POST /recommend`
Get personalized career recommendations.

**Request Body:**
```json
{
  "skills": "Python Machine Learning SQL",
  "interest": "Data Science"
}
```

**Response:**
```json
{
  "user_skills": ["Python", "Machine Learning", "SQL"],
  "user_interest": "Data Science",
  "recommendations": [
    {
      "career": "Data Scientist",
      "domain": "Data Science",
      "description": "...",
      "avg_salary": 95000,
      "job_demand": "Very High",
      "match_percentage": 75.0,
      "skill_gap": ["Statistics", "Data Visualization", "NumPy"],
      "recommended_courses": [ ... ]
    }
  ]
}
```

---

### `POST /skill-gap`
Analyse skill gap for a specific career.

**Request Body:**
```json
{
  "skills": "Python SQL",
  "career": "Data Scientist"
}
```

---

### `GET /careers`
List all careers and domains.

---

### `GET /courses?skill=Python`
List courses filtered by skill (optional query param).

---

## Supported Career Domains

| Domain | Careers |
|---|---|
| 📊 Data Science | Data Scientist, Data Analyst, Database Administrator |
| 🤖 Artificial Intelligence | ML Engineer, AI Research Scientist, NLP Engineer |
| 🌐 Web Development | Frontend, Backend, Full Stack Developer, UI/UX Designer |
| ☁️ Cloud Computing | Cloud Engineer, DevOps Engineer, Cloud Architect |
| 🔒 Cyber Security | Security Analyst, Penetration Tester, Security Engineer |
| 💻 Software Development | Software Developer, Mobile Developer, Embedded Systems, Blockchain |

---

## Future Enhancements

- 🤖 Advanced ML models (Random Forest, Neural Networks) for better matching
- 🗣️ NLP-based resume parsing and analysis
- 🌍 Real-time job market API integration (LinkedIn, Indeed)
- 💬 AI chatbot for conversational career guidance
- 🌐 Multilingual support
- 📱 Mobile application (Flutter / React Native)
- 👤 User accounts and recommendation history (MySQL)
- 📊 Personality assessment integration

---

## Contributors

| Name | Roll Number |
|---|---|
| Naveen Chander G | 312423205148 |
| Panimaya James R | 312423205158 |

**Supervisor:** Mrs. P. Saranya M.E (Ph.D), Assistant Professor  
**Department:** Information Technology  
**Institution:** St. Joseph's Institute of Technology, Chennai — 600 119

---

## License

This project is licensed under the [MIT License](LICENSE).
