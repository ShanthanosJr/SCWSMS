"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BsEnvelope, BsLock, BsArrowRight, BsCheckCircle, BsExclamationCircle } from "react-icons/bs"

const SignIn = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
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

    if (!credentials.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Email address is invalid"
    }

    if (!credentials.password) {
      newErrors.password = "Password is required"
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
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
      // Sign in with backend API
      const response = await axios.post("http://localhost:5050/api/users/login", {
        email: credentials.email,
        password: credentials.password,
      })

      const userData = response.data

      // Store user data and token in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: userData.name,
          email: userData.email,
          id: userData._id,
          avatar: userData.avatar,
        }),
      )
      localStorage.setItem("token", userData.token)

      // Navigate to Projects Dashboard
      navigate("/ptfd/projects")
    } catch (error) {
      console.error("Sign in error:", error)
      if (error.response && error.response.data) {
        alert("Sign in failed: " + error.response.data.message)
      } else {
        alert("Sign in failed. Please check your credentials and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #f6f5f4 0%, #fdfcfb 100%)" }}>
      <div className="container-fluid p-0 h-100">
        <div className="row g-0 min-vh-100">
          <div
            className="col-lg-6 d-flex align-items-center justify-content-center position-relative"
            style={{
              background: "linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)",
              minHeight: "100vh",
            }}
          >
            {/* Video Background */}
            <video
              autoPlay
              muted
              loop
              className="position-absolute w-100 h-100"
              style={{
                objectFit: "cover",
                opacity: "0.3",
              }}
            >
              <source src="https://www.pexels.com/download/video/13165798/" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Content Overlay */}
            <div className="position-relative text-center text-white p-5">
              <div className="mb-4">
                <div
                  className="display-4 fw-bold mb-3"
                  style={{
                    color: "white !important",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Welcome to
                </div>

                <div
                  className="display-3 fw-bold"
                  style={{
                    background: "linear-gradient(45deg, #ffffff, #e0e7ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "none",
                  }}
                >
                  Workflows Engineering
                </div>
              </div>
              <p className="lead mb-0" style={{ textShadow: "1px 1px 2px rgba(219, 203, 29, 0.45)" }}>
                Streamline your construction projects with intelligent workflow management
              </p>
            </div>
          </div>

          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{ maxWidth: "480px" }}>
              <div
                className="card border-0 shadow-lg"
                style={{ borderRadius: "24px", background: "linear-gradient(145deg, #f6f5f4, #fdfcfb)" }}
              >
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit}>
                    {/* Header Section */}
                    <div className="mb-5 text-center">
                      <h3 className="fw-bold mb-3" style={{ color: "#6B46C1", fontSize: "1.75rem" }}>
                        <BsArrowRight className="me-3 fs-4" /> Access Your Dashboard
                      </h3>
                      <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
                        Sign in to manage your construction projects
                      </p>
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
                        value={credentials.email}
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
                    <div className="mb-5">
                      <label className="form-label fw-semibold mb-2" style={{ color: "#374151" }}>
                        <BsLock className="me-2 text-muted fs-5" /> Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.password ? "border-danger" : ""}`}
                        placeholder="Enter your password"
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
                            Signing In...
                          </>
                        ) : (
                          <>
                            <BsCheckCircle className="me-2" /> Sign In
                          </>
                        )}
                      </button>
                    </div>

                    {/* Footer Link */}
                    <div className="text-center mt-4">
                      <p className="text-muted">
                        Don't have an account?{" "}
                        <a href="/ptfd/signup" style={{ color: "#6B46C1", fontWeight: "600" }}>
                          Sign Up
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
