"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BsPerson, BsEnvelope, BsLock, BsArrowRight, BsCheckCircle, BsExclamationCircle } from "react-icons/bs"

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!userData.name) {
      newErrors.name = "Name is required"
    } else if (userData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters"
    } else if (userData.name.length > 30) {
      newErrors.name = "Name must be less than 30 characters"
    } else if (!/^[A-Za-z\s]+$/.test(userData.name)) {
      newErrors.name = "Name can only contain letters and spaces"
    }

    if (!userData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email address is invalid"
    }

    if (!userData.password) {
      newErrors.password = "Password is required"
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Register with backend API
      const response = await axios.post("http://localhost:5050/api/users/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      })

      const userDataResponse = response.data

      // Store user data and token in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: userDataResponse.name,
          email: userDataResponse.email,
          id: userDataResponse._id,
          avatar: userDataResponse.avatar,
        }),
      )
      localStorage.setItem("token", userDataResponse.token)

      // Navigate to Projects dashboard
      navigate("/projects")
    } catch (error) {
      console.error("Sign up error:", error)
      if (error.response && error.response.data) {
        alert("Sign up failed: " + error.response.data.message)
      } else {
        alert("Sign up failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 p-0 m-0"
      style={{ background: "linear-gradient(135deg, #f6f5f4 0%, #fdfcfb 100%)", width: "100vw", overflow: "hidden" }}
    >
      <div className="h-100 p-0 m-0" style={{ width: "100vw" }}>
        <div className="row h-100 g-0 m-0">
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{ maxWidth: "500px" }}>
              <div
                className="card border-0 shadow-lg"
                style={{ borderRadius: "24px", background: "linear-gradient(145deg, #f6f5f4, #fdfcfb)" }}
              >
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit}>
                    {/* Header Section */}
                    <div className="mb-5 text-center">
                      <h3 className="fw-bold mb-3" style={{ color: "#6B46C1", fontSize: "1.75rem" }}>
                        <BsArrowRight className="me-3 fs-4" /> Create Your Account
                      </h3>
                      <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
                        Sign up for construction management
                      </p>
                    </div>

                    {/* Name Section */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: "#374151" }}>
                        <BsPerson className="me-2 text-muted fs-5" /> Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.name ? "border-danger" : ""}`}
                        placeholder="Enter your full name"
                        style={{
                          borderRadius: "16px",
                          backgroundColor: "#fdfcfb",
                          border: "1px solid #e5e7eb",
                          fontSize: "1rem",
                        }}
                      />
                      {errors.name && (
                        <small className="text-danger d-block mt-1">
                          <BsExclamationCircle className="me-1" /> {errors.name}
                        </small>
                      )}
                    </div>

                    {/* Email Section */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: "#374151" }}>
                        <BsEnvelope className="me-2 text-muted fs-5" /> Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.email ? "border-danger" : ""}`}
                        placeholder="Enter your email"
                        style={{
                          borderRadius: "16px",
                          backgroundColor: "#fdfcfb",
                          border: "1px solid #e5e7eb",
                          fontSize: "1rem",
                        }}
                      />
                      {errors.email && (
                        <small className="text-danger d-block mt-1">
                          <BsExclamationCircle className="me-1" /> {errors.email}
                        </small>
                      )}
                    </div>

                    {/* Password Section */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: "#374151" }}>
                        <BsLock className="me-2 text-muted fs-5" /> Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.password ? "border-danger" : ""}`}
                        placeholder="Create a password"
                        style={{
                          borderRadius: "16px",
                          backgroundColor: "#fdfcfb",
                          border: "1px solid #e5e7eb",
                          fontSize: "1rem",
                        }}
                      />
                      {errors.password && (
                        <small className="text-danger d-block mt-1">
                          <BsExclamationCircle className="me-1" /> {errors.password}
                        </small>
                      )}
                    </div>

                    {/* Confirm Password Section */}
                    <div className="mb-5">
                      <label className="form-label fw-semibold mb-2" style={{ color: "#374151" }}>
                        <BsLock className="me-2 text-muted fs-5" /> Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.confirmPassword ? "border-danger" : ""}`}
                        placeholder="Confirm your password"
                        style={{
                          borderRadius: "16px",
                          backgroundColor: "#fdfcfb",
                          border: "1px solid #e5e7eb",
                          fontSize: "1rem",
                        }}
                      />
                      {errors.confirmPassword && (
                        <small className="text-danger d-block mt-1">
                          <BsExclamationCircle className="me-1" /> {errors.confirmPassword}
                        </small>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-lg px-5 py-3 fw-semibold w-100"
                        style={{
                          borderRadius: "50px",
                          background: "linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)",
                          border: "none",
                          color: "#fff",
                          fontSize: "1.1rem",
                          boxShadow: "0 8px 25px rgba(107, 70, 193, 0.4)",
                          transition: "all 0.3s ease",
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                              style={{ width: "1rem", height: "1rem" }}
                            ></span>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <BsCheckCircle className="me-2" /> Create Account
                          </>
                        )}
                      </button>
                    </div>

                    {/* Footer Link */}
                    <div className="text-center mt-4">
                      <p className="text-muted">
                        Already have an account?{" "}
                        <a href="/ptfd/signin" style={{ color: "#6B46C1", fontWeight: "600" }}>
                          Sign In
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-lg-6 position-relative d-flex align-items-center justify-content-center"
            style={{
              background: "linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)",
              minHeight: "100vh",
              overflow: "hidden",
              padding: 0,
              margin: 0,
              position: "fixed",
              right: 0,
              top: 0,
              width: "50vw",
            }}
          >
            {/* Video Background */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="position-absolute"
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: "0.3",
                margin: 0,
                padding: 0,
              }}
              onEnded={(e) => {
                e.target.playbackRate = e.target.playbackRate === 1 ? -1 : 1
                e.target.play()
              }}
            >
              <source src="https://www.pexels.com/download/video/16148130/" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Content Overlay */}
            <div className="position-relative text-center text-white px-4" style={{ zIndex: 2 }}>
              <div className="mb-4">
                <h1
                  className="display-4 fw-bold mb-4"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    fontSize: "3.5rem",
                  }}
                >
                  Welcome to
                </h1>
                <h2
                  className="display-5 fw-bold"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    fontSize: "2.8rem",
                    background: "linear-gradient(45deg, #ffffff, #f8fafc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Workflows Engineering
                </h2>
              </div>

              <div className="mt-5">
                <p
                  className="lead fs-4 mb-4"
                  style={{
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    maxWidth: "400px",
                    margin: "0 auto",
                  }}
                >
                  Join our construction management platform and streamline your projects
                </p>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                    <small className="text-black fw-semibold">Project Management</small>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-pill px-4 py-2">
                    <small className="text-black fw-semibold">Team Collaboration</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              className="position-absolute"
              style={{
                top: "10%",
                right: "10%",
                width: "100px",
                height: "100px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                animation: "float 6s ease-in-out infinite",
              }}
            ></div>

            <div
              className="position-absolute"
              style={{
                bottom: "15%",
                left: "15%",
                width: "60px",
                height: "60px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                animation: "float 4s ease-in-out infinite reverse",
              }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        video::-webkit-media-controls {
          display: none !important;
        }
        
        video {
          pointer-events: none;
        }
        
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }
        
        .container-fluid {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .row {
          margin: 0 !important;
        }
      `}</style>
    </div>
  )
}

export default SignUp
