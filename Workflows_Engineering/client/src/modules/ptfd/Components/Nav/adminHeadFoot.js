import React, { useState, useEffect, useRef } from "react";
import { BsBellFill } from "react-icons/bs";

export default function AdminHeadFoot() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const notifRef = useRef();

  // Close notification popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle notification click to clear count
  const handleNotificationClick = () => {
    setNotificationCount(0);
    setShowNotifications(false);
  };

  return (
    <>
      {/* Executive Header */}
      <header
        className="position-fixed w-100"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)",
          zIndex: 1050,
          top: 0,
          left: 0,
          height: "100px",
        }}
      >
        <div 
          className="h-100 d-flex align-items-center justify-content-between"
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 4rem",
          }}
        >
          {/* Left Section - Admin Panel */}
          <div 
            style={{ 
              flex: "0 0 300px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{
              borderLeft: "3px solid #1a1a1a",
              paddingLeft: "1.25rem",
            }}>
              <h1 
                className="mb-0 fw-bold" 
                style={{ 
                  color: "#1a1a1a", 
                  fontSize: "1.5rem",
                  letterSpacing: "-0.02em",
                  fontWeight: "700",
                }}
              >
                Admin Panel
              </h1>
              <p 
                className="mb-0 text-muted" 
                style={{ 
                  fontSize: "0.8rem",
                  marginTop: "0.15rem",
                  fontWeight: "500",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                Management Console
              </p>
            </div>
          </div>

          {/* Center Logo */}
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "75px",
                height: "75px",
                background: "#ffffff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
                border: "2px solid #f5f5f5",
              }}
            >
              <img
                src="/workflowsengineering.png"
                alt="Logo"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          {/* Right Section - Notifications */}
          <div 
            style={{ 
              flex: "0 0 300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <div 
              className="position-relative" 
              ref={notifRef}
            >
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <BsBellFill
                  size={24}
                  style={{ 
                    color: "#1a1a1a",
                    transition: "color 0.2s ease",
                  }}
                />
                {notificationCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "#dc2626",
                      color: "#ffffff",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      fontWeight: "700",
                      border: "2px solid #ffffff",
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 1rem)",
                    right: "0",
                    width: "380px",
                    background: "#ffffff",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "8px",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
                    animation: "slideDown 0.2s ease-out",
                    overflow: "hidden",
                  }}
                >
                  {/* Notification Header */}
                  <div 
                    style={{ 
                      padding: "1.25rem 1.5rem",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      background: "#fafafa",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                        Notifications
                      </h6>
                      <span 
                        style={{ 
                          fontSize: "0.75rem", 
                          color: "#6b7280",
                          fontWeight: "600",
                          background: "#f3f4f6",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "12px",
                        }}
                      >
                        {notificationCount} New
                      </span>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <div 
                      style={{ 
                        padding: "1.25rem 1.5rem",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                        cursor: "pointer",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={handleNotificationClick}
                    >
                      <div className="d-flex">
                        <div style={{ 
                          width: "40px", 
                          height: "40px", 
                          background: "#eff6ff",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "1rem",
                          flexShrink: 0,
                        }}>
                          <span style={{ fontSize: "1.25rem" }}>📊</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="mb-1 fw-semibold" style={{ color: "#1a1a1a", fontSize: "0.9rem" }}>
                            Project Report Updated
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                            Q4 financial metrics are now available for review
                          </p>
                          <small className="text-muted" style={{ fontSize: "0.75rem" }}>2 hours ago</small>
                        </div>
                      </div>
                    </div>

                    <div 
                      style={{ 
                        padding: "1.25rem 1.5rem",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                        cursor: "pointer",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={handleNotificationClick}
                    >
                      <div className="d-flex">
                        <div style={{ 
                          width: "40px", 
                          height: "40px", 
                          background: "#f0fdf4",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "1rem",
                          flexShrink: 0,
                        }}>
                          <span style={{ fontSize: "1.25rem" }}>⚙️</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="mb-1 fw-semibold" style={{ color: "#1a1a1a", fontSize: "0.9rem" }}>
                            Configuration Applied
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                            System settings updated successfully
                          </p>
                          <small className="text-muted" style={{ fontSize: "0.75rem" }}>5 hours ago</small>
                        </div>
                      </div>
                    </div>

                    <div 
                      style={{ 
                        padding: "1.25rem 1.5rem",
                        cursor: "pointer",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={handleNotificationClick}
                    >
                      <div className="d-flex">
                        <div style={{ 
                          width: "40px", 
                          height: "40px", 
                          background: "#fef3c7",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "1rem",
                          flexShrink: 0,
                        }}>
                          <span style={{ fontSize: "1.25rem" }}>🧾</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="mb-1 fw-semibold" style={{ color: "#1a1a1a", fontSize: "0.9rem" }}>
                            Invoice Ready for Review
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                            Monthly invoice #2024-10 awaits approval
                          </p>
                          <small className="text-muted" style={{ fontSize: "0.75rem" }}>1 day ago</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: "100px" }}></div>

      {/* Executive Footer */}
      <footer
        style={{
          background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 -1px 3px rgba(0, 0, 0, 0.04), 0 -8px 24px rgba(0, 0, 0, 0.06)",
          padding: "2.5rem 4rem",
          marginTop: "auto",
        }}
      >
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          <div className="row align-items-center g-4">
            {/* Left: System Title */}
            <div className="col-md-5">
              <h3 
                className="mb-2 fw-bold" 
                style={{ 
                  color: "#1a1a1a", 
                  fontSize: "1.15rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Smart Construction Workflow & Safety Management System
              </h3>
              <p 
                className="mb-0 text-muted" 
                style={{ 
                  fontSize: "0.85rem",
                  lineHeight: "1.6",
                }}
              >
                Comprehensive enterprise solution for construction project oversight and safety compliance
              </p>
            </div>

            {/* Center: Divider */}
            <div className="col-md-2 text-center d-none d-md-block">
              <div style={{
                width: "1px",
                height: "60px",
                background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                margin: "0 auto",
              }}></div>
            </div>

            {/* Right: Copyright & Info */}
            <div className="col-md-5 text-md-end">
              <p 
                className="mb-2 fw-semibold" 
                style={{ 
                  color: "#1a1a1a", 
                  fontSize: "1rem",
                }}
              >
                Workflow Engineering Nexus
              </p>
              <p 
                className="mb-1 text-muted" 
                style={{ 
                  fontSize: "0.85rem",
                }}
              >
                Administrative Dashboard © {new Date().getFullYear()}
              </p>
              <div className="d-flex align-items-center justify-content-md-end gap-3 mt-2">
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Version 2.0.1
                </small>
                <span style={{ color: "#d1d5db" }}>•</span>
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  All Rights Reserved
                </small>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
}