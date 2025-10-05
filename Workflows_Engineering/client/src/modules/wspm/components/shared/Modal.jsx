import React, { useEffect } from "react";
import "../../styles/globals.css";

export default function Modal({ isOpen, onClose, children, title, size = "md" }) {
  const sizes = {
    sm: "wspm-modal-sm",
    md: "wspm-modal-md",
    lg: "wspm-modal-lg",
    xl: "wspm-modal-xl",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="wspm-modal-overlay">
      <div className="wspm-modal-container">
        {/* Backdrop */}
        <div
          className="wspm-modal-backdrop"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div
          className={`wspm-modal ${sizes[size]}`}
        >
          {/* Header */}
          {title && (
            <div className="wspm-modal-header">
              <h3 className="wspm-modal-title">{title}</h3>
              <button
                onClick={onClose}
                className="wspm-modal-close-btn"
              >
                <svg
                  className="wspm-modal-close-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="wspm-modal-content">{children}</div>

          {/* Footer */}
          <div className="wspm-modal-footer">
            <button
              onClick={onClose}
              className="wspm-btn wspm-btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}