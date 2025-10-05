import React, { useState, useEffect } from "react";
import "./UserProjects.css";
import axios from "axios";
import NavV2 from "../Nav/NavV2";
import Footer from "../Nav/ptfdFooter";
import { useNavigate } from "react-router-dom";

const UserProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("All");
  //  const [typeFilter, setTypeFilter] = useState("All");
  const [showDemo, setShowDemo] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    preqname: "",
    preqmail: "",
    preqnumber: "",
    preqdescription: ""
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5050/projects");
        const projectData = Array.isArray(response.data) ? response.data : (response.data?.projects ?? []);
        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage("");

    try {
      await axios.post("http://localhost:5050/project-requests", formData);
      setFormMessage("Thank you! Your project request has been submitted successfully. Our team will contact you soon.");

      setFormData({
        preqname: "",
        preqmail: "",
        preqnumber: "",
        preqdescription: ""
      });

      setTimeout(() => {
        setFormMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error submitting project request:", error);
      setFormMessage("Sorry, there was an error submitting your request. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Get projects by type for section-wise display
  const getProjectsByType = (type, limit = 4) => {
    return projects.filter(project => project.ptype === type).slice(0, limit);
  };

  // Get mixed projects (different types)
  const getMixedProjects = (limit = 4) => {
    const mixedTypes = ['Industrial', 'Mixed-Use', 'Renovation', 'Government'];
    return projects.filter(project =>
      mixedTypes.includes(project.ptype) ||
      !['Infrastructure', 'Commercial', 'Residential'].includes(project.ptype)
    ).slice(0, limit);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const nextImage = () => {
    if (selectedProject && selectedProject.pimg && selectedProject.pimg.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.pimg.length);
    }
  };

  const prevImage = () => {
    if (selectedProject && selectedProject.pimg && selectedProject.pimg.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.pimg.length) % selectedProject.pimg.length);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': 'status-progress',
      'Completed': 'status-completed',
      'On Hold': 'status-hold',
      'Cancelled': 'status-cancelled',
      'Planning': 'status-planning'
    };
    return colors[status] || 'status-default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    };
    return colors[priority] || 'priority-default';
  };

  const getProjectImage = (project) => {
    if (project.pimg && project.pimg.length > 0) {
      return project.pimg[0];
    }

    const defaultImages = {
      'Residential': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Infrastructure': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Industrial': 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };

    return defaultImages[project.ptype] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  };

  return (
    <div className="premium-projects-container">
      <NavV2 />

      {showDemo && (
        <div className="premium-modal-overlay" onClick={() => setShowDemo(false)}>
          <div
            className="premium-demo-cinema"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowDemo(false)} className="premium-cinema-close">✕</button>
            <div className="premium-cinema-video">
              <iframe
                src="https://www.youtube.com/embed/MlIhVHMk788?autoplay=1&rel=0&modestbranding=1&showinfo=0"
                title="Construction Project Process"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="premium-cinema-caption">
              <h2>Construction Project Process</h2>
              <p>From planning to delivery, here's how modern construction projects come to life.</p>
            </div>
          </div>
        </div>
      )}

      {/* Premium Hero Section */}
      <section className="premium-hero" id="home">
        <div className="premium-hero-video">
          <video autoPlay loop muted playsInline>
            <source src="https://www.pexels.com/download/video/3971351/" type="video/mp4" />
          </video>
          <div className="premium-hero-overlay"></div>
        </div>
        <div className="premium-hero-content">
          <h1 className="premium-hero-title">Workflows Construction Portfolio</h1><br></br>
          <p className="premium-hero-subtitle">Building Excellence For The Future Generation</p><br></br>
          <div className="premium-hero-actions">
            <button
              className="premium-btn premium-btn-secondary premium-pulse-btn"
              onClick={() => setShowDemo(true)}
            >
              <span className="premium-play-icon">▶</span>
              Watch Projects Demo
            </button>
          </div>
        </div>
        <div className="premium-scroll-indicator">
          <span className="premium-scroll-arrow">↓</span>
        </div>
      </section>

      {/* Premium Expertise Section */}
      <section
        className={`premium-expertise ${visibleSections.has('expertise') ? 'animate-in' : ''}`}
        id="expertise"
        data-animate
      >
        <div className="premium-container">
          <div className="premium-section-header">
            <h2 className="premium-section-title">Our Expertise</h2>
            <p className="premium-section-subtitle">From residential homes to commercial complexes, we deliver excellence in every project type.</p>
          </div>
          <div className="premium-expertise-grid">
            <div className="premium-expertise-card residential">
              <div className="premium-expertise-image">
                <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Residential" />
              </div>
              <h3 className="premium-expertise-title">Residential</h3>
              <p className="premium-expertise-description">Custom homes and residential complexes built with precision and care for modern living.</p>
              <span className="premium-expertise-badge">250+ Projects</span>
            </div>

            <div className="premium-expertise-card commercial">
              <div className="premium-expertise-image">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Commercial" />
              </div>
              <h3 className="premium-expertise-title">Commercial</h3>
              <p className="premium-expertise-description">Office buildings, retail spaces, and commercial complexes designed for business success.</p>
              <span className="premium-expertise-badge">180+ Projects</span>
            </div>

            <div className="premium-expertise-card infrastructure">
              <div className="premium-expertise-image">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Infrastructure" />
              </div>
              <h3 className="premium-expertise-title">Infrastructure</h3>
              <p className="premium-expertise-description">Roads, bridges, and infrastructure projects that shape communities and cities.</p>
              <span className="premium-expertise-badge">95+ Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Infrastructure Projects Section */}
      <section
        className={`premium-project-section infrastructure-section ${visibleSections.has('infrastructure-projects') ? 'animate-in' : ''}`}
        id="infrastructure-projects"
        data-animate
      >
        <div className="timeline-desc-benefits-video-background">
          <video autoPlay loop muted playsInline>
            <source src="https://www.pexels.com/download/video/32911250/" type="video/mp4" />
          </video>
          <div className="timeline-desc-benefits-video-overlay"></div>
        </div>
        <div className="premium-container">
          <div className="premium-section-header">
            <h2 className="premium-section-title">Latest Infrastructure Projects</h2>
            <p className="premium-section-subtitle">Discover our recent infrastructure developments across various sectors.</p>
          </div>
          <div className="premium-projects-grid">
            {getProjectsByType('Infrastructure', 4).map((project, index) => (
              <div key={project._id} className="premium-project-card" style={{ animationDelay: `${index * 0.3}s` }}>
                <div className="premium-project-image">
                  <img src={getProjectImage(project)} alt={project.pname} />
                  <div className="premium-project-badges">
                    <span className={`premium-status-badge ${getStatusColor(project.pstatus)}`}>
                      {project.pstatus}
                    </span>
                    {project.ppriority && (
                      <div className={`premium-priority-dot ${getPriorityColor(project.ppriority)}`} title={`${project.ppriority} Priority`}></div>
                    )}
                  </div>
                  <div className="premium-project-overlay">
                    <button
                      onClick={() => handleViewProject(project)}
                      className="premium-view-btn"
                    >
                      👁️ View Details
                    </button>
                  </div>
                </div>
                <div className="premium-project-content">
                  <div className="premium-project-header">
                    <h3 className="premium-project-title">{project.pname}</h3>
                    <span className="premium-project-type">{project.ptype}</span>
                  </div>
                  <p className="premium-project-description">{project.pdescription}</p>
                  <div className="premium-project-footer">
                    <span className="premium-project-budget">{formatCurrency(project.pbudget)}</span>
                    <span className="premium-project-location">
                      📍 {project.plocation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Projects Section */}
      <section
        className={`premium-project-section commercial-section ${visibleSections.has('commercial-projects') ? 'animate-in' : ''}`}
        id="commercial-projects"
        data-animate
      >
        <div className="premium-container">
          <div className="premium-section-header">
            <h2 className="premium-section-title">Our Commercial Projects</h2>
            <p className="premium-section-subtitle">Explore our commercial developments and business-focused constructions.</p>
          </div>
          <div className="premium-projects-grid">
            {getProjectsByType('Commercial', 4).map((project, index) => (
              <div key={project._id} className="premium-project-card" style={{ animationDelay: `${index * 0.3}s` }}>
                <div className="premium-project-image">
                  <img src={getProjectImage(project)} alt={project.pname} />
                  <div className="premium-project-badges">
                    <span className={`premium-status-badge ${getStatusColor(project.pstatus)}`}>
                      {project.pstatus}
                    </span>
                    {project.ppriority && (
                      <div className={`premium-priority-dot ${getPriorityColor(project.ppriority)}`} title={`${project.ppriority} Priority`}></div>
                    )}
                  </div>
                  <div className="premium-project-overlay">
                    <button
                      onClick={() => handleViewProject(project)}
                      className="premium-view-btn"
                    >
                      👁️ View Details
                    </button>
                  </div>
                </div>
                <div className="premium-project-content">
                  <div className="premium-project-header">
                    <h3 className="premium-project-title">{project.pname}</h3>
                    <span className="premium-project-type">{project.ptype}</span>
                  </div>
                  <p className="premium-project-description">{project.pdescription}</p>
                  <div className="premium-project-footer">
                    <span className="premium-project-budget">{formatCurrency(project.pbudget)}</span>
                    <span className="premium-project-location">
                      📍 {project.plocation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Residential Projects Section */}
      <section
        className={`premium-project-section residential-section ${visibleSections.has('residential-projects') ? 'animate-in' : ''}`}
        id="residential-projects"
        data-animate
      >
        <div className="timeline-desc-benefits-video-background">
          <video autoPlay loop muted playsInline>
            <source src="https://www.pexels.com/download/video/2826350/" type="video/mp4" />
          </video>
          <div className="timeline-desc-benefits-video-overlay"></div>
        </div>
        <div className="premium-container">
          <div className="premium-section-header">
            <h2 className="premium-section-title">Residential Excellence</h2>
            <p className="premium-section-subtitle">Browse our residential projects and custom home developments.</p>
          </div>
          <div className="premium-projects-grid">
            {getProjectsByType('Residential', 3).map((project, index) => (
              <div key={project._id} className="premium-project-card" style={{ animationDelay: `${index * 0.3}s` }}>
                <div className="premium-project-image">
                  <img src={getProjectImage(project)} alt={project.pname} />
                  <div className="premium-project-badges">
                    <span className={`premium-status-badge ${getStatusColor(project.pstatus)}`}>
                      {project.pstatus}
                    </span>
                    {project.ppriority && (
                      <div className={`premium-priority-dot ${getPriorityColor(project.ppriority)}`} title={`${project.ppriority} Priority`}></div>
                    )}
                  </div>
                  <div className="premium-project-overlay">
                    <button
                      onClick={() => handleViewProject(project)}
                      className="premium-view-btn"
                    >
                      👁️ View Details
                    </button>
                  </div>
                </div>
                <div className="premium-project-content">
                  <div className="premium-project-header">
                    <h3 className="premium-project-title">{project.pname}</h3>
                    <span className="premium-project-type">{project.ptype}</span>
                  </div>
                  <p className="premium-project-description">{project.pdescription}</p>
                  <div className="premium-project-footer">
                    <span className="premium-project-budget">{formatCurrency(project.pbudget)}</span>
                    <span className="premium-project-location">
                      📍 {project.plocation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mixed-Use & Specialty Projects Section */}
      <section
        className={`premium-project-section mixed-section ${visibleSections.has('mixed-projects') ? 'animate-in' : ''}`}
        id="mixed-projects"
        data-animate
      >
        <div className="premium-container">
          <div className="premium-section-header">
            <h2 className="premium-section-title">Specialty & Mixed-Use Projects</h2>
            <p className="premium-section-subtitle">Innovative solutions for unique construction challenges and mixed-use developments.</p>
          </div>
          <div className="premium-projects-grid">
            {getMixedProjects(4).map((project, index) => (
              <div key={project._id} className="premium-project-card" style={{ animationDelay: `${index * 0.3}s` }}>
                <div className="premium-project-image">
                  <img src={getProjectImage(project)} alt={project.pname} />
                  <div className="premium-project-badges">
                    <span className={`premium-status-badge ${getStatusColor(project.pstatus)}`}>
                      {project.pstatus}
                    </span>
                    {project.ppriority && (
                      <div className={`premium-priority-dot ${getPriorityColor(project.ppriority)}`} title={`${project.ppriority} Priority`}></div>
                    )}
                  </div>
                  <div className="premium-project-overlay">
                    <button
                      onClick={() => handleViewProject(project)}
                      className="premium-view-btn"
                    >
                      👁️ View Details
                    </button>
                  </div>
                </div>
                <div className="premium-project-content">
                  <div className="premium-project-header">
                    <h3 className="premium-project-title">{project.pname}</h3>
                    <span className="premium-project-type">{project.ptype}</span>
                  </div>
                  <p className="premium-project-description">{project.pdescription}</p>
                  <div className="premium-project-footer">
                    <span className="premium-project-budget">{formatCurrency(project.pbudget)}</span>
                    <span className="premium-project-location">
                      📍 {project.plocation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium About Section */}
      <section
        className={`premium-about ${visibleSections.has('about') ? 'animate-in' : ''}`}
        id="about"
        data-animate
      >
        <div className="timeline-desc-benefits-video-background">
          <video autoPlay loop muted playsInline>
            <source src="https://www.pexels.com/download/video/9868164/" type="video/mp4" />
          </video>
          <div className="timeline-desc-benefits-video-overlay"></div>
        </div>
        <div className="premium-container">
          <div className="premium-about-grid">
            <div className="premium-about-content">
              <h2 className="premium-about-title">Building Excellence for the Future</h2>
              <p className="premium-about-text">
                At Workflows Engineering, we've been transforming visions into reality since 2025.
                Our commitment to quality, innovation, and customer satisfaction has made us a
                trusted partner for construction projects of all scales.
              </p>
              <div className="premium-stats-grid">
                <div className="premium-stat">
                  <div className="premium-stat-number">500+</div>
                  <div className="premium-stat-label">Projects Completed</div>
                </div>
                <div className="premium-stat">
                  <div className="premium-stat-number">25+</div>
                  <div className="premium-stat-label">Active Clients</div>
                </div>
                <div className="premium-stat">
                  <div className="premium-stat-number">98%</div>
                  <div className="premium-stat-label">Client Satisfaction</div>
                </div>
              </div>
              <button onClick={() => navigate("/join-with-us")} className="premium-btn premium-btn-primary">Learn More About Us</button>
            </div>
            <div className="premium-about-image">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Construction Team" />
              <div className="premium-about-badge">
                <div className="premium-badge-title">Excellence</div>
                <div className="premium-badge-subtitle">In Every Detail</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Contact Section */}
      <section
        className={`premium-contact ${visibleSections.has('contact') ? 'animate-in' : ''}`}
        id="contact"
        data-animate
      >
        <div className="premium-container">
          <div className="premium-section-header">
            <h2 className="premium-section-title">Start Your Project Today</h2>
            <p className="premium-section-subtitle">Ready to build something amazing? Let's discuss your construction needs.</p><br />
            <p className="premium-section-subtitle">
              <em>"One of our representatives will get in touch with you soon."</em>
            </p>
          </div>
          <div className="premium-contact-form">
            {formMessage && (
              <div className={`premium-form-message ${formMessage.includes('successfully') ? 'success' : 'error'}`}>
                {formMessage}
              </div>
            )}
            <form className="premium-form" onSubmit={handleSubmit}>
              <div className="premium-form-row">
                <input
                  type="text"
                  name="preqname"
                  placeholder="Your Name"
                  className="premium-form-input"
                  value={formData.preqname}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="preqmail"
                  placeholder="Email Address"
                  className="premium-form-input"
                  value={formData.preqmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                type="text"
                name="preqnumber"
                placeholder="Contact Number"
                className="premium-form-input"
                value={formData.preqnumber}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="preqdescription"
                placeholder="Tell us about your project..."
                rows="4"
                className="premium-form-textarea"
                value={formData.preqdescription}
                onChange={handleInputChange}
                required
              ></textarea>
              <button
                type="submit"
                className="premium-btn premium-btn-primary premium-btn-full"
                disabled={formSubmitting}
              >
                {formSubmitting ? 'Submitting...' : 'Get Free Consultation'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      {/* Premium Project Detail Modal */}
      {showModal && selectedProject && (
        <div className="premium-modal-overlay" onClick={closeModal}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="premium-modal-header">
              {selectedProject.pimg && selectedProject.pimg.length > 0 ? (
                <div className="premium-modal-image-container">
                  <img
                    src={selectedProject.pimg[currentImageIndex]}
                    alt={selectedProject.pname}
                    className="premium-modal-image"
                  />
                  {selectedProject.pimg.length > 1 && (
                    <>
                      <button onClick={prevImage} className="premium-modal-nav premium-modal-prev">‹</button>
                      <button onClick={nextImage} className="premium-modal-nav premium-modal-next">›</button>
                      <div className="premium-modal-indicators">
                        {selectedProject.pimg.map((_, index) => (
                          <div
                            key={index}
                            className={`premium-modal-indicator ${index === currentImageIndex ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="premium-modal-placeholder">
                  <span className="premium-placeholder-icon">🏢</span>
                </div>
              )}
              <button onClick={closeModal} className="premium-modal-close">✕</button>
            </div>

            {/* Modal Content */}
            <div className="premium-modal-content">
              {/* Project Header */}
              <div className="premium-modal-project-header">
                <div className="premium-modal-project-info">
                  <h2 className="premium-modal-title">{selectedProject.pname}</h2>
                  <div className="premium-modal-meta">
                    <span className="premium-modal-location">📍 {selectedProject.plocation}</span>
                    <span className="premium-modal-type">🏗️ {selectedProject.ptype}</span>
                  </div>
                </div>
                <div className="premium-modal-project-status">
                  <div className="premium-modal-budget">{formatCurrency(selectedProject.pbudget)}</div>
                  <span className={`premium-modal-status ${getStatusColor(selectedProject.pstatus)}`}>
                    {selectedProject.pstatus}
                  </span>
                </div>
              </div>

              {/* Project Details Grid */}
              <div className="premium-modal-details-grid">
                <div className="premium-modal-details-left">
                  <div className="premium-modal-info-card">
                    <h3 className="premium-modal-card-title">📋 Project Information</h3>
                    <div className="premium-modal-info-list">
                      <div className="premium-modal-info-item">
                        <span>Project Code:</span>
                        <span>{selectedProject.pcode}</span>
                      </div>
                      <div className="premium-modal-info-item">
                        <span>Owner:</span>
                        <span>{selectedProject.pownername}</span>
                      </div>
                      <div className="premium-modal-info-item">
                        <span>Priority:</span>
                        <span className={`premium-priority-badge ${getPriorityColor(selectedProject.ppriority)}`}>
                          {selectedProject.ppriority}
                        </span>
                      </div>
                      <div className="premium-modal-info-item">
                        <span>Start Date:</span>
                        <span>{new Date(selectedProject.pcreatedat).toLocaleDateString()}</span>
                      </div>
                      <div className="premium-modal-info-item">
                        <span>End Date:</span>
                        <span>{new Date(selectedProject.penddate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {selectedProject.pissues && selectedProject.pissues.length > 0 && (
                    <div className="premium-modal-issues-card">
                      <h3 className="premium-modal-card-title">⚠️ Active Issues ({selectedProject.pissues.length})</h3>
                      <div className="premium-modal-issues-list">
                        {selectedProject.pissues.slice(0, 3).map((issue, index) => (
                          <div key={index} className="premium-modal-issue-item">
                            • {typeof issue === 'string' ? issue : issue.description || 'Issue details not available'}
                          </div>
                        ))}
                        {selectedProject.pissues.length > 3 && (
                          <div className="premium-modal-more-issues">
                            +{selectedProject.pissues.length - 3} more issues
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="premium-modal-details-right">
                  <div className="premium-modal-description-card">
                    <h3 className="premium-modal-card-title">📝 Description</h3>
                    <p className="premium-modal-description">
                      {selectedProject.pdescription || 'No description available for this project.'}
                    </p>
                  </div>

                  {selectedProject.pobservations && (
                    <div className="premium-modal-observations-card">
                      <h3 className="premium-modal-card-title">👁️ Observations</h3>
                      <p className="premium-modal-observations">
                        {selectedProject.pobservations}
                      </p>
                    </div>
                  )}

                  <div className="premium-modal-stats-card">
                    <h3 className="premium-modal-card-title">📊 Project Stats</h3>
                    <div className="premium-modal-stats-grid">
                      <div className="premium-modal-stat">
                        <div className="premium-modal-stat-number">
                          {Math.floor((new Date() - new Date(selectedProject.pcreatedat)) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="premium-modal-stat-label">Days Running</div>
                      </div>
                      <div className="premium-modal-stat">
                        <div className="premium-modal-stat-number">
                          {selectedProject.pstatus === 'Completed' ? '100' :
                            selectedProject.pstatus === 'In Progress' ? '65' :
                              selectedProject.pstatus === 'Planning' ? '15' : '0'}%
                        </div>
                        <div className="premium-modal-stat-label">Progress</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="premium-modal-actions">
                <button onClick={closeModal} className="premium-btn premium-btn-outline">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProjects;
