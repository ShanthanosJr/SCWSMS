import React from "react";
import "../../styles/globals.css";

export default function ShiftList({ swaps, onSuggest }) {
  return (
    <div className="wspm-shift-list">
      {swaps.length === 0 ? (
        <div className="wspm-shift-list-empty">
          <p>No shift swap requests found.</p>
        </div>
      ) : (
        swaps.map((s, idx) => (
          <div
            key={idx}
            className="wspm-shift-list-item"
          >
            <div className="wspm-shift-list-item-content">
              <p className="wspm-shift-list-item-title">
                Worker {s.workerId} requested {s.requestedShift}
              </p>
              <p className="wspm-shift-list-item-reason">{s.reason}</p>
              <span
                className={`wspm-badge ${s.status === "Pending"
                    ? "wspm-badge-warning"
                    : s.status === "Approved"
                      ? "wspm-badge-success"
                      : "wspm-badge-error"
                  }`}
              >
                {s.status}
              </span>
            </div>
            {s.status === "Pending" && onSuggest && (
              <button
                onClick={() => onSuggest(s._id)}
                className="wspm-btn wspm-btn-success"
              >
                Suggest Replacement
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}