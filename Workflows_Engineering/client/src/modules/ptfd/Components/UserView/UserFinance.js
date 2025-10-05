import React, { useState, useEffect } from "react";
import "./UserFinance.css";
import NavV2 from "../Nav/NavV2";
import Footer from "../Nav/ptfdFooter";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserFinance = () => {
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentDashboard, setCurrentDashboard] = useState(0);
  const [currentProcess, setCurrentProcess] = useState(0);
  const [currentChart, setCurrentChart] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  

  // Video slides for header section
  const videoSlides = [
    {
      video: "https://www.pexels.com/download/video/1797247/",
      title: "Financial Analysis",
      description: "Financial management begins with comprehensive cost analysis, budget planning, and resource valuation to create accurate financial frameworks for construction projects."
    },
    {
      video: "https://www.pexels.com/download/video/8869637/",
      title: "Budget Allocation",
      description: "Strategic distribution of financial resources across workers, engineers, architects, materials, and equipment based on project phases and requirements."
    },
    {
      video: "https://www.pexels.com/download/video/7947406/",
      title: "Dashboard Monitoring",
      description: "Real-time financial tracking through interactive dashboards displaying expenses, budget utilization, cost trends, and financial performance metrics."
    }
  ];

  // Financial features with images
  const financialFeatures = [
    {
      image: "https://c.animaapp.com/mfwtmt56xCUZ08/img/ai_2.png",
      title: "Cost Analysis",
      description: "Comprehensive analysis of project costs including labor, materials, equipment, and overhead expenses with detailed breakdowns."
    },
    {
      image: "https://c.animaapp.com/mfwtmt56xCUZ08/img/ai_3.png",
      title: "Budget Planning",
      description: "Strategic budget allocation and planning based on project scope, timeline, and resource requirements with contingency planning."
    },
    {
      image: "https://c.animaapp.com/mfwtmt56xCUZ08/img/ai_4.png",
      title: "Expense Tracking",
      description: "Real-time expense monitoring and tracking with automated categorization and approval workflows for better control."
    },
    {
      image: "https://c.animaapp.com/mfwtmt56xCUZ08/img/ai_5.png",
      title: "Financial Reporting",
      description: "Comprehensive financial reports with analytics, forecasting, and performance metrics for informed decision making."
    }
  ];

  // Dashboard types carousel
  const dashboardTypes = [
    {
      icon: '📊',
      title: 'Cost Dashboard',
      description: 'Monitor project costs, budget utilization, and expense trends with interactive charts and real-time updates.'
    },
    {
      icon: '💰',
      title: 'Budget Dashboard',
      description: 'Track budget allocation, spending patterns, and financial forecasts with detailed breakdown analysis.'
    },
    {
      icon: '📈',
      title: 'Analytics Dashboard',
      description: 'Advanced financial analytics with predictive modeling, ROI analysis, and performance benchmarking.'
    },
    {
      icon: '⚡',
      title: 'Real-time Dashboard',
      description: 'Live financial monitoring with instant alerts, notifications, and automated reporting capabilities.'
    }
  ];

  // Process steps
  const processSteps = [
    {
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      step: "01",
      title: "Financial Planning",
      description: "Comprehensive financial planning including budget creation, cost estimation, and resource allocation strategies."
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      step: "02",
      title: "Dashboard Creation",
      description: "Development of interactive dashboards with charts, graphs, and real-time financial monitoring capabilities."
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      step: "03",
      title: "Performance Tracking",
      description: "Continuous monitoring of financial performance with analytics, reporting, and optimization recommendations."
    }
  ];

  // Chart data for demonstrations
  const chartData = {
    pieChart: [
      { name: 'Labor Costs', value: 45, color: '#3b82f6' },
      { name: 'Materials', value: 30, color: '#10b981' },
      { name: 'Equipment', value: 15, color: '#f59e0b' },
      { name: 'Overhead', value: 10, color: '#ef4444' }
    ],
    barChart: [
      { month: 'Jan', budget: 50000, actual: 48000, forecast: 52000 },
      { month: 'Feb', budget: 55000, actual: 53000, forecast: 57000 },
      { month: 'Mar', budget: 60000, actual: 58000, forecast: 62000 },
      { month: 'Apr', budget: 65000, actual: 63000, forecast: 67000 },
      { month: 'May', budget: 70000, actual: 68000, forecast: 72000 },
      { month: 'Jun', budget: 75000, actual: 73000, forecast: 77000 }
    ],
    ganttChart: [
      { task: 'Foundation', start: 0, duration: 20, progress: 100 },
      { task: 'Structure', start: 15, duration: 30, progress: 75 },
      { task: 'Roofing', start: 35, duration: 15, progress: 50 },
      { task: 'Interior', start: 45, duration: 25, progress: 25 },
      { task: 'Finishing', start: 65, duration: 15, progress: 0 }
    ]
  };
  
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
      setCurrentFeature((prev) => (prev + 1) % financialFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [financialFeatures.length]);

  // Auto-advance dashboards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDashboard((prev) => (prev + 1) % dashboardTypes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [dashboardTypes.length]);

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

  const nextChart = () => {
    setCurrentChart((prev) => (prev + 1) % 3);
  };

  const prevChart = () => {
    setCurrentChart((prev) => (prev - 1 + 3) % 3);
  };

  const navigate = useNavigate();
  
  return (
    <div className="finance-desc-container">
        <NavV2 />
        {/* Demo */}
{showDemo && (
  <div className="premium-modal-overlay" onClick={() => setShowDemo(false)}>
    <div 
      className="premium-demo-cinema" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button onClick={() => setShowDemo(false)} className="premium-cinema-close">✕</button>

      {/* Cinematic video */}
      <div className="premium-cinema-video">
        <iframe
          src="https://www.youtube.com/embed/2xr2HuwHlg8?autoplay=1&rel=0&modestbranding=1&showinfo=0"
          title="Construction Project Process"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Optional caption / description */}
      <div className="premium-cinema-caption">
        <h2>Construction Financial  Management</h2>
        <p>From calculation to completion, here’s how modern construction projects come to life.</p>
      </div>
    </div>
  </div>
)}

      {/* Premium Hero Section with Video Carousel */}
      <section className="finance-desc-hero">
        <div className="finance-desc-video-carousel">
          {videoSlides.map((slide, index) => (
            <div
              key={index}
              className={`finance-desc-video-slide ${currentVideoSlide === index ? 'active' : ''}`}
            >
              <video autoPlay loop muted playsInline>
                <source src={slide.video} type="video/mp4" />
              </video>
              <div className="finance-desc-video-overlay"></div>
            </div>
          ))}
          
          <div className="finance-desc-hero-content">
            <div className="finance-desc-hero-text">
              <h1 className="finance-desc-hero-title">
                Welcome to Financial Management 
              </h1>
              <div className="finance-desc-slide-content">
                <h2 className="finance-desc-slide-title">
                  {videoSlides[currentVideoSlide].title}
                </h2>
                <p className="finance-desc-slide-description">
                  {videoSlides[currentVideoSlide].description}
                </p>
              </div>
              <button
                className="finance-desc-hero-button premium-pulse-btn"
                onClick={() => setShowDemo(true)}
              >
                <span className="premium-play-icon">▶</span>
                Watch Finance Demo
              </button>
            </div>
          </div>

          {/* Video Navigation */}
          <div className="finance-desc-video-navigation">
            <button onClick={prevVideoSlide} className="finance-desc-video-nav-btn prev">
              ←
            </button>
            <div className="finance-desc-video-indicators">
              {videoSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoSlide(index)}
                  className={`finance-desc-video-indicator ${currentVideoSlide === index ? 'active' : ''}`}
                />
              ))}
            </div>
            <button onClick={nextVideoSlide} className="finance-desc-video-nav-btn next">
              →
            </button>
          </div>


        </div>
      </section>

      {/* Financial Definition Section */}
      <section className="finance-desc-definition">
        <div className="finance-desc-container-inner">
          <div className="finance-desc-definition-grid">
            <div className="finance-desc-definition-text" id="contact">
              <h2 className="finance-desc-section-title">
                Understanding Construction Financial Management
              </h2>
              <p className="finance-desc-paragraph">
                Financial management in construction is a comprehensive system that begins when a project is created. It involves detailed analysis of project costs, resource allocation, and budget planning to ensure optimal financial performance throughout the project lifecycle.
              </p>
              <p className="finance-desc-paragraph">
                Our system analyzes project specifications and automatically calculates financial requirements including labor costs, material expenses, equipment rentals, and overhead costs. All financial data is displayed through interactive dashboards for real-time monitoring and decision making.
              </p>
              <p className="finance-desc-paragraph">
                Through advanced analytics and financial modeling, we provide complete transparency in project finances, enabling stakeholders to make informed decisions and maintain budget control throughout construction phases.
              </p>
              
              <div className="finance-desc-features-list">
                <div className="finance-desc-feature-item">
                  <span className="finance-desc-feature-icon">💰</span>
                  <span>Comprehensive Cost Analysis</span>
                </div>
                <div className="finance-desc-feature-item">
                  <span className="finance-desc-feature-icon">📊</span>
                  <span>Interactive Dashboard Displays</span>
                </div>
                <div className="finance-desc-feature-item">
                  <span className="finance-desc-feature-icon">📈</span>
                  <span>Real-time Financial Monitoring</span>
                </div>
                <div className="finance-desc-feature-item">
                  <span className="finance-desc-feature-icon">🎯</span>
                  <span>Budget Optimization</span>
                </div>
              </div>
            </div>

            <div className="finance-desc-features-carousel">
              {financialFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`finance-desc-feature-slide ${currentFeature === index ? 'active' : ''}`}
                >
                  <img src={feature.image} alt={feature.title} />
                  <div className="finance-desc-feature-overlay">
                    <h3 className="finance-desc-feature-title">{feature.title}</h3>
                    <p className="finance-desc-feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
              <div className="finance-desc-feature-indicators">
                {financialFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`finance-desc-feature-indicator ${currentFeature === index ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Types Section */}
      <section className="finance-desc-dashboards">
        <div className="finance-desc-container-inner">
          <div className="finance-desc-dashboards-header">
            <h2 className="finance-desc-section-title">
              Financial Dashboard Solutions
            </h2>
            <p className="finance-desc-section-subtitle">
              Discover our comprehensive dashboard solutions that transform complex financial data into actionable insights through intuitive visualizations and real-time monitoring.
            </p>
          </div>

          <div className="finance-desc-dashboards-grid">
            <div className="finance-desc-dashboards-carousel">
              <div className="finance-desc-dashboard-display">
                <div className="finance-desc-dashboard-icon">
                  {dashboardTypes[currentDashboard].icon}
                </div>
                <h3 className="finance-desc-dashboard-title">
                  {dashboardTypes[currentDashboard].title}
                </h3>
                <p className="finance-desc-dashboard-description">
                  {dashboardTypes[currentDashboard].description}
                </p>
              </div>
              <div className="finance-desc-dashboard-navigation">
                <button
                  onClick={() => setCurrentDashboard((prev) => (prev - 1 + dashboardTypes.length) % dashboardTypes.length)}
                  className="finance-desc-dashboard-nav-btn"
                >
                  ←
                </button>
                <div className="finance-desc-dashboard-indicators">
                  {dashboardTypes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDashboard(index)}
                      className={`finance-desc-dashboard-indicator ${currentDashboard === index ? 'active' : ''}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentDashboard((prev) => (prev + 1) % dashboardTypes.length)}
                  className="finance-desc-dashboard-nav-btn"
                >
                  →
                </button>
              </div>
            </div>

            <div className="finance-desc-dashboards-stats">
              <div className="finance-desc-stat-card">
                <div className="finance-desc-stat-number">98%</div>
                <div className="finance-desc-stat-label">Budget Accuracy</div>
              </div>
              <div className="finance-desc-stat-card">
                <div className="finance-desc-stat-number">25%</div>
                <div className="finance-desc-stat-label">Cost Savings</div>
              </div>
              <div className="finance-desc-stat-card">
                <div className="finance-desc-stat-number">60%</div>
                <div className="finance-desc-stat-label">Faster Reporting</div>
              </div>
              <div className="finance-desc-stat-card">
                <div className="finance-desc-stat-number">100%</div>
                <div className="finance-desc-stat-label">Transparency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Showcase Section */}
      <section className="finance-desc-charts">
        <div className="finance-desc-container-inner">
          <div className="finance-desc-charts-header">
            <h2 className="finance-desc-section-title">
              Interactive Financial Charts
            </h2>
            <p className="finance-desc-section-subtitle">
              Visualize your financial data through various chart types including pie charts, bar charts, and Gantt charts for comprehensive project financial analysis.
            </p>
          </div>

          <div className="finance-desc-charts-showcase">
            <div className="finance-desc-chart-navigation">
              <button onClick={prevChart} className="finance-desc-chart-nav-btn">
                ←
              </button>
              <div className="finance-desc-chart-indicators">
                <button
                  onClick={() => setCurrentChart(0)}
                  className={`finance-desc-chart-indicator ${currentChart === 0 ? 'active' : ''}`}
                >
                  Pie Chart
                </button>
                <button
                  onClick={() => setCurrentChart(1)}
                  className={`finance-desc-chart-indicator ${currentChart === 1 ? 'active' : ''}`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setCurrentChart(2)}
                  className={`finance-desc-chart-indicator ${currentChart === 2 ? 'active' : ''}`}
                >
                  Gantt Chart
                </button>
              </div>
              <button onClick={nextChart} className="finance-desc-chart-nav-btn">
                →
              </button>
            </div>

            <div className="finance-desc-chart-display">
              {/* Pie Chart */}
              {currentChart === 0 && (
                <div className="finance-desc-chart-container">
                  <h4 className="finance-desc-chart-title">Cost Distribution Analysis</h4>
                  <div className="finance-desc-pie-chart">
                    <svg viewBox="0 0 200 200" className="finance-desc-pie-svg">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="20" 
                              strokeDasharray="226" strokeDashoffset="113" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="20" 
                              strokeDasharray="151" strokeDashoffset="75" transform="rotate(72 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="20" 
                              strokeDasharray="75" strokeDashoffset="37" transform="rotate(180 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#ef4444" strokeWidth="20" 
                              strokeDasharray="50" strokeDashoffset="25" transform="rotate(270 100 100)" />
                    </svg>
                    <div className="finance-desc-pie-legend">
                      {chartData.pieChart.map((item, index) => (
                        <div key={index} className="finance-desc-legend-item">
                          <div className="finance-desc-legend-color" style={{ backgroundColor: item.color }}></div>
                          <span>{item.name}: {item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bar Chart */}
              {currentChart === 1 && (
                <div className="finance-desc-chart-container">
                  <h4 className="finance-desc-chart-title">Monthly Budget vs Actual Spending</h4>
                  <div className="finance-desc-bar-chart">
                    <div className="finance-desc-bar-chart-grid">
                      {chartData.barChart.map((data, index) => (
                        <div key={index} className="finance-desc-bar-group">
                          <div className="finance-desc-bar-container">
                            <div 
                              className="finance-desc-bar budget" 
                              style={{ height: `${(data.budget / 80000) * 100}%` }}
                              title={`Budget: $${data.budget.toLocaleString()}`}
                            ></div>
                            <div 
                              className="finance-desc-bar actual" 
                              style={{ height: `${(data.actual / 80000) * 100}%` }}
                              title={`Actual: $${data.actual.toLocaleString()}`}
                            ></div>
                            <div 
                              className="finance-desc-bar forecast" 
                              style={{ height: `${(data.forecast / 80000) * 100}%` }}
                              title={`Forecast: $${data.forecast.toLocaleString()}`}
                            ></div>
                          </div>
                          <div className="finance-desc-bar-label">{data.month}</div>
                        </div>
                      ))}
                    </div>
                    <div className="finance-desc-bar-legend">
                      <div className="finance-desc-legend-item">
                        <div className="finance-desc-legend-color budget"></div>
                        <span>Budget</span>
                      </div>
                      <div className="finance-desc-legend-item">
                        <div className="finance-desc-legend-color actual"></div>
                        <span>Actual</span>
                      </div>
                      <div className="finance-desc-legend-item">
                        <div className="finance-desc-legend-color forecast"></div>
                        <span>Forecast</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Gantt Chart */}
              {currentChart === 2 && (
                <div className="finance-desc-chart-container">
                  <h4 className="finance-desc-chart-title">Project Timeline & Budget Allocation</h4>
                  <div className="finance-desc-gantt-chart">
                    {chartData.ganttChart.map((task, index) => (
                      <div key={index} className="finance-desc-gantt-row">
                        <div className="finance-desc-gantt-label">{task.task}</div>
                        <div className="finance-desc-gantt-timeline">
                          <div 
                            className="finance-desc-gantt-bar"
                            style={{ 
                              left: `${task.start}%`, 
                              width: `${task.duration}%`,
                              backgroundColor: index % 2 === 0 ? '#3b82f6' : '#10b981'
                            }}
                          >
                            <div 
                              className="finance-desc-gantt-progress"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="finance-desc-gantt-percentage">{task.progress}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="finance-desc-process">
        <div className="finance-desc-container-inner">
          <div className="finance-desc-process-header">
            <h2 className="finance-desc-section-title">
              Our Financial Management Process
            </h2>
            <p className="finance-desc-section-subtitle">
              From initial cost analysis to dashboard creation and performance tracking, our systematic approach ensures comprehensive financial management for every construction project.
            </p>
          </div>

          <div className="finance-desc-process-grid">
            <div className="finance-desc-process-content">
              <div className="finance-desc-process-steps">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`finance-desc-process-step ${currentProcess === index ? 'active' : ''}`}
                    onClick={() => setCurrentProcess(index)}
                  >
                    <div className="finance-desc-step-number">{step.step}</div>
                    <div className="finance-desc-step-content">
                      <h4 className="finance-desc-step-title">{step.title}</h4>
                      <p className="finance-desc-step-description">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => document.getElementById("finance-1").scrollIntoView({ behavior: "smooth" })} className="finance-desc-process-button">
                Start Financial Planning
              </button>
            </div>

            <div className="finance-desc-process-visual">
              <div className="finance-desc-process-image-container">
                <img
                  src={processSteps[currentProcess].image}
                  alt={processSteps[currentProcess].title}
                  className="finance-desc-process-image"
                />
                <div className="finance-desc-process-overlay">
                  <span className="finance-desc-process-overlay-text" >
                    💰 View Financial Details
                  </span>
                </div>
              </div>
              <div className="finance-desc-process-navigation" id="finance-1">
                <button onClick={prevProcess} className="finance-desc-process-nav-btn">
                  ←
                </button>
                <div className="finance-desc-process-indicators">
                  {processSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProcess(index)}
                      className={`finance-desc-process-indicator ${currentProcess === index ? 'active' : ''}`}
                    />
                  ))}
                </div>
                <button onClick={nextProcess} className="finance-desc-process-nav-btn">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Allocation Section */}
      <section className="finance-desc-resources">
        <div className="finance-desc-container-inner">
          <div className="finance-desc-resources-grid">
            <div className="finance-desc-resources-visual">
              <div className="finance-desc-resources-chart">
                <div className="finance-desc-resource-item workers">
                  <div className="finance-desc-resource-icon">👷</div>
                  <div className="finance-desc-resource-info">
                    <h4>Labor Costs</h4>
                    <p>Comprehensive tracking of worker wages, overtime, benefits, and productivity-based compensation</p>
                    <div className="finance-desc-resource-amount">$45,000/month</div>
                  </div>
                </div>
                <div className="finance-desc-resource-item materials">
                  <div className="finance-desc-resource-icon">🧱</div>
                  <div className="finance-desc-resource-info">
                    <h4>Material Expenses</h4>
                    <p>Real-time tracking of material costs, supplier payments, and inventory management expenses</p>
                    <div className="finance-desc-resource-amount">$30,000/month</div>
                  </div>
                </div>
                <div className="finance-desc-resource-item equipment">
                  <div className="finance-desc-resource-icon">🚜</div>
                  <div className="finance-desc-resource-info">
                    <h4>Equipment Costs</h4>
                    <p>Equipment rental, maintenance, fuel, and operational costs with utilization analytics</p>
                    <div className="finance-desc-resource-amount">$15,000/month</div>
                  </div>
                </div>
                <div className="finance-desc-resource-item overhead">
                  <div className="finance-desc-resource-icon">📋</div>
                  <div className="finance-desc-resource-info">
                    <h4>Overhead Expenses</h4>
                    <p>Administrative costs, permits, insurance, and project management expenses tracking</p>
                    <div className="finance-desc-resource-amount">$10,000/month</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="finance-desc-resources-content">
              <h2 className="finance-desc-section-title">
                Intelligent Cost Allocation
              </h2>
              <p className="finance-desc-paragraph">
                Our financial management system automatically calculates and tracks all project costs including labor, materials, equipment, and overhead expenses with real-time dashboard updates.
              </p>
              <p className="finance-desc-paragraph">
                By analyzing historical data and current market rates, we provide accurate cost projections and budget recommendations, ensuring optimal financial performance throughout the project lifecycle.
              </p>
              
              <div className="finance-desc-resource-metrics">
                <div className="finance-desc-metric">
                  <div className="finance-desc-metric-value">50+</div>
                  <div className="finance-desc-metric-label">Cost Categories</div>
                </div>
                <div className="finance-desc-metric">
                  <div className="finance-desc-metric-value">24/7</div>
                  <div className="finance-desc-metric-label">Live Tracking</div>
                </div>
                <div className="finance-desc-metric">
                  <div className="finance-desc-metric-value">AI</div>
                  <div className="finance-desc-metric-label">Predictions</div>
                </div>
              </div>

              <button onClick={() => document.getElementById('finance-2').scrollIntoView({ behavior: 'smooth' })} className="finance-desc-resources-button">
                Get Your Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="finance-desc-technology">
        <div className="finance-desc-container-inner">
          <div className="finance-desc-technology-content">
            <h2 className="finance-desc-section-title">
              Advanced Financial Technology
            </h2>
            <p className="finance-desc-section-subtitle">
              Powered by cutting-edge financial algorithms and machine learning, our system provides unprecedented accuracy and efficiency in construction financial management.
            </p>

            <div className="finance-desc-tech-features">
              <div className="finance-desc-tech-feature">
                <div className="finance-desc-tech-icon">🤖</div>
                <h4>AI-Powered Analytics</h4>
                <p>Machine learning algorithms analyze financial patterns to predict costs, optimize budgets, and identify potential savings opportunities.</p>
              </div>
              <div className="finance-desc-tech-feature">
                <div className="finance-desc-tech-icon">📊</div>
                <h4>Real-time Dashboards</h4>
                <p>Interactive dashboards with live financial data, customizable charts, and automated reporting capabilities.</p>
              </div>
              <div className="finance-desc-tech-feature">
                <div className="finance-desc-tech-icon">🔄</div>
                <h4>Dynamic Budgeting</h4>
                <p>Adaptive budget adjustments based on real-time conditions, market changes, and project modifications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="finance-desc-cta">
        <div className="finance-desc-container-inner">
          <div className="finance-desc-cta-content">
            <h2 className="finance-desc-cta-title" id="finance-2">
              Ready to Master Your Project Finances?
            </h2>
            <p className="finance-desc-cta-description">
              Transform your construction financial management with our advanced dashboard system. Experience the power of intelligent cost tracking and real-time financial monitoring.
            </p>
            
            <div className="finance-desc-cta-buttons">
              <button onClick={() => navigate('/ptfd/user-projects')} className="finance-desc-cta-primary-btn">
                Get Free Accommodation
              </button>
              <button className="finance-desc-cta-secondary-btn" onClick={() => setShowDemo(true)}>
                See Financial Demo
              </button>
            </div>

            <div className="finance-desc-cta-stats">
              <div className="finance-desc-cta-stat">
                <div className="finance-desc-cta-stat-number">$2B+</div>
                <div className="finance-desc-cta-stat-label">Managed Budget</div>
              </div>
              <div className="finance-desc-cta-stat">
                <div className="finance-desc-cta-stat-number">10K+</div>
                <div className="finance-desc-cta-stat-label">Transactions</div>
              </div>
              <div className="finance-desc-cta-stat">
                <div className="finance-desc-cta-stat-number">99.8%</div>
                <div className="finance-desc-cta-stat-label">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserFinance;
