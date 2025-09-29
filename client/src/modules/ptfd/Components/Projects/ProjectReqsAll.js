import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import { useNavigate } from "react-router-dom";
import {
    BsSearch,
    BsBuilding,
    BsGrid,
    BsList,
    BsTrash,
    BsEye,
    BsEnvelope,
    BsTelephone,
    BsCalendar,
    BsFileText,
    BsPeople,
    BsGraphUp,
    BsExclamationTriangle,
    BsActivity,
    BsPieChart,
    BsCheckCircle
} from 'react-icons/bs';
import {
  PieChart as RePieChart,
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
  LineChart,
  Line
} from "recharts";

const URL = 'http://localhost:5050/project-requests';

async function fetchProjectReqs() {
    try {
        const res = await axios.get(URL);
        return Array.isArray(res.data.projectReqs) ? res.data.projectReqs : [];
    } catch (err) {
        console.error('Error fetching project requests:', err);
        return [];
    }
}

export default function ProjectReqsAll() {
    const navigate = useNavigate();
    const [projectReqs, setProjectReqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All"); // Assuming possible statuses: New, Processed, etc.
    const [sortField, setSortField] = useState("preqdate");
    const [sortDirection, setSortDirection] = useState("desc");
    const [viewMode, setViewMode] = useState("overview");
    const [selectedReq, setSelectedReq] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            const data = await fetchProjectReqs();
            if (!mounted) return;
            setProjectReqs(data || []);
            setLoading(false);
        })();
        return () => { mounted = false; };
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("⚠️ Are you sure you want to delete this project request? This action cannot be undone.")) {
            try {
                await axios.delete(`${URL}/${id}`);
                setProjectReqs((prev) => prev.filter((p) => p._id !== id));
                const alert = document.createElement('div');
                alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
                alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
                alert.innerHTML = `
          <strong>✅ Success!</strong> Project request deleted successfully.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
                document.body.appendChild(alert);
                setTimeout(() => alert.remove(), 3000);
            } catch (error) {
                console.error("Error deleting project request:", error);
                alert("❌ Error deleting project request. Please try again.");
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

    const getSortedAndFilteredReqs = () => {
        let filtered = projectReqs.filter(req => {
            const matchesSearch = (
                (req.preqname && req.preqname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (req.preqmail && req.preqmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (req.preqnumber && req.preqnumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (req.preqdescription && req.preqdescription.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            // Assuming all are "New" for now; can expand if statuses are added
            const matchesStatus = statusFilter === "All" || (statusFilter === "New" && true); // Mock

            return matchesSearch && matchesStatus;
        });

        return filtered.sort((a, b) => {
            let aVal, bVal;

            switch (sortField) {
                case "preqdate":
                    aVal = new Date(a.preqdate);
                    bVal = new Date(b.preqdate);
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

    const openDetailModal = (req) => {
        setSelectedReq(req);
        setShowModal(true);
    };

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalRequests = projectReqs.length;
        const recentRequests = projectReqs.filter(req => {
            const date = new Date(req.preqdate);
            const now = new Date();
            return (now - date) / (1000 * 60 * 60 * 24) <= 7; // Last 7 days
        }).length;
        const avgDescriptionLength = projectReqs.length > 0 ? 
            projectReqs.reduce((sum, req) => sum + (req.preqdescription?.length || 0), 0) / projectReqs.length : 0;

        return {
            totalRequests,
            recentRequests,
            avgDescriptionLength,
            pendingRequests: projectReqs.length // Assuming all pending
        };
    }, [projectReqs]);

    // Chart data - New charts: Line for requests over time, Bar for requests per month, Pie for mock categories (e.g., by contact type if possible, but mock)
    const chartData = useMemo(() => {
        // Mock statuses for pie chart (since no real status, simulate)
        const statusCounts = {
            'New': projectReqs.length * 0.7,
            'Processed': projectReqs.length * 0.2,
            'Archived': projectReqs.length * 0.1
        };

        const statusData = Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            value: Math.round(count),
            color: status === 'New' ? '#d97706' : status === 'Processed' ? '#3b82f6' : '#f59e0b'
        }));

        // Requests per month for bar chart
        const monthlyData = projectReqs.reduce((acc, req) => {
            const date = new Date(req.preqdate);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});

        const barData = Object.entries(monthlyData).map(([month, count]) => ({
            month,
            requests: count
        })).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

        // Requests over time for line chart
        const lineData = barData.map(item => ({
            ...item,
            month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        }));

        return { statusData, barData, lineData };
    }, [projectReqs]);

    const getSortIcon = (field) => {
        if (sortField !== field) return "↕️";
        return sortDirection === "asc" ? "⬆️" : "⬇️";
    };

    const filteredReqs = getSortedAndFilteredReqs();

    if (loading) {
        return (
            <div>
                <Nav />
                <div className="container mt-4">
                    <div className="text-center">
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading project requests dashboard...</p>
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
                                        background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)',
                                        marginRight: '1rem'
                                    }}>
                                        <BsFileText className="text-white fs-1" />
                                    </div>
                                    <div>
                                        <h1 className="display-3 fw-bold mb-1" style={{
                                            color: '#1a1a1a',
                                            fontWeight: '700',
                                            letterSpacing: '-0.02em'
                                        }}> Requests Nexus</h1>
                                        <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                                            Manage incoming construction inquiries with precision
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
                                    Your premium platform for handling project requests. Track inquiries, analyze trends, and respond efficiently.
                                </p>
                                <div className="d-flex justify-content-center gap-3 flex-wrap">
                                    <button onClick={() => navigate("/ptfd/project-timelines")} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                                        borderRadius: '50px',
                                        border: '2px solid #92400e',
                                        color: '#92400e',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                                    }}>
                                        <BsBuilding className="me-2" />View Timelines
                                    </button>
                                    <button onClick={() => navigate("/ptfd/projects")} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                                        borderRadius: '50px',
                                        background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
                                        border: 'none',
                                        color: '#fff',
                                        fontWeight: '600',
                                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <BsBuilding className="me-2" />View Projects
                                    </button>
                                    <button onClick={() => navigate("/ptfd/financial-dashboard")} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                                        borderRadius: '50px',
                                        border: '2px solid #92400e',
                                        color: '#92400e',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                                    }}>
                                        <BsBuilding className="me-2" />View Dashboards
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics Cards */}
                <div className="row mb-4 g-3">
                    <div className="col-lg-3 col-md-6">
                        <div className="card stats-card border-0 shadow h-100 text-white premium-gradient">
                            <div className="card-body text-center p-4">
                                <BsFileText size={40} className="mb-3 opacity-75" />
                                <h3 className="fw-bold mb-1">{statistics.totalRequests}</h3>
                                <p className="mb-1">Total Requests</p>
                                <small className="opacity-75">+3 from last week</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card stats-card border-0 shadow h-100 text-white success-gradient">
                            <div className="card-body text-center p-4">
                                <BsGraphUp size={40} className="mb-3 opacity-75" />
                                <h3 className="fw-bold mb-1">{statistics.recentRequests}</h3>
                                <p className="mb-1">Recent Requests</p>
                                <small className="opacity-75">Last 7 days</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card stats-card border-0 shadow h-100 text-white info-gradient">
                            <div className="card-body text-center p-4">
                                <BsPeople size={40} className="mb-3 opacity-75" />
                                <h3 className="fw-bold mb-1">{statistics.pendingRequests}</h3>
                                <p className="mb-1">Pending</p>
                                <small className="opacity-75">To be processed</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card stats-card border-0 shadow h-100 text-white warning-gradient">
                            <div className="card-body text-center p-4">
                                <BsExclamationTriangle size={40} className="mb-3 opacity-75" />
                                <h3 className="fw-bold mb-1">{Math.round(statistics.avgDescriptionLength)}</h3>
                                <p className="mb-1">Avg Desc Length</p>
                                <small className="opacity-75">Characters</small>
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
                                                    className={`nav-link ${viewMode === 'card' ? 'active' : ''}`}
                                                    onClick={() => setViewMode('card')}
                                                >
                                                    <BsGrid className="me-2" />
                                                    Card View
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
                                                        placeholder="Search requests..."
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
                                                    <option value="New">New</option>
                                                    {/* Add more if statuses are implemented */}
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
    background: linear-gradient(135deg, #92400e 0%, #b45309 100%) !important;
    color: #fff !important;
    border-radius: 8px;
  }
  .nav-pills .nav-link {
    color: #92400e;
  }
  .nav-pills .nav-link:hover {
    color: #b45309;
  }
`}
                </style>

                {/* Overview Tab */}
                {viewMode === 'overview' && (
                    <div className="row g-4">
                        {/* Recent Requests */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow h-100">
                                <div className="card-header bg-light border-0">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <BsGraphUp className="me-2 text-primary" />
                                        Recent Requests
                                    </h5>
                                    <small className="text-muted">Latest project inquiries</small>
                                </div>
                                <div className="card-body">
                                    {filteredReqs.slice(0, 4).map((req) => (
                                        <div key={req._id} className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div>
                                                    <h6 className="mb-0">{req.preqname}</h6>
                                                    <small className="text-muted">{req.preqmail}</small>
                                                </div>
                                                <span className="badge bg-success">New</span>
                                            </div>
                                            <p className="small text-muted mb-0">
                                                {req.preqdescription.substring(0, 100)}...
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats or Activity */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow h-100">
                                <div className="card-header bg-light border-0">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <BsCalendar className="me-2 text-primary" />
                                        Request Activity
                                    </h5>
                                    <small className="text-muted">Overview of recent activity</small>
                                </div>
                                <div className="card-body">
                                    {/* Mock activity */}
                                    <div className="mb-3">New request from John Doe</div>
                                    <div className="mb-3">Inquiry about commercial project</div>
                                    {/* Add more as needed */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {viewMode === 'analytics' && (
                    <div className="row g-4">
                        {/* Pie Chart: Status Distribution */}
                        <div className="col-lg-4">
                            <div className="chart-container">
                                <h5 className="text-center mb-4">Request Status Distribution</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RePieChart>
                                        <Pie
                                            data={chartData.statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart: Requests per Month */}
                        <div className="col-lg-4">
                            <div className="chart-container">
                                <h5 className="text-center mb-4">Requests per Month</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData.barData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="requests" fill="#d97706" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Line Chart: Requests Trend */}
                        <div className="col-lg-4">
                            <div className="chart-container">
                                <h5 className="text-center mb-4">Requests Trend</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData.lineData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="requests" stroke="#b45309" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Card View */}
                {viewMode === 'card' && (
                    <div className="row g-4">
                        {filteredReqs.length === 0 ? (
                            <div className="col-12">
                                <div className="text-center py-5">
                                    <BsFileText size={48} className="text-muted mb-3" />
                                    <h4 className="text-muted">No project requests found</h4>
                                    <p className="text-muted">There are no project requests matching your current filters.</p>
                                </div>
                            </div>
                        ) : (
                            filteredReqs.map((req) => (
                                <div key={req._id} className="col-lg-4 col-md-6">
                                    <div className="card border-0 shadow card-hover h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h5 className="card-title mb-1">{req.preqname}</h5>
                                                    <p className="text-muted small mb-0">
                                                        <BsCalendar className="me-1" />
                                                        {new Date(req.preqdate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className="badge bg-success">New</span>
                                            </div>

                                            <div className="mb-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <BsEnvelope className="me-2 text-muted" />
                                                    <small>{req.preqmail}</small>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <BsTelephone className="me-2 text-muted" />
                                                    <small>{req.preqnumber}</small>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <p className="card-text">
                                                    {req.preqdescription.length > 100
                                                        ? `${req.preqdescription.substring(0, 100)}...`
                                                        : req.preqdescription}
                                                </p>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => openDetailModal(req)}
                                                        title="View Details"
                                                    >
                                                        <BsEye />
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDelete(req._id)}
                                                        title="Delete Request"
                                                    >
                                                        <BsTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                    <div className="card border-0 shadow">
                        <div className="card-header bg-light border-0">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Project Requests</h5>
                                <small className="text-muted">
                                    Showing {filteredReqs.length} of {projectReqs.length} requests
                                </small>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {filteredReqs.length === 0 ? (
                                <div className="text-center py-5">
                                    <BsFileText size={48} className="text-muted mb-3" />
                                    <h4 className="text-muted">No project requests found</h4>
                                    <p className="text-muted">There are no project requests matching your current filters.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th onClick={() => handleSort("preqname")}>
                                                    Client Name {getSortIcon("preqname")}
                                                </th>
                                                <th>Contact</th>
                                                <th onClick={() => handleSort("preqdate")}>
                                                    Date {getSortIcon("preqdate")}
                                                </th>
                                                <th>Description</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredReqs.map((req) => (
                                                <tr key={req._id}>
                                                    <td>
                                                        <div className="fw-semibold">{req.preqname}</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="d-flex align-items-center">
                                                                <BsEnvelope className="me-1 text-muted" />
                                                                <small>{req.preqmail}</small>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                <BsTelephone className="me-1 text-muted" />
                                                                <small>{req.preqnumber}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {new Date(req.preqdate).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <div style={{ maxWidth: '300px' }}>
                                                            {req.preqdescription.length > 100
                                                                ? `${req.preqdescription.substring(0, 100)}...`
                                                                : req.preqdescription}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => openDetailModal(req)}
                                                                title="View Details"
                                                            >
                                                                <BsEye />
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDelete(req._id)}
                                                                title="Delete Request"
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
                            )}
                        </div>
                    </div>
                )}

                {/* Enhanced Premium Modal */}
                {showModal && selectedReq && (
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
                                {/* Premium Header */}
                                <div
                                    className="modal-header border-0 position-relative"
                                    style={{
                                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)',
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
                                                background: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
                                                boxShadow: '0 8px 25px rgba(212, 64, 14, 0.4)'
                                            }}
                                        >
                                            <BsFileText className="text-white fs-3" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h3 className="modal-title fw-bold mb-2 text-white">
                                                Project Request Chronicle
                                            </h3>
                                            <p className="mb-0 text-white-75 fs-5">
                                                {new Date(selectedReq.preqdate).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Premium Body */}
                                <div className="modal-body" style={{ padding: '2.5rem' }}>
                                    {/* Key Metrics */}
                                    <div className="row g-4 mb-5">
                                        <div className="col-12">
                                            <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#1f2937' }}>
                                                <BsGraphUp className="me-3 text-success" />
                                                Request Metrics
                                            </h5>
                                        </div>

                                        <div className="col-lg-3 col-md-6">
                                            <div
                                                className="card h-100 border-0 shadow-sm"
                                                style={{
                                                    borderRadius: '20px',
                                                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
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
                                                    <h2 className="fw-bold text-black mb-1">New</h2>
                                                    <p className="text-black-75 mb-0 fw-medium">Current Status</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6">
                                            <div
                                                className="card h-100 border-0 shadow-sm"
                                                style={{
                                                    borderRadius: '20px',
                                                    background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
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
                                                        {new Date(selectedReq.preqdate).toLocaleDateString()}
                                                    </h2>
                                                    <p className="text-black-75 mb-0 fw-medium">Submission Date</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6">
                                            <div
                                                className="card h-100 border-0 shadow-sm"
                                                style={{
                                                    borderRadius: '20px',
                                                    background: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
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
                                                        <BsEnvelope className="text-black fs-4" />
                                                    </div>
                                                    <h2 className="fw-bold text-black mb-1">Email</h2>
                                                    <p className="text-black-75 mb-0 fw-medium">Primary Contact</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-6">
                                            <div
                                                className="card h-100 border-0 shadow-sm"
                                                style={{
                                                    borderRadius: '20px',
                                                    background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
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
                                                    <h2 className="fw-bold text-black mb-1">High</h2>
                                                    <p className="text-black-75 mb-0 fw-medium">Priority Level</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Request Information */}
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
                                                        <BsFileText className="me-3 text-success" />
                                                        Request Details
                                                    </h6>

                                                    <div className="row g-4">
                                                        <div className="col-md-6">
                                                            <div className="border-start border-4 border-success ps-3">
                                                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Client Name</small>
                                                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                                                    {selectedReq.preqname || 'Unknown'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="border-start border-4 border-info ps-3">
                                                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Email</small>
                                                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                                                    {selectedReq.preqmail || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="border-start border-4 border-warning ps-3">
                                                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Phone</small>
                                                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                                                    {selectedReq.preqnumber || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="border-start border-4 border-primary ps-3">
                                                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Submission Date</small>
                                                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                                                    {new Date(selectedReq.preqdate).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div
                                                className="card border-0 shadow-sm h-100"
                                                style={{
                                                    borderRadius: '24px',
                                                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
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
                                                            background: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
                                                            boxShadow: '0 8px 25px rgba(212, 64, 14, 0.3)'
                                                        }}
                                                    >
                                                        <BsFileText className="text-white fs-3" />
                                                    </div>
                                                    <h6 className="fw-bold mb-3 text-black-75">Request Summary</h6>
                                                    <h2 className="fw-bold text-black mb-2">
                                                        New Inquiry
                                                    </h2>
                                                    <p className="text-black-50 mb-0 small">
                                                        Pending review and response
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {selectedReq.preqdescription && (
                                        <div className="mb-4">
                                            <div
                                                className="card border-0 shadow-sm"
                                                style={{
                                                    borderRadius: '24px',
                                                    background: 'linear-gradient(145deg, #fefce8 0%, #fef3c7 100%)',
                                                    border: '1px solid rgba(180, 83, 9, 0.2)'
                                                }}
                                            >
                                                <div className="card-body p-4">
                                                    <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#78350f' }}>
                                                        <BsFileText className="me-3" />
                                                        Project Description
                                                    </h6>
                                                    <div
                                                        className="p-4 rounded-3"
                                                        style={{
                                                            background: 'rgba(255, 255, 255, 0.7)',
                                                            border: '1px solid rgba(180, 83, 9, 0.1)',
                                                            fontStyle: 'italic',
                                                            lineHeight: '1.6'
                                                        }}
                                                    >
                                                        <p className="mb-0" style={{ color: '#451a03' }}>
                                                            "{selectedReq.preqdescription}"
                                                        </p>
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
                                        Submitted: {new Date(selectedReq.preqdate).toLocaleDateString()}
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
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
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
                                    💡 Switch between different views using the tabs above • Use filters and search to find specific requests •
                                    Analyze trends in analytics view
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}