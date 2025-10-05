import React, { useState, useEffect } from "react";
import "./UserTimeline.css";
import NavV2 from "../Nav/NavV2";
import Footer from "../Nav/ptfdFooter";
import { useNavigate } from "react-router-dom";

const UserTimeline = () => {
    const navigate = useNavigate();
    const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(0);
    const [currentBenefit, setCurrentBenefit] = useState(0);
    const [currentProcess, setCurrentProcess] = useState(0);
    const [showDemo, setShowDemo] = useState(false);
    const [visibleSections, setVisibleSections] = useState(new Set());

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

    // Video slides for header section
    const videoSlides = [
        {
            video: "https://www.pexels.com/download/video/11887097/",
            title: "Timeline Analysis",
            description: "Timeline management begins with comprehensive project analysis, evaluating scope, complexity, and resource requirements to create accurate scheduling frameworks."
        },
        {
            video: "https://www.pexels.com/download/video/6046368/",
            title: "Resource Allocation",
            description: "After analysis, we strategically assign workers, engineers, architects, and project managers based on project phases, skill requirements, and availability."
        },
        {
            video: "https://www.pexels.com/download/video/17912075/",
            title: "Progress Tracking",
            description: "Real-time monitoring of daily activities, resource utilization, material consumption, and milestone achievements ensures projects stay on schedule and within budget."
        },
        {
            video: "https://www.pexels.com/download/video/8449167/",
            title: "Quality Assurance",
            description: "Continuous quality control and compliance monitoring throughout the project lifecycle with detailed documentation."
        },
        {
            video: "https://www.pexels.com/download/video/10166521/",
            title: "Explore More",
            description: "Final inspection and approval, project closure, come with us to discover more about project outcomes and success stories."
        }
    ];

    // Timeline phases with images
    const timelinePhases = [
        {
            image: "https://c.animaapp.com/mfwtmt56xCUZ08/img/ai_2.png",
            title: "Project Initiation",
            description: "Comprehensive project analysis and initial planning phase where we evaluate scope, requirements, and establish baseline timelines."
        },
        {
            image: "https://c.animaapp.com/mfwtmt56xCUZ08/img/ai_3.png",
            title: "Resource Planning",
            description: "Strategic allocation of human resources, equipment, and materials based on project phases and critical path analysis."
        },
        {
            image: "https://c.animaapp.com/mfwtmt56xCUZ08/img/ai_4.png",
            title: "Execution Monitoring",
            description: "Daily tracking of progress, resource utilization, and milestone achievements with real-time adjustments and optimization."
        },
        {
            image: "https://c.animaapp.com/mfwtmt56xCUZ08/img/ai_5.png",
            title: "Quality Assurance",
            description: "Continuous quality control and compliance monitoring throughout the project lifecycle with detailed documentation."
        }
    ];

    // Benefits carousel
    const timelineBenefits = [
        {
            icon: '📊',
            title: 'Data-Driven Decisions',
            description: 'Make informed decisions based on real-time data analytics, resource utilization metrics, and performance indicators.'
        },
        {
            icon: '⏱️',
            title: 'Time Optimization',
            description: 'Minimize delays and maximize efficiency through predictive scheduling and proactive resource management.'
        },
        {
            icon: '💰',
            title: 'Cost Control',
            description: 'Track expenses in real-time, prevent budget overruns, and optimize resource allocation for maximum ROI.'
        },
        {
            icon: '🎯',
            title: 'Milestone Tracking',
            description: 'Monitor critical milestones, identify potential bottlenecks, and ensure project deliverables are met on time.'
        }
    ];

    // Process steps
    const processSteps = [
        {
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            step: "01",
            title: "Analysis & Planning",
            description: "Deep dive into project requirements, scope analysis, and resource assessment to create comprehensive timeline frameworks."
        },
        {
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            step: "02",
            title: "Team Assembly",
            description: "Strategic assignment of workers, engineers, architects, and project managers based on expertise and availability."
        },
        {
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            step: "03",
            title: "Resource Coordination",
            description: "Coordination of tools, materials, equipment, and logistics to ensure seamless project execution and delivery."
        }
    ];

    // Auto-advance video slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentVideoSlide((prev) => (prev + 1) % videoSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [videoSlides.length]);

    // Auto-advance phases
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhase((prev) => (prev + 1) % timelinePhases.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [timelinePhases.length]);

    // Auto-advance benefits
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBenefit((prev) => (prev + 1) % timelineBenefits.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [timelineBenefits.length]);

    const nextVideoSlide = () => {
        setCurrentVideoSlide((prev) => (prev + 1) % videoSlides.length);
    };

    const prevVideoSlide = () => {
        setCurrentVideoSlide((prev) => (prev - 1 + videoSlides.length) % videoSlides.length);
    };

    const nextProcess = () => {
        setCurrentProcess((prev) => (prev + 1) % processSteps.length);
    };

    const prevProcess = () => {
        setCurrentProcess((prev) => (prev - 1 + processSteps.length) % processSteps.length);
    };

    return (
        <div className="timeline-desc-container">
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
                                src="https://www.youtube.com/embed/cDGukhMg7DM?autoplay=1&rel=0&modestbranding=1&showinfo=0"
                                title="Construction Project Process"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="premium-cinema-caption">
                            <h2>Construction Timeline Process</h2>
                            <p>From projects to timeline management, here's how modern construction projects come to life.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Hero Section with Video Carousel */}
            <section className="timeline-desc-hero">
                <div className="timeline-desc-video-carousel">
                    {videoSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`timeline-desc-video-slide ${currentVideoSlide === index ? 'active' : ''}`}
                        >
                            <video autoPlay loop muted playsInline>
                                <source src={slide.video} type="video/mp4" />
                            </video>
                            <div className="timeline-desc-video-overlay"></div>
                        </div>
                    ))}

                    <div className="timeline-desc-hero-content">
                        <div className="timeline-desc-hero-text">
                            <h1 className="timeline-desc-hero-title">
                                Welcome to Timeline Management
                            </h1>
                            <div className="timeline-desc-slide-content">
                                <h2 className="timeline-desc-slide-title">
                                    {videoSlides[currentVideoSlide].title}
                                </h2>
                                <p className="timeline-desc-slide-description"><br></br>
                                    {videoSlides[currentVideoSlide].description}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDemo(true)}
                                className="timeline-desc-hero-button premium-pulse-btn"
                            >
                                <span className="premium-play-icon">▶</span>
                                Watch Timeline Demo
                            </button>
                        </div>
                    </div>

                    {/* Video Navigation */}
                    <div className="timeline-desc-video-navigation">
                        <button onClick={prevVideoSlide} className="timeline-desc-video-nav-btn prev">
                            ←
                        </button>
                        <div className="timeline-desc-video-indicators">
                            {videoSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentVideoSlide(index)}
                                    className={`timeline-desc-video-indicator ${currentVideoSlide === index ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextVideoSlide} className="timeline-desc-video-nav-btn next">
                            →
                        </button>
                    </div>
                </div>
            </section>

            {/* Timeline Definition Section */}
            <section
                className={`timeline-desc-definition ${visibleSections.has('definition') ? 'animate-in' : ''}`}
                id="definition"
                data-animate
            >
                <div className="timeline-desc-container-inner">
                    <div className="timeline-desc-definition-grid">
                        <div className="timeline-desc-definition-text" id="contact-form">
                            <h2 className="timeline-desc-section-title">
                                Understanding Construction Timeline Management
                            </h2>
                            <p className="timeline-desc-paragraph">
                                Timeline management in construction is a sophisticated process that begins when a project is created. It involves comprehensive analysis of project depth, complexity, and requirements to strategically assign the right resources at the right time.
                            </p>
                            <p className="timeline-desc-paragraph">
                                Our system analyzes project specifications and automatically calculates optimal resource allocation including workers, engineers, architects, project managers, tools, and materials based on project phases and critical path methodology.
                            </p>
                            <p className="timeline-desc-paragraph">
                                Through advanced algorithms and industry expertise, we ensure every project timeline is optimized for efficiency, cost-effectiveness, and successful delivery within specified deadlines.
                            </p>

                            <div className="timeline-desc-features-list">
                                <div className="timeline-desc-feature-item">
                                    <span className="timeline-desc-feature-icon">🔍</span>
                                    <span>Comprehensive Project Analysis</span>
                                </div>
                                <div className="timeline-desc-feature-item">
                                    <span className="timeline-desc-feature-icon">👥</span>
                                    <span>Strategic Resource Allocation</span>
                                </div>
                                <div className="timeline-desc-feature-item">
                                    <span className="timeline-desc-feature-icon">📈</span>
                                    <span>Real-time Progress Monitoring</span>
                                </div>
                                <div className="timeline-desc-feature-item">
                                    <span className="timeline-desc-feature-icon">⚡</span>
                                    <span>Automated Optimization</span>
                                </div>
                            </div>
                        </div>

                        <div className="timeline-desc-phases-carousel">
                            {timelinePhases.map((phase, index) => (
                                <div
                                    key={index}
                                    className={`timeline-desc-phase-slide ${currentPhase === index ? 'active' : ''}`}
                                >
                                    <img src={phase.image} alt={phase.title} />
                                    <div className="timeline-desc-phase-overlay">
                                        <h3 className="timeline-desc-phase-title">{phase.title}</h3>
                                        <p className="timeline-desc-phase-description">{phase.description}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="timeline-desc-phase-indicators">
                                {timelinePhases.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPhase(index)}
                                        className={`timeline-desc-phase-indicator ${currentPhase === index ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section
                className={`timeline-desc-benefits ${visibleSections.has('benefits') ? 'animate-in' : ''}`}
                id="benefits"
                data-animate
            >
                <div className="timeline-desc-benefits-video-background">
                    <video autoPlay loop muted playsInline>
                        <source src="https://www.pexels.com/download/video/5846620/" type="video/mp4" />
                    </video>
                    <div className="timeline-desc-benefits-video-overlay"></div>
                </div>
                <div className="timeline-desc-container-inner">
                    <div className="timeline-desc-benefits-header">
                        <h2 className="timeline-desc-section-title">
                            Why Timeline Management Matters
                        </h2>
                        <p className="timeline-desc-section-subtitle">
                            Discover how our advanced timeline management system transforms construction project delivery through intelligent resource allocation and real-time monitoring.
                        </p>
                    </div>

                    <div className="timeline-desc-benefits-grid">
                        <div className="timeline-desc-benefits-carousel">
                            <div className="timeline-desc-benefit-display">
                                <div className="timeline-desc-benefit-icon">
                                    {timelineBenefits[currentBenefit].icon}
                                </div>
                                <h3 className="timeline-desc-benefit-title">
                                    {timelineBenefits[currentBenefit].title}
                                </h3>
                                <p className="timeline-desc-benefit-description">
                                    {timelineBenefits[currentBenefit].description}
                                </p>
                            </div>
                            <div className="timeline-desc-benefit-navigation">
                                <button
                                    onClick={() => setCurrentBenefit((prev) => (prev - 1 + timelineBenefits.length) % timelineBenefits.length)}
                                    className="timeline-desc-benefit-nav-btn"
                                >
                                    ←
                                </button>
                                <div className="timeline-desc-benefit-indicators">
                                    {timelineBenefits.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentBenefit(index)}
                                            className={`timeline-desc-benefit-indicator ${currentBenefit === index ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentBenefit((prev) => (prev + 1) % timelineBenefits.length)}
                                    className="timeline-desc-benefit-nav-btn"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        <div className="timeline-desc-benefits-stats">
                            <div className="timeline-desc-stat-card">
                                <div className="timeline-desc-stat-number">95%</div>
                                <div className="timeline-desc-stat-label">On-Time Delivery</div>
                            </div>
                            <div className="timeline-desc-stat-card">
                                <div className="timeline-desc-stat-number">30%</div>
                                <div className="timeline-desc-stat-label">Cost Reduction</div>
                            </div>
                            <div className="timeline-desc-stat-card">
                                <div className="timeline-desc-stat-number">50%</div>
                                <div className="timeline-desc-stat-label">Faster Planning</div>
                            </div>
                            <div className="timeline-desc-stat-card">
                                <div className="timeline-desc-stat-number">99%</div>
                                <div className="timeline-desc-stat-label">Accuracy Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section
                className={`timeline-desc-process ${visibleSections.has('process') ? 'animate-in' : ''}`}
                id="process"
                data-animate
            >
                <div className="timeline-desc-container-inner">
                    <div className="timeline-desc-process-header">
                        <h2 className="timeline-desc-section-title">
                            Our Timeline Creation Process
                        </h2>
                        <p className="timeline-desc-section-subtitle">
                            From initial project analysis to final resource allocation, our systematic approach ensures optimal timeline creation for every construction project.
                        </p>
                    </div>

                    <div className="timeline-desc-process-grid">
                        <div className="timeline-desc-process-content">
                            <div className="timeline-desc-process-steps">
                                {processSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`timeline-desc-process-step ${currentProcess === index ? 'active' : ''}`}
                                        onClick={() => setCurrentProcess(index)}
                                    >
                                        <div className="timeline-desc-step-number">{step.step}</div>
                                        <div className="timeline-desc-step-content">
                                            <h4 className="timeline-desc-step-title">{step.title}</h4>
                                            <p className="timeline-desc-step-description">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="timeline-desc-process-button">
                                Start Timeline Creation
                            </button>
                        </div>

                        <div className="timeline-desc-process-visual">
                            <div className="timeline-desc-process-image-container">
                                <img
                                    src={processSteps[currentProcess].image}
                                    alt={processSteps[currentProcess].title}
                                    className="timeline-desc-process-image"
                                />
                                <div className="timeline-desc-process-overlay">
                                    <span className="timeline-desc-process-overlay-text">
                                        🔍 View Process Details
                                    </span>
                                </div>
                            </div>
                            <div className="timeline-desc-process-navigation">
                                <button onClick={prevProcess} className="timeline-desc-process-nav-btn">
                                    ←
                                </button>
                                <div className="timeline-desc-process-indicators">
                                    {processSteps.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentProcess(index)}
                                            className={`timeline-desc-process-indicator ${currentProcess === index ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                                <button onClick={nextProcess} className="timeline-desc-process-nav-btn">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resource Allocation Section */}
            <section
                className={`timeline-desc-resources ${visibleSections.has('resources') ? 'animate-in' : ''}`}
                id="resources"
                data-animate
            >
                <div className="timeline-desc-benefits-video-background">
                    <video autoPlay loop muted playsInline>
                        <source src="https://www.pexels.com/download/video/5846711/" type="video/mp4" />
                    </video>
                    <div className="timeline-desc-benefits-video-overlay"></div>
                </div>
                <div className="timeline-desc-container-inner">
                    <div className="timeline-desc-resources-grid">
                        <div className="timeline-desc-resources-visual">
                            <div className="timeline-desc-resources-chart">
                                <div className="timeline-desc-resource-item workers">
                                    <div className="timeline-desc-resource-icon">👷</div>
                                    <div className="timeline-desc-resource-info">
                                        <h4>Workers</h4>
                                        <p>Skilled labor force allocation based on project requirements and phase complexity</p>
                                    </div>
                                </div>
                                <div className="timeline-desc-resource-item engineers">
                                    <div className="timeline-desc-resource-icon">👨‍💼</div>
                                    <div className="timeline-desc-resource-info">
                                        <h4>Engineers</h4>
                                        <p>Technical expertise assignment for structural, mechanical, and electrical systems</p>
                                    </div>
                                </div>
                                <div className="timeline-desc-resource-item architects">
                                    <div className="timeline-desc-resource-icon">🏗️</div>
                                    <div className="timeline-desc-resource-info">
                                        <h4>Architects</h4>
                                        <p>Design professionals ensuring aesthetic and functional project requirements</p>
                                    </div>
                                </div>
                                <div className="timeline-desc-resource-item managers">
                                    <div className="timeline-desc-resource-icon">📋</div>
                                    <div className="timeline-desc-resource-info">
                                        <h4>Project Managers</h4>
                                        <p>Leadership and coordination to ensure seamless project execution</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="timeline-desc-resources-content">
                            <h2 className="timeline-desc-section-title">
                                Intelligent Resource Allocation
                            </h2>
                            <p className="timeline-desc-paragraph">
                                Our timeline system automatically calculates and assigns the optimal mix of human resources based on project complexity, phase requirements, and critical path analysis.
                            </p>
                            <p className="timeline-desc-paragraph">
                                By analyzing historical data and project specifications, we ensure the right professionals are assigned to the right tasks at the right time, maximizing efficiency and minimizing costs.
                            </p>

                            <div className="timeline-desc-resource-metrics">
                                <div className="timeline-desc-metric">
                                    <div className="timeline-desc-metric-value">40+</div>
                                    <div className="timeline-desc-metric-label">Resource Types</div>
                                </div>
                                <div className="timeline-desc-metric">
                                    <div className="timeline-desc-metric-value">24/7</div>
                                    <div className="timeline-desc-metric-label">Monitoring</div>
                                </div>
                                <div className="timeline-desc-metric">
                                    <div className="timeline-desc-metric-value">AI</div>
                                    <div className="timeline-desc-metric-label">Optimization</div>
                                </div>
                            </div>

                            <button className="timeline-desc-resources-button">
                                View Resource Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section
                className={`timeline-desc-technology ${visibleSections.has('technology') ? 'animate-in' : ''}`}
                id="technology"
                data-animate
            >
                <div className="timeline-desc-container-inner">
                    <div className="timeline-desc-technology-content">
                        <h2 className="timeline-desc-section-title">
                            Advanced Timeline Technology
                        </h2>
                        <p className="timeline-desc-section-subtitle">
                            Powered by cutting-edge algorithms and machine learning, our timeline management system provides unprecedented accuracy and efficiency in construction project planning.
                        </p>

                        <div className="timeline-desc-tech-features">
                            <div className="timeline-desc-tech-feature">
                                <div className="timeline-desc-tech-icon">🤖</div>
                                <h4>AI-Powered Analysis</h4>
                                <p>Machine learning algorithms analyze project data to predict optimal resource allocation and timeline optimization.</p>
                            </div>
                            <div className="timeline-desc-tech-feature">
                                <div className="timeline-desc-tech-icon">📊</div>
                                <h4>Real-time Analytics</h4>
                                <p>Live dashboard monitoring with instant alerts, progress tracking, and performance metrics visualization.</p>
                            </div>
                            <div className="timeline-desc-tech-feature">
                                <div className="timeline-desc-tech-icon">🔄</div>
                                <h4>Dynamic Scheduling</h4>
                                <p>Adaptive timeline adjustments based on real-time conditions, weather, and resource availability changes.</p>
                            </div>
                            <div className="timeline-desc-tech-feature">
                                <div className="timeline-desc-tech-icon">📱</div>
                                <h4>Mobile Integration</h4>
                                <p>Cross-platform accessibility with mobile apps for field teams and real-time data synchronization.</p>
                            </div>
                            <div className="timeline-desc-tech-feature">
                                <div className="timeline-desc-tech-icon">☁️</div>
                                <h4>Cloud Collaboration </h4>
                                <p>Seamless document sharing, version control, and team coordination powered by secure cloud infrastructure.</p>
                            </div>
                            <div className="timeline-desc-tech-feature">
                                <div className="timeline-desc-tech-icon">📑</div>
                                <h4>Automated Reporting</h4>
                                <p>Smart reports generated instantly with project KPIs, compliance checks, and stakeholder summaries.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section
                className={`timeline-desc-cta ${visibleSections.has('cta') ? 'animate-in' : ''}`}
                id="cta"
                data-animate
            >
                <div className="timeline-desc-benefits-video-background">
                    <video autoPlay loop muted playsInline>
                        <source src="https://www.pexels.com/download/video/4630091/" type="video/mp4" />
                    </video>
                    <div className="timeline-desc-benefits-video-overlay"></div>
                </div>

                <div className="timeline-desc-container-inner">
                    <div className="timeline-desc-cta-content">
                        <h2 className="timeline-desc-cta-title">
                            Ready to Optimize Your Project Timelines?
                        </h2>
                        <p className="timeline-desc-cta-description">
                            Transform your construction project management with our advanced timeline system. Experience the power of intelligent resource allocation and real-time progress monitoring.
                        </p>

                        <div className="timeline-desc-cta-buttons">
                            <button onClick={() => navigate('/user-projects#contact')} className="timeline-desc-cta-primary-btn">
                                Get Free Accommodation
                            </button>
                            <button className="timeline-desc-cta-secondary-btn"
                                onClick={() => setShowDemo(true)}
                            >
                                Watch Timeline Demo
                            </button>
                        </div>

                        <div className="timeline-desc-cta-stats">
                            <div className="timeline-desc-cta-stat">
                                <div className="timeline-desc-cta-stat-number">1000+</div>
                                <div className="timeline-desc-cta-stat-label">Projects Managed</div>
                            </div>
                            <div className="timeline-desc-cta-stat">
                                <div className="timeline-desc-cta-stat-number">50M+</div>
                                <div className="timeline-desc-cta-stat-label">Hours Tracked</div>
                            </div>
                            <div className="timeline-desc-cta-stat">
                                <div className="timeline-desc-cta-stat-number">99.9%</div>
                                <div className="timeline-desc-cta-stat-label">Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default UserTimeline;
