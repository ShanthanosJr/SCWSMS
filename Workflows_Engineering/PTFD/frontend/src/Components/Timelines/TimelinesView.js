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
  BsPieChart,
  BsBarChart,
  BsPencil,
  BsBriefcase,
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
  ResponsiveContainer
} from "recharts";

export default function TimelineView() {
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
                  <button onClick={() => navigate(`/update-project-timeline/${id}`)} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
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
                    <BsFileEarmarkBarGraph className="me-2"/> Export PDF
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

        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <div className="row g-4">
            {/* Cost Distribution Chart */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsPieChart className="me-2 text-danger" />
                    Cost Distribution
                  </h5>
                </div>
                <div className="card-body text-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.costData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.costData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#333" fontSize={28} fontWeight="bold">
                        ${statistics.totalCost.toLocaleString()}
                      </text>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-muted">Breakdown of daily costs</p>
                </div>
              </div>
            </div>

            {/* Staff Distribution */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsBarChart className="me-2 text-danger" />
                    Staff Distribution
                  </h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.staffData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {viewMode === 'staff' && (
          <div className="row g-4">
            {/* Workers */}
            <div className="col-lg-4">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0">Workers ({timeline.workerCount || 0})</h5>
                </div>
                <div className="card-body">
                  {timeline.tworker?.length > 0 ? (
                    <ul className="list-group">
                      {timeline.tworker.map((worker, index) => (
                        <li key={index} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <span>{worker.name}</span>
                            <span>{worker.hoursWorked}h</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center">No workers assigned</p>
                  )}
                </div>
              </div>
            </div>

            {/* Engineers */}
            <div className="col-lg-4">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0">Engineers ({timeline.tengineerCount || 0})</h5>
                </div>
                <div className="card-body">
                  {timeline.tengineer?.length > 0 ? (
                    <ul className="list-group">
                      {timeline.tengineer.map((engineer, index) => (
                        <li key={index} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <span>{engineer.name}</span>
                            <span>{engineer.hoursWorked}h</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center">No engineers assigned</p>
                  )}
                </div>
              </div>
            </div>

            {/* Architects */}
            <div className="col-lg-4">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0">Architects ({timeline.architectCount || 0})</h5>
                </div>
                <div className="card-body">
                  {timeline.tarchitect?.length > 0 ? (
                    <ul className="list-group">
                      {timeline.tarchitect.map((architect, index) => (
                        <li key={index} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <span>{architect.name}</span>
                            <span>{architect.hoursWorked}h</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center">No architects assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {viewMode === 'resources' && (
          <div className="row g-4">
            {/* Materials */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0">Materials ({statistics.materialsCount})</h5>
                </div>
                <div className="card-body">
                  {timeline.tmaterials?.length > 0 ? (
                    <ul className="list-group">
                      {timeline.tmaterials.map((material, index) => (
                        <li key={index} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <span>{material.name} (x{material.quantity})</span>
                            <span>${parseFloat(material.cost || 0).toLocaleString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center">No materials used</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0">Tools ({statistics.toolsCount})</h5>
                </div>
                <div className="card-body">
                  {timeline.ttools?.length > 0 ? (
                    <ul className="list-group">
                      {timeline.ttools.map((tool, index) => (
                        <li key={index} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <span>{tool.name} (x{tool.quantity})</span>
                            <span className={`badge bg-secondary`}>{tool.status}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted text-center">No tools used</p>
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
                          <small className="text-muted">{formatDate(expense.date)}</small>
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
                <small className="text-muted">
                  💡 Switch between views using tabs • Export or edit as needed
                </small>
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