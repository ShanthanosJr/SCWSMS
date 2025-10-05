import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

// Add this import at the top with other imports
import { exportProjectToPDF } from '../ExportUtils';
import {
  BsBuilding,
  BsCurrencyDollar,
  BsGraphUp,
  BsPeople,
  BsFileEarmarkBarGraph,
  BsCalendar,
  BsGeoAlt,
  BsBriefcase,
  BsExclamationTriangle,
  BsActivity,
  BsPencil,
  BsGrid,
  BsBack,
  BsSortNumericDown,
  BsIndent,
  BsTelephone,
  BsClock,
  BsBell,
  BsPersonFill,
  BsKanban,
  BsBarChartFill,
  BsStarFill,
  BsShieldCheck,
  BsGraphUpArrow,
  BsBullseye
} from 'react-icons/bs';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from "recharts";

export default function ProjectsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [viewMode, setViewMode] = useState("overview");
  // automatic elapsed timer (seconds since project.pcreatedat)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Get project images array or fallback to single image/default
  const getProjectImages = (project) => {
    if (!project) return [];

    if (project.pimg && Array.isArray(project.pimg) && project.pimg.length > 0) {
      return project.pimg;
    }

    if (project.pimg && typeof project.pimg === 'string') {
      return [project.pimg];
    }

    const defaultImages = {
      'Residential': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=400&fit=crop&auto=format',
      'Commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop&auto=format',
      'Infrastructure': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&h=400&fit=crop&auto=format',
      'Industrial': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop&auto=format',
      default: 'https://via.placeholder.com/800x400?text=Project+Image'
    };

    return [defaultImages[project?.ptype] || defaultImages.default];
  };

  // Automatic elapsed timer since project.pcreatedat
  const projectStart = project?.pcreatedat;

useEffect(() => {
  if (!projectStart) {
    setElapsedSeconds(0);
    return;
  }

  const startDate = new Date(projectStart);
  if (isNaN(startDate.getTime())) {
    console.warn("Invalid project.pcreatedat:", projectStart);
    setElapsedSeconds(0);
    return;
  }

  const now = Date.now();
  const initial = Math.max(0, Math.floor((now - startDate.getTime()) / 1000));
  setElapsedSeconds(initial);

  const interval = setInterval(() => {
    setElapsedSeconds(prev => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [projectStart]);

  // Format timer display as days, hours, minutes, seconds
const formatTime = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // You can choose the format style
  return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes
    .toString()
    .padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
};

  // Mock team data - in real app this would come from API
  const teamMembers = [
    {
      id: 1,
      name: 'Alexandra Deff',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      task: 'Github Project Repository',
      status: 'Completed',
      color: '#10b981'
    },
    {
      id: 2,
      name: 'Edwin Adenike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      task: 'Integrate User Authentication System',
      status: 'In Progress',
      color: '#f59e0b'
    },
    {
      id: 3,
      name: 'Isaac Oluwatemilorun',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      task: 'Develop Search and Filter Functionality',
      status: 'Pending',
      color: '#ef4444'
    },
    {
      id: 4,
      name: 'David Oshodi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      task: 'Responsive Layout for Homepage',
      status: 'In Progress',
      color: '#f59e0b'
    }
  ];

  // Mock reminders data
  const reminders = [
    {
      id: 1,
      title: 'Develop API Endpoints',
      date: 'Nov 26, 2024',
      time: '02:00 pm - 04:00 pm',
      icon: '🔧',
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Onboarding Flow',
      date: 'Nov 28, 2024',
      time: '10:00 am - 12:00 pm',
      icon: '📋',
      color: '#10b981'
    },
    {
      id: 3,
      title: 'Build Dashboard',
      date: 'Nov 30, 2024',
      time: '09:00 am - 11:00 am',
      icon: '📊',
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'Optimize Page Load',
      date: 'Dec 5, 2024',
      time: '03:00 pm - 05:00 pm',
      icon: '⚡',
      color: '#8b5cf6'
    },
    {
      id: 5,
      title: 'Cross-Browser Testing',
      date: 'Dec 6, 2024',
      time: '01:00 pm - 03:00 pm',
      icon: '🧪',
      color: '#ef4444'
    }
  ];

  // Enhanced analytics data
  // Enhanced analytics data
  const analyticsData = {
    weeklyProgress: [
      { day: 'S', completed: 75, pending: 25, name: 'Sunday' },
      { day: 'M', completed: 100, pending: 0, name: 'Monday' },
      { day: 'T', completed: 85, pending: 15, name: 'Tuesday' },
      { day: 'W', completed: 90, pending: 10, name: 'Wednesday' },
      { day: 'T', completed: 0, pending: 100, name: 'Thursday' },
      { day: 'F', completed: 0, pending: 100, name: 'Friday' },
      { day: 'S', completed: 0, pending: 100, name: 'Saturday' }
    ],
    progressTrend: [
      { month: 'Jul', progress: 20, target: 25 },
      { month: 'Aug', progress: 35, target: 40 },
      { month: 'Sep', progress: 45, target: 55 },
      { month: 'Oct', progress: 60, target: 70 },
      { month: 'Nov', progress: 75, target: 85 },
      { month: 'Dec', progress: 85, target: 100 }
    ],
    taskDistribution: [
      { name: 'Completed', value: 41, color: '#10b981' },
      { name: 'In Progress', value: 35, color: '#f59e0b' },
      { name: 'Pending', value: 24, color: '#ef4444' }
    ]
  };

  // Auto-carousel effect (3 seconds) when auto-playing is enabled
  useEffect(() => {
    let intervalId;
    if (isAutoPlaying && project) {
      const projectImages = getProjectImages(project);
      if (projectImages.length > 1) {
        intervalId = setInterval(() => {
          setCurrentImageIndex((prevIndex) =>
            prevIndex === projectImages.length - 1 ? 0 : prevIndex + 1
          );
        }, 3000); // 3 second interval
      }
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoPlaying, project]);

  const handlePreviousImage = () => {
    const projectImages = getProjectImages(project);
    setCurrentImageIndex(currentImageIndex === 0 ? projectImages.length - 1 : currentImageIndex - 1);
  };

  const handleNextImage = () => {
    const projectImages = getProjectImages(project);
    setCurrentImageIndex(currentImageIndex === projectImages.length - 1 ? 0 : currentImageIndex + 1);
  };

  const fetchProject = () => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:5050/projects/${id}`)
      .then((res) => {
        setProject(res.data.project || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setError("Failed to load project data");
        setProject(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProjectDuration = () => {
    if (!project?.pcreatedat || !project?.penddate) return 0;
    const start = new Date(project.pcreatedat);
    const end = new Date(project.penddate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProjectProgress = () => {
    if (!project?.pcreatedat || !project?.penddate) return 0;
    const start = new Date(project.pcreatedat);
    const end = new Date(project.penddate);
    const now = new Date();

    if (now >= end) return 100;
    if (now <= start) return 0;

    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / totalDuration) * 100);
  };

  const statistics = project ? {
    budget: parseFloat(project.pbudget || 0),
    duration: calculateProjectDuration(),
    progress: getProjectProgress(),
    issues: project.pissues?.length || 0
  } : {
    budget: 0,
    duration: 0,
    progress: 0,
    issues: 0
  };

  const chartData = project ? {
    statusData: [
      { name: 'Completed', value: getProjectProgress(), color: '#10b981' },
      { name: 'Remaining', value: 100 - getProjectProgress(), color: '#e5e7eb' }
    ]
  } : {
    statusData: [
      { name: 'Completed', value: 0, color: '#10b981' },
      { name: 'Remaining', value: 100, color: '#e5e7eb' }
    ]
  };

  // Add this function after other helper functions
  const handleExportProject = () => {
    if (project) {
      exportProjectToPDF(project, `project-${project.pcode}-detailed.pdf`);
    }
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="container mt-4">
          <div className="text-center">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading project dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div>
        <Nav />
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-danger">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <span style={{ fontSize: '4rem', color: '#dc3545' }}>⚠️</span>
                  </div>
                  <h4 className="card-title text-danger">Project Not Found</h4>
                  <p className="card-text text-muted">
                    {error || "The requested project could not be found or may have been deleted."}
                  </p>
                  <div className="mt-4">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => navigate("/projects-fd")}
                    >
                      ← Back to Projects
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={fetchProject}
                    >
                      🔄 Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const projectImages = getProjectImages(project);
  const hasMultipleImages = projectImages.length > 1;

  return (
    <div>
      <Nav />
      <div className="container-fluid mt-4">
        <style>{`
          .chart-container { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .stats-card { transition: transform 0.2s; }
          .stats-card:hover { transform: translateY(-2px); }
          .premium-gradient { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
          .success-gradient { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
          .warning-gradient { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
          .info-gradient { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
          .progress-bar-custom { height: 8px; border-radius: 4px; }
        `}</style>

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
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(17, 153, 142, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(56, 239, 125, 0.03) 0%, transparent 50%)',
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
                    background: 'linear-gradient(135deg, #1e8449 0%, #38ef7d 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(17, 153, 142, 0.3)',
                    marginRight: '1rem'
                  }}>
                    <BsBuilding className="text-white fs-1" />
                  </div>
                  <div>
                    <h1 className="display-3 fw-bold mb-1" style={{
                      color: '#1a1a1a',
                      fontWeight: '700',
                      letterSpacing: '-0.02em'
                    }}>{project?.pname || 'Project Name'}</h1>
                    <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                      {project?.ptype || 'Project Type'} • {project?.pcode || 'Project Code'}
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
                  {project?.pdescription || 'No description available.'}
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button onClick={() => navigate(`/ptfd/projects/${id}`)} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(17, 153, 142, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsPencil className="me-2" /> Edit Project
                  </button>
                  <button onClick={handleExportProject} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #1e8449',
                    color: '#11998e',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(17, 153, 142, 0.2)'
                  }}>
                    <BsFileEarmarkBarGraph className="me-2" /> Export PDF
                  </button>
                  <button onClick={() => navigate(`/ptfd/projects`)} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(17, 153, 142, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsBack className="me-2" /> Back To Projects
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Cards */}
        <div className="row mb-4 g-3">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #1e8449' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3">
                      <BsCurrencyDollar style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Budget</h6>
                    <h3 className="mb-0 text-success">${statistics.budget.toLocaleString()}</h3>
                    <small className="text-success">
                      <span className="me-1">↑</span>
                      Allocated
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #1e8449' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                      <BsCalendar style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Duration</h6>
                    <h3 className="mb-0 text-primary">{statistics.duration} days</h3>
                    <small className="text-info">
                      <span className="me-1">📅</span>
                      Planned
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #1e8449' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                      <BsGraphUp style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Progress</h6>
                    <h3 className="mb-0 text-warning">
                      {statistics.progress}%
                    </h3>
                    <small className="text-muted">
                      <span className="me-1">📈</span>
                      Completion
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #1e8449' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                      <BsExclamationTriangle style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Issues</h6>
                    <h3 className="mb-0 text-danger">
                      {statistics.issues}
                    </h3>
                    <small className="text-success">
                      <span className="me-1">⚠️</span>
                      Reported
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'overview' ? 'active' : ''}`}
                      onClick={() => setViewMode('overview')}
                    >
                      <BsActivity className="me-2" />
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'details' ? 'active' : ''}`}
                      onClick={() => setViewMode('details')}
                    >
                      <BsBuilding className="me-2" />
                      Project Info
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'analytics' ? 'active' : ''}`}
                      onClick={() => setViewMode('analytics')}
                    >
                      <BsBarChartFill className="me-2" />
                      Analytics
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'images' ? 'active' : ''}`}
                      onClick={() => setViewMode('images')}
                    >
                      <BsGrid className="me-2" />
                      Gallery
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'issues' ? 'active' : ''}`}
                      onClick={() => setViewMode('issues')}
                    >
                      <BsExclamationTriangle className="me-2" />
                      Issues
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab - Enhanced */}
        {viewMode === 'overview' && (
          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-8">
              <div className="row g-4">
                {/* Project Analytics - Weekly Progress */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center"
                        style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsBarChartFill className="me-2" style={{ color: '#10b981' }} />
                        Project Analytics
                      </h5>

                      <small className="text-muted">Weekly progress overview</small>
                    </div>
                    <div className="card-body p-4">
                      <ResponsiveContainer width="100%" height={238}>
                        <BarChart data={analyticsData.weeklyProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#059669" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#e5e7eb" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#d1d5db" stopOpacity={0.4} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                          <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                            }}
                            labelFormatter={(value, payload) => {
                              const item = analyticsData.weeklyProgress.find(d => d.day === value);
                              return item ? item.name : value;
                            }}
                          />
                          <Bar
                            dataKey="completed"
                            stackId="a"
                            fill="url(#completedGradient)"
                            radius={[0, 0, 4, 4]}
                            name="Completed"
                          />
                          <Bar
                            dataKey="pending"
                            stackId="a"
                            fill="url(#pendingGradient)"
                            radius={[4, 4, 0, 0]}
                            name="Pending"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Team Collaboration */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}>
                    <div className="card-header border-0 d-flex justify-content-between align-items-center" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div className="text-center w-100">
                        <h5 className="mb-0 d-flex align-items-center justify-content-center"
                          style={{ color: '#1f2937', fontWeight: 'bold' }}>
                          <BsPeople className="me-2" style={{ color: '#10b981' }} />
                          Team Collaboration
                        </h5>
                        <small className="text-muted">{teamMembers.length} members</small>
                      </div>


                      {/*<button className="btn btn-outline-primary btn-sm rounded-pill px-3" style={{
                        border: '2px solid #10b981',
                        color: '#10b981'
                      }}>
                        <BsPersonFill className="me-1" />
                        Add Member
                      </button>*/}
                    </div>
                    <div className="card-body p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {teamMembers.map((member) => (
                        <div key={member.id} className="d-flex align-items-center mb-3 p-3 rounded-3" style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}>
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="rounded-circle me-3"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>{member.name}</h6>
                            <p className="mb-1 text-muted small">Working on {member.task}</p>
                            <span
                              className="badge rounded-pill px-2 py-1 small"
                              style={{
                                backgroundColor: `${member.color}20`,
                                color: member.color,
                                border: `1px solid ${member.color}30`
                              }}
                            >
                              {member.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Progress Donut */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsBullseye className="me-2" style={{ color: '#10b981' }} />
                        Project Progress
                      </h5>
                      <small className="text-muted">Overall completion status</small>
                    </div>
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <defs>
                            <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="#059669" stopOpacity={0.7} />
                            </linearGradient>
                            <linearGradient id="remainingGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="5%" stopColor="#f3f4f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#e5e7eb" stopOpacity={0.5} />
                            </linearGradient>
                          </defs>
                          <Pie
                            data={chartData.statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            <Cell fill="url(#progressGradient)" />
                            <Cell fill="url(#remainingGradient)" />
                          </Pie>
                          <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#10b981" fontSize={28} fontWeight="bold">
                            {`${statistics.progress}%`}
                          </text>
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-3">
                        <div className="d-flex justify-content-center align-items-center mb-2">
                          <div className="me-3 d-flex align-items-center">
                            <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', background: '#10b981' }}></div>
                            <small className="text-muted">Completed</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', background: '#e5e7eb' }}></div>
                            <small className="text-muted">Remaining</small>
                          </div>
                        </div>
                        <div className="text-center">
                          <small className="text-success fw-bold">Project Ended</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-4">
              <div className="row g-4">
                {/* Reminders */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}>
                    <div className="card-header border-0 d-flex align-items-center" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div className="w-100 text-center">
                        <h5 className="mb-0 d-flex align-items-center justify-content-center"
                          style={{ color: '#1f2937', fontWeight: 'bold' }}>
                          <BsBell className="me-2" style={{ color: '#10b981' }} />
                          Reminders
                        </h5>
                      </div>

                      {/*<button className="btn btn-outline-primary btn-sm rounded-pill px-3" style={{
                        border: '2px solid #10b981',
                        color: '#10b981'
                      }}>
                        <BsCalendarEvent className="me-1" />
                        New
                      </button>*/}
                    </div>
                    <div className="card-body p-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {reminders.map((reminder) => (
                        <div key={reminder.id} className="mb-3">
                          <div className="d-flex align-items-start p-3 rounded-3" style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
                              e.currentTarget.style.transform = 'translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}>
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                              style={{
                                width: '40px',
                                height: '40px',
                                background: `${reminder.color}15`,
                                border: `2px solid ${reminder.color}30`
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>{reminder.icon}</span>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-bold" style={{ color: '#1f2937', fontSize: '14px' }}>
                                {reminder.title}
                              </h6>
                              <p className="mb-1 text-muted small">Due date: {reminder.date}</p>
                              <p className="mb-0 text-muted small">Time: {reminder.time}</p>
                            </div>
                          </div>
                          {reminder.id === 1 && (
                            <div className="mt-2 text-center">
                              {/*<button 
                                className="btn btn-success btn-sm rounded-pill px-4"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  border: 'none'
                                }}
                              >
                                <BsChatDots className="me-1" />
                                Start Meeting
                              </button>*/}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Tracker (auto) */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg" style={{
                    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                    color: 'white'
                  }}>
                    <div className="card-body text-center p-5">
                      <h5 className="mb-3 d-flex align-items-center justify-content-center">
                        <BsClock className="me-2" />
                        Time Tracker
                      </h5>
                      <div className="mb-4">
                        <div
                          className="display-4 fw-bold mb-2"
                          style={{
                            fontFamily: 'monospace',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          {formatTime(elapsedSeconds)}
                        </div>
                        {/* Optional: show started-on date */}
                        <div className="small text-muted mb-3">
                          Started: {project?.pcreatedat ? new Date(project.pcreatedat).toLocaleString() : 'Not set'}
                        </div>
                        {/* no manual buttons — display read only */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
  .nav-pills .nav-link.active {
    background: linear-gradient(135deg, #1e8449 0%, #27ae60 100%) !important;
    color: #fff !important;
    border-radius: 8px;
  }
  .nav-pills .nav-link {
    color: #1e8449;
  }
  .nav-pills .nav-link:hover {
    color: #27ae60 !important;
  }
    .btn-primary {
  background: linear-gradient(135deg, #1e8449 0%, #27ae60 100%) !important;
  border: none !important;
  color: #fff !important;
}

.btn-primary:hover,
.btn-primary:focus {
  filter: brightness(1.1);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4) !important;
}

.btn-outline-primary {
  background: transparent !important;
  border: 2px solid #27ae60 !important;
  color: #27ae60 !important;
}

.btn-outline-primary:hover,
.btn-outline-primary:focus {
  background: rgba(39, 174, 96, 0.1) !important;
}

`}
        </style>

        {/* Analytics Tab - Premium Charts */}
        {viewMode === 'analytics' && (
          <div className="row g-4">
            {/* Progress Trend Line Chart */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsGraphUpArrow className="me-2" style={{ color: '#10b981' }} />
                    Progress vs Target Trend
                  </h5>
                  <small className="text-muted">Monthly performance analysis</small>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={analyticsData.progressTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="progressAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="targetAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                      <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value, name) => [`${value}%`, name === 'progress' ? 'Actual Progress' : 'Target']}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        fill="url(#targetAreaGradient)"
                        name="Target"
                        strokeDasharray="5 5"
                      />
                      <Area
                        type="monotone"
                        dataKey="progress"
                        stroke="#10b981"
                        strokeWidth={4}
                        fill="url(#progressAreaGradient)"
                        name="Actual Progress"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Task Distribution Donut */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsKanban className="me-2" style={{ color: '#10b981' }} />
                    Task Distribution
                  </h5>
                  <small className="text-muted">Current project status</small>
                </div>
                <div className="card-body text-center d-flex flex-column justify-content-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <defs>
                        <linearGradient id="completedTaskGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="inProgressTaskGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="pendingTaskGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={analyticsData.taskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="url(#completedTaskGradient)" />
                        <Cell fill="url(#inProgressTaskGradient)" />
                        <Cell fill="url(#pendingTaskGradient)" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [`${value}%`, 'Tasks']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3">
                    {analyticsData.taskDistribution.map((item, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 rounded" style={{
                        background: `${item.color}10`,
                        border: `1px solid ${item.color}30`
                      }}>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', background: item.color }}></div>
                          <span className="small fw-medium" style={{ color: '#1f2937' }}>{item.name}</span>
                        </div>
                        <span className="badge rounded-pill" style={{ background: item.color, color: 'white' }}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsStarFill className="me-2" style={{ color: '#10b981' }} />
                    Key Performance Metrics
                  </h5>
                  <small className="text-muted">Real-time project insights</small>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-3">
                      <div className="text-center p-4 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#10b981' }}>94%</div>
                        <div className="small fw-medium text-muted">Quality Score</div>
                        <div className="mt-2">
                          <BsShieldCheck className="text-success" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-4 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#f59e0b' }}>87%</div>
                        <div className="small fw-medium text-muted">Timeline Adherence</div>
                        <div className="mt-2">
                          <BsClock className="text-warning" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-4 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#3b82f6' }}>12</div>
                        <div className="small fw-medium text-muted">Active Tasks</div>
                        <div className="mt-2">
                          <BsKanban className="text-primary" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-4 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#8b5cf6' }}>98%</div>
                        <div className="small fw-medium text-muted">Team Satisfaction</div>
                        <div className="mt-2">
                          <BsStarFill className="text-purple" style={{ fontSize: '1.5rem', color: '#8b5cf6' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Info Tab - Enhanced */}
        {viewMode === 'details' && (
          <div className="row g-4">
            {/* Project Details */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsBuilding className="me-2" style={{ color: '#10b981' }} />
                    Project Information
                  </h5>
                  <small className="text-muted">Comprehensive project details</small>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-12">
                      <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#10b981' }}>
                        <BsFileEarmarkBarGraph className="me-2" />
                        Description
                      </h6>
                      <div className="p-3 rounded-3" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <p className="mb-0 text-muted lh-lg">{project?.pdescription || 'No description provided.'}</p>
                      </div>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#10b981' }}>
                        <BsActivity className="me-2" />
                        Observations
                      </h6>
                      <div className="p-3 rounded-3" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <p className="mb-0 text-muted lh-lg">{project?.pobservations || 'No observations recorded.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Metadata */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsActivity className="me-2" style={{ color: '#10b981' }} />
                    Key Information
                  </h5>
                  <small className="text-muted">Project metadata</small>
                </div>
                <div className="card-body p-3">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                      <span className="d-flex align-items-center small fw-medium text-muted">
                        <BsSortNumericDown className="me-2" style={{ color: '#10b981' }} />
                        Number
                      </span>
                      <span className="badge rounded-pill" style={{ background: '#fffff', color: 'white', fontSize: '15px' }}>
                        {project?.pnumber || 'Not specified'}
                      </span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                      <span className="d-flex align-items-center small fw-medium text-muted">
                        <BsGeoAlt className="me-2" style={{ color: '#f59e0b' }} />
                        Location
                      </span>
                      <span className="badge rounded-pill" style={{ background: '#fffff', color: 'white', fontSize: '15px' }}>
                        {project?.plocation || 'Not specified'}
                      </span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                      <span className="d-flex align-items-center small fw-medium text-muted">
                        <BsBriefcase className="me-2" style={{ color: '#3b82f6' }} />
                        Type
                      </span>
                      <span className="badge rounded-pill" style={{ background: '#fffff', color: 'white', fontSize: '15px' }}>
                        {project?.ptype || 'Not specified'}
                      </span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                      <span className="d-flex align-items-center small fw-medium text-muted">
                        <BsCalendar className="me-2" style={{ color: '#8b5cf6' }} />
                        Created
                      </span>
                      <span className="badge rounded-pill" style={{ background: '#fffff', color: 'white', fontSize: '15px' }}>
                        {project ? formatDate(project.pcreatedat) : 'Not specified'}
                      </span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                      <span className="d-flex align-items-center small fw-medium text-muted">
                        <BsCalendar className="me-2" style={{ color: '#ef4444' }} />
                        Updated
                      </span>
                      <span className="badge rounded-pill" style={{ background: '#fffff', color: 'white', fontSize: '15px' }}>
                        {project ? formatDate(project.pupdatedat) : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Owner Information */}
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsPersonFill className="me-2" style={{ color: '#10b981' }} />
                    Identifier Details
                  </h5>
                  <small className="text-muted">Contact information and ownership</small>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="text-center p-4 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <BsPeople className="text-success mb-3" style={{ fontSize: '2.5rem' }} />
                        <h6 className="fw-bold mb-2" style={{ color: '#1f2937' }}>Owner Name</h6>
                        <p className="mb-0 fw-medium" style={{ color: '#10b981' }}>
                          {project?.pownername || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-4 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <BsIndent className="text-primary mb-3" style={{ fontSize: '2.5rem' }} />
                        <h6 className="fw-bold mb-2" style={{ color: '#1f2937' }}>Owner ID</h6>
                        <p className="mb-0 fw-medium" style={{ color: '#3b82f6' }}>
                          {project?.pownerid || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-4 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <BsTelephone className="text-warning mb-3" style={{ fontSize: '2.5rem' }} />
                        <h6 className="fw-bold mb-2" style={{ color: '#1f2937' }}>Contact Number</h6>
                        <p className="mb-0 fw-medium" style={{ color: '#f59e0b' }}>
                          {project?.potelnumber || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {viewMode === 'images' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 d-flex align-items-center justify-content-center">
                    <BsGrid className="me-2 text-success" />
                    Image Gallery
                  </h5>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isAutoPlaying}
                      onChange={(e) => setIsAutoPlaying(e.target.checked)}
                    />
                    <label className="form-check-label">Auto Play</label>
                  </div>
                </div>
                <div className="card-body">
                  <div className="position-relative">
                    <img
                      src={projectImages[currentImageIndex]}
                      alt={`Project ${currentImageIndex + 1}`}
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    />
                    {hasMultipleImages && (
                      <>
                        <button
                          className="btn btn-primary position-absolute top-50 start-0 translate-middle-y ms-3"
                          onClick={handlePreviousImage}
                          style={{ zIndex: 1 }}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                          className="btn btn-primary position-absolute top-50 end-0 translate-middle-y me-3"
                          onClick={handleNextImage}
                          style={{ zIndex: 1 }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </>
                    )}
                  </div>
                  {hasMultipleImages && (
                    <div className="d-flex justify-content-center mt-3 gap-2">
                      {projectImages.map((_, index) => (
                        <button
                          key={index}
                          className={`btn btn-sm ${index === currentImageIndex ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Issues Tab */}
        {viewMode === 'issues' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsExclamationTriangle className="me-2 text-success" />
                    Project Issues
                  </h5>
                </div>
                <div className="card-body">
                  {project?.pissues && project.pissues.length > 0 ? (
                    <ul className="list-group">
                      {project.pissues.map((issue, index) => (
                        <li key={index} className="list-group-item">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center py-4">No issues reported for this project.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="row mt-5 mb-4">
          <div className="col-12">
            <div className="card bg-light border-0">
              <div className="card-body text-center py-3">
                <small className="text-muted">
                  💡 Switch between views using tabs • Use auto-play for gallery • Export or edit as needed
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}