// ConstructionHome.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./ConstructionHome.css";

const ConstructionHome = () => {
  const navigate = useNavigate();
  const sectionsRef = useRef({});

  const addRef = (id) => (el) => {
    if (el) sectionsRef.current[id] = el;
  };

  // Data for features, process steps, tech, and photos for photo booths
  const features = [
    {
      labelBox: "Residential Construction",
      icon: "🏠",
      title: "Residential Construction",
      description: "Custom homes with precision and smart workflows.",
      type: "RESIDENTIAL",
      photoUrls: [
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
      ],
    },
    {
      labelBox: "Commercial Construction",
      icon: "🏢",
      title: "Commercial Construction",
      description: "Efficient and sustainable office and retail spaces.",
      type: "COMMERCIAL",
      photoUrls: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=600&q=80",
      ],
    },
    {
      labelBox: "Industrial Construction",
      icon: "🏭",
      title: "Industrial Construction",
      description: "Safe and productive manufacturing facilities.",
      type: "INDUSTRIAL",
      photoUrls: [
        "https://images.unsplash.com/photo-1509228627152-4a4a5f5c6f11?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80",
      ],
    },
    {
      labelBox: "Infrastructure Construction",
      icon: "🌉",
      title: "Infrastructure",
      description: "Bridges, roads, and public works connecting communities.",
      type: "INFRASTRUCTURE",
      photoUrls: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=600&q=80",
      ],
    },
    {
      labelBox: "Renovation Projects",
      icon: "🔨",
      title: "Renovation Projects",
      description: "Transforming existing structures with modern upgrades.",
      type: "RENOVATION",
      photoUrls: [
        "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&w=600&q=80",
      ],
    },
    {
      labelBox: "Green Construction",
      icon: "🌱",
      title: "Green Construction",
      description: "Sustainable building practices for eco-friendly structures.",
      type: "GREEN",
      photoUrls: [
        "https://images.unsplash.com/photo-1593062097818-0ff44e1c4f49?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1593062091724-31790e70f954?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1593062091724-31790e70f954?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1593062091724-31790e70f954?auto=format&fit=crop&w=600&q=80",
      ],
    },
  ];

  // Video Background with improved loading and fallback
  const VideoBackground = ({ videoId }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef(null);

    // Better video URLs - using more reliable sources
    const videos = {
      hero: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      intro: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", 
      types: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
      process: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      projectShowcase: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      timelineShowcase: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      dashboardShowcase: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      technology: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      growth: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
    };

    const posterImages = {
      hero: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&h=900&fit=crop&q=80",
      intro: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&h=900&fit=crop&q=80",
      types: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=1600&h=900&fit=crop&q=80",
      process: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=900&fit=crop&q=80",
      projectShowcase: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=1600&h=900&fit=crop&q=80",
      timelineShowcase: "https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?w=1600&h=900&fit=crop&q=80",
      dashboardShowcase: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop&q=80",
      technology: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1600&h=900&fit=crop&q=80",
      growth: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1600&h=900&fit=crop&q=80"
    };

    // Reset states when videoId changes
    useEffect(() => {
      setLoaded(false);
      setError(false);
      setPlaying(false);
    }, [videoId]);

    // Handle video interactions
    const handleVideoLoad = () => {
      console.log(`Video loaded for ${videoId}`);
      setLoaded(true);
      
      // Try to play the video
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`Video playing for ${videoId}`);
              setPlaying(true);
            })
            .catch((error) => {
              console.log(`Autoplay failed for ${videoId}:`, error);
              // Autoplay failed, but video is loaded - this is normal
              setPlaying(false);
            });
        }
      }
    };

    const handleVideoError = (e) => {
      console.error(`Video error for ${videoId}:`, e.target.error);
      setError(true);
    };

    // Intersection Observer to play video when in view
    useEffect(() => {
      if (!videoRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && loaded && !playing) {
              const video = entry.target;
              video.play().catch(() => {
                // Silently fail if autoplay is blocked
              });
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(videoRef.current);

      return () => observer.disconnect();
    }, [loaded, playing]);

    return (
      <div className="video-background">
        {!error ? (
          <>
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className={`section-video ${loaded ? "loaded" : ""}`}
              poster={posterImages[videoId]}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                minWidth: '100%',
                minHeight: '100%',
                width: 'auto',
                height: 'auto',
                transform: 'translate(-50%, -50%)',
                objectFit: 'cover',
                zIndex: 1,
                opacity: loaded ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out'
              }}
            >
              <source src={videos[videoId]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Static background image as fallback */}
            <div 
              className="video-poster-fallback"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${posterImages[videoId]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.6) contrast(1.1)',
                zIndex: 0,
                opacity: loaded ? 0 : 1,
                transition: 'opacity 1.5s ease-in-out'
              }}
            />
          </>
        ) : (
          <div 
            className="video-fallback"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${posterImages[videoId]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <div className="video-overlay" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(26, 26, 26, 0.5) 50%, rgba(0, 0, 0, 0.7) 100%)',
              zIndex: 1
            }} />
            <div className="fallback-content" style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              color: '#f7df1e'
            }}>
              <div className="fallback-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏗️</div>
              <div className="fallback-text" style={{ 
                fontSize: '1.3rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: '700'
              }}>
                Construction Project
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay for better text readability */}
        <div 
          className="video-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(26, 26, 26, 0.4) 50%, rgba(0, 0, 0, 0.6) 100%)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />
      </div>
    );
  };

  // Photo Booth component for image gallery per section
  const PhotoBooth = ({ photos, title }) => {
    return (
      <div className="photo-booth" aria-label={`${title} photo booth`}>
        {photos.map((url, idx) => (
          <div key={idx} className="photo-booth-item">
            <img
              src={url}
              alt={`${title} ${idx + 1}`}
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23ffd700'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' font-family='Arial' font-size='24' fill='%23000'%3EImage Not Available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="construction-home-advanced">
      {/* Global Nav (hamburger) */}
      <div style={{ position: 'relative', zIndex: 1202 }}>
        <style>{`.hamburger-btn{ top: 72px !important; left: 16px !important; }`}</style>
        <Nav />
      </div>

      {/* Top caution tape bar */}
      <header className="caution-tape-bar top-bar" aria-hidden="true">
        <div className="caution-text">WORKFLOWS ENGINEERING</div>
        <div className="caution-stripes"></div>
      </header>



      {/* Hero Section */}
      <section
        id="hero"
        className="section hero-section d-flex align-items-center justify-content-center text-center"
        ref={addRef("hero")}
        tabIndex={-1}
      >
        <VideoBackground videoId="hero" />
        <div className="hero-content container">
          <h1 className="hero-title">
            Welcome to the
            <br /><br />
            <span className="title-highlight">Projects Timeline &</span>
            <span className="title-highlight">Financial Dashboard</span>
          </h1><br />
          <p className="hero-description">
            Smart Construction Workflow & Safety Management System powered by AI innovation.
          </p>
          <div className="hero-buttons d-flex justify-content-center gap-4 flex-wrap">
            <button className="btn btn-primary btn-lg shadow-btn" onClick={() => navigate("/projects")} aria-label="Get Started">
              Get Started <span className="arrow">→</span>
            </button>
            <button className="btn btn-outline-warning btn-lg shadow-btn-outline" onClick={() => navigate("/chatbot")} aria-label="Learn More">
              Learn More <span className="arrow">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="intro" className="section section-intro py-5" ref={addRef("intro")} tabIndex={-1}>
        <VideoBackground videoId="intro" />
        <div className="container py-4 text-white">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 intro-text">
              <div className="caution-tape-section-bar" aria-hidden="true"></div>
              <h2 className="section-title mb-3">
                Introduction to <span className="title-highlight">Construction</span>
              </h2>
              <p className="section-description mb-4">
                Construction is the art and science of creating structures that shape our world. At
                Workflows Engineering, we combine decades of expertise with cutting-edge technology to
                deliver exceptional results on time and within budget.
              </p>
              <p className="feature-text mb-4" style={{ fontSize: "1.3rem", lineHeight: "1.6" }}>
                Our Smart Construction Workflow & Safety Management System transforms traditional
                construction practices through AI-powered analytics, real-time collaboration, and
                predictive insights that help prevent delays and reduce costs.
              </p>
              <button
                className="btn btn-outline-warning btn-lg shadow-btn-outline ms-2"
                onClick={() => navigate("/projects")}
                aria-label="Explore Our Process"
                style={{ marginLeft: "0.5rem" }}
              >
                Explore Our Process
              </button>
            </div>
            <div className="col-lg-6 text-center d-flex align-items-center justify-content-center">
              <div className="intro-image-container">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&h=500&fit=crop"
                  alt="Building project overview"
                  className="img-fluid rounded shadow-lg border border-warning"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='500' viewBox='0 0 700 500'%3E%3Crect width='700' height='500' fill='%23ffd700'/%3E%3Ctext x='350' y='250' text-anchor='middle' dy='.3em' font-family='Arial' font-size='28' fill='%23000'%3EConstruction Management%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Construction Section - Styled after Canva theme */}
      <section
        id="types"
        className="section section-types-advanced py-5"
        ref={addRef("types")}
        tabIndex={-1}
      >
        <VideoBackground videoId="types" />
        <div className="container d-flex flex-wrap gap-5 justify-content-center align-items-center">
          {/* Left content with big heading and description styled per Canva */}
          <div className="types-left-content">
            <div className="caution-tape-side-bar" aria-hidden="true"></div>
            <h2 className="types-title">
              Types of <br />
              <span className="title-highlight">Construction</span>
            </h2>
            <h4 className="types-subtitle">Different Sectors in Construction</h4>
            <p className="types-description">
              Our construction services span multiple sectors, each with specialized approaches and methodologies. 
              We excel in residential, commercial, industrial, and infrastructure projects, bringing decades of 
              expertise to every build. Our team understands the unique requirements of each construction type 
              and delivers tailored solutions that meet industry standards and client expectations.
            </p>
          </div>

          {/* Right content with boxed labels for each construction type */}
          <div className="types-label-boxes">
            {features.map((feature, i) => (
              <div key={i} className="types-label-box" tabIndex={0} aria-label={feature.labelBox}>
                {feature.labelBox}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enlarged Project Section with video background and photo booth */}
      <section
        id="project"
        className="section section-project-advanced py-5"
        ref={addRef("project")}
        tabIndex={-1}
      >
        <VideoBackground videoId="projectShowcase" />
        <div className="container text-white">
          <div className="caution-tape-section-bar" aria-hidden="true"></div>
          <h2 className="section-title mb-4 text-center">
            Project <span className="title-highlight">Showcase</span>
          </h2>
          <p className="section-description text-center mb-5" style={{ fontSize: "1.4rem", maxWidth: "800px", margin: "0 auto 2rem auto" }}>
            Explore our latest construction projects with detailed insights, progress tracking, and live photo updates. 
            Our project management system provides comprehensive visibility into every aspect of your construction projects.
          </p>
          <div className="photo-booth-wrapper">
            {features.map((feature, idx) => (
              <div key={idx} className="photo-booth-section">
                <h3 className="photo-booth-title">
                  {feature.title} Photos
                </h3>
                <PhotoBooth photos={feature.photoUrls} title={feature.title} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enlarged Timeline Section with video background and photo booth */}
      <section
        id="timeline"
        className="section section-timeline-advanced py-5"
        ref={addRef("timeline")}
        tabIndex={-1}
      >
        <VideoBackground videoId="timelineShowcase" />
        <div className="container text-white text-center">
          <div className="caution-tape-section-bar" aria-hidden="true"></div>
          <h2 className="section-title mb-4">
            Manage Your <span className="title-highlight">Project Timeline</span>
          </h2>
          <p className="section-description mb-5 px-lg-5 mx-auto">
            Track daily project activities, resource allocation, and progress with our comprehensive timeline tools. 
            Monitor construction milestones, identify potential delays, and view real-time images from the field 
            to ensure your projects stay on schedule and within budget.
          </p>
          <div className="btn-group mb-5 d-flex justify-content-center gap-4 flex-wrap">
            <button className="btn btn-primary btn-lg shadow-btn px-5" onClick={() => navigate("/timelines")} aria-label="View Timelines">
              View Timelines
            </button>
            <button
              className="btn btn-outline-light btn-lg shadow-btn-outline px-5"
              onClick={() => navigate("/add-timeline")}
              aria-label="Add Timeline Entry"
            >
              Add Timeline Entry
            </button>
            <button
              className="btn btn-warning btn-lg shadow-btn px-5"
              onClick={() => navigate("/project-timelines")}
              aria-label="View Project Timelines"
            >
              View Project Timelines
            </button>
          </div>
          {/* Photo booth for timeline */}
          <PhotoBooth
            photos={[
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
            ]}
            title="Timeline"
          />
        </div>
      </section>

      {/* Enlarged Dashboard Section with video background and photo booth */}
      <section
        id="dashboard"
        className="section section-dashboard-advanced py-5"
        ref={addRef("dashboard")}
        tabIndex={-1}
      >
        <VideoBackground videoId="dashboardShowcase" />
        <div className="container text-white text-center">
          <div className="caution-tape-section-bar" aria-hidden="true"></div>
          <h2 className="section-title mb-4">
            Financial <span className="title-highlight">Dashboard</span>
          </h2>
          <p className="section-description mb-5 px-lg-5 mx-auto">
            Monitor project budgets, expenses, and overall financial health with our comprehensive dashboard. 
            Track costs in real-time, analyze spending patterns, generate financial reports, and make 
            data-driven decisions to keep your construction projects financially sound.
          </p>
          <div className="btn-group mb-5 d-flex justify-content-center gap-4 flex-wrap">
            <button
              className="btn btn-warning btn-lg shadow-btn px-5"
              onClick={() => navigate("/financial-dashboard")}
              aria-label="View Financial Dashboards"
            >
              View Financial Dashboards
            </button>
            <button
              className="btn btn-outline-light btn-lg shadow-btn-outline px-5"
              onClick={() => navigate("/chatbot")}
              aria-label="Calculate Budget"
            >
              Calculate Budget
            </button>
          </div>
          {/* Photo booth for dashboard */}
          <PhotoBooth
            photos={[
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1581093588401-5d41949e3b9f?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
            ]}
            title="Dashboard"
          />
        </div>
      </section>

      {/* Additional Advanced Sections with video backgrounds and photo booths */}
      {/* Example: Safety & Innovation Section */}
      <section
        id="safety"
        className="section section-safety-advanced py-5"
        ref={addRef("safety")}
        tabIndex={-1}
      >
        <VideoBackground videoId="technology" />
        <div className="container text-white text-center">
          <div className="caution-tape-section-bar" aria-hidden="true"></div>
          <h2 className="section-title mb-4">
            Safety & <span className="title-highlight">Innovation</span>
          </h2>
          <p className="section-description mb-5 px-lg-5 mx-auto">
            Embracing cutting-edge safety protocols and innovative construction technologies.
          </p><br></br>
          <PhotoBooth
            photos={[
              "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
            ]}
            title="Safety & Innovation"
          />
        </div>
      </section>

      {/* Growth of Construction Market Section */}
      <section
        id="growth"
        className="section section-growth-advanced py-5"
        ref={addRef("growth")}
        tabIndex={-1}
      >
        <VideoBackground videoId="growth" />
        <div className="container text-white text-center">
          <div className="caution-tape-section-bar" aria-hidden="true"></div>
          <h2 className="section-title mb-4">
            Growth of <span className="title-highlight">Construction Market</span>
          </h2>
          <p className="section-description mb-5 px-lg-5 mx-auto">
            The construction industry continues to expand globally, with significant growth projected through 2030.
            Explore the market trends and see how different sectors are evolving in the construction landscape.
          </p>
          
          {/* Bar Chart Container */}
          <div className="market-growth-chart">
            <div className="chart-container">
              <div className="chart-y-axis">
                <div className="y-axis-label">Market Size (Billion USD)</div>
                <div className="y-axis-values">
                  <span>2000</span>
                  <span>1500</span>
                  <span>1000</span>
                  <span>500</span>
                  <span>0</span>
                </div>
              </div>
              <div className="chart-bars">
                <div className="chart-bar-group">
                  <div className="chart-bar residential" style={{ height: '240px', width: '60px' }}>
                    <div className="bar-value">1200B</div>
                  </div>
                  <div className="bar-label">2020</div>
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar residential" style={{ height: '280px', width: '60px' }}>
                    <div className="bar-value">1400B</div>
                  </div>
                  <div className="bar-label">2022</div>
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar residential" style={{ height: '320px', width: '60px' }}>
                    <div className="bar-value">1600B</div>
                  </div>
                  <div className="bar-label">2024</div>
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar residential" style={{ height: '360px', width: '60px' }}>
                    <div className="bar-value">1800B</div>
                  </div>
                  <div className="bar-label">2026</div>
                </div>
                <div className="chart-bar-group">
                  <div className="chart-bar residential" style={{ height: '400px', width: '60px' }}>
                    <div className="bar-value">2000B</div>
                  </div>
                  <div className="bar-label">2030</div>
                </div>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color residential"></div>
                <div className="legend-label">Global Construction Market</div>
              </div>
            </div>
          </div>
          
          <div className="market-stats mt-5">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">7.3%</div>
                  <div className="stat-label">Annual Growth Rate</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon">🏗️</div>
                  <div className="stat-value">14.4M</div>
                  <div className="stat-label">Jobs Created</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon">🌐</div>
                  <div className="stat-value">$2T</div>
                  <div className="stat-label">Market Size by 2030</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section section-cta py-5 text-center text-white bg-gradient-cta">
        <div className="container py-4">
          <div className="caution-tape-section-bar" aria-hidden="true"></div>
          <h2 className="cta-title mb-3">Ready to Build the Future?</h2>
          <p className="cta-description mb-4 fs-5">
            Partner with Workflows Engineering for your next construction project.
          </p>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <button className="btn btn-warning btn-lg shadow-btn px-4" onClick={() => navigate("/projects")} aria-label="Start Your Project">
              Start Your Project
            </button>
            <button className="btn btn-outline-light btn-lg shadow-btn-outline px-4" onClick={() => navigate("/chatbot")} aria-label="Contact Us">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer with social, links and contact */}
      <footer className="construction-footer text-center bg-dark text-light border-top border-warning">
        <div className="container">
          <div className="footer-brand mb-2 d-flex justify-content-center gap-2 fs-4 fw-bold text-warning">
            <span>WORKFLOWS</span>
            <span>ENGINEERING</span>
          </div>

          <p className="footer-tagline text-uppercase mb-2">
            Smart Construction Workflow & Safety Management System
          </p>

          {/* Social icons */}
          <div className="footer-social" aria-label="Social media links">
            <a href="https://facebook.com/workflowsengineering" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook" title="Facebook">
              <span role="img" aria-hidden>📘</span>
            </a>
            <a href="https://instagram.com/workflowsengineering" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram" title="Instagram">
              <span role="img" aria-hidden>📸</span>
            </a>
            <a href="https://linkedin.com/company/workflowsengineering" target="_blank" rel="noopener noreferrer" aria-label="Visit our LinkedIn" title="LinkedIn">
              <span role="img" aria-hidden>💼</span>
            </a>
            <a href="https://x.com/workflowseng" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter/X" title="Twitter/X">
              <span role="img" aria-hidden>🐦</span>
            </a>
            <a href="https://youtube.com/@workflowsengineering" target="_blank" rel="noopener noreferrer" aria-label="Visit our YouTube" title="YouTube">
              <span role="img" aria-hidden>▶️</span>
            </a>
          </div>

          {/* Quick links */}
          <div className="footer-links">
            <a href="#hero">Home</a>
            <a href="#project">Projects</a>
            <a href="#timeline">Timelines</a>
            <a href="#dashboard">Financial</a>
            <a href="#safety">Safety</a>
            <a href="#growth">Market</a>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <div>Email: contact@workflowsengineering.com</div>
            <div>Phone: +1 (555) 123-4567</div>
          </div>

          <p className="footer-website fw-semibold text-warning mb-1">
            WWW.WORKFLOWSENGINEERING.COM
          </p>
          <div className="footer-copy">© {new Date().getFullYear()} Workflows Engineering. All rights reserved.</div><br />
        </div>
      </footer>

      {/* Bottom caution tape bar */}
      <div className="caution-tape-bar bottom-bar" aria-hidden="true">
        <div className="caution-stripes"></div>
        <div className="caution-text">BUILD YOUR DREAMS</div><br></br>
      </div>
    </div>
  );
};

export default ConstructionHome;