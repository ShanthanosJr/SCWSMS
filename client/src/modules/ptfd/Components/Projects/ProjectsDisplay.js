import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import { useNavigate } from "react-router-dom";
import { exportProjectToPDF } from '../ExportUtils';
import {
  BsBuilding,
  BsCurrencyDollar,
  BsGraphUp,
  BsPeople,
  BsFileEarmarkBarGraph,
  BsSearch,
  BsPieChart,
  BsBarChart,
  BsCheckCircle,
  BsEye,
  BsTrash,
  BsPencil,
  BsGrid,
  BsList,
  BsCalendar,
  BsGeoAlt,
  BsBriefcase,
  BsExclamationTriangle,
  BsActivity
} from 'react-icons/bs';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

const URL = 'http://localhost:5050/projects';

async function fetchHandlers() {
  try {
    const res = await axios.get(URL);
    return Array.isArray(res.data) ? res.data : (res.data?.projects ?? []);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return [];
  }
}

export default function ProjectsDisplay() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortField, setSortField] = useState("pcreatedat");
  const [sortDirection, setSortDirection] = useState("desc");
  const [viewMode, setViewMode] = useState("overview");

  // Add these state variables after your existing useState declarations
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await fetchHandlers();
      if (!mounted) return;
      setProjects(data || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5050/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p._id !== id));
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        alert.innerHTML = `
          <strong>✅ Success!</strong> Project deleted successfully.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("❌ Error deleting project. Please try again.");
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status, returnHex = false) => {
    const colors = {
      'In Progress': returnHex ? '#3b82f6' : 'primary',
      'Completed': returnHex ? '#10b981' : 'success',
      'On Hold': returnHex ? '#f59e0b' : 'warning',
      'Cancelled': returnHex ? '#ef4444' : 'danger',
      'Planning': returnHex ? '#8b5cf6' : 'info',
      'Unknown': returnHex ? '#6b7280' : 'secondary'
    };
    return colors[status] || colors['Unknown'];
  };

  const getSortedAndFilteredProjects = () => {
    let filtered = projects.filter(project => {
      const matchesSearch = (
        (project.pname && project.pname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.plocation && project.plocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.pdescription && project.pdescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.pobservations && project.pobservations.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      const matchesStatus = statusFilter === "All" || project.pstatus === statusFilter;
      const matchesType = typeFilter === "All" || project.ptype === typeFilter;
      const matchesPriority = priorityFilter === "All" || project.ppriority === priorityFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    return filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case "pcreatedat":
          aVal = new Date(a.pcreatedat);
          bVal = new Date(b.pcreatedat);
          break;
        case "pbudget":
          aVal = parseFloat(a.pbudget) || 0;
          bVal = parseFloat(b.pbudget) || 0;
          break;
        case "pstatus":
          aVal = a.pstatus || "";
          bVal = b.pstatus || "";
          break;
        case "ppriority":
          aVal = a.ppriority || "";
          bVal = b.ppriority || "";
          break;
        case "penddate":
          aVal = new Date(a.penddate);
          bVal = new Date(b.penddate);
          break;
        default:
          aVal = a[sortField] || "";
          bVal = b[sortField] || "";
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Function to open project detail modal
  const openProjectDetailModal = (project) => {
    setSelectedProjectDetail(project);
    setShowDetailModal(true);
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };


  // Calculate statistics
  const statistics = useMemo(() => {
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.pbudget) || 0), 0);
    const activeProjects = projects.filter(p => p.pstatus === "In Progress").length;
    const completedProjects = projects.filter(p => p.pstatus === "Completed").length;
    const totalIssues = projects.reduce((sum, p) => sum + (p.pissues?.length || 0), 0);
    const overdueProjects = projects.filter(p => {
      const endDate = new Date(p.penddate);
      const now = new Date();
      return p.pstatus !== "Completed" && endDate < now;
    }).length;

    return {
      totalProjects: projects.length,
      totalBudget,
      activeProjects,
      completedProjects,
      totalIssues,
      overdueProjects,
      avgBudget: projects.length > 0 ? totalBudget / projects.length : 0
    };
  }, [projects]);

  // Chart data
  const chartData = useMemo(() => {
    // Status distribution for pie chart
    const statusCounts = projects.reduce((acc, project) => {
      const status = project.pstatus || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: getStatusColor(status, true)
    }));

    // Budget by type for bar chart
    const budgetByType = projects.reduce((acc, project) => {
      const type = project.ptype || 'Other';
      const budget = parseFloat(project.pbudget) || 0;
      if (!acc[type]) {
        acc[type] = { type, totalBudget: 0, projectCount: 0 };
      }
      acc[type].totalBudget += budget;
      acc[type].projectCount += 1;
      return acc;
    }, {});

    const budgetData = Object.values(budgetByType).map(item => ({
      ...item,
      avgBudget: item.projectCount > 0 ? item.totalBudget / item.projectCount : 0
    }));

    // Monthly progress data
    const monthlyData = projects.reduce((acc, project) => {
      const createdDate = new Date(project.pcreatedat);
      const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, created: 0, completed: 0 };
      }

      acc[monthKey].created += 1;
      if (project.pstatus === 'Completed') {
        acc[monthKey].completed += 1;
      }

      return acc;
    }, {});

    const progressData = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(item => ({
        ...item,
        month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));

    return { statusData, budgetData, progressData };
  }, [projects]);

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge bg-danger';
      case 'Medium': return 'badge bg-warning text-dark';
      case 'Low': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "⬆️" : "⬇️";
  };

  const filteredProjects = getSortedAndFilteredProjects();

// const handleExportAll = () => {
//   const summaryData = {
//     projects: projects,
//     totalProjects: projects.length,
//     totalBudget: projects.reduce((sum, p) => sum + (parseFloat(p.pbudget) || 0), 0),
//     activeProjects: projects.filter(p => p.pstatus === "In Progress").length,
//     generatedAt: new Date()
//   };

//   exportProjectToPDF(summaryData, `projects-summary-${new Date().toISOString().split('T')[0]}.pdf`);
// };


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

  return (
    <div>
      <Nav />
      <div className="container-fluid mt-4">
        <style>{`
          .chart-container { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .stats-card { transition: transform 0.2s; }
          .stats-card:hover { transform: translateY(-2px); }
          .premium-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .success-gradient { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
          .warning-gradient { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
          .info-gradient { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
          .progress-bar-custom { height: 8px; border-radius: 4px; }
        `}</style>

        {/* Premium Projects Dashboard-Style Header */}
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
                    <BsFileEarmarkBarGraph className="text-white fs-1" />
                  </div>
                  <div>
                    <h1 className="display-3 fw-bold mb-1" style={{
                      color: '#1a1a1a',
                      fontWeight: '700',
                      letterSpacing: '-0.02em'
                    }}>Projects Nexus</h1>
                    <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                      Orchestrate fiscal intelligence with unparalleled acuity
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
                  Your premium construction management platform. Track projects, manage teams, and ensure safety across all your construction sites.</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button onClick={() => navigate("/ptfd/project-timelines")} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #1e8449',
                    color: '#1e8449',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                  }}>
                    <BsBuilding className="me-2" />View Timelines
                  </button>
                  <button onClick={() => navigate("/ptfd/add-project")} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsBuilding className="me-2" />Forge New Project
                  </button>
                  <button onClick={() => navigate("/ptfd/project-requests")} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #1e8449',
                    color: '#1e8449',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                  }}>
                    <BsBuilding className="me-2" />View Requests
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Header 
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="card-header" style={{ background: 'linear-gradient(135deg, #ffc107 0%,rgba(255, 153, 0, 0.77) 100%)', color: 'white', padding: '2rem' }}>
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <h1 className="display-5 fw-bold mb-2">Welcome to Projects Dashboard</h1>
                    <p className="lead mb-3 opacity-90">
                      Your premium construction management platform. Track projects, manage teams, and ensure safety across all your construction sites.
                    </p>
                    <div className="row g-3 mt-2">
                      <div className="col-auto">
                        <button className="btn btn-light btn-lg shadow" onClick={() => navigate("/ptfd/add-project")} style={{ padding: '12px 30px', borderRadius: '50px', fontSize: '1.1rem' }}>
                          <BsBuilding className="me-2" />
                          Create A Project
                        </button>
                      </div>
                      <div className="col-auto">
                        <button className="btn btn-success btn-lg shadow" onClick={handleExportAll} style={{ padding: '12px 30px', borderRadius: '50px', fontSize: '1.1rem' }}>
                          <BsFileEarmarkBarGraph className="me-2" />
                          Export All Projects
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 text-end d-none d-lg-block">
                    <BsBuilding size={120} className="opacity-25" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>*/}

        {/* Statistics Cards */}
        <div className="row mb-4 g-3">
          <div className="col-lg-3 col-md-6">
            <div className="card stats-card border-0 shadow h-100 text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="card-body text-center p-4">
                <BsBuilding size={40} className="mb-3 opacity-75" />
                <h3 className="fw-bold mb-1">{statistics.totalProjects}</h3>
                <p className="mb-1">Total Projects</p>
                <small className="opacity-75">+2 from last month</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card stats-card border-0 shadow h-100 text-white success-gradient">
              <div className="card-body text-center p-4">
                <BsCurrencyDollar size={40} className="mb-3 opacity-75" />
                <h3 className="fw-bold mb-1">${(statistics.totalBudget / 1000000).toFixed(1)}M</h3>
                <p className="mb-1">Total Budget</p>
                <small className="opacity-75">+12% from last quarter</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card stats-card border-0 shadow h-100 text-white info-gradient">
              <div className="card-body text-center p-4">
                <BsGraphUp size={40} className="mb-3 opacity-75" />
                <h3 className="fw-bold mb-1">{statistics.totalProjects > 0 ? Math.round((statistics.completedProjects / statistics.totalProjects) * 100) : 0}%</h3>
                <p className="mb-1">Completion Rate</p>
                <small className="opacity-75">+2% improvement</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card stats-card border-0 shadow h-100 text-white warning-gradient">
              <div className="card-body text-center p-4">
                <BsExclamationTriangle size={40} className="mb-3 opacity-75" />
                <h3 className="fw-bold mb-1">{statistics.totalIssues}</h3>
                <p className="mb-1">Active Issues</p>
                <small className="opacity-75">5 resolved this week</small>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-lg-6">
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
                          className={`nav-link ${viewMode === 'analytics' ? 'active' : ''}`}
                          onClick={() => setViewMode('analytics')}
                        >
                          <BsPieChart className="me-2" />
                          Analytics
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${viewMode === 'projects' ? 'active' : ''}`}
                          onClick={() => setViewMode('projects')}
                        >
                          <BsGrid className="me-2" />
                          Projects
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${viewMode === 'table' ? 'active' : ''}`}
                          onClick={() => setViewMode('table')}
                        >
                          <BsList className="me-2" />
                          Table View
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6">
                    <div className="row g-2 align-items-center">
                      <div className="col">
                        <div className="input-group">
                          <span className="input-group-text">
                            <BsSearch />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-auto">
                        <select
                          className="form-select form-select-sm"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="All">All Status</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="col-auto">
                        <select
                          className="form-select form-select-sm"
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                        >
                          <option value="All">All Types</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Industrial">Industrial</option>
                        </select>
                      </div>
                      <div className="col-auto">
                        <select
                          className="form-select form-select-sm"
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                          <option value="All">All Priorities</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
    color: #27ae60;
  }
`}
        </style>


        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <div className="row g-4">
            {/* Project Progress */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsGraphUp className="me-2 text-primary" />
                    Project Progress
                  </h5>
                  <small className="text-muted">Current status of ongoing construction projects</small>
                </div>
                <div className="card-body">
                  {filteredProjects.slice(0, 4).map((project, index) => (
                    <div key={project._id} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <h6 className="mb-0">{project.pname}</h6>
                          <small className="text-muted">{project.plocation}</small>
                        </div>
                        <div className="text-end">
                          <small className="fw-bold">
                            {project.pstatus === 'Completed' ? '100%' :
                              project.pstatus === 'In Progress' ? '65%' :
                                project.pstatus === 'On Hold' ? '35%' : '0%'}
                          </small>
                        </div>
                      </div>
                      <div className="progress progress-bar-custom mb-2">
                        <div
                          className={`progress-bar bg-${getStatusColor(project.pstatus)}`}
                          style={{
                            width: `${project.pstatus === 'Completed' ? 100 :
                              project.pstatus === 'In Progress' ? 65 :
                                project.pstatus === 'On Hold' ? 35 : 0
                              }%`
                          }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark">{project.ptype}</span>
                        <span className={`badge bg-${getStatusColor(project.pstatus)}`}>
                          {project.pstatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsCalendar className="me-2 text-primary" />
                    Recent Activity
                  </h5>
                  <small className="text-muted">Latest updates from your construction sites</small>
                </div>
                <div className="card-body">
                  <div className="activity-feed">
                    <div className="d-flex mb-4">
                      <div className="flex-shrink-0">
                        <div className="bg-success rounded-circle d-flex align-items-center justify-center" style={{ width: '32px', height: '32px' }}>
                          <BsCheckCircle className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold">Foundation inspection completed</p>
                        <small className="text-muted">Downtown Office Complex • 2h ago</small>
                      </div>
                    </div>

                    <div className="d-flex mb-4">
                      <div className="flex-shrink-0">
                        <div className="bg-warning rounded-circle d-flex align-items-center justify-center" style={{ width: '32px', height: '32px' }}>
                          <BsExclamationTriangle className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold">Weather delay reported</p>
                        <small className="text-muted">Residential Tower A • 4h ago</small>
                      </div>
                    </div>

                    <div className="d-flex mb-4">
                      <div className="flex-shrink-0">
                        <div className="bg-info rounded-circle d-flex align-items-center justify-center" style={{ width: '32px', height: '32px' }}>
                          <BsPeople className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold">New team member assigned</p>
                        <small className="text-muted">Shopping Center Renovation • 6h ago</small>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-center" style={{ width: '32px', height: '32px' }}>
                          <BsFileEarmarkBarGraph className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold">Safety inspection scheduled</p>
                        <small className="text-muted">Industrial Complex B • 1d ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {viewMode === 'analytics' && (
          <div className="row g-4">
            {/* Status Distribution Chart */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsPieChart className="me-2 text-primary" />
                    Project Status Distribution
                  </h5>
                </div>
                <div className="card-body">
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData.statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Distribution Chart */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsBarChart className="me-2 text-primary" />
                    Budget Distribution by Type
                  </h5>
                </div>
                <div className="card-body">
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.budgetData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${(value / 1000).toFixed(0)}K`, 'Total Budget']} />
                        <Bar dataKey="totalBudget" fill="#667eea" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Progress Chart */}
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsGraphUp className="me-2 text-primary" />
                    Monthly Project Progress
                  </h5>
                </div>
                <div className="card-body">
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={chartData.progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="created" stackId="1" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="completed" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid Tab */}
        {viewMode === 'projects' && (
          <div>
            {/* Card View Filters */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="text-muted me-2">Sort by:</span>
                      {['pname', 'pcreatedat', 'pbudget', 'pstatus', 'ppriority'].map(field => (
                        <button
                          key={field}
                          className={`btn btn-sm ${sortField === field ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => handleSort(field)}
                        >
                          {field === 'pname' && '📋 Name'}
                          {field === 'pcreatedat' && '📅 Date'}
                          {field === 'pbudget' && '💰 Budget'}
                          {field === 'pstatus' && '📊 Status'}
                          {field === 'ppriority' && '⚠️ Priority'}
                          {' ' + getSortIcon(field)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {filteredProjects.map((project) => (
                <div key={project._id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow card-hover h-100">
                    <div className="position-relative">
                      <img
                        src={project.pimg?.[0] || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop&auto=format'}
                        alt={project.pname}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className={`badge bg-${getStatusColor(project.pstatus)}`}>
                          {project.pstatus}
                        </span>
                      </div>
                    </div>

                    <div className="card-body">
                      <h5 className="card-title">{project.pname}</h5>
                      <p className="text-muted small">{project.pcode}</p>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <BsGeoAlt className="me-2 text-muted" />
                          <small>{project.plocation}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <BsBriefcase className="me-2 text-muted" />
                          <small>{project.ptype}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <BsCurrencyDollar className="me-2 text-muted" />
                          <small>${parseFloat(project.pbudget || 0).toLocaleString()}</small>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className={getPriorityBadgeClass(project.ppriority)}>
                          {project.ppriority}
                        </span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openProjectDetailModal(project)}
                            title="View Details"
                          >
                            <BsEye />
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(`/projects/${project._id}`)}
                            title="Edit Project"
                          >
                            <BsPencil />
                          </button>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => exportProjectToPDF(project, `project-${project.pcode || project._id}.pdf`)}
                            title="Export Project"
                          >
                            <BsFileEarmarkBarGraph />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(project._id)}
                            title="Delete Project"
                          >
                            <BsTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table View Tab */}
        {viewMode === 'table' && (
          <div className="card border-0 shadow">
            <div className="card-header bg-light border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Project Records</h5>
                <small className="text-muted">
                  Showing {filteredProjects.length} of {projects.length} projects
                </small>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("pname")}
                      >
                        Project Name {getSortIcon("pname")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("pcode")}
                      >
                        Code {getSortIcon("pcode")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("plocation")}
                      >
                        Location {getSortIcon("plocation")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("ptype")}
                      >
                        Type {getSortIcon("ptype")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("pbudget")}
                      >
                        Budget {getSortIcon("pbudget")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("pstatus")}
                      >
                        Status {getSortIcon("pstatus")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("ppriority")}
                      >
                        Priority {getSortIcon("ppriority")}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={project.pimg?.[0] || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=50&h=50&fit=crop&auto=format'}
                              alt={project.pname}
                              className="rounded me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-semibold">{project.pname}</div>
                              <small className="text-muted">{project.pdescription?.substring(0, 50)}...</small>
                            </div>
                          </div>
                        </td>
                        <td><code>{project.pcode}</code></td>
                        <td>{project.plocation}</td>
                        <td>
                          <span className="badge bg-light text-dark">{project.ptype}</span>
                        </td>
                        <td className="fw-bold">${parseFloat(project.pbudget || 0).toLocaleString()}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(project.pstatus)}`}>
                            {project.pstatus}
                          </span>
                        </td>
                        <td>
                          <span className={getPriorityBadgeClass(project.ppriority)}>
                            {project.ppriority}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                openProjectDetailModal(project);
                              }}
                              title="View Details"
                            >
                              <BsEye />
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => navigate(`/ptfd/projects/${project._id}`)}
                              title="Edit Project"
                            >
                              <BsPencil />
                            </button>
                            <button
                              className="btn btn-outline-success"
                              onClick={() => exportProjectToPDF(project, `project-${project.pcode || project._id}.pdf`)}
                              title="Export Project"
                            >
                              <BsFileEarmarkBarGraph />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(project._id)}
                              title="Delete Project"
                            >
                              <BsTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Premium Project Modal */}
        {showDetailModal && selectedProjectDetail && (
          <div
            className="modal fade show d-block"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 1055
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div
                className="modal-content border-0 shadow-2xl"
                style={{
                  borderRadius: '32px',
                  background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  overflow: 'hidden'
                }}
              >
                {/* Premium Header with Green Gradient */}
                <div
                  className="modal-header border-0 position-relative"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                    padding: '2rem 2.5rem 1.5rem',
                    color: '#ffffff'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
                      pointerEvents: 'none'
                    }}
                  ></div>

                  <div className="d-flex align-items-center position-relative">
                    <div
                      className="me-4 d-flex align-items-center justify-content-center"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
                        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      <BsBuilding className="text-white fs-3" />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="modal-title fw-bold mb-2 text-white">
                        Project Chronicle
                      </h3>
                      <p className="mb-0 text-white-75 fs-5">
                        {new Date(selectedProjectDetail.pcreatedat).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Project Code Badge */}
                  <div className="mt-3 position-absolute top-0 end-0" style={{ marginTop: "50px", marginRight: "30px" }}>
                    <span
                      className="badge px-4 py-2 fw-semibold"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        borderRadius: '100px',
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      Project Code: {selectedProjectDetail.pcode}
                    </span>
                  </div>
                </div>

                {/* Premium Body */}
                <div className="modal-body" style={{ padding: '2.5rem' }}>

                  {/* Key Metrics Dashboard */}
                  <div className="row g-4 mb-5">
                    <div className="col-12">
                      <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#1f2937' }}>
                        <BsGraphUp className="me-3 text-success" />
                        Project Metrics
                      </h5>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          transform: 'translateY(0)',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div className="card-body text-center p-4">
                          <div
                            className="mb-3 d-inline-flex align-items-center justify-content-center"
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '16px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <BsCurrencyDollar className="text-black fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">
                            {formatCurrency(selectedProjectDetail.pbudget || 0)}
                          </h2>
                          <p className="text-black-75 mb-0 fw-medium">Project Budget</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          transform: 'translateY(0)',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div className="card-body text-center p-4">
                          <div
                            className="mb-3 d-inline-flex align-items-center justify-content-center"
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '16px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <BsCheckCircle className="text-black fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">{selectedProjectDetail.pstatus || 'Unknown'}</h2>
                          <p className="text-black-75 mb-0 fw-medium">Current Status</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                          transform: 'translateY(0)',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div className="card-body text-center p-4">
                          <div
                            className="mb-3 d-inline-flex align-items-center justify-content-center"
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '16px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <BsCalendar className="text-black fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">
                            {new Date(selectedProjectDetail.pcreatedat).toLocaleDateString()}
                          </h2>
                          <p className="text-black-75 mb-0 fw-medium">Start Date</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
                          transform: 'translateY(0)',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div className="card-body text-center p-4">
                          <div
                            className="mb-3 d-inline-flex align-items-center justify-content-center"
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '16px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <BsActivity className="text-black fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">
                            {selectedProjectDetail.ppriority || 'Medium'}
                          </h2>
                          <p className="text-black-75 mb-0 fw-medium">Priority Level</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="row g-4 mb-5">
                    <div className="col-lg-8">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          borderRadius: '24px',
                          background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                          border: '1px solid rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <div className="card-body p-4">
                          <h6 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#374151' }}>
                            <BsBuilding className="me-3 text-success" />
                            Project Intelligence
                          </h6>

                          <div className="row g-4">
                            <div className="col-md-6">
                              <div className="border-start border-4 border-success ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Name</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedProjectDetail.pname || 'Unknown Project'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-info ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Code</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedProjectDetail.pcode || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-warning ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Type</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedProjectDetail.ptype || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-danger ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Location</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedProjectDetail.plocation || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-primary ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>End Date</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedProjectDetail.penddate ? new Date(selectedProjectDetail.penddate).toLocaleDateString() : 'Not set'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-secondary ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Owner</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedProjectDetail.pownername || 'Not specified'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Summary */}
                    <div className="col-lg-4">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          borderRadius: '24px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff'
                        }}
                      >
                        <div className="card-body p-4 text-center">
                          <div
                            className="mb-3 mx-auto d-inline-flex align-items-center justify-content-center"
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '18px',
                              background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
                              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <BsCurrencyDollar className="text-white fs-3" />
                          </div>
                          <h6 className="fw-bold mb-3 text-black-75">Total Investment</h6>
                          <h2 className="fw-bold text-black mb-2">
                            {formatCurrency(selectedProjectDetail.pbudget || 0)}
                          </h2>
                          <p className="text-black-50 mb-0 small">
                            Allocated budget for this construction project
                          </p>

                          {/* Additional Project Details */}
                          <div className="mt-3 pt-3 border-top border-white border-opacity-25">
                            <div className="row text-center">
                              <div className="col-6">
                                <small className="text-black-75 d-block">Type</small>
                                <strong className="text-black">
                                  {selectedProjectDetail.ptype || 'Standard'}
                                </strong>
                              </div>
                              <div className="col-6">
                                <small className="text-black-75 d-block">Priority</small>
                                <strong className="text-black">
                                  {selectedProjectDetail.ppriority || 'Medium'}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  {selectedProjectDetail.pdescription && (
                    <div className="mb-4">
                      <div
                        className="card border-0 shadow-sm"
                        style={{
                          borderRadius: '24px',
                          background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        <div className="card-body p-4">
                          <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#065f46' }}>
                            <BsPencil className="me-3" />
                            Project Description
                          </h6>
                          <div
                            className="p-4 rounded-3"
                            style={{
                              background: 'rgba(255, 255, 255, 0.7)',
                              border: '1px solid rgba(16, 185, 129, 0.1)',
                              fontStyle: 'italic',
                              lineHeight: '1.6'
                            }}
                          >
                            <p className="mb-0" style={{ color: '#064e3b' }}>
                              "{selectedProjectDetail.pdescription}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Observations */}
                  {selectedProjectDetail.pobservations && (
                    <div className="mb-4">
                      <div
                        className="card border-0 shadow-sm"
                        style={{
                          borderRadius: '24px',
                          background: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 100%)',
                          border: '1px solid rgba(245, 158, 11, 0.2)'
                        }}
                      >
                        <div className="card-body p-4">
                          <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#92400e' }}>
                            <BsExclamationTriangle className="me-3" />
                            Observations & Notes
                          </h6>
                          <div
                            className="p-4 rounded-3"
                            style={{
                              background: 'rgba(255, 255, 255, 0.7)',
                              border: '1px solid rgba(245, 158, 11, 0.1)',
                              fontStyle: 'italic',
                              lineHeight: '1.6'
                            }}
                          >
                            <p className="mb-0" style={{ color: '#78350f' }}>
                              "{selectedProjectDetail.pobservations}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Issues */}
                  {selectedProjectDetail.pissues && selectedProjectDetail.pissues.length > 0 && (
                    <div className="mb-4">
                      <div
                        className="card border-0 shadow-sm"
                        style={{
                          borderRadius: '24px',
                          background: 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)',
                          border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <div className="card-body p-4">
                          <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#991b1b' }}>
                            <BsExclamationTriangle className="me-3" />
                            Project Issues ({selectedProjectDetail.pissues.length})
                          </h6>
                          <div className="row g-2">
                            {selectedProjectDetail.pissues.slice(0, 4).map((issue, index) => (
                              <div key={index} className="col-md-6">
                                <div
                                  className="p-3 rounded-3"
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    border: '1px solid rgba(239, 68, 68, 0.1)'
                                  }}
                                >
                                  <small className="text-danger fw-semibold">Issue {index + 1}</small>
                                  <p className="mb-0 small" style={{ color: '#7f1d1d' }}>
                                    {typeof issue === 'string' ? issue : issue.description || 'Issue description'}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {selectedProjectDetail.pissues.length > 4 && (
                              <div className="col-12">
                                <small className="text-muted">
                                  +{selectedProjectDetail.pissues.length - 4} more issues...
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Premium Footer */}
                <div
                  className="modal-footer border-0 d-flex justify-content-between align-items-center"
                  style={{
                    padding: '1.5rem 2.5rem 2rem',
                    background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)'
                  }}
                >
                  <div className="text-muted small">
                    <BsActivity className="me-2" />
                    Created: {new Date(selectedProjectDetail.pcreatedat).toLocaleDateString()}
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-light border-0 rounded-pill px-4 py-2 fw-semibold"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        color: '#6b7280',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setShowDetailModal(false)}
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      className="btn rounded-pill px-4 py-2 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                      }}
                      onClick={() => {
                        setShowDetailModal(false);
                        navigate(`/ptfd/projects/${selectedProjectDetail._id}`);
                      }}
                    >
                      <BsPencil className="me-2" />
                      Edit Project
                    </button>

                    <button
                      type="button"
                      className="btn rounded-pill px-4 py-2 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(4, 120, 87, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(4, 120, 87, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(4, 120, 87, 0.4)';
                      }}
                      onClick={() => {
                        setShowDetailModal(false);
                        navigate(`/ptfd/project-view/${selectedProjectDetail._id}`);
                      }}
                    >
                      <BsEye className="me-2" />
                      See More
                    </button>
                  </div>
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
                  💡 Switch between different views using the tabs above • Use filters and search to find specific projects •
                  Export data and manage your construction portfolio efficiently
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
