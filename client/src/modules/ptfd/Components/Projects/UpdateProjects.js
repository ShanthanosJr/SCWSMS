import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";

function UpdateProjects() {
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Validation states
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  // Validation rules
  const validationRules = {
    pname: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-.]+$/,
      message: "Project name must be 2-100 characters, letters, numbers, spaces, hyphens, and periods only"
    },
    plocation: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: "Location must be 5-200 characters"
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

  // Check if field is read-only
  const isFieldReadOnly = (fieldName) => {
    const readOnlyFields = ['pnumber', 'pcode', 'pownerid', 'ptype'];
    return readOnlyFields.includes(fieldName);
  };


  // Handle input changes with live validation
  const handleChange = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }));

    // Mark field as touched
    setFieldTouched((prev) => ({ ...prev, [field]: true }));

    // Perform live validation
    const errors = validateField(field, value);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: errors
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
    // Handle read-only fields
    if (isFieldReadOnly(fieldName)) {
      return `${baseClasses} bg-light text-muted`;
    }

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
      const fieldValue = project[fieldName] || "";
      const fieldErrors = validateField(fieldName, fieldValue);
      if (fieldErrors) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    // Special validation for images - at least one image required (existing or new)
    if (existingImages.length === 0 && imagePreviewUrls.length === 0) {
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

  // Render validation feedback
  const renderValidationFeedback = (fieldName) => {
    // Handle read-only fields
    if (isFieldReadOnly(fieldName)) {
      return (
        <div className="valid-feedback d-block text-muted">
          <i className="fas fa-lock me-1"></i>
          Read only
        </div>
      );
    }

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


  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await axios.get(`http://localhost:5050/projects/${id}`);
        // Handle both cases (wrapped or plain project)
        const projectData = res.data.project || res.data;

        // Process issues array for display
        if (projectData.pissues && Array.isArray(projectData.pissues)) {
          projectData.pissues = projectData.pissues.join(", ");
        }

        // Handle existing images
        if (projectData.pimg) {
          if (Array.isArray(projectData.pimg)) {
            setExistingImages(projectData.pimg);
            // Keep pimg as array - no need to reassign
          } else if (typeof projectData.pimg === 'string') {
            setExistingImages([projectData.pimg]);
            projectData.pimg = [projectData.pimg]; // Convert to array
          }
        } else {
          setExistingImages([]);
          projectData.pimg = [];
        }

        setProject(projectData);
      } catch (err) {
        console.error("Error fetching project:", err);
        setMessage("❌ Failed to load project data.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  const sendRequest = async () => {
    try {
      // Process issues back to array
      const issuesArray = project.pissues
        ? project.pissues.split(",").map(issue => issue.trim()).filter(issue => issue.length > 0)
        : [];

      // Combine existing images with new images
      const finalImages = [...existingImages, ...imagePreviewUrls];

      await axios.put(`http://localhost:5050/projects/${id}`, {
        pname: project.pname,
        pnumber: project.pnumber,
        pcode: project.pcode,
        plocation: project.plocation,
        pimg: finalImages, // Send combined images array
        ptype: project.ptype,
        pownerid: project.pownerid,
        pownername: project.pownername,
        potelnumber: project.potelnumber,
        powmail: project.powmail,
        pdescription: project.pdescription,
        ppriority: project.ppriority,
        pbudget: Number(project.pbudget),
        pstatus: project.pstatus,
        penddate: project.penddate,
        pissues: issuesArray,
        pobservations: project.pobservations,
      });
      return true;
    } catch (err) {
      console.error("Error updating project:", err);
      throw err;
    }
  };

  // Handle multiple image selection for new images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedImages.length + existingImages.length > 10) {
      alert('Maximum 10 images allowed in total');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('Please select only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Check file sizes (max 2MB each to prevent timeout)
    const largeFiles = files.filter(file => file.size > 2 * 1024 * 1024);
    if (largeFiles.length > 0) {
      alert('Each image must be less than 2MB for better performance');
      return;
    }

    // Clear image validation error when files are selected
    setValidationErrors(prev => ({ ...prev, pimg: null }));
    setFieldTouched(prev => ({ ...prev, pimg: true }));

    // Convert images to base64 with compression
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Create an image element to resize
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (max width/height: 800px)
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

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality

          setSelectedImages(prev => [...prev, file]);
          setImagePreviewUrls(prev => [...prev, compressedBase64]);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));

    // Re-validate images
    const newImageCount = existingImages.length - 1 + imagePreviewUrls.length;
    if (newImageCount === 0) {
      setValidationErrors(prev => ({ ...prev, pimg: ["At least one image is required"] }));
    } else {
      setValidationErrors(prev => ({ ...prev, pimg: null }));
    }
  };

  // Remove new image
  const removeNewImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));

    // Re-validate images
    const newImageCount = existingImages.length + imagePreviewUrls.length - 1;
    if (newImageCount === 0) {
      setValidationErrors(prev => ({ ...prev, pimg: ["At least one image is required"] }));
    } else {
      setValidationErrors(prev => ({ ...prev, pimg: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    // Validate form
    if (!validateForm()) {
      setMessage("❌ Please correct the errors below before submitting.");
      setSubmitting(false);
      return;
    }

    try {
      await sendRequest();
      setMessage("✅ Project updated successfully!");

      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate("/ptfd/projects");
      }, 1500);
    } catch (err) {
      setMessage("❌ Failed to update project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#fdfcfb', minHeight: '100vh' }}>
        <Nav />
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Retrieving project blueprint...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fdfcfb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Nav />

      {/* Premium Header */}
      <section className="container-fluid px-4 py-5" style={{
        background: 'linear-gradient(135deg, #fdfcfb 0%, #f8f7f4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
                  <i className="fas fa-edit text-white fs-1"></i>
                </div>
                <div>
                  <h1 className="display-4 fw-bold mb-1" style={{
                    color: '#1a1a1a',
                    fontWeight: '700',
                    letterSpacing: '-0.02em'
                  }}>Refine Blueprint</h1>
                  <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                    Updating: {project.pname || "Project"}
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
                Elevate the precision of your project with targeted refinements. Preserve the foundation while enhancing every detail for optimal execution.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold"
                  style={{
                    borderRadius: '50px',
                    border: '2px solid #1e8449',
                    color: '#1e8449',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                  }}
                  onClick={() => navigate("/ptfd/projects")}
                >
                  <i className="fas fa-arrow-left me-2"></i>Project Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Enhanced Form Card */}
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
                    <i className="fas fa-pen-fancy text-green" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div className="w-100 text-center">
                    <h2 className="h3 fw-bold mb-1" style={{ color: '#111827' }}>Blueprint Refinement</h2>
                    <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                      Enhance the existing foundation with precision updates
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="p-5">
                  {/* Success/Error Message */}
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
                    {/* Basic Information Section */}
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
                            value={project.pname || ""}
                            onChange={(e) => handleChange('pname', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="e.g., Downtown Office Complex"
                            required
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
                              backgroundColor: '#f8f9fa',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem',
                              color: '#6c757d',
                              fontStyle: 'italic'
                            }}
                            value={project.pnumber || ""}
                            onChange={(e) => handleChange('pnumber', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="e.g., PRJ-2025-001"
                            required
                            readOnly
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
                              backgroundColor: '#f8f9fa',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem',
                              color: '#6c757d',
                              fontStyle: 'italic'
                            }}
                            value={project.pcode || ""}
                            onChange={(e) => handleChange('pcode', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="e.g., DTC-001"
                            required
                            readOnly
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
                            value={project.plocation || ""}
                            onChange={(e) => handleChange('plocation', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="e.g., 123 Main St, New York, NY"
                            required
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
                              backgroundColor: '#f8f9fa',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem',
                              color: '#6c757d',
                              fontStyle: 'italic'
                            }}
                            value={project.ptype || ""}
                            onChange={(e) => handleChange('ptype', e.target.value)}
                            required
                            disabled
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
                          <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                            Visual Documentation
                          </label>

                          {/* Existing Images */}
                          {existingImages.length > 0 && (
                            <div className="mb-4">
                              <h6 className="fw-semibold mb-3" style={{ color: '#3b82f6' }}>📷 Established Assets ({existingImages.length})</h6>
                              <div className="row g-3">
                                {existingImages.map((url, index) => (
                                  <div key={`existing-${index}`} className="col-lg-3 col-md-4 col-sm-6">
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
                                        alt={`Current ${index + 1}`}
                                        className="img-fluid w-100 h-100 object-cover"
                                        style={{ objectFit: 'cover' }}
                                      />
                                      <button
                                        type="button"
                                        className="btn position-absolute top-0 end-0"
                                        onClick={() => removeExistingImage(index)}
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
                                          e.currentTarget.style.transform = 'scale(1.15)';
                                          e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
                                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.6)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.transform = 'scale(1)';
                                          e.currentTarget.style.background = 'rgba(220, 68, 68, 0.95)';
                                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.4)';
                                        }}
                                        title="Remove Image"
                                      >
                                        <i className="fas fa-times" style={{
                                          color: 'inherit',
                                          fontSize: '14px',
                                          fontWeight: 'bold'
                                        }}></i>
                                      </button>
                                      <div className="position-absolute bottom-0 start-0 end-0 bg-primary bg-opacity-75 text-white text-center py-1" style={{ fontSize: '0.8rem' }}>
                                        Established {index + 1}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-2 text-center">
                            <small className="text-info fw-medium">
                              <i className="fas fa-info-circle me-1"></i>
                              Hover over images and click the <span className="text-danger">✕</span> button to remove them
                            </small>
                          </div>

                          {/* New Images Preview */}
                          {imagePreviewUrls.length > 0 && (
                            <div className="mb-4">
                              <h6 className="fw-semibold mb-3" style={{ color: '#059669' }}>🆕 Augmented Preview ({imagePreviewUrls.length})</h6>
                              <div className="row g-3">
                                {imagePreviewUrls.map((url, index) => (
                                  <div key={`new-${index}`} className="col-lg-3 col-md-4 col-sm-6">
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
                                        alt={`New ${index + 1}`}
                                        className="img-fluid w-100 h-100 object-cover"
                                        style={{ objectFit: 'cover' }}
                                      />
                                      <button
                                        type="button"
                                        className="btn position-absolute top-0 end-0 m-2"
                                        onClick={() => removeNewImage(index)}
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
                                          e.currentTarget.style.transform = 'scale(1.15)';
                                          e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
                                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.6)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.transform = 'scale(1)';
                                          e.currentTarget.style.background = 'rgba(220, 68, 68, 0.95)';
                                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.4)';
                                        }}
                                        title="Remove Image"
                                      >
                                        <i className="fas fa-times" style={{
                                          color: 'inherit',
                                          fontSize: '14px',
                                          fontWeight: 'bold'
                                        }}></i>
                                      </button>
                                      <div className="position-absolute bottom-0 start-0 end-0 bg-success bg-opacity-75 text-white text-center py-1" style={{ fontSize: '0.8rem' }}>
                                        {selectedImages[index]?.name || `Augmented ${index + 1}`}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 text-center">
                                <small className="text-info fw-medium">
                                  <i className="fas fa-info-circle me-1"></i>
                                  Hover over images and click the <span className="text-danger">✕</span> button to remove them
                                </small>
                              </div>
                            </div>
                          )}

                          {/* Add New Images */}
                          <div className="mb-4">
                            <h6 className="fw-semibold mb-3" style={{ color: '#059669' }}>➕ Augment Gallery</h6>
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
                            {fieldTouched.pimg && !hasFieldError('pimg') && (existingImages.length > 0 || imagePreviewUrls.length > 0) && (
                              <div className="valid-feedback d-block">
                                <i className="fas fa-check-circle me-1"></i>
                                {existingImages.length + imagePreviewUrls.length} image(s) ready for update!
                              </div>
                            )}
                            <div className="form-text mt-2" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                              Integrate up to {10 - existingImages.length - selectedImages.length} additional assets (max 2MB each). Auto-compression for seamless enhancement.
                            </div>
                          </div>

                          {/* Image Summary */}
                          <div className="mt-3 text-center">
                            <small className="text-muted fw-medium">
                              🖼️ Total: {existingImages.length + imagePreviewUrls.length} asset{existingImages.length + imagePreviewUrls.length !== 1 ? 's' : ''}
                              {existingImages.length + imagePreviewUrls.length < 10 && ` • Capacity for ${(10 - existingImages.length - imagePreviewUrls.length)} more`}
                            </small>
                          </div>
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
                              backgroundColor: '#f8f9fa',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb',
                              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem',
                              color: '#6c757d',
                              fontStyle: 'italic'
                            }}
                            value={project.pownerid || ""}
                            onChange={(e) => handleChange('pownerid', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="e.g., OWN-2025-01"
                            required
                            readOnly
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
                            value={project.pownername || ""}
                            onChange={(e) => handleChange('pownername', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="e.g., John Doe"
                            required
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
                            value={project.potelnumber || ""}
                            onChange={(e) => handleChange('potelnumber', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="e.g., +94 71 123 4567 or 071 123 4567"
                            required
                          />
                          {renderValidationFeedback("potelnumber")}
                        </div>
                        <div className="col-md-4">
                          <label
                            htmlFor="powmail"
                            className="form-label fw-semibold mb-2"
                            style={{ color: '#374151' }}
                          >
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
                              fontSize: '1rem'
                            }}
                            value={project.powmail || ""}
                            onChange={(e) => handleChange('powmail', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="e.g., owner@example.com"
                            required
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
                            value={project.pdescription || ""}
                            onChange={(e) => handleChange('pdescription', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="Detail the vision, scope, and key objectives..."
                            required
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
                            value={project.ppriority || "Medium"}
                            onChange={(e) => handleChange('ppriority', e.target.value)}
                            required
                          >
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
                              value={project.pbudget || ""}
                              onChange={(e) => handleChange('pbudget', e.target.value)}
                              onBlur={handleBlur}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
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
                            value={project.pstatus || ""}
                            onChange={(e) => handleChange('pstatus', e.target.value)}
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
                            Horizon <span className="text-danger">*</span>
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
                            value={
                              project.penddate
                                ? new Date(project.penddate).toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) => handleChange('penddate', e.target.value)}
                            onBlur={handleBlur}
                            required
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
                            value={project.pissues || ""}
                            onChange={(e) => handleChange('pissues', e.target.value)}
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
                            value={project.pobservations || ""}
                            onChange={(e) => handleChange('pobservations', e.target.value)}
                            placeholder="Capture preliminary notes, site observations, or strategic considerations..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Submit Buttons */}
                    <div className="d-flex justify-content-end gap-3">
                      <button
                        type="button"
                        className="btn px-6 py-3 fw-semibold"
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
                        disabled={submitting}
                      >
                        <i className="fas fa-times me-2"></i>Abandon
                      </button>
                      <button
                        type="submit"
                        className="btn px-6 py-3 fw-semibold"
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
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ width: '1rem', height: '1rem' }}></span>
                            Refining Blueprint...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Preserve Updates
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

export default UpdateProjects;