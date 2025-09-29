import React, { useState, useEffect } from "react";
import "./UserChatbot.css";
import NavV2 from "../Nav/NavV2";
import Footer from "../Nav/ptfdFooter";
import { useNavigate } from "react-router-dom";

const UserChatbot = () => {
    const navigate = useNavigate();
    const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
    const [currentFeature, setCurrentFeature] = useState(0);
    const [currentCapability, setCurrentCapability] = useState(0);
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
            video: "https://www.pexels.com/download/video/8464662/",
            title: "AI-Powered Intelligence",
            description: "Projecto AI uses advanced machine learning algorithms to understand construction queries and provide intelligent, context-aware responses for all your building needs."
        },
        {
            video: "https://www.pexels.com/download/video/8327799/",
            title: "Real-time Assistance",
            description: "Get instant answers to construction questions, cost calculations, material recommendations, and project guidance available 24/7 through our intelligent chatbot interface."
        },
        {
            video: "https://www.pexels.com/download/video/3129576/",
            title: "Knowledge Integration",
            description: "Access comprehensive construction knowledge base including building codes, safety guidelines, material specifications, and industry best practices through conversational AI."
        },
        {
            video: "https://www.pexels.com/download/video/8464634/",
            title: "Smart Automation",
            description: "Automate routine construction calculations, generate project timelines, and receive personalized recommendations based on your specific project requirements and constraints."
        }
    ];

    // AI Features with detailed explanations
    const aiFeatures = [
        {
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            title: "Intelligent Cost Analysis",
            description: "Advanced algorithms analyze project specifications to provide accurate cost estimates, material quantities, and budget breakdowns with real-time market pricing."
        },
        {
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            title: "Smart Project Planning",
            description: "AI-driven timeline creation, resource allocation, and milestone tracking that adapts to project changes and optimizes construction workflows automatically."
        },
        {
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            title: "Knowledge Base Integration",
            description: "Comprehensive construction knowledge including building codes, safety regulations, material specifications, and industry standards accessible through natural language queries."
        },
        {
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            title: "Voice & Document Processing",
            description: "Advanced voice recognition and document analysis capabilities that allow you to upload blueprints, specifications, and communicate through speech for hands-free operation."
        }
    ];

    // Chatbot capabilities carousel
    const chatbotCapabilities = [
        {
            icon: '🧮',
            title: 'Cost Calculations',
            description: 'Instant material cost estimates, labor calculations, and budget analysis with real-time market data integration.',
            examples: ['Calculate concrete needed for foundation', 'Estimate roofing material costs', 'Labor cost breakdown analysis']
        },
        {
            icon: '📋',
            title: 'Project Planning',
            description: 'Intelligent timeline creation, resource scheduling, and milestone tracking with automated optimization.',
            examples: ['Create construction timeline', 'Resource allocation planning', 'Critical path analysis']
        },
        {
            icon: '🔍',
            title: 'Code Compliance',
            description: 'Building code verification, permit requirements, and regulatory compliance guidance for your location.',
            examples: ['Check local building codes', 'Permit requirements guide', 'Safety regulation compliance']
        },
        {
            icon: '🏗️',
            title: 'Technical Guidance',
            description: 'Expert advice on construction methods, material selection, and engineering best practices.',
            examples: ['Foundation design recommendations', 'Structural engineering advice', 'Material selection guidance']
        }
    ];

    // Process steps for how Projecto AI works
    const processSteps = [
        {
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            step: "01",
            title: "Natural Language Processing",
            description: "Projecto AI understands your construction questions using advanced NLP, interpreting context, technical terms, and project-specific requirements."
        },
        {
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            step: "02",
            title: "Knowledge Base Analysis",
            description: "The AI searches through comprehensive construction databases, building codes, material specifications, and industry standards to find relevant information."
        },
        {
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            step: "03",
            title: "Intelligent Response Generation",
            description: "Advanced algorithms generate accurate, contextual responses with calculations, recommendations, and actionable insights tailored to your specific project needs."
        }
    ];

    // Auto-advance video slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentVideoSlide((prev) => (prev + 1) % videoSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [videoSlides.length]);

    // Auto-advance features
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % aiFeatures.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [aiFeatures.length]);

    // Auto-advance capabilities
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCapability((prev) => (prev + 1) % chatbotCapabilities.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [chatbotCapabilities.length]);

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
        <div className="chatbot-desc-container">
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
                                src="https://www.youtube.com/embed/qbIk7-JPB2c?autoplay=1&rel=0&modestbranding=1&showinfo=0"
                                title="Projecto AI Chatbot Demo"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="premium-cinema-caption">
                            <h2>Projecto AI in Action</h2>
                            <p>See how our AI assistant transforms construction project management and planning.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Hero Section with Video Carousel */}
            <section className="chatbot-desc-hero">
                <div className="chatbot-desc-video-carousel">
                    {videoSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`chatbot-desc-video-slide ${currentVideoSlide === index ? 'active' : ''}`}
                        >
                            <video autoPlay loop muted playsInline>
                                <source src={slide.video} type="video/mp4" />
                            </video>
                            <div className="chatbot-desc-video-overlay"></div>
                        </div>
                    ))}

                    <div className="chatbot-desc-hero-content">
                        <div className="chatbot-desc-hero-text">
                            <h1 className="chatbot-desc-hero-title">
                                Projecto AI
                            </h1>
                            <div className="chatbot-desc-slide-content">
                                <h2 className="chatbot-desc-slide-title">
                                    {videoSlides[currentVideoSlide].title}
                                </h2>
                                <p className="chatbot-desc-slide-description"><br></br>
                                    {videoSlides[currentVideoSlide].description}
                                </p>
                            </div>
                            <div className="chatbot-desc-hero-actions">
                                {/*<button 
                                    onClick={() => navigate('/chatbot')} 
                                    className="chatbot-desc-hero-button"
                                >
                                    <span className="chatbot-play-icon">🤖</span>
                                    Try Projecto AI
                                </button>*/}
                                <button
                                    className="chatbot-desc-demo-button chatbot-pulse-btn"
                                    onClick={() => setShowDemo(true)}
                                >
                                    <span className="chatbot-demo-icon">▶</span>
                                    Watch Demo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Video Navigation */}
                    <div className="chatbot-desc-video-navigation">
                        <button onClick={prevVideoSlide} className="chatbot-desc-video-nav-btn prev">
                            ←
                        </button>
                        <div className="chatbot-desc-video-indicators">
                            {videoSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentVideoSlide(index)}
                                    className={`chatbot-desc-video-indicator ${currentVideoSlide === index ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextVideoSlide} className="chatbot-desc-video-nav-btn next">
                            →
                        </button>
                    </div>
                </div>
            </section>

            {/* What is Projecto AI Section */}
            <section 
                className={`chatbot-desc-definition ${visibleSections.has('definition') ? 'animate-in' : ''}`}
                id="definition"
                data-animate
            >
                <div className="chatbot-desc-container-inner">
                    <div className="chatbot-desc-definition-grid">
                        <div className="chatbot-desc-definition-text">
                            <h2 className="chatbot-desc-section-title">
                                What is Projecto AI?
                            </h2>
                            <p className="chatbot-desc-paragraph">
                                Projecto AI is an advanced artificial intelligence assistant specifically designed for the construction industry. It combines machine learning, natural language processing, and comprehensive construction knowledge to provide instant, accurate assistance for all your building projects.
                            </p>
                            <p className="chatbot-desc-paragraph">
                                Our AI understands construction terminology, building codes, material specifications, and project management principles. It can analyze your questions, provide cost calculations, suggest materials, create timelines, and offer expert guidance based on industry best practices.
                            </p>
                            <p className="chatbot-desc-paragraph">
                                Whether you're a contractor, architect, engineer, or homeowner, Projecto AI serves as your intelligent construction companion, available 24/7 to help you make informed decisions and optimize your building projects.
                            </p>

                            <div className="chatbot-desc-features-list">
                                <div className="chatbot-desc-feature-item">
                                    <span className="chatbot-desc-feature-icon">🧠</span>
                                    <span>Advanced Machine Learning</span>
                                </div>
                                <div className="chatbot-desc-feature-item">
                                    <span className="chatbot-desc-feature-icon">💬</span>
                                    <span>Natural Language Processing</span>
                                </div>
                                <div className="chatbot-desc-feature-item">
                                    <span className="chatbot-desc-feature-icon">📚</span>
                                    <span>Comprehensive Knowledge Base</span>
                                </div>
                                <div className="chatbot-desc-feature-item">
                                    <span className="chatbot-desc-feature-icon">⚡</span>
                                    <span>Instant Response Generation</span>
                                </div>
                            </div>
                        </div>

                        <div className="chatbot-desc-features-carousel">
                            {aiFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`chatbot-desc-feature-slide ${currentFeature === index ? 'active' : ''}`}
                                >
                                    <img src={feature.image} alt={feature.title} />
                                    <div className="chatbot-desc-feature-overlay">
                                        <h3 className="chatbot-desc-feature-title">{feature.title}</h3>
                                        <p className="chatbot-desc-feature-description">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="chatbot-desc-feature-indicators">
                                {aiFeatures.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFeature(index)}
                                        className={`chatbot-desc-feature-indicator ${currentFeature === index ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section 
                className={`chatbot-desc-capabilities ${visibleSections.has('capabilities') ? 'animate-in' : ''}`}
                id="capabilities"
                data-animate
            >
                <div className="chatbot-desc-capabilities-video-bg">
                    <video autoPlay loop muted playsInline>
                        <source src="https://www.pexels.com/download/video/8464662/" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="chatbot-desc-capabilities-overlay"></div>
                </div>
                <div className="chatbot-desc-container-inner">
                    <div className="chatbot-desc-capabilities-header">
                        <h2 className="chatbot-desc-section-title">
                            Projecto AI Capabilities
                        </h2>
                        <p className="chatbot-desc-section-subtitle">
                            Discover the powerful features that make Projecto AI your ultimate construction assistant, from intelligent cost analysis to real-time project guidance.
                        </p>
                    </div>

                    <div className="chatbot-desc-capabilities-grid">
                        <div className="chatbot-desc-capabilities-carousel">
                            <div className="chatbot-desc-capability-display">
                                <div className="chatbot-desc-capability-icon">
                                    {chatbotCapabilities[currentCapability].icon}
                                </div>
                                <h3 className="chatbot-desc-capability-title">
                                    {chatbotCapabilities[currentCapability].title}
                                </h3>
                                <p className="chatbot-desc-capability-description">
                                    {chatbotCapabilities[currentCapability].description}
                                </p>
                                <div className="chatbot-desc-capability-examples">
                                    <h5>Example Queries:</h5>
                                    <ul>
                                        {chatbotCapabilities[currentCapability].examples.map((example, index) => (
                                            <li key={index}>"{example}"</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="chatbot-desc-capability-navigation">
                                <button
                                    onClick={() => setCurrentCapability((prev) => (prev - 1 + chatbotCapabilities.length) % chatbotCapabilities.length)}
                                    className="chatbot-desc-capability-nav-btn"
                                >
                                    ←
                                </button>
                                <div className="chatbot-desc-capability-indicators">
                                    {chatbotCapabilities.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentCapability(index)}
                                            className={`chatbot-desc-capability-indicator ${currentCapability === index ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentCapability((prev) => (prev + 1) % chatbotCapabilities.length)}
                                    className="chatbot-desc-capability-nav-btn"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        <div className="chatbot-desc-capabilities-stats">
                            <div className="chatbot-desc-stat-card">
                                <div className="chatbot-desc-stat-number">99.5%</div>
                                <div className="chatbot-desc-stat-label">Accuracy Rate</div>
                            </div>
                            <div className="chatbot-desc-stat-card">
                                <div className="chatbot-desc-stat-number">24/7</div>
                                <div className="chatbot-desc-stat-label">Availability</div>
                            </div>
                            <div className="chatbot-desc-stat-card">
                                <div className="chatbot-desc-stat-number">10K+</div>
                                <div className="chatbot-desc-stat-label">Knowledge Articles</div>
                            </div>
                            <div className="chatbot-desc-stat-card">
                                <div className="chatbot-desc-stat-number">50+</div>
                                <div className="chatbot-desc-stat-label">Specializations</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section 
                className={`chatbot-desc-process ${visibleSections.has('process') ? 'animate-in' : ''}`}
                id="process"
                data-animate
            >
                <div className="chatbot-desc-container-inner">
                    <div className="chatbot-desc-process-header">
                        <h2 className="chatbot-desc-section-title">
                            How Projecto AI Works
                        </h2>
                        <p className="chatbot-desc-section-subtitle">
                            Understanding the advanced technology behind Projecto AI and how it processes your construction queries to deliver intelligent, actionable responses.
                        </p>
                    </div>

                    <div className="chatbot-desc-process-grid">
                        <div className="chatbot-desc-process-content">
                            <div className="chatbot-desc-process-steps">
                                {processSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`chatbot-desc-process-step ${currentProcess === index ? 'active' : ''}`}
                                        onClick={() => setCurrentProcess(index)}
                                    >
                                        <div className="chatbot-desc-step-number">{step.step}</div>
                                        <div className="chatbot-desc-step-content">
                                            <h4 className="chatbot-desc-step-title">{step.title}</h4>
                                            <p className="chatbot-desc-step-description">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => navigate('/chatbot')} 
                                className="chatbot-desc-process-button"
                            >
                                Start Projects with Projecto AI
                            </button>
                        </div>

                        <div className="chatbot-desc-process-visual">
                            <div className="chatbot-desc-process-image-container">
                                <img
                                    src={processSteps[currentProcess].image}
                                    alt={processSteps[currentProcess].title}
                                    className="chatbot-desc-process-image"
                                />
                                <div className="chatbot-desc-process-overlay">
                                    <span className="chatbot-desc-process-overlay-text">
                                        🤖 View AI Process
                                    </span>
                                </div>
                            </div>
                            <div className="chatbot-desc-process-navigation">
                                <button onClick={prevProcess} className="chatbot-desc-process-nav-btn">
                                    ←
                                </button>
                                <div className="chatbot-desc-process-indicators">
                                    {processSteps.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentProcess(index)}
                                            className={`chatbot-desc-process-indicator ${currentProcess === index ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                                <button onClick={nextProcess} className="chatbot-desc-process-nav-btn">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Knowledge Categories Section */}
            <section 
                className={`chatbot-desc-knowledge ${visibleSections.has('knowledge') ? 'animate-in' : ''}`}
                id="knowledge"
                data-animate
            >
                <div className="chatbot-desc-knowledge-video-bg">
                    <video autoPlay loop muted playsInline>
                        <source src="https://www.pexels.com/download/video/8464662/" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="chatbot-desc-knowledge-overlay"></div>
                </div>
                <div className="chatbot-desc-container-inner">
                    <div className="chatbot-desc-knowledge-header">
                        <h2 className="chatbot-desc-section-title">
                            Comprehensive Knowledge Base
                        </h2>
                        <p className="chatbot-desc-section-subtitle">
                            Projecto AI has access to extensive construction knowledge across multiple categories, ensuring accurate and relevant responses to all your building questions.
                        </p>
                    </div>

                    <div className="chatbot-desc-knowledge-grid">
                        <div className="chatbot-desc-knowledge-card materials">
                            <div className="chatbot-desc-knowledge-icon">🧱</div>
                            <h4 className="chatbot-desc-knowledge-title">Building Materials</h4>
                            <p className="chatbot-desc-knowledge-description">Comprehensive database of construction materials including specifications, costs, durability ratings, and sustainability factors.</p>
                            <div className="chatbot-desc-knowledge-stats">
                                <span>5000+ Materials</span>
                            </div>
                        </div>

                        <div className="chatbot-desc-knowledge-card planning">
                            <div className="chatbot-desc-knowledge-icon">📋</div>
                            <h4 className="chatbot-desc-knowledge-title">Project Planning</h4>
                            <p className="chatbot-desc-knowledge-description">Timeline templates, resource allocation strategies, and project management methodologies for efficient construction execution.</p>
                            <div className="chatbot-desc-knowledge-stats">
                                <span>200+ Templates</span>
                            </div>
                        </div>

                        <div className="chatbot-desc-knowledge-card safety">
                            <div className="chatbot-desc-knowledge-icon">🦺</div>
                            <h4 className="chatbot-desc-knowledge-title">Safety Guidelines</h4>
                            <p className="chatbot-desc-knowledge-description">OSHA regulations, safety protocols, and best practices to ensure secure construction environments and compliance.</p>
                            <div className="chatbot-desc-knowledge-stats">
                                <span>1000+ Guidelines</span>
                            </div>
                        </div>

                        <div className="chatbot-desc-knowledge-card codes">
                            <div className="chatbot-desc-knowledge-icon">📖</div>
                            <h4 className="chatbot-desc-knowledge-title">Building Codes</h4>
                            <p className="chatbot-desc-knowledge-description">Local and international building codes, permit requirements, and regulatory compliance information for various jurisdictions.</p>
                            <div className="chatbot-desc-knowledge-stats">
                                <span>500+ Codes</span>
                            </div>
                        </div>

                        <div className="chatbot-desc-knowledge-card costs">
                            <div className="chatbot-desc-knowledge-icon">💰</div>
                            <h4 className="chatbot-desc-knowledge-title">Cost Analysis</h4>
                            <p className="chatbot-desc-knowledge-description">Real-time pricing data, cost estimation formulas, and budget optimization strategies for accurate project financial planning.</p>
                            <div className="chatbot-desc-knowledge-stats">
                                <span>Live Pricing</span>
                            </div>
                        </div>

                        <div className="chatbot-desc-knowledge-card design">
                            <div className="chatbot-desc-knowledge-icon">🏗️</div>
                            <h4 className="chatbot-desc-knowledge-title">Design Principles</h4>
                            <p className="chatbot-desc-knowledge-description">Architectural guidelines, structural engineering principles, and design best practices for creating functional and aesthetic buildings.</p>
                            <div className="chatbot-desc-knowledge-stats">
                                <span>300+ Principles</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Technology Section */}
            <section 
                className={`chatbot-desc-technology ${visibleSections.has('technology') ? 'animate-in' : ''}`}
                id="technology"
                data-animate
            >
                <div className="chatbot-desc-container-inner">
                    <div className="chatbot-desc-technology-content">
                        <h2 className="chatbot-desc-section-title">
                            Advanced AI Technology
                        </h2>
                        <p className="chatbot-desc-section-subtitle">
                            Powered by cutting-edge artificial intelligence and machine learning technologies, Projecto AI delivers unprecedented accuracy and intelligence in construction assistance.
                        </p>

                        <div className="chatbot-desc-tech-features">
                            <div className="chatbot-desc-tech-feature">
                                <div className="chatbot-desc-tech-icon">🧠</div>
                                <h4>Neural Networks</h4>
                                <p>Deep learning models trained on millions of construction documents, specifications, and industry data for intelligent response generation.</p>
                            </div>
                            <div className="chatbot-desc-tech-feature">
                                <div className="chatbot-desc-tech-icon">💬</div>
                                <h4>Natural Language Understanding</h4>
                                <p>Advanced NLP algorithms that understand construction terminology, context, and intent for accurate query interpretation.</p>
                            </div>
                            <div className="chatbot-desc-tech-feature">
                                <div className="chatbot-desc-tech-icon">🔄</div>
                                <h4>Continuous Learning</h4>
                                <p>Self-improving AI that learns from interactions, updates knowledge base, and enhances response quality over time.</p>
                            </div>
                            <div className="chatbot-desc-tech-feature">
                                <div className="chatbot-desc-tech-icon">🎯</div>
                                <h4>Context Awareness</h4>
                                <p>Maintains conversation context, remembers project details, and provides personalized recommendations based on your specific needs.</p>
                            </div>
                            <div className="chatbot-desc-tech-feature">
                                <div className="chatbot-desc-tech-icon">🔊</div>
                                <h4>Voice Recognition</h4>
                                <p>Advanced speech-to-text capabilities allowing hands-free interaction for busy construction professionals on-site.</p>
                            </div>
                            <div className="chatbot-desc-tech-feature">
                                <div className="chatbot-desc-tech-icon">📄</div>
                                <h4>Document Analysis</h4>
                                <p>AI-powered document processing that can analyze blueprints, specifications, and project files for intelligent insights.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section 
                className={`chatbot-desc-demo ${visibleSections.has('demo') ? 'animate-in' : ''}`}
                id="demo"
                data-animate
            >
                <div className="chatbot-desc-demo-video-bg">
                    <video autoPlay loop muted playsInline>
                        <source src="https://www.pexels.com/download/video/8464662/" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="chatbot-desc-demo-overlay"></div>
                </div>
                <div className="chatbot-desc-container-inner">
                    <div className="chatbot-desc-demo-content">
                        <h2 className="chatbot-desc-section-title">
                            Experience Projecto AI
                        </h2>
                        <p className="chatbot-desc-section-subtitle">
                            See how Projecto AI transforms construction project management through intelligent conversation and expert guidance.
                        </p>

                        <div className="chatbot-desc-demo-interface">
                            <div className="chatbot-desc-demo-header">
                                <div className="chatbot-desc-demo-avatar">🤖</div>
                                <div className="chatbot-desc-demo-info">
                                    <h4>Projecto AI Assistant</h4>
                                    <p>Ready to help with your construction needs</p>
                                </div>
                                <div className="chatbot-desc-demo-status">
                                    <span className="chatbot-desc-status-dot"></span>
                                    Online
                                </div>
                            </div>

                            <div className="chatbot-desc-demo-messages">
                                <div className="chatbot-desc-demo-message bot">
                                    <div className="chatbot-desc-message-content">
                                        👋 Hello! I'm Projecto AI, your construction assistant. I can help with cost calculations, material selection, project planning, and safety guidelines. What would you like to know?
                                    </div>
                                </div>
                                <div className="chatbot-desc-demo-message user">
                                    <div className="chatbot-desc-message-content">
                                        Calculate material costs for a 2000 sq ft house foundation
                                    </div>
                                </div>
                                <div className="chatbot-desc-demo-message bot">
                                    <div className="chatbot-desc-message-content">
                                        🧮 For a 2000 sq ft house foundation, you'll need approximately:
                                        <br />• Concrete: 74 cubic yards (~$8,880)
                                        <br />• Rebar: 2,400 lbs (~$1,200)
                                        <br />• Forms: 800 sq ft (~$1,600)
                                        <br />• Labor: 40 hours (~$2,000)
                                        <br /><strong>Total Estimate: $13,680</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="chatbot-desc-demo-input">
                                <input 
                                    type="text" 
                                    placeholder="Ask Projecto AI anything about construction..."
                                    className="chatbot-desc-demo-input-field"
                                    readOnly
                                />
                                <button className="chatbot-desc-demo-send-btn">
                                    <span>💬</span>
                                </button>
                            </div>
                        </div>

                        <div className="chatbot-desc-demo-actions">
                            <button 
                                onClick={() => navigate('/user-projects')} 
                                className="chatbot-desc-demo-try-btn"
                            >
                                Try Projecto AI Now
                            </button>
                            <button 
                                onClick={() => setShowDemo(true)} 
                                className="chatbot-desc-demo-watch-btn"
                            >
                                Watch Full Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default UserChatbot;
