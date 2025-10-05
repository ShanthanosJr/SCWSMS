import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import {
  BsCurrencyDollar,
  BsBuilding,
  BsCalendar,
  BsPeople,
  BsDownload,
  BsShare,
  BsGraphUp,
  BsActivity,
  BsPieChart,
  BsBarChart,
  BsBack
} from "react-icons/bs";
// Add this import for our export utility
import { exportFinancialDashboardToPDF } from '../ExportUtils';
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

export default function FinancialDashboardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [viewMode, setViewMode] = useState("overview");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching financial dashboard with ID:', id);

        // Add error handling for missing ID
        if (!id) {
          console.error('❌ No dashboard ID provided');
          setError('No dashboard ID provided');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5050/financial-dashboard/${id}`);
        const dashboardData = response.data.data;

        // Validate that we received dashboard data
        if (!dashboardData) {
          console.error('❌ No dashboard data received');
          setError('No dashboard data received');
          setLoading(false);
          return;
        }

        setDashboard(dashboardData);
        console.log('✅ Loaded financial dashboard:', dashboardData);
      } catch (error) {
        console.error('❌ Error fetching dashboard:', error);
        console.error('❌ Error details:', error.response?.data || error.message);
        setError('Error loading financial dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleExport = async () => {
    setExporting(true);
    try {
      console.log('🔄 Exporting dashboard:', id);

      // Use our professional PDF export function
      if (dashboard) {
        exportFinancialDashboardToPDF(dashboard, `${dashboard.dashboardName}.pdf`);
        console.log('✅ ✅ PDF export successful');
      } else {
        // Fallback to backend export if PDF generation fails
        const response = await axios.get(`http://localhost:5050/financial-dashboard/${id}/export`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `financial-dashboard-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        console.log('✅ Export successful');
      }
    } catch (error) {
      console.error('❌ Export failed:', error);
      console.error('❌ Export error details:', error.response?.data || error.message);
      alert('Export failed: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      console.log('🔄 Sharing dashboard:', id);
      // Since there's no backend share endpoint, we'll just copy the direct URL
      const shareUrl = `http://localhost:3000/financial-dashboard/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      alert(`✅ Direct URL copied: ${shareUrl}`);
    } catch (error) {
      console.error('❌ Share failed:', error);
      const shareUrl = `http://localhost:3000/financial-dashboard/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      alert(`✅ Direct URL copied: ${shareUrl}`);
    } finally {
      setSharing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDateRange = () => {
    if (!dashboard?.dateFrom || !dashboard?.dateTo) return 'All Time';
    return `${formatDate(dashboard.dateFrom)} - ${formatDate(dashboard.dateTo)}`;
  };

  const statistics = dashboard ? {
    totalCost: dashboard.financialSummary?.grandTotal || 0,
    avgDailyCost: dashboard.financialSummary?.grandTotal && dashboard.financialSummary?.timelineEntries ? 
                 dashboard.financialSummary.grandTotal / dashboard.financialSummary.timelineEntries : 0,
    totalHours: dashboard.laborAnalytics?.totalLaborHours || 0,
    projectCount: dashboard.financialSummary?.projectCount || 0
  } : {
    totalCost: 0,
    avgDailyCost: 0,
    totalHours: 0,
    projectCount: 0
  };

  const chartData = {
    costDistribution: [
      { name: 'Labor', value: dashboard?.totalLaborCost || 0, color: '#f59e0b' },
      { name: 'Materials', value: dashboard?.totalMaterialCost || 0, color: '#d97706' },
      { name: 'Tools', value: dashboard?.totalToolCost || 0, color: '#fbbf24' },
      { name: 'Expenses', value: dashboard?.totalExpenses || 0, color: '#fcd34d' }
    ]
  };

  const getProjectBreakdown = () => {
    if (!dashboard?.projectBreakdown) return [];
    return dashboard.projectBreakdown.map(project => ({
      ...project,
      totalCost: project.totalCost || 0,
      laborCost: project.laborCost || 0,
      materialCost: project.materialCost || 0,
      toolCost: project.toolCost || 0,
      expenses: project.expenses || 0
    }));
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
            <p className="mt-3 text-muted">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
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
                  <h4 className="card-title text-danger">Dashboard Not Found</h4>
                  <p className="card-text text-muted">
                    {error || "The requested dashboard could not be found or may have been deleted."}
                  </p>
                  <div className="mt-4">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => navigate("/financial-dashboard")}
                    >
                      ← Back to Dashboards
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
          .premium-gradient { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
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
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.03) 0%, transparent 50%)',
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
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                    marginRight: '1rem'
                  }}>
                    <BsGraphUp className="text-white fs-1" />
                  </div>
                  <div>
                    <h1 className="display-3 fw-bold mb-1" style={{
                      color: '#1a1a1a',
                      fontWeight: '700',
                      letterSpacing: '-0.02em'
                    }}>{dashboard.dashboardName}</h1>
                    <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                      {getDateRange()}
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
                  Comprehensive financial analysis for selected projects and period.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
                    style={{
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: '600',
                      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {exporting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <BsDownload className="me-2" /> Export PDF
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={sharing}
                    className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold"
                    style={{
                      borderRadius: '50px',
                      border: '2px solid #f59e0b',
                      color: '#f59e0b',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    {sharing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sharing...
                      </>
                    ) : (
                      <>
                        <BsShare className="me-2" /> Share Dashboard
                      </>
                    )}
                  </button>
                  <button onClick={() => navigate(`/financial-dashboard`)} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsBack className="me-2" /> Back To Dashboards
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Cards */}
        <div className="row mb-4 g-3">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                      <BsCurrencyDollar style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Cost</h6>
                    <h3 className="mb-0 text-warning">{formatCurrency(statistics.totalCost)}</h3>
                    <small className="text-success">
                      <span className="me-1">📈</span>
                      Overall
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #fbbf24' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                      <BsGraphUp style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Avg Daily Cost</h6>
                    <h3 className="mb-0 text-warning">{formatCurrency(statistics.avgDailyCost)}</h3>
                    <small className="text-info">
                      <span className="me-1">📅</span>
                      Per Day
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
                      <BsPeople style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Hours</h6>
                    <h3 className="mb-0 text-warning">
                      {statistics.totalHours.toLocaleString()}
                    </h3>
                    <small className="text-muted">
                      <span className="me-1">⏱️</span>
                      Worked
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #fbbf24' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                      <BsBuilding style={{ fontSize: '1.5rem' }} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Projects</h6>
                    <h3 className="mb-0 text-warning">
                      {statistics.projectCount}
                    </h3>
                    <small className="text-success">
                      <span className="me-1">🏗️</span>
                      Analyzed
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
                      className={`nav-link ${viewMode === 'breakdown' ? 'active' : ''}`}
                      onClick={() => setViewMode('breakdown')}
                    >
                      <BsPieChart className="me-2" />
                      Breakdown
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${viewMode === 'projects' ? 'active' : ''}`}
                      onClick={() => setViewMode('projects')}
                    >
                      <BsBuilding className="me-2" />
                      Projects
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
                    <BsPieChart className="me-2 text-warning" />
                    Cost Distribution
                  </h5>
                </div>
                <div className="card-body text-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.costDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.costDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#333" fontSize={28} fontWeight="bold">
                        {formatCurrency(statistics.totalCost)}
                      </text>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-muted">Breakdown of total costs</p>
                </div>
              </div>
            </div>

            {/* Key Information */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsActivity className="me-2 text-warning" />
                    Key Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsCalendar className="me-2 text-muted" />Date Range</span>
                      <strong>{getDateRange()}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsBuilding className="me-2 text-muted" />Projects</span>
                      <strong>{statistics.projectCount}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsCurrencyDollar className="me-2 text-muted" />Total Cost</span>
                      <strong>{formatCurrency(statistics.totalCost)}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsGraphUp className="me-2 text-muted" />Avg Daily Cost</span>
                      <strong>{formatCurrency(statistics.avgDailyCost)}</strong>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span><BsPeople className="me-2 text-muted" />Total Hours</span>
                      <strong>{statistics.totalHours.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Tab */}
        {viewMode === 'breakdown' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsBarChart className="me-2 text-warning" />
                    Cost Breakdown
                  </h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.costDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4">
                    <div className="list-group list-group-flush">
                      {chartData.costDistribution.map((item, index) => (
                        <div key={index} className="list-group-item d-flex justify-content-between">
                          <span>{item.name}</span>
                          <strong>{formatCurrency(item.value)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {viewMode === 'projects' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsBuilding className="me-2 text-warning" />
                    Project Breakdown
                  </h5>
                </div>
                <div className="card-body p-0">
                  {getProjectBreakdown().length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Project</th>
                            <th>Total Cost</th>
                            <th>Labor</th>
                            <th>Materials</th>
                            <th>Tools</th>
                            <th>Expenses</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getProjectBreakdown().map((project, index) => (
                            <tr key={index}>
                              <td>
                                <strong>{project.projectName || project.projectCode}</strong>
                                <br />
                                <small className="text-muted">{project.projectCode}</small>
                              </td>
                              <td className="fw-bold">{formatCurrency(project.totalCost)}</td>
                              <td>{formatCurrency(project.laborCost)}</td>
                              <td>{formatCurrency(project.materialCost)}</td>
                              <td>{formatCurrency(project.toolCost)}</td>
                              <td>{formatCurrency(project.expenses)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center py-4">No project breakdown available</p>
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
                  💡 Switch between views using tabs • Export or share as needed
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
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
    color: #fff !important;
    border-radius: 8px;
  }
  .nav-pills .nav-link {
    color: #f59e0b;
  }
  .nav-pills .nav-link:hover {
    color: #d97706;
  }
`}
</style>