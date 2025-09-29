import React, { useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";

export default function AddProjects() {
  const [formData, setFormData] = useState({
    pname: "",
    pnumber: "",
    pcode: "",
    plocation: "",
    pimg: [],
    ptype: "",
    pownerid: "",
    pownername: "",
    potelnumber: "",
    powmail: "",
    pdescription: "",
    ppriority: "",
    pbudget: "",
    pstatus: "",
    penddate: "",
    pissues: "",
    pobservations: "",
  });

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation rules
  const validationRules = {
    pname: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-.]+$/,
      message: "Project name must be 2-100 characters, letters, numbers, spaces, hyphens, and periods only"
    },
    pnumber: {
      required: true,
      pattern: /^[A-Z]{2,4}-\d{4}-\d{4}$/,
      message: "Format: PRJ-2024-0000 (2-4 letters, year, 3-digit number)"
    },
    pcode: {
      required: true,
      minLength: 3,
      maxLength: 10,
      pattern: /^[A-Z0-9-]+$/,
      message: "3-10 characters, uppercase letters, numbers, and hyphens only"
    },
    plocation: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: "Location must be 5-200 characters"
    },
    pownerid: {
      required: true,
      pattern: /^OWN-\d{4}-\d{4}$/,
      message: "Format: OWN-2024-0000"
    },
    pownername: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-.]+$/,
      message: "2-50 characters, letters, spaces, hyphens, and periods only"
    },
    potelnumber: {
      required: true,
      pattern: /^(?:0\d{9}|\+94[\s-]?\d{2,3}[\s-]?\d{3}[\s-]?\d{3})$/,
      message: "Valid phone number must be like 0712345678 or +94 712 345 678"
    },
    powmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Valid email address required"
    },
    pdescription: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: "Description must be 10-1000 characters"
    },
    pbudget: {
      required: true,
      min: 1000,
      max: 100000000,
      message: "Budget must be between $1,000 and $100,000,000"
    },
    penddate: {
      required: true,
      futureDate: true,
      message: "End date must be in the future"
    }
  };

  // Live validation function
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;

    const errors = [];

    // Required validation
    if (rule.required && (!value || value.toString().trim() === "")) {
      errors.push(`${getFieldLabel(name)} is required`);
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === "") {
      return errors.length > 0 ? errors : null;
    }

    // String length validations
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`Minimum ${rule.minLength} characters required`);
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`Maximum ${rule.maxLength} characters allowed`);
    }

    // Numeric validations
    if (rule.min && parseFloat(value) < rule.min) {
      errors.push(`Minimum value: ${rule.min.toLocaleString()}`);
    }
    if (rule.max && parseFloat(value) > rule.max) {
      errors.push(`Maximum value: ${rule.max.toLocaleString()}`);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.message);
    }

    // Custom validations
    if (name === 'penddate' && rule.futureDate) {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate <= today) {
        errors.push("End date must be in the future");
      }
    }

    // Email uniqueness check ( API call )
    if (name === 'powmail' && rule.pattern && rule.pattern.test(value)) {
      //  API call to check email uniqueness
      // For now, just basic validation
    }

    return errors.length > 0 ? errors : null;
  };

  // Get user-friendly field labels
  const getFieldLabel = (name) => {
    const labels = {
      pname: "Project Name",
      pnumber: "Project Number",
      pcode: "Project Code",
      plocation: "Location",
      pownerid: "Owner ID",
      pownername: "Owner Name",
      potelnumber: "Phone Number",
      powmail: "Email",
      pdescription: "Description",
      pbudget: "Budget",
      penddate: "End Date"
    };
    return labels[name] || name;
  };

  // Handle input changes with live validation
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Mark field as touched
    setFieldTouched((prev) => ({ ...prev, [name]: true }));

    // Perform live validation
    const errors = validateField(name, value);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: errors
    }));
  };

  // Handle field blur (when user leaves the field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFieldTouched((prev) => ({ ...prev, [name]: true }));

    // Re-validate on blur for more comprehensive checking
    const errors = validateField(name, value);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: errors
    }));
  };

  // Check if field has errors and is touched
  const hasFieldError = (fieldName) => {
    return fieldTouched[fieldName] && validationErrors[fieldName] && validationErrors[fieldName].length > 0;
  };

  // Get field CSS classes based on validation state
  const getFieldClasses = (fieldName, baseClasses = "form-control form-control-lg") => {
    if (!fieldTouched[fieldName]) return baseClasses;

    if (hasFieldError(fieldName)) {
      return `${baseClasses} is-invalid`;
    } else if (validationErrors[fieldName] === null) {
      return `${baseClasses} is-valid`;
    }

    return baseClasses;
  };

  // Enhanced form validation before submit
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(validationRules).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, formData[fieldName]);
      if (fieldErrors) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    // Special validation for images
    if (formData.pimg.length === 0) {
      errors.pimg = ["At least one image is required"];
      isValid = false;
    }

    // Mark all fields as touched to show errors
    const touchedFields = {};
    Object.keys(validationRules).forEach(field => {
      touchedFields[field] = true;
    });
    touchedFields.pimg = true;

    setFieldTouched(touchedFields);
    setValidationErrors(errors);

    return isValid;
  };

  // Handle issues input
  const handleIssuesChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, pissues: value }));
  };

  // Image handling (unchanged)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedImages.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('Please select only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    const largeFiles = files.filter(file => file.size > 2 * 1024 * 1024);
    if (largeFiles.length > 0) {
      alert('Each image must be less than 2MB for better performance');
      return;
    }

    // Clear image validation error when files are selected
    setValidationErrors(prev => ({ ...prev, pimg: null }));
    setFieldTouched(prev => ({ ...prev, pimg: true }));

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxSize = 800;
          let { width, height } = img;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          setSelectedImages(prev => [...prev, file]);
          setImagePreviewUrls(prev => [...prev, compressedBase64]);
          setFormData(prev => ({
            ...prev,
            pimg: [...prev.pimg, compressedBase64]
          }));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      pimg: prev.pimg.filter((_, i) => i !== index)
    }));

    // Re-validate images
    const newImageCount = formData.pimg.length - 1;
    if (newImageCount === 0) {
      setValidationErrors(prev => ({ ...prev, pimg: ["At least one image is required"] }));
    } else {
      setValidationErrors(prev => ({ ...prev, pimg: null }));
    }
  };

  // Enhanced submit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate form
    if (!validateForm()) {
      setMessage("❌ Please correct the errors below before submitting.");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        pissues: formData.pissues ? formData.pissues.split(",").map(issue => issue.trim()) : []
      };

      console.log('Submitting project data:', {
        ...submitData,
        pimg: `[${submitData.pimg.length} images]`
      });

      const res = await axios.post("http://localhost:5050/projects", submitData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      });

      setMessage("✅ Project added successfully!");
      console.log("Project created:", res.data);

      // Navigate to projects page after a short delay
      setTimeout(() => {
        navigate("/projects");
      }, 1500);

      // Reset form
      setFormData({
        pname: "",
        pnumber: "",
        pcode: "",
        plocation: "",
        pimg: [],
        ptype: "",
        pownerid: "",
        pownername: "",
        potelnumber: "",
        powmail: "",
        pdescription: "",
        ppriority: "",
        pbudget: "",
        pstatus: "",
        penddate: "",
        pissues: "",
        pobservations: "",
      });
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setValidationErrors({});
      setFieldTouched({});

      document.getElementById('pimg').value = '';

    } catch (err) {
      console.error('Error submitting project:', err);
      setMessage(`❌ Failed to add project: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Render validation feedback
  const renderValidationFeedback = (fieldName) => {
    if (hasFieldError(fieldName)) {
      return (
        <div className="invalid-feedback d-block">
          {validationErrors[fieldName].map((error, index) => (
            <div key={index} className="d-flex align-items-center mt-1">
              <i className="fas fa-exclamation-circle me-1"></i>
              {error}
            </div>
          ))}
        </div>
      );
    } else if (fieldTouched[fieldName] && validationErrors[fieldName] === null) {
      return (
        <div className="valid-feedback d-block">
          <i className="fas fa-check-circle me-1"></i>
          Looks good!
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ backgroundColor: '#fdfcfb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Nav />

      {/* Header section remains the same */}
      <section className="container-fluid px-4 py-5" style={{
        background: 'linear-gradient(135deg, #fdfcfb 0%, #f8f7f4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header content unchanged */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div className="row justify-content-center position-relative">
          <div className="col-lg-10">
            <div className="text-center mb-5" style={{
              borderRadius: '24px',
              padding: '4rem 3rem',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 252, 251, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)',
                  marginRight: '1rem'
                }}>
                  <i className="fas fa-building text-white fs-1"></i>
                </div>
                <div>
                  <h1 className="display-3 fw-bold mb-1" style={{
                    color: '#1a1a1a',
                    fontWeight: '700',
                    letterSpacing: '-0.02em'
                  }}>Refine New Project</h1>
                  <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                    Elevate your construction workflow with precision and elegance
                  </p>
                </div>
              </div>
              <p className="lead mb-4" style={{
                color: '#6b7280',
                fontSize: '1.25rem',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Seamlessly integrate new initiatives into Workflows Engineering's premium ecosystem. Track every milestone with unparalleled clarity and ensure unwavering safety across all sites.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <a href="/ptfd/projects" className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                  borderRadius: '50px',
                  border: '2px solid #1e8449',
                  color: '#1e8449',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                }}>
                  <i className="fas fa-folder-open me-2"></i>View Projects
                </a>
                <a href="/ptfd/project-timelines" className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '600',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fas fa-calendar-alt me-2"></i>Timelines
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-xl" style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #ffffff 0%, #fdfcfb 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div className="card-header bg-transparent border-0 py-5 px-5">
                <div className="d-flex align-items-center">
                  <div className="bg-gradient p-3 rounded-3 me-4" style={{
                    background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)'
                  }}>
                    <i className="fas fa-plus text-black" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div className="w-100 text-center">
                    <h2 className="h3 fw-bold mb-1" style={{ color: "#111827" }}>
                      Project Blueprint
                    </h2>
                    <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                      Craft your project's foundation with meticulous detail
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="p-5">
                  {message && (
                    <div className={`alert ${message.includes('✅') ? 'alert-success border-0 shadow-sm bg-gradient' : 'alert-danger border-0 shadow-sm bg-gradient-danger'} fade show mb-5`} style={{
                      borderRadius: '16px',
                      background: message.includes('✅') ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}>
                      <div className="d-flex align-items-center">
                        <i className={`fas ${message.includes('✅') ? 'fa-check-circle me-3 fs-4' : 'fa-exclamation-circle me-3 fs-4'}`}></i>
                        <div className="flex-grow-1">{message}</div>
                      </div>
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-auto"
                        onClick={() => setMessage("")}
                        aria-label="Close"
                      ></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Basic Information Section with Live Validation */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4" style={{
                        color: '#d4af37',
                        borderBottom: '3px solid #f8f7f4',
                        paddingBottom: '1rem',
                        fontSize: '1.25rem'
                      }}>
                        <i className="fas fa-info-circle me-3 text-muted fs-5"></i>Core Essentials
                      </h5>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label htmlFor="pname" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Project Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="pname"
                            name="pname"
                            className={getFieldClasses("pname")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.pname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., Downtown Office Complex"
                          />
                          {renderValidationFeedback("pname")}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="pnumber" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Project Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="pnumber"
                            name="pnumber"
                            className={getFieldClasses("pnumber")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.pnumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., PRJ-2025-001"
                          />
                          {renderValidationFeedback("pnumber")}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="pcode" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Project Code <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="pcode"
                            name="pcode"
                            className={getFieldClasses("pcode")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.pcode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., DTC-001"
                          />
                          {renderValidationFeedback("pcode")}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="plocation" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Location <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="plocation"
                            name="plocation"
                            className={getFieldClasses("plocation")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.plocation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., 123 Main St, New York, NY"
                          />
                          {renderValidationFeedback("plocation")}
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="ptype" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Type <span className="text-danger">*</span>
                          </label>
                          <select
                            id="ptype"
                            name="ptype"
                            className="form-select form-select-lg"
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.ptype}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select category...</option>
                            <option value="Residential">🏠 Residential</option>
                            <option value="Commercial">🏢 Commercial</option>
                            <option value="Industrial">🏭 Industrial</option>
                            <option value="Infrastructure">🛣️ Infrastructure</option>
                            <option value="Institutional">🏫 Institutional</option>
                            <option value="Renovation">🔨 Renovation</option>
                            <option value="Landscaping">🌳 Landscaping</option>
                            <option value="Mixed-Use">🏙️ Mixed-Use</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label htmlFor="pimg" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Visual Documentation <span className="text-danger">*</span>
                          </label>
                          <input
                            type="file"
                            id="pimg"
                            name="pimg"
                            className={`form-control form-control-lg ${hasFieldError('pimg') ? 'is-invalid' : fieldTouched.pimg && !hasFieldError('pimg') ? 'is-valid' : ''}`}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '2px dashed #d1d5db',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {hasFieldError('pimg') && (
                            <div className="invalid-feedback d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {validationErrors.pimg[0]}
                            </div>
                          )}
                          {fieldTouched.pimg && !hasFieldError('pimg') && formData.pimg.length > 0 && (
                            <div className="valid-feedback d-block">
                              <i className="fas fa-check-circle me-1"></i>
                              {formData.pimg.length} image(s) uploaded successfully!
                            </div>
                          )}
                          <div className="form-text mt-2" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                            Upload up to 10 images (max 2MB each). Auto-compression applied for seamless integration.
                          </div>

                          {/* Enhanced Image Preview */}
                          {imagePreviewUrls.length > 0 && (
                            <div className="mt-4">
                              <h6 className="fw-semibold mb-3" style={{ color: '#374151' }}>📸 Preview Gallery</h6>
                              <div className="row g-3">
                                {imagePreviewUrls.map((url, index) => (
                                  <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="position-relative rounded-3 overflow-hidden shadow-sm" style={{
                                      height: '160px',
                                      background: 'linear-gradient(135deg, #f8f7f4 0%, #fdfcfb 100%)',
                                      transition: 'all 0.3s ease',
                                    }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                                      }}>
                                      <img
                                        src={url}
                                        alt={`Asset ${index + 1}`}
                                        className="img-fluid w-100 h-100 object-cover"
                                        style={{ objectFit: 'cover' }}
                                      />
                                      <button
                                        type="button"
                                        className="btn position-absolute top-0 end-0 m-2"
                                        onClick={() => removeImage(index)}
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          borderRadius: '50%',
                                          background: 'rgba(220, 38, 38, 0.95)',
                                          color: 'white',
                                          border: 'none',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                                          cursor: 'pointer',
                                          zIndex: 20,
                                          transition: 'all 0.2s ease',
                                          transform: 'scale(1)',
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.transform = 'scale(1.1)';
                                          e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
                                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.6)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.transform = 'scale(1)';
                                          e.currentTarget.style.background = 'rgba(220, 38, 38, 0.95)';
                                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.04)';
                                        }}
                                        title="Remove Image"
                                      >
                                        <i className="fas fa-times" style={{
                                          color: 'inherit',
                                          fontSize: '14px',
                                          fontWeight: 'bold'
                                        }}></i>
                                      </button>
                                      <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white text-center py-1" style={{ fontSize: '0.8rem' }}>
                                        {selectedImages[index]?.name || `Image ${index + 1}`}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 text-center">
                                <small className="text-muted fw-medium">
                                  🖼️ {selectedImages.length} asset{selectedImages.length !== 1 ? 's' : ''} captured
                                  {selectedImages.length < 10 && ` | Room for ${(10 - selectedImages.length)} more`}
                                </small>
                              </div>
                              <div className="mt-2 text-center">
                                <small className="text-info fw-medium">
                                  <i className="fas fa-info-circle me-1"></i>
                                  Hover over images and click the <span className="text-danger">✕</span> button to remove them
                                </small>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Owner Information Section */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4" style={{
                        color: '#d4af37',
                        borderBottom: '3px solid #f8f7f4',
                        paddingBottom: '1rem',
                        fontSize: '1.25rem'
                      }}>
                        <i className="fas fa-user-tie me-3 text-muted fs-5"></i>Stakeholder Profile
                      </h5>
                      <div className="row g-4">
                        <div className="col-md-4">
                          <label htmlFor="pownerid" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Identifier <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="pownerid"
                            name="pownerid"
                            className={getFieldClasses("pownerid")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.pownerid}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., OWN-2025-01"
                          />
                          {renderValidationFeedback("pownerid")}
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="pownername" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Full Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="pownername"
                            name="pownername"
                            className={getFieldClasses("pownername")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.pownername}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., John Doe"
                          />
                          {renderValidationFeedback("pownername")}
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="potelnumber" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Contact <span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            id="potelnumber"
                            name="potelnumber"
                            className={getFieldClasses("potelnumber")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.potelnumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., +(94) 123-456-789 or 071-123-4567"
                          />
                          {renderValidationFeedback("potelnumber")}
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="powmail" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            id="powmail"
                            name="powmail"
                            className={getFieldClasses("powmail")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem',
                            }}
                            value={formData.powmail}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., owner@example.com"
                          />
                          {renderValidationFeedback("powmail")}
                        </div>
                      </div>
                    </div>

                    {/* Project Details Section */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4" style={{
                        color: '#d4af37',
                        borderBottom: '3px solid #f8f7f4',
                        paddingBottom: '1rem',
                        fontSize: '1.25rem'
                      }}>
                        <i className="fas fa-cogs me-3 text-muted fs-5"></i>Strategic Parameters
                      </h5>
                      <div className="row g-4">
                        <div className="col-12">
                          <label htmlFor="pdescription" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Narrative <span className="text-danger">*</span>
                          </label>
                          <textarea
                            id="pdescription"
                            name="pdescription"
                            className={getFieldClasses("pdescription", "form-control")}
                            rows="4"
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem',
                              minHeight: '140px',
                              resize: 'vertical'
                            }}
                            value={formData.pdescription}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Detail the vision, scope, and key objectives..."
                          />
                          {renderValidationFeedback("pdescription")}
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="ppriority" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Urgency <span className="text-danger">*</span>
                          </label>
                          <select
                            id="ppriority"
                            name="ppriority"
                            className="form-select form-select-lg"
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.ppriority}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Set priority...</option>
                            <option value="High">🔴 Critical</option>
                            <option value="Medium">🟡 Elevated</option>
                            <option value="Low">🟢 Standard</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="pbudget" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Allocation <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0 text-muted fs-6" style={{
                              backgroundColor: '#fdfcfb',
                              borderColor: '#e5e7eb',
                              borderRight: 'none !important'
                            }}>$</span>
                            <input
                              type="number"
                              id="pbudget"
                              name="pbudget"
                              className={getFieldClasses("pbudget")}
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#fdfcfb',
                                padding: '1rem 1.25rem',
                                borderLeft: 'none',
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.2s ease',
                                fontSize: '1rem'
                              }}
                              value={formData.pbudget}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          {renderValidationFeedback("pbudget")}
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="pstatus" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Phase <span className="text-danger">*</span>
                          </label>
                          <select
                            id="pstatus"
                            name="pstatus"
                            className="form-select form-select-lg"
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.pstatus}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Initiate phase...</option>
                            <option value="Planned">📋 Conceptual</option>
                            <option value="In Progress">⚡ Active</option>
                            <option value="Completed">✅ Fulfilled</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="penddate" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Estimated Horizon <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            id="penddate"
                            name="penddate"
                            className={getFieldClasses("penddate")}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.penddate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {renderValidationFeedback("penddate")}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="pissues" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Potential Hurdles
                          </label>
                          <input
                            type="text"
                            id="pissues"
                            name="pissues"
                            className="form-control form-control-lg"
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem'
                            }}
                            value={formData.pissues}
                            onChange={handleIssuesChange}
                            placeholder="e.g., permitting delays, supply chain risks"
                          />
                          <div className="form-text mt-1" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                            Delimit with commas for multiple entries
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="pobservations" className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Insights & Annotations
                          </label>
                          <textarea
                            id="pobservations"
                            name="pobservations"
                            className="form-control"
                            rows="3"
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem',
                              minHeight: '120px',
                              resize: 'vertical'
                            }}
                            value={formData.pobservations}
                            onChange={handleChange}
                            placeholder="Capture preliminary notes, site observations, or strategic considerations..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Submit Button */}
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn px-6 py-3 fw-semibold me-3"
                        style={{
                          borderRadius: '50px',
                          border: '2px solid #1e8449',
                          color: '#1e8449',
                          background: 'transparent',
                          fontSize: '1.1rem',
                          boxShadow: '0 4px 15px rgba(107, 114, 128, 0.2)',
                          transition: 'all 0.3s ease',
                          minWidth: '160px'
                        }}
                        onClick={() => navigate("/ptfd/projects")}
                        disabled={loading}
                      >
                        <i className="fas fa-times me-2"></i>Abandon
                      </button>
                      <button
                        type="submit"
                        className="btn btn-lg px-6 py-3 fw-semibold"
                        style={{
                          borderRadius: '50px',
                          background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
                          border: 'none',
                          color: '#fff',
                          fontSize: '1.1rem',
                          boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
                          transition: 'all 0.3s ease',
                          minWidth: '200px'
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ width: '1rem', height: '1rem' }}></span>
                            Initiating Project...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-rocket me-2"></i>
                            Launch Project
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}