import React from "react";
import "../../styles/globals.css";

export default function SafetyForm({ onInspect }) {
  const handleInspect = () => {
    const checklist = {
      helmet: true,
      vest: true,
      gloves: false,
      boots: true,
      harness: false,
    };
    onInspect(checklist);
  };

  return (
    <button
      onClick={handleInspect}
      className="wspm-btn wspm-btn-primary"
    >
      Run Safety Inspection
    </button>
  );
}