import React from "react";
import "../../styles/globals.css";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) {
  const baseClasses = `
    wspm-btn
    wspm-btn-${variant}
    wspm-btn-${size}
    ${fullWidth ? "wspm-btn-full-width" : ""}
    ${disabled || loading ? "wspm-btn-disabled" : ""}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {loading && (
        <svg
          className="wspm-btn-spinner"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="wspm-btn-spinner-circle"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="wspm-btn-spinner-path"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {!loading && icon && <span className="wspm-btn-icon">{icon}</span>}

      {children}
    </button>
  );
}