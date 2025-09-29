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
  BsTelephone
} from 'react-icons/bs';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
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
                      Details
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

        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <div className="row g-4">
            {/* Progress Chart */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsGraphUp className="me-2 text-success" />
                    Project Progress
                  </h5>
                </div>
                <div className="card-body text-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#333" fontSize={28} fontWeight="bold">
                        {`${statistics.progress}%`}
                      </text>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-muted">Overall completion status</p>
                </div>
              </div>
            </div>

            {/* Key Information */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsActivity className="me-2 text-success" />
                    Key Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsSortNumericDown className="me-2 text-muted" />Number</span>
                      <strong>{project?.pnumber || 'Not specified'}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsGeoAlt className="me-2 text-muted" />Location</span>
                      <strong>{project?.plocation || 'Not specified'}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsBriefcase className="me-2 text-muted" />Type</span>
                      <strong>{project?.ptype || 'Not specified'}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsCalendar className="me-2 text-muted" />Created Date</span>
                      <strong>{project ? formatDate(project.pcreatedat) : 'Not specified'}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsCalendar className="me-2 text-muted" />Updated Date</span>
                      <strong>{project ? formatDate(project.pupdatedat) : 'Not specified'}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsPeople className="me-2 text-muted" />Owner</span>
                      <strong>{project?.pownername || 'Not specified'}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsIndent className="me-2 text-muted" />Owner ID</span>
                      <strong>{project?.pownerid || 'Not specified'}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsTelephone className="me-2 text-muted" />Owner Tel</span>
                      <strong>{project?.potelnumber || 'Not specified'}</strong>
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

        {/* Details Tab */}
        {viewMode === 'details' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsBuilding className="me-2 text-success" />
                    Project Details
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Description</h6>
                      <p className="text-muted">{project?.pdescription || 'No description provided.'}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Observations</h6>
                      <p className="text-muted">{project?.pobservations || 'No observations recorded.'}</p>
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
                  <h5 className="mb-0 d-flex align-items-center">
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