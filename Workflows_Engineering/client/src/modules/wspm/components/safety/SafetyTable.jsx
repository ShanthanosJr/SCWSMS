import React from "react";
import "../../styles/globals.css";

export default function SafetyTable({ inspections }) {
  return (
    <ul className="wspm-safety-list">
      {inspections.map((i, idx) => (
        <li key={idx} className="wspm-safety-list-item">
          Compliance Score: {i.score}%
        </li>
      ))}
    </ul>
  );
}