import React, { useState, useEffect } from "react";
import axios from "axios";
import "./JoinWithUs.css";
import NavV2 from "../Nav/NavV2";
import { useNavigate } from "react-router-dom";
import Footer from "../Nav/ptfdFooter";

const JoinWithUs = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [currentTeamMember, setCurrentTeamMember] = useState(0);
    const [currentProject, setCurrentProject] = useState(0);
    const [currentProcess, setCurrentProcess] = useState(0);
    const [heroAnimationStep, setHeroAnimationStep] = useState(0);

    const [projects, setProjects] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        preqname: "",
        preqmail: "",
        preqnumber: "",
        preqdescription: ""
    });
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState("");

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("http://localhost:5050/projects");
                // The API returns { projects: [...] }, so we need to extract the projects array
                const projectData = response.data.projects || [];
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

            // Reset form
            setFormData({
                preqname: "",
                preqmail: "",
                preqnumber: "",
                preqdescription: ""
            });

            // Clear message after 5 seconds
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

    // Hero animation steps
    const heroSteps = [
        {
            title: "Transform Your Vision",
            subtitle: "Into Reality",
            description: "Partner with industry leaders who bring decades of expertise to every project"
        },
        {
            title: "Build Your Dreams",
            subtitle: "With Excellence",
            description: "Experience unmatched quality and innovation in every construction phase"
        },
        {
            title: "Create Tomorrow's",
            subtitle: "Infrastructure",
            description: "Join thousands of satisfied clients who chose excellence over ordinary"
        }
    ];

    // Team members with profiles
    const teamMembers = [
        {
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            name: "Michael Rodriguez",
            role: "Chief Engineer",
            experience: "15+ Years",
            specialty: "Structural Engineering",
            projects: "200+ Projects",
            description: "Leading structural engineer with expertise in high-rise buildings and complex infrastructure projects."
        },
        {
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            name: "Sarah Chen",
            role: "Lead Architect",
            experience: "12+ Years",
            specialty: "Sustainable Design",
            projects: "150+ Projects",
            description: "Award-winning architect specializing in eco-friendly and innovative architectural solutions."
        },
        {
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            name: "David Thompson",
            role: "Project Manager",
            experience: "18+ Years",
            specialty: "Large Scale Projects",
            projects: "300+ Projects",
            description: "Experienced project manager ensuring timely delivery and quality control across all project phases."
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            name: "Emily Johnson",
            role: "Financial Director",
            experience: "14+ Years",
            specialty: "Cost Optimization",
            projects: "250+ Projects",
            description: "Financial expert ensuring optimal budget management and cost-effective project delivery."
        }
    ];

    // Current projects showcase - replaced with real data from database
    const displayedProjects = projects.slice(0, 4); // Display only first 4 projects

    // Process steps
    const processSteps = [
        {
            icon: "📋",
            title: "Initial Consultation",
            description: "Free consultation to understand your vision, requirements, and project scope with detailed analysis."
        },
        {
            icon: "📐",
            title: "Design & Planning",
            description: "Comprehensive design development with 3D modeling, engineering analysis, and permit acquisition."
        },
        {
            icon: "🏗️",
            title: "Construction Phase",
            description: "Professional execution with daily progress updates, quality control, and safety management."
        },
        {
            icon: "✅",
            title: "Project Delivery",
            description: "Final inspection, quality assurance, and seamless handover with ongoing support."
        }
    ];

    // Client testimonials
    const testimonials = [
        {
            name: "Robert Anderson",
            company: "Anderson Enterprises",
            project: "Corporate Headquarters",
            rating: 5,
            text: "Exceptional quality and professionalism. They delivered our corporate headquarters ahead of schedule and under budget. Highly recommended!"
        },
        {
            name: "Maria Garcia",
            company: "Garcia Development",
            project: "Residential Complex",
            rating: 5,
            text: "Outstanding team with incredible attention to detail. Our residential complex exceeded all expectations in both design and execution."
        },
        {
            name: "James Wilson",
            company: "Wilson Industries",
            project: "Manufacturing Facility",
            rating: 5,
            text: "Professional, reliable, and innovative. They transformed our vision into a state-of-the-art manufacturing facility that boosted our productivity."
        }
    ];

    // Auto-advance animations
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setHeroAnimationStep((prev) => (prev + 1) % heroSteps.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [heroSteps.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTeamMember((prev) => (prev + 1) % teamMembers.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [teamMembers.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentProject((prev) => (prev + 1) % (displayedProjects.length || 1));
        }, 3500);
        return () => clearInterval(interval);
    }, [displayedProjects.length]);

    const nextTeamMember = () => {
        setCurrentTeamMember((prev) => (prev + 1) % teamMembers.length);
    };

    const prevTeamMember = () => {
        setCurrentTeamMember((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
    };

    const nextProcess = () => {
        setCurrentProcess((prev) => (prev + 1) % processSteps.length);
    };

    const prevProcess = () => {
        setCurrentProcess((prev) => (prev - 1 + processSteps.length) % processSteps.length);
    };

    return (
        <div className="join-container">
            <NavV2 />
            {/* Innovative Hero Section */}
            <section className="join-hero">
                <div className="join-hero-background">
                    <div className="join-hero-shapes">
                        <div className="join-shape join-shape-1"></div>
                        <div className="join-shape join-shape-2"></div>
                        <div className="join-shape join-shape-3"></div>
                        <div className="join-shape join-shape-4"></div>
                    </div>
                    <div className="join-hero-particles">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className={`join-particle join-particle-${i + 1}`}></div>
                        ))}
                    </div>
                </div>

                <div className="join-hero-content">
                    <div className="join-hero-text">
                        <div className="join-hero-badge">
                            <span className="join-badge-icon">🏆</span>
                            <span>Award-Winning Construction</span>
                        </div>

                        <div className="join-hero-title-container">
                            <h1 className="join-hero-title">
                                {heroSteps[heroAnimationStep].title}
                                <br />
                                <span className="join-hero-subtitle">
                                    {heroSteps[heroAnimationStep].subtitle}
                                </span>
                            </h1>
                        </div>

                        <p className="join-hero-description">
                            {heroSteps[heroAnimationStep].description}
                        </p>

                        <div className="join-hero-stats">
                            <div className="join-hero-stat">
                                <div className="join-stat-number">500+</div>
                                <div className="join-stat-label">Projects</div>
                            </div>
                            <div className="join-hero-stat">
                                <div className="join-stat-number">25+</div>
                                <div className="join-stat-label">Years</div>
                            </div>
                            <div className="join-hero-stat">
                                <div className="join-stat-number">98%</div>
                                <div className="join-stat-label">Satisfaction</div>
                            </div>
                        </div>

                        <div className="join-hero-buttons">
                            <button
                                className="join-hero-btn primary"
                                onClick={() => document.getElementById("contact-form").scrollIntoView({ behavior: "smooth" })}
                            >
                                Start Your Project
                            </button>

                            <button onClick={() => navigate("/user-projects")}className="join-hero-btn secondary">
                                View Portfolio
                            </button>
                        </div>
                    </div>

                    <div className="join-hero-visual">
                        <div className="join-hero-card">
                            <div className="join-card-header">
                                <div className="join-card-icon">🏗️</div>
                                <div className="join-card-title">Your Project Awaits</div>
                            </div>
                            <div className="join-card-content">
                                <div className="join-progress-ring">
                                    <svg className="join-progress-svg" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="8"
                                            strokeDasharray="283" strokeDashoffset="85" transform="rotate(-90 50 50)" />
                                    </svg>
                                    <div className="join-progress-text">
                                        <span className="join-progress-number">70%</span>
                                        <span className="join-progress-label">Ready</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="join-hero-indicators">
                    {heroSteps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setHeroAnimationStep(index)}
                            className={`join-hero-indicator ${heroAnimationStep === index ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="join-why-choose">
                <div className="join-container-inner">
                    <div className="join-why-header">
                        <h2 className="join-section-title">
                            Why Choose Our Construction Excellence?
                        </h2>
                        <p className="join-section-subtitle">
                            Discover the advantages that set us apart in the construction industry and make us the preferred choice for discerning clients.
                        </p>
                    </div>

                    <div className="join-why-grid">
                        <div className="join-why-card quality">
                            <div className="join-why-icon">🎯</div>
                            <h3 className="join-why-title">Unmatched Quality</h3>
                            <p className="join-why-description">
                                Every project meets the highest industry standards with rigorous quality control and premium materials.
                            </p>
                            <div className="join-why-metric">
                                <span className="join-metric-value">99.8%</span>
                                <span className="join-metric-label">Quality Score</span>
                            </div>
                        </div>

                        <div className="join-why-card innovation">
                            <div className="join-why-icon">💡</div>
                            <h3 className="join-why-title">Cutting-Edge Innovation</h3>
                            <p className="join-why-description">
                                Latest construction technologies and sustainable practices for future-ready buildings.
                            </p>
                            <div className="join-why-metric">
                                <span className="join-metric-value">50+</span>
                                <span className="join-metric-label">Technologies</span>
                            </div>
                        </div>

                        <div className="join-why-card timeline">
                            <div className="join-why-icon">⚡</div>
                            <h3 className="join-why-title">On-Time Delivery</h3>
                            <p className="join-why-description">
                                Proven track record of delivering projects on schedule with efficient project management.
                            </p>
                            <div className="join-why-metric">
                                <span className="join-metric-value">95%</span>
                                <span className="join-metric-label">On-Time Rate</span>
                            </div>
                        </div>

                        <div className="join-why-card support">
                            <div className="join-why-icon">🤝</div>
                            <h3 className="join-why-title">24/7 Support</h3>
                            <p className="join-why-description">
                                Dedicated support team available around the clock for all your project needs.
                            </p>
                            <div className="join-why-metric">
                                <span className="join-metric-value">24/7</span>
                                <span className="join-metric-label">Availability</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section with Video Background */}
            <section className="join-team">
                <div className="join-team-video-container">
                    <video autoPlay loop muted playsInline>
                        <source src="https://www.pexels.com/download/video/6774633/" type="video/mp4" />
                    </video>
                    <div className="join-team-overlay"></div>
                </div>

                <div className="join-team-content">
                    <div className="join-container-inner">
                        <div className="join-team-header">
                            <h2 className="join-section-title white">
                                Meet Our Expert Team
                            </h2>
                            <p className="join-section-subtitle white">
                                Our diverse team of professionals brings together decades of experience, innovation, and dedication to deliver exceptional results.
                            </p>
                        </div>

                        <div className="join-team-showcase">
                            <div className="join-team-profile">
                                <div className="join-profile-image">
                                    <img src={teamMembers[currentTeamMember].image} alt={teamMembers[currentTeamMember].name} />
                                    <div className="join-profile-overlay">
                                        <span className="join-profile-overlay-text">
                                            👤 View Full Profile
                                        </span>
                                    </div>
                                </div>
                                <div className="join-profile-info">
                                    <h3 className="join-profile-name">{teamMembers[currentTeamMember].name}</h3>
                                    <div className="join-profile-role">{teamMembers[currentTeamMember].role}</div>
                                    <div className="join-profile-details">
                                        <div className="join-profile-detail">
                                            <span className="join-detail-icon">⏱️</span>
                                            <span>{teamMembers[currentTeamMember].experience}</span>
                                        </div>
                                        <div className="join-profile-detail">
                                            <span className="join-detail-icon">🎯</span>
                                            <span>{teamMembers[currentTeamMember].specialty}</span>
                                        </div>
                                        <div className="join-profile-detail">
                                            <span className="join-detail-icon">📊</span>
                                            <span>{teamMembers[currentTeamMember].projects}</span>
                                        </div>
                                    </div>
                                    <p className="join-profile-description">
                                        {teamMembers[currentTeamMember].description}
                                    </p>
                                </div>
                            </div>

                            <div className="join-team-navigation">
                                <button onClick={prevTeamMember} className="join-team-nav-btn">
                                    ←
                                </button>
                                <div className="join-team-indicators">
                                    {teamMembers.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentTeamMember(index)}
                                            className={`join-team-indicator ${currentTeamMember === index ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                                <button onClick={nextTeamMember} className="join-team-nav-btn">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Current Projects Section */}
            <section className="join-projects">
                <div className="join-container-inner">
                    <div className="join-projects-header">
                        <h2 className="join-section-title">
                            Our Current Projects
                        </h2>
                        <p className="join-section-subtitle">
                            See our ongoing work and the quality standards we maintain across all project types and scales.
                        </p>
                    </div>

                    <div className="join-projects-showcase">
                        <div className="join-projects-carousel">
                            {displayedProjects.map((project, index) => (
                                <div
                                    key={index}
                                    className={`join-project-slide ${currentProject === index ? 'active' : ''}`}
                                >
                                    <img src={project.pimg && project.pimg.length > 0 ? project.pimg[0] : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} alt={project.pname} />
                                    <div className="join-project-info">
                                        <h3 className="join-project-name">{project.pname || "Project Name"}</h3>
                                        <div className="join-project-meta">
                                            <span className="join-project-type">{project.ptype || "Type"}</span>
                                            <span className={`join-project-status ${project.pstatus?.toLowerCase().replace(' ', '-') || 'planning'}`}>
                                                {project.pstatus || "Planning"}
                                            </span>
                                        </div>
                                        <div className="join-project-progress">
                                            <div className="join-progress-bar">
                                                <div
                                                    className="join-progress-fill"
                                                    style={{ width: '75%' }}
                                                ></div>
                                            </div>
                                            <span className="join-progress-percentage">75%</span>
                                        </div>
                                        <div className="join-project-details">
                                            <div className="join-project-detail">
                                                <span className="join-detail-label">Budget:</span>
                                                <span className="join-detail-value">{project.pbudget ? `$${project.pbudget.toLocaleString()}` : "$0"}</span>
                                            </div>
                                            <div className="join-project-detail">
                                                <span className="join-detail-label">End Date:</span>
                                                <span className="join-detail-value">{project.penddate ? new Date(project.penddate).toLocaleDateString() : "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="join-projects-navigation">
                            <button
                                onClick={() => setCurrentProject((prev) => (prev - 1 + (displayedProjects.length || 1)) % (displayedProjects.length || 1))}
                                className="join-projects-nav-btn"
                            >
                                ←
                            </button>
                            <div className="join-projects-indicators">
                                {displayedProjects.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentProject(index)}
                                        className={`join-projects-indicator ${currentProject === index ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentProject((prev) => (prev + 1) % (displayedProjects.length || 1))}
                                className="join-projects-nav-btn"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section with Video Background */}
            <section className="join-process">
                <div className="join-process-video-container">
                    <video autoPlay loop muted playsInline>
                        <source src="https://www.pexels.com/download/video/15990565/" type="video/mp4" />
                    </video>
                    <div className="join-process-overlay"></div>
                </div>

                <div className="join-process-content">
                    <div className="join-container-inner">
                        <div className="join-process-header">
                            <h2 className="join-section-title white">
                                Our Proven Process
                            </h2>
                            <p className="join-section-subtitle white">
                                From initial consultation to final delivery, our systematic approach ensures exceptional results at every stage.
                            </p>
                        </div>

                        <div className="join-process-grid">
                            {processSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`join-process-card ${currentProcess === index ? 'active' : ''}`}
                                    onClick={() => setCurrentProcess(index)}
                                >
                                    <div className="join-process-icon">{step.icon}</div>
                                    <h4 className="join-process-title">{step.title}</h4>
                                    <p className="join-process-description">{step.description}</p>
                                    <div className="join-process-number">{String(index + 1).padStart(2, '0')}</div>
                                </div>
                            ))}
                        </div>

                        <div className="join-process-navigation">
                            <button onClick={prevProcess} className="join-process-nav-btn">
                                ←
                            </button>
                            <div className="join-process-indicators">
                                {processSteps.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentProcess(index)}
                                        className={`join-process-indicator ${currentProcess === index ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                            <button onClick={nextProcess} className="join-process-nav-btn">
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="join-testimonials">
                <div className="join-container-inner">
                    <div className="join-testimonials-header">
                        <h2 className="join-section-title">
                            What Our Clients Say
                        </h2>
                        <p className="join-section-subtitle">
                            Don't just take our word for it. Hear from satisfied clients who have experienced our exceptional service and quality.
                        </p>
                    </div>

                    <div className="join-testimonials-showcase">
                        <div className="join-testimonial-card">
                            <div className="join-testimonial-content">
                                <div className="join-testimonial-stars">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <span key={i} className="join-star">⭐</span>
                                    ))}
                                </div>
                                <blockquote className="join-testimonial-text">
                                    "{testimonials[currentTestimonial].text}"
                                </blockquote>
                                <div className="join-testimonial-author">
                                    <div className="join-author-info">
                                        <div className="join-author-name">{testimonials[currentTestimonial].name}</div>
                                        <div className="join-author-company">{testimonials[currentTestimonial].company}</div>
                                        <div className="join-author-project">Project: {testimonials[currentTestimonial].project}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="join-testimonials-navigation">
                            <button
                                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                className="join-testimonials-nav-btn"
                            >
                                ←
                            </button>
                            <div className="join-testimonials-indicators">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonial(index)}
                                        className={`join-testimonials-indicator ${currentTestimonial === index ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                                className="join-testimonials-nav-btn"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="join-contact" id="contact-form">
                <div className="join-container-inner">
                    <div className="join-contact-grid">
                        <div className="join-contact-info">
                            <h2 className="join-contact-title">
                                Ready to Start Your Project?
                            </h2>
                            <p className="join-contact-description">
                                Take the first step towards bringing your construction vision to life. Our team is ready to discuss your project and provide a comprehensive consultation.
                            </p>

                            <div className="join-contact-benefits">
                                <div className="join-contact-benefit">
                                    <span className="join-benefit-icon">📞</span>
                                    <div className="join-benefit-text">
                                        <h4>Free Consultation</h4>
                                        <p>No-obligation project assessment and planning session</p>
                                    </div>
                                </div>
                                <div className="join-contact-benefit">
                                    <span className="join-benefit-icon">📋</span>
                                    <div className="join-benefit-text">
                                        <h4>Detailed Proposal</h4>
                                        <p>Comprehensive project plan with timeline and budget breakdown</p>
                                    </div>
                                </div>
                                <div className="join-contact-benefit">
                                    <span className="join-benefit-icon">🎯</span>
                                    <div className="join-benefit-text">
                                        <h4>Guaranteed Quality</h4>
                                        <p>Quality assurance with warranty and ongoing support</p>
                                    </div>
                                </div>
                            </div>

                            <div className="join-contact-stats">
                                <div className="join-contact-stat">
                                    <div className="join-contact-stat-number">24hrs</div>
                                    <div className="join-contact-stat-label">Response Time</div>
                                </div>
                                <div className="join-contact-stat">
                                    <div className="join-contact-stat-number">100%</div>
                                    <div className="join-contact-stat-label">Satisfaction</div>
                                </div>
                            </div>
                        </div>

                        <div className="join-contact-form-container">
                            <form className="join-contact-form" onSubmit={handleSubmit}>
                                <div className="join-form-header">
                                    <h3 className="join-form-title">Get Your Free Quote</h3>
                                    <p className="join-form-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>
                                </div>

                                {formMessage && (
                                    <div className={`join-form-message ${formMessage.includes('Thank you') ? 'success' : 'error'}`}>
                                        {formMessage}
                                    </div>
                                )}

                                <div className="join-form-group">
                                    <label className="join-form-label">Your Name *</label>
                                    <input
                                        type="text"
                                        name="preqname"
                                        value={formData.preqname}
                                        onChange={handleInputChange}
                                        className="join-form-input"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div className="join-form-group">
                                    <label className="join-form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        name="preqmail"
                                        value={formData.preqmail}
                                        onChange={handleInputChange}
                                        className="join-form-input"
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>

                                <div className="join-form-group">
                                    <label className="join-form-label">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="preqnumber"
                                        value={formData.preqnumber}
                                        onChange={handleInputChange}
                                        className="join-form-input"
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>

                                <div className="join-form-group">
                                    <label className="join-form-label">Project Description *</label>
                                    <textarea
                                        name="preqdescription"
                                        value={formData.preqdescription}
                                        onChange={handleInputChange}
                                        className="join-form-textarea"
                                        rows="4"
                                        placeholder="Describe your project requirements, timeline, and any specific needs..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="join-form-submit"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? (
                                        <>
                                            <span className="join-submit-icon">⏳</span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <span className="join-submit-icon">🚀</span>
                                            Get Free Consultation
                                        </>
                                    )}
                                </button>

                                <div className="join-form-footer">
                                    <p className="join-form-note">
                                        By submitting this form, you agree to our privacy policy and terms of service.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Premium Footer */}
            <Footer />
        </div>
    );
};

export default JoinWithUs;