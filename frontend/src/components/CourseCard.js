import React from "react";

const LEVEL_COLORS = {
  Beginner: "#22c55e",
  Intermediate: "#3b82f6",
  Advanced: "#8b5cf6",
};

function CourseCard({ course }) {
  return (
    <a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="course-card"
    >
      <div className="course-platform">{course.platform}</div>
      <div className="course-name">{course.course_name}</div>
      <div className="course-footer">
        <span className="course-skill">🛠 {course.skill}</span>
        <span
          className="course-level"
          style={{ color: LEVEL_COLORS[course.level] || "#6b7280" }}
        >
          {course.level}
        </span>
        <span className="course-duration">⏱ {course.duration}</span>
      </div>
    </a>
  );
}

export default CourseCard;
