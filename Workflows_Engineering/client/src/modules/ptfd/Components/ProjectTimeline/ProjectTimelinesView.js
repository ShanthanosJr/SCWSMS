import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

// Add this import at the top with other imports
import { exportTimelineToPDF } from '../ExportUtils';
import {
  BsCalendar,
  BsCurrencyDollar,
  BsGraphUp,
  BsPeople,
  BsFileEarmarkBarGraph,
  BsPencil,
  BsBriefcase,
  BsActivity,
  BsBack,
  BsClock,
  BsGear,
  BsClipboardData,
  BsTrophyFill,
  BsStarFill,
  BsBarChartFill,
  BsShield,
  BsBuilding,
  BsTools,
  BsHammer,
  BsClipboard,
  BsPerson,
  BsLadder,
  BsDatabase
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
  ResponsiveContainer
} from "recharts";

export default function ProjectTimelinesView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("overview");

  const fetchTimeline = () => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:5050/project-timelines/${id}`)
      .then((res) => {
        setTimeline(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching timeline:", err);
        setError("Failed to load timeline data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const calculateTotalHours = (staff) => {
    if (!staff || !Array.isArray(staff)) return 0;
    return staff.reduce((total, person) => total + (parseInt(person.hoursWorked) || 0), 0);
  };

  const calculateTotalExpenses = (expenses) => {
    if (!expenses || !Array.isArray(expenses)) return 0;
    return expenses.reduce((total, expense) => total + (parseFloat(expense.amount) || 0), 0);
  };

  const calculateTotalMaterialCosts = (materials) => {
    if (!materials || !Array.isArray(materials)) return 0;
    return materials.reduce((total, material) => total + (parseFloat(material.cost) || 0), 0);
  };

  const getAllHours = () => {
    if (!timeline) return 0;
    const workerHours = calculateTotalHours(timeline.tworker);
    const engineerHours = calculateTotalHours(timeline.tengineer);
    const architectHours = calculateTotalHours(timeline.tarchitect);
    return workerHours + engineerHours + architectHours;
  };

  const getTotalCost = () => {
    if (!timeline) return 0;
    const expenseTotal = calculateTotalExpenses(timeline.texpenses);
    const materialTotal = calculateTotalMaterialCosts(timeline.tmaterials);
    return expenseTotal + materialTotal;
  };

  const statistics = timeline ? {
    totalHours: getAllHours(),
    totalCost: getTotalCost(),
    workerCount: timeline.workerCount || 0,
    engineerCount: timeline.tengineerCount || 0,
    architectCount: timeline.architectCount || 0,
    materialsCount: timeline.tmaterials?.length || 0,
    toolsCount: timeline.ttools?.length || 0,
    expensesCount: timeline.texpenses?.length || 0
  } : {
    totalHours: 0,
    totalCost: 0,
    workerCount: 0,
    engineerCount: 0,
    architectCount: 0,
    materialsCount: 0,
    toolsCount: 0,
    expensesCount: 0
  };

  const chartData = {
    costData: [
      { name: 'Materials', value: calculateTotalMaterialCosts(timeline?.tmaterials), color: '#ef4444' },
      { name: 'Expenses', value: calculateTotalExpenses(timeline?.texpenses), color: '#f59e0b' }
    ],
    staffData: [
      { name: 'Workers', value: statistics.workerCount, color: '#ef4444' },
      { name: 'Engineers', value: statistics.engineerCount, color: '#f59e0b' },
      { name: 'Architects', value: statistics.architectCount, color: '#10b981' }
    ]
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportTimeline = () => {
    if (timeline) {
      exportTimelineToPDF(timeline, `timeline-${timeline.pcode || id}.pdf`);
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
            <p className="mt-3 text-muted">Loading timeline dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !timeline) {
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
                  <h4 className="card-title text-danger">Timeline Not Found</h4>
                  <p className="card-text text-muted">
                    {error || "The requested timeline could not be found or may have been deleted."}
                  </p>
                  <div className="mt-4">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => navigate("/project-timelines")}
                    >
                      ← Back to Timelines
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={fetchTimeline}
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

  return (
    <div>
      <Nav />
      <div className="container-fluid mt-4">
        <style>{`
          .chart-container { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .stats-card { transition: transform 0.2s; }
          .stats-card:hover { transform: translateY(-2px); }
          .premium-gradient { background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%); }
          .success-gradient { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); }
          .warning-gradient { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); }
          .info-gradient { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); }
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
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(197, 48, 48, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(229, 62, 62, 0.03) 0%, transparent 50%)',
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
                    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(197, 48, 48, 0.3)',
                    marginRight: '1rem'
                  }}>
                    <BsCalendar className="text-white fs-1" />
                  </div>
                  <div>
                    <h1 className="display-3 fw-bold mb-1" style={{
                      color: '#1a1a1a',
                      fontWeight: '700',
                      letterSpacing: '-0.02em'
                    }}>{timeline.projectDetails?.pname || 'Timeline Entry'}</h1>
                    <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                      {formatDate(timeline.date)} • {timeline.pcode}
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
                  {timeline.tnotes || 'No notes available for this timeline.'}
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button onClick={() => navigate(`/ptfd/update-project-timeline/${id}`)} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(197, 48, 48, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsPencil className="me-2" /> Edit Timeline
                  </button>
                  <button onClick={handleExportTimeline} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #c53030',
                    color: '#c53030',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(197, 48, 48, 0.2)'
                  }}>
                    <BsFileEarmarkBarGraph className="me-2" /> Export PDF
                  </button>
                  <button onClick={() => navigate(`/ptfd/project-timelines`)} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(197, 48, 48, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsBack className="me-2" /> Back To Timelines
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Cards */}
        <div className="row mb-4 g-3">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #ef4444' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                      <BsPeople style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Staff</h6>
                    <h3 className="mb-0 text-danger">{statistics.workerCount + statistics.engineerCount + statistics.architectCount}</h3>
                    <small className="text-success">
                      <span className="me-1">👥</span>
                      On Site
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                      <BsGraphUp style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Hours</h6>
                    <h3 className="mb-0 text-warning">{statistics.totalHours}</h3>
                    <small className="text-info">
                      <span className="me-1">⏱️</span>
                      Worked
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #ef4444' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                      <BsCurrencyDollar style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Cost</h6>
                    <h3 className="mb-0 text-danger">${statistics.totalCost.toLocaleString()}</h3>
                    <small className="text-muted">
                      <span className="me-1">💰</span>
                      Incurred
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                      <BsBriefcase style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Resources</h6>
                    <h3 className="mb-0 text-warning">{statistics.materialsCount + statistics.toolsCount}</h3>
                    <small className="text-success">
                      <span className="me-1">🛠️</span>
                      Used
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
                      className={`nav-link ${viewMode === 'staff' ? 'active' : ''}`}
                      onClick={() => setViewMode('staff')}
                    >
                      <BsPeople className="me-2" />
                      Staff
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'resources' ? 'active' : ''}`}
                      onClick={() => setViewMode('resources')}
                    >
                      <BsBriefcase className="me-2" />
                      Resources
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'expenses' ? 'active' : ''}`}
                      onClick={() => setViewMode('expenses')}
                    >
                      <BsCurrencyDollar className="me-2" />
                      Expenses
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'notes' ? 'active' : ''}`}
                      onClick={() => setViewMode('notes')}
                    >
                      <BsPencil className="me-2" />
                      Notes
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
                {/* Timeline Performance Insights */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center"
                        style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsBarChartFill className="me-2" style={{ color: '#ef4444' }} />
                        Timeline Performance Breakdown
                      </h5>
                      <p className="text-muted mb-0 mt-1">Comprehensive activity analysis for {timeline ? formatDate(timeline.date) : 'this timeline'}</p>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <defs>
                                <linearGradient id="materialGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7} />
                                </linearGradient>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.7} />
                                </linearGradient>
                              </defs>
                              <Pie
                                data={chartData.costData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                <Cell fill="url(#materialGradient)" />
                                <Cell fill="url(#expenseGradient)" />
                              </Pie>
                              <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#ef4444" fontSize={24} fontWeight="bold">
                                ${getTotalCost().toLocaleString()}
                              </text>
                              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                            </PieChart>
                          </ResponsiveContainer>
                            <div className="text-center mt-2">
                              <h6 className="fw-bold" style={{ color: '#1f2937' }}>Cost Distribution</h6>
                              <div className="d-flex justify-content-center gap-3">
                                <span className="d-flex align-items-center text-sm">
                                  <div className="rounded-circle me-2" style={{ width: '10px', height: '10px', background: '#ef4444' }}></div>
                                  Materials
                                </span>
                                <span className="d-flex align-items-center text-sm">
                                  <div className="rounded-circle me-2" style={{ width: '10px', height: '10px', background: '#f59e0b' }}></div>
                                  Expenses
                                </span>
                              </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData.staffData}>
                              <defs>
                                <linearGradient id="staffGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.4} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239, 68, 68, 0.1)" />
                              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
                              <YAxis stroke="#6b7280" fontSize={10} />
                              <Tooltip
                                contentStyle={{
                                  background: 'rgba(255, 255, 255, 0.95)',
                                  border: 'none',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                              <Bar dataKey="value" fill="url(#staffGradient)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                          <div className="text-center mt-2">
                            <h6 className="fw-bold" style={{ color: '#1f2937' }}>Staff Allocation</h6>
                            <span className="text-muted">{statistics.workerCount + statistics.engineerCount + statistics.architectCount} total personnel</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Utilization */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center"
                        style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsTools className="me-2" style={{ color: '#ef4444' }} />
                        Resource Utilization
                      </h5>
                      <p className="text-muted mb-0 mt-1">Materials and tools usage</p>
                    </div>
                    <div className="card-body p-3">
                      {[
                        { type: 'Materials', count: statistics.materialsCount, icon: '🧱', color: '#ef4444', items: timeline?.tmaterials },
                        { type: 'Tools', count: statistics.toolsCount, icon: '🔨', color: '#f59e0b', items: timeline?.ttools },
                        { type: 'Equipment', count: statistics.expensesCount, icon: '🏧', color: '#dc2626', items: timeline?.texpenses }
                      ].map((resource, idx) => (
                        <div key={idx} className="mb-3 p-3 rounded-3" style={{
                          background: `${resource.color}08`,
                          border: `1px solid ${resource.color}20`,
                          transition: 'all 0.3s ease'
                        }}>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  background: `${resource.color}15`,
                                  border: `2px solid ${resource.color}30`
                                }}
                              >
                                <span style={{ fontSize: '16px' }}>{resource.icon}</span>
                              </div>
                            <div>
                              <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>{resource.type}</h6>
                              <span className="text-muted">{resource.count} items utilized</span>
                            </div>
                            </div>
                            <span className="badge rounded-pill px-3" style={{
                              background: resource.color,
                              color: 'white',
                              fontSize: '14px'
                            }}>
                              {resource.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Efficiency Metrics */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsTrophyFill className="me-2" style={{ color: '#ef4444' }} />
                        Performance Metrics
                      </h5>
                      <p className="text-muted mb-0 mt-1">Key efficiency indicators</p>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="text-center p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}>
                            <div className="h4 fw-bold mb-2" style={{ color: '#ef4444' }}>94%</div>
                            <div className="fw-medium text-muted">Efficiency</div>
                            <BsStarFill className="text-danger mt-1" />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                          }}>
                            <div className="h4 fw-bold mb-2" style={{ color: '#f59e0b' }}>${(getTotalCost() / getAllHours() || 0).toFixed(0)}</div>
                            <div className="fw-medium text-muted">Cost/Hour</div>
                            <BsCurrencyDollar className="text-warning mt-1" />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(153, 27, 27, 0.05) 100%)',
                            border: '1px solid rgba(220, 38, 38, 0.2)'
                          }}>
                            <div className="h4 fw-bold mb-2" style={{ color: '#dc2626' }}>A+</div>
                            <div className="fw-medium text-muted">Quality</div>
                            <BsShield className="text-danger mt-1" />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(185, 28, 28, 0.1) 0%, rgba(127, 29, 29, 0.05) 100%)',
                            border: '1px solid rgba(185, 28, 28, 0.2)'
                          }}>
                            <div className="h4 fw-bold mb-2" style={{ color: '#b91c1c' }}>89%</div>
                            <div className="fw-medium text-muted">On-Time</div>
                            <BsClock className="text-danger mt-1" />
                          </div>
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
                {/* Timeline Summary */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg" style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                    color: 'white'
                  }}>
                    <div className="card-body text-center p-5">
                      <div
                        className="mb-3 mx-auto d-inline-flex align-items-center justify-content-center"
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '20px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <BsCalendar className="text-danger fs-3" />
                      </div>
                      <h5 className="mb-3">Timeline Summary</h5>
                      <div className="row g-2 text-center">
                        <div className="col-6">
                          <div className="border border-white border-opacity-25 rounded p-2">
                            <div className="h5 fw-bold mb-1">{statistics.totalHours}h</div>
                            <small className="opacity-75">Total Hours</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="border border-white border-opacity-25 rounded p-2">
                            <div className="h5 fw-bold mb-1">${statistics.totalCost.toLocaleString()}</div>
                            <small className="opacity-75">Total Cost</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="border border-white border-opacity-25 rounded p-2">
                            <div className="h5 fw-bold mb-1">{statistics.workerCount + statistics.engineerCount + statistics.architectCount}</div>
                            <small className="opacity-75">Staff</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="border border-white border-opacity-25 rounded p-2">
                            <div className="h5 fw-bold mb-1">{statistics.materialsCount + statistics.toolsCount}</div>
                            <small className="opacity-75">Resources</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center"
                        style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsBuilding className="me-2" style={{ color: '#ef4444' }} />
                        Project Context
                      </h5>
                      <p className="text-muted mb-0 mt-1">Associated project details</p>
                    </div>
                    <div className="card-body p-3">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center fw-medium text-muted">
                            <BsClipboard className="me-2" style={{ color: '#ef4444' }} />
                            Project Code
                          </span>
                          <span className="badge rounded-pill" style={{ background: '#ef4444', color: 'white' }}>
                            {timeline?.pcode || 'N/A'}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center fw-medium text-muted">
                            <BsBuilding className="me-2" style={{ color: '#f59e0b' }} />
                            Project Name
                          </span>
                          <span className="text-end" style={{ maxWidth: '140px' }}>
                            {timeline?.pname || timeline?.projectDetails?.pname || 'Unknown Project'}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center fw-medium text-muted">
                            <BsPerson className="me-2" style={{ color: '#10b981' }} />
                            Project Owner
                          </span>
                          <span className="text-end" style={{ maxWidth: '140px' }}>
                            {timeline?.powner || timeline?.projectDetails?.powner || timeline?.powname || timeline?.projectDetails?.powname || 'Not specified'}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center fw-medium text-muted">
                            <BsLadder className="me-2" style={{ color: '#f59e0b' }} />
                            Project Location
                          </span>
                          <span className="text-end" style={{ maxWidth: '140px' }}>
                            {timeline?.plocation || timeline?.projectDetails?.plocation || 'Location not set'}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center fw-medium text-muted">
                            <BsDatabase className="me-2" style={{ color: '#6366f1' }} />
                            Project Created
                          </span>
                          <span className="text-end" style={{ maxWidth: '140px' }}>
                            {timeline?.pcreatedat ? formatDate(timeline.pcreatedat) : 
                             timeline?.projectDetails?.pcreatedat ? formatDate(timeline.projectDetails.pcreatedat) : 
                             timeline?.createdAt ? formatDate(timeline.createdAt) : 'Date not available'}
                          </span>
                        </div>
                        {/*<div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsShield className="me-2" style={{ color: '#8b5cf6' }} />
                            Project Type
                          </span>
                          <span className="text-end small" style={{ maxWidth: '120px' }}>
                            {timeline?.ptype || timeline?.projectDetails?.ptype || 'Standard Project'}
                          </span>
                        </div>*/}
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center fw-medium text-muted">
                            <BsCalendar className="me-2" style={{ color: '#dc2626' }} />
                            Timeline Date
                          </span>
                          <span className="text-end">
                            {timeline ? formatDate(timeline.date) : 'N/A'}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center fw-medium text-muted">
                            <BsActivity className="me-2" style={{ color: '#b91c1c' }} />
                            Status
                          </span>
                          <span className="badge bg-success">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Tab - Enhanced */}
        {viewMode === 'staff' && (
          <div className="row g-4">
            {/* Staff Overview */}
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center"
                    style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsPeople className="me-2" style={{ color: '#ef4444' }} />
                    Workforce Deployment Analysis
                  </h5>
                  <p className="text-muted mb-0 mt-1">Complete staff allocation breakdown for this timeline</p>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}>
                        <BsHammer className="text-danger mb-2" style={{ fontSize: '2rem' }} />
                        <div className="h4 fw-bold mb-1" style={{ color: '#ef4444' }}>{statistics.workerCount}</div>
                        <div className="fw-medium text-muted">Site Workers</div>
                        <div className="mt-2">
                          <span className="text-success">
                            <strong>{calculateTotalHours(timeline?.tworker)}h</strong> total
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <BsBriefcase className="text-warning mb-2" style={{ fontSize: '2rem' }} />
                        <div className="h4 fw-bold mb-1" style={{ color: '#f59e0b' }}>{statistics.engineerCount}</div>
                        <div className="fw-medium text-muted">Engineers</div>
                        <div className="mt-2">
                          <span className="text-success">
                            <strong>{calculateTotalHours(timeline?.tengineer)}h</strong> total
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(153, 27, 27, 0.05) 100%)',
                        border: '1px solid rgba(220, 38, 38, 0.2)'
                      }}>
                        <BsClipboardData className="text-danger mb-2" style={{ fontSize: '2rem' }} />
                        <div className="h4 fw-bold mb-1" style={{ color: '#dc2626' }}>{statistics.architectCount}</div>
                        <div className="fw-medium text-muted">Architects</div>
                        <div className="mt-2">
                          <span className="text-success">
                            <strong>{calculateTotalHours(timeline?.tarchitect)}h</strong> total
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workers */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center">
                    <BsHammer className="me-2" />
                    Site Workers ({timeline?.workerCount || 0})
                  </h5>
                  <span className="text-white-50">Front-line construction team</span>
                </div>
                <div className="card-body p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {timeline?.tworker?.length > 0 ? (
                    timeline.tworker.map((worker, index) => (
                      <div key={index} className="mb-3 p-3 rounded-3" style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(239, 68, 68, 0.1)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>{worker.name}</h6>
                            <span className="text-muted d-block">{worker.role || 'Site Worker'}</span>
                            {worker.specialty && (
                              <span className="text-info d-block">Specialty: {worker.specialty}</span>
                            )}
                          </div>
                          <div className="text-end">
                            <span className="badge" style={{ background: '#ef4444', color: 'white' }}>
                              {worker.hoursWorked || 0}h
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="progress" style={{ height: '4px' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${Math.min((worker.hoursWorked || 0) / 8 * 100, 100)}%`,
                                background: 'linear-gradient(90deg, #ef4444, #dc2626)'
                              }}
                            ></div>
                          </div>
                          <span className="text-muted">Daily hours progress</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <BsHammer className="text-muted mb-2" style={{ fontSize: '3rem', opacity: 0.3 }} />
                      <p className="text-muted">No workers assigned to this timeline</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Engineers */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(245, 158, 11, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center">
                    <BsBriefcase className="me-2" />
                    Engineers ({timeline?.tengineerCount || 0})
                  </h5>
                  <span className="text-white-50">Technical supervision team</span>
                </div>
                <div className="card-body p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {timeline?.tengineer?.length > 0 ? (
                    timeline.tengineer.map((engineer, index) => (
                      <div key={index} className="mb-3 p-3 rounded-3" style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(245, 158, 11, 0.1)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>{engineer.name}</h6>
                            <span className="text-muted d-block">{engineer.specialty || 'General Engineering'}</span>
                            {engineer.certification && (
                              <span className="text-success d-block">Cert: {engineer.certification}</span>
                            )}
                          </div>
                          <div className="text-end">
                            <span className="badge" style={{ background: '#f59e0b', color: 'white' }}>
                              {engineer.hoursWorked || 0}h
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="progress" style={{ height: '4px' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${Math.min((engineer.hoursWorked || 0) / 8 * 100, 100)}%`,
                                background: 'linear-gradient(90deg, #f59e0b, #d97706)'
                              }}
                            ></div>
                          </div>
                          <span className="text-muted">Daily hours progress</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <BsBriefcase className="text-muted mb-2" style={{ fontSize: '3rem', opacity: 0.3 }} />
                      <p className="text-muted">No engineers assigned to this timeline</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Architects */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(220, 38, 38, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  color: 'white'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center">
                    <BsClipboardData className="me-2" />
                    Architects ({timeline?.architectCount || 0})
                  </h5>
                  <span className="text-white-50">Design and planning team</span>
                </div>
                <div className="card-body p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {timeline?.tarchitect?.length > 0 ? (
                    timeline.tarchitect.map((architect, index) => (
                      <div key={index} className="mb-3 p-3 rounded-3" style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(220, 38, 38, 0.1)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>{architect.name}</h6>
                            <span className="text-muted d-block">{architect.specialty || 'Architectural Design'}</span>
                            {architect.license && (
                              <span className="text-primary d-block">License: {architect.license}</span>
                            )}
                          </div>
                          <div className="text-end">
                            <span className="badge" style={{ background: '#dc2626', color: 'white' }}>
                              {architect.hoursWorked || 0}h
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="progress" style={{ height: '4px' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${Math.min((architect.hoursWorked || 0) / 8 * 100, 100)}%`,
                                background: 'linear-gradient(90deg, #dc2626, #991b1b)'
                              }}
                            ></div>
                          </div>
                          <span className="text-muted">Daily hours progress</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <BsClipboardData className="text-muted mb-2" style={{ fontSize: '3rem', opacity: 0.3 }} />
                      <p className="text-muted">No architects assigned to this timeline</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab - Enhanced */}
        {viewMode === 'resources' && (
          <div className="row g-4">
            {/* Resource Overview */}
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center"
                    style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsTools className="me-2" style={{ color: '#ef4444' }} />
                    Resource Allocation Summary
                  </h5>
                  <p className="text-muted mb-0 mt-1">Complete breakdown of materials, tools and equipment usage</p>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}>
                        <BsHammer className="text-danger mb-2" style={{ fontSize: '2rem' }} />
                        <div className="h4 fw-bold mb-1" style={{ color: '#ef4444' }}>{statistics.materialsCount}</div>
                        <div className="fw-medium text-muted">Materials Used</div>
                        <div className="mt-2">
                          <span className="text-success">
                            <strong>${calculateTotalMaterialCosts(timeline?.tmaterials).toLocaleString()}</strong> value
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <BsTools className="text-warning mb-2" style={{ fontSize: '2rem' }} />
                        <div className="h4 fw-bold mb-1" style={{ color: '#f59e0b' }}>{statistics.toolsCount}</div>
                        <div className="fw-medium text-muted">Tools Deployed</div>
                        <div className="mt-2">
                          <span className="text-info">
                            <strong>Active</strong> status
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(153, 27, 27, 0.05) 100%)',
                        border: '1px solid rgba(220, 38, 38, 0.2)'
                      }}>
                        <BsGear className="text-danger mb-2" style={{ fontSize: '2rem' }} />
                        <div className="h4 fw-bold mb-1" style={{ color: '#dc2626' }}>{statistics.expensesCount}</div>
                        <div className="fw-medium text-muted">Other Expenses</div>
                        <div className="mt-2">
                          <span className="text-success">
                            <strong>${calculateTotalExpenses(timeline?.texpenses).toLocaleString()}</strong> total
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center">
                    <BsHammer className="me-2" />
                    Materials ({statistics.materialsCount})
                  </h5>
                  <span className="text-white-50">Construction materials inventory</span>
                </div>
                <div className="card-body p-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {timeline?.tmaterials?.length > 0 ? (
                    timeline.tmaterials.map((material, index) => (
                      <div key={index} className="mb-3 p-3 rounded-3" style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(239, 68, 68, 0.1)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>{material.name}</h6>
                            <div className="d-flex align-items-center gap-3">
                              <span className="text-muted">Qty: <strong>{material.quantity}</strong></span>
                              <span className="text-muted">Unit: <strong>{material.unit || 'pcs'}</strong></span>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="badge mb-1" style={{ background: '#ef4444', color: 'white' }}>
                              ${parseFloat(material.cost || 0).toLocaleString()}
                            </span>
                            <div>
                              <span className="text-muted">
                                ${(parseFloat(material.cost || 0) / parseFloat(material.quantity || 1)).toFixed(2)}/unit
                              </span>
                            </div>
                          </div>
                        </div>
                        {material.supplier && (
                          <div className="mt-2 pt-2 border-top border-light">
                            <span className="text-info">Supplier: {material.supplier}</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <div className="progress" style={{ height: '3px' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: '100%',
                                background: 'linear-gradient(90deg, #ef4444, #dc2626)'
                              }}
                            ></div>
                          </div>
                          <span className="text-success">✓ Delivered</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <BsHammer className="text-muted mb-3" style={{ fontSize: '4rem', opacity: 0.3 }} />
                      <h6 className="text-muted mb-2">No Materials Recorded</h6>
                      <p className="text-muted small">No construction materials have been logged for this timeline entry.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(245, 158, 11, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center">
                    <BsTools className="me-2" />
                    Tools & Equipment ({statistics.toolsCount})
                  </h5>
                  <span className="text-white-50">Construction tools and machinery</span>
                </div>
                <div className="card-body p-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {timeline?.ttools?.length > 0 ? (
                    timeline.ttools.map((tool, index) => (
                      <div key={index} className="mb-3 p-3 rounded-3" style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(245, 158, 11, 0.1)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>{tool.name}</h6>
                            <div className="d-flex align-items-center gap-3">
                              <span className="text-muted">Qty: <strong>{tool.quantity}</strong></span>
                              {tool.type && (
                                <span className="text-muted">Type: <strong>{tool.type}</strong></span>
                              )}
                            </div>
                          </div>
                          <div className="text-end">
                            <span className={`badge mb-1 ${tool.status === 'Available' ? 'bg-success' :
                                tool.status === 'In Use' ? 'bg-warning' :
                                  tool.status === 'Maintenance' ? 'bg-danger' :
                                    'bg-secondary'
                              }`}>
                              {tool.status || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        {tool.operator && (
                          <div className="mt-2">
                            <span className="text-primary">Operator: {tool.operator}</span>
                          </div>
                        )}
                        {tool.location && (
                          <div className="mt-1">
                            <span className="text-info">Location: {tool.location}</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <div className="progress" style={{ height: '3px' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: tool.status === 'Available' ? '100%' : tool.status === 'In Use' ? '75%' : '25%',
                                background: 'linear-gradient(90deg, #f59e0b, #d97706)'
                              }}
                            ></div>
                          </div>
                          <small className={`${tool.status === 'Available' ? 'text-success' :
                              tool.status === 'In Use' ? 'text-warning' :
                                'text-danger'
                            }`}>
                            {tool.status === 'Available' ? '✓ Ready' :
                              tool.status === 'In Use' ? '⚡ Active' :
                                '⚠ Attention needed'}
                          </small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <BsTools className="text-muted mb-3" style={{ fontSize: '4rem', opacity: 0.3 }} />
                      <h6 className="text-muted mb-2">No Tools Recorded</h6>
                      <p className="text-muted small">No tools or equipment have been logged for this timeline entry.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {viewMode === 'expenses' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0">Expenses ({statistics.expensesCount})</h5>
                </div>
                <div className="card-body">
                  {timeline.texpenses?.length > 0 ? (
                    <ul className="list-group">
                      {timeline.texpenses.map((expense, index) => (
                        <li key={index} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <span>{expense.description}</span>
                            <span>${parseFloat(expense.amount || 0).toLocaleString()}</span>
                          </div>
                          <span className="text-muted">{formatDate(expense.date)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center">No expenses recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {viewMode === 'notes' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0">Notes</h5>
                </div>
                <div className="card-body">
                  {timeline.tnotes ? (
                    <p className="text-muted">{timeline.tnotes}</p>
                  ) : (
                    <p className="text-muted text-center">No notes available</p>
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
                <span className="text-muted">
                  💡 Switch between views using tabs • Export or edit as needed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<style>
  {`
  .nav-pills .nav-link.active {
    background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%) !important;
    color: #fff !important;
    border-radius: 8px;
  }
  .nav-pills .nav-link {
    color: #c53030;
  }
  .nav-pills .nav-link:hover {
    color: #e53e3e;
  }
`}
</style>