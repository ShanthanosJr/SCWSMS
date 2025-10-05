import React from "react";
import "../../styles/globals.css";

export default function Loader({ size = "md", text = "Loading..." }) {
  const sizes = {
    sm: "wspm-loader-sm",
    md: "wspm-loader-md",
    lg: "wspm-loader-lg",
    xl: "wspm-loader-xl",
  };

  return (
    <div className="wspm-loader-container">
      {/* Main Spinner */}
      <div className="wspm-loader-spinner-container">
        <div
          className={`wspm-loader-spinner-base ${sizes[size]}`}
        ></div>
        <div
          className={`wspm-loader-spinner-overlay ${sizes[size]}`}
          style={{
            animationDirection: "reverse",
            animationDuration: "1.5s",
          }}
        ></div>
      </div>

      {/* Loading Text */}
      {text && (
        <p className="wspm-loader-text">
          {text}
        </p>
      )}

      {/* ETM Branding */}
      <div className="wspm-loader-dots">
        <div className="wspm-loader-dot wspm-loader-dot-1"></div>
        <div
          className="wspm-loader-dot wspm-loader-dot-2"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="wspm-loader-dot wspm-loader-dot-3"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
}