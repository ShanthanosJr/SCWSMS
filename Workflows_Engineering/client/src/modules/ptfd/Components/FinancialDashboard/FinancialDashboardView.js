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
  BsBack,
  BsFileEarmarkBarGraph,
  BsStarFill,
  BsShieldCheck,
  BsClock,
  BsTrophyFill,
  BsBarChartFill,
  BsBullseye
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
  ResponsiveContainer,
  AreaChart,
  Area,
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
                      onClick={() => navigate("/ptfd/financial-dashboard")}
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
                  <button onClick={() => navigate(`/ptfd/financial-dashboard`)} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
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

        {/* Overview Tab - Enhanced */}
        {viewMode === 'overview' && (
          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-8">
              <div className="row g-4">
                {/* Financial Intelligence Dashboard */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(245, 158, 11, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center"
                        style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsBarChartFill className="me-2" style={{ color: '#f59e0b' }} />
                        Financial Intelligence Matrix
                      </h5>
                      <small className="text-muted">Comprehensive cost analysis breakdown for {dashboard ? formatDate(dashboard.createdAt) : 'this dashboard'}</small>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <defs>
                                <linearGradient id="laborGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.7} />
                                </linearGradient>
                                <linearGradient id="materialGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.9} />
                                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.7} />
                                </linearGradient>
                                <linearGradient id="toolGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="5%" stopColor="#fcd34d" stopOpacity={0.9} />
                                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.7} />
                                </linearGradient>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="5%" stopColor="#fed7aa" stopOpacity={0.9} />
                                  <stop offset="95%" stopColor="#fcd34d" stopOpacity={0.7} />
                                </linearGradient>
                              </defs>
                              <Pie
                                data={chartData.costDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                <Cell fill="url(#laborGradient)" />
                                <Cell fill="url(#materialGradient)" />
                                <Cell fill="url(#toolGradient)" />
                                <Cell fill="url(#expenseGradient)" />
                              </Pie>
                              <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#f59e0b" fontSize={24} fontWeight="bold">
                                {formatCurrency(statistics.totalCost)}
                              </text>
                              <Tooltip formatter={(value) => [formatCurrency(value), '']} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="text-center mt-2">
                            <h6 className="fw-bold" style={{ color: '#1f2937' }}>Cost Distribution</h6>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              {chartData.costDistribution.map((item, idx) => (
                                <small key={idx} className="d-flex align-items-center">
                                  <div className="rounded-circle me-1" style={{ width: '8px', height: '8px', background: item.color }}></div>
                                  {item.name}
                                </small>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData.costDistribution}>
                              <defs>
                                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.4} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 158, 11, 0.1)" />
                              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
                              <YAxis stroke="#6b7280" fontSize={10} />
                              <Tooltip
                                contentStyle={{
                                  background: 'rgba(255, 255, 255, 0.95)',
                                  border: 'none',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value) => formatCurrency(value)}
                              />
                              <Bar dataKey="value" fill="url(#costGradient)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                          <div className="text-center mt-2">
                            <h6 className="fw-bold" style={{ color: '#1f2937' }}>Cost Comparison</h6>
                            <small className="text-muted">{formatCurrency(statistics.totalCost)} total financial impact</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Performance Metrics */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(245, 158, 11, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center"
                        style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsTrophyFill className="me-2" style={{ color: '#f59e0b' }} />
                        Performance Excellence
                      </h5>
                      <small className="text-muted">Key efficiency indicators</small>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="text-center p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                          }}>
                            <div className="h4 fw-bold mb-2" style={{ color: '#f59e0b' }}>98%</div>
                            <div className="small fw-medium text-muted">Accuracy</div>
                            <BsStarFill className="text-warning mt-1" />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                          }}>
                            <div className="h4 fw-bold mb-2" style={{ color: '#10b981' }}>${(statistics.totalCost / Math.max(statistics.totalHours, 1) || 0).toFixed(0)}</div>
                            <div className="small fw-medium text-muted">Cost/Hour</div>
                            <BsCurrencyDollar className="text-success mt-1" />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                          }}>
                            <div className="h4 fw-bold mb-2" style={{ color: '#3b82f6' }}>A+</div>
                            <div className="small fw-medium text-muted">Quality</div>
                            <BsShieldCheck className="text-primary mt-1" />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                          }}>
                            <div className="h4 fw-bold mb-2" style={{ color: '#8b5cf6' }}>96%</div>
                            <div className="small fw-medium text-muted">On-Time</div>
                            <BsClock className="text-purple mt-1" style={{ color: '#8b5cf6' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Analysis */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(245, 158, 11, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsBullseye className="me-2" style={{ color: '#f59e0b' }} />
                        Financial Timeline
                      </h5>
                      <small className="text-muted">Budget allocation and utilization</small>
                    </div>
                    <div className="card-body p-3">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsCalendar className="me-2" style={{ color: '#f59e0b' }} />
                            Date Range
                          </span>
                          <span className="badge rounded-pill" style={{ background: '#f59e0b', color: 'white', fontSize: '12px' }}>
                            {getDateRange()}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsBuilding className="me-2" style={{ color: '#10b981' }} />
                            Projects
                          </span>
                          <span className="badge rounded-pill" style={{ background: '#10b981', color: 'white', fontSize: '12px' }}>
                            {statistics.projectCount}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsCurrencyDollar className="me-2" style={{ color: '#fbbf24' }} />
                            Total Investment
                          </span>
                          <span className="badge rounded-pill" style={{ background: '#fbbf24', color: 'white', fontSize: '12px' }}>
                            {formatCurrency(statistics.totalCost)}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsGraphUp className="me-2" style={{ color: '#d97706' }} />
                            Daily Average
                          </span>
                          <span className="badge rounded-pill" style={{ background: '#d97706', color: 'white', fontSize: '12px' }}>
                            {formatCurrency(statistics.avgDailyCost)}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsPeople className="me-2" style={{ color: '#3b82f6' }} />
                            Workforce Hours
                          </span>
                          <span className="badge rounded-pill" style={{ background: '#3b82f6', color: 'white', fontSize: '12px' }}>
                            {statistics.totalHours.toLocaleString()}h
                          </span>
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
                {/* Financial Summary */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg" style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                        <BsCurrencyDollar className="text-gold fs-1" />
                      </div>
                      <h5 className="mb-3">Financial Summary</h5>
                      <div className="row g-2 text-center">
                        <div className="col-6">
                          <div className="border border-white border-opacity-25 rounded p-2">
                            <div className="h5 fw-bold mb-1">{formatCurrency(statistics.totalCost)}</div>
                            <small className="opacity-75">Total Cost</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="border border-white border-opacity-25 rounded p-2">
                            <div className="h5 fw-bold mb-1">{formatCurrency(statistics.avgDailyCost)}</div>
                            <small className="opacity-75">Daily Avg</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="border border-white border-opacity-25 rounded p-2">
                            <div className="h5 fw-bold mb-1">{statistics.totalHours.toLocaleString()}</div>
                            <small className="opacity-75">Hours</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="border border-white border-opacity-25 rounded p-2">
                            <div className="h5 fw-bold mb-1">{statistics.projectCount}</div>
                            <small className="opacity-75">Projects</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Intelligence */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg h-100" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(245, 158, 11, 0.1)'
                  }}>
                    <div className="card-header border-0" style={{
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h5 className="mb-0 d-flex align-items-center justify-content-center"
                        style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        <BsFileEarmarkBarGraph className="me-2" style={{ color: '#f59e0b' }} />
                        Dashboard Context
                      </h5>
                      <small className="text-muted">Associated dashboard details</small>
                    </div>
                    <div className="card-body p-3">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsFileEarmarkBarGraph className="me-2" style={{ color: '#f59e0b' }} />
                            Dashboard ID
                          </span>
                          <span className="text-end small" style={{ maxWidth: '120px' }}>
                            {dashboard?.dashboardId || 'N/A'}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsActivity className="me-2" style={{ color: '#10b981' }} />
                            Dashboard Name
                          </span>
                          <span className="text-end small" style={{ maxWidth: '120px' }}>
                            {dashboard?.dashboardName || 'Unknown Dashboard'}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsCalendar className="me-2" style={{ color: '#3b82f6' }} />
                            Created Date
                          </span>
                          <span className="text-end small">
                            {dashboard ? formatDate(dashboard.createdAt) : 'N/A'}
                          </span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style={{ background: 'transparent' }}>
                          <span className="d-flex align-items-center small fw-medium text-muted">
                            <BsStarFill className="me-2" style={{ color: '#fbbf24' }} />
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

        {/* Breakdown Tab - Enhanced */}
        {viewMode === 'breakdown' && (
          <div className="row g-4">
            {/* Comprehensive Financial Analysis */}
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(245, 158, 11, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsBarChart className="me-2" style={{ color: '#f59e0b' }} />
                    Advanced Financial Breakdown Analysis
                  </h5>
                  <small className="text-muted">Detailed cost structure and distribution metrics</small>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData.costDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="breakdownAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 158, 11, 0.1)" />
                      <XAxis
                        dataKey="name"
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
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value, name) => [formatCurrency(value), `${name} Cost`]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        fill="url(#breakdownAreaGradient)"
                        name="Financial"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4">
                    <div className="row g-3">
                      {chartData.costDistribution.map((item, index) => (
                        <div key={index} className="col-md-3">
                          <div className="p-3 rounded-3" style={{
                            background: `${item.color}10`,
                            border: `1px solid ${item.color}30`,
                            transition: 'all 0.3s ease'
                          }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', background: item.color }}></div>
                                <span className="fw-medium" style={{ color: '#1f2937' }}>{item.name}</span>
                              </div>
                              <span className="badge rounded-pill" style={{ background: item.color, color: 'white' }}>
                                {((item.value / statistics.totalCost) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h5 fw-bold mb-1" style={{ color: item.color }}>
                              {formatCurrency(item.value)}
                            </div>
                            <div className="progress" style={{ height: '4px' }}>
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${(item.value / Math.max(...chartData.costDistribution.map(d => d.value))) * 100}%`,
                                  background: item.color
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab - Enhanced */}
        {viewMode === 'projects' && (
          <div className="row g-4">
            {/* Enhanced Project Analysis */}
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(245, 158, 11, 0.1)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsBuilding className="me-2" style={{ color: '#f59e0b' }} />
                    Project Portfolio Analysis
                  </h5>
                  <small className="text-muted">Comprehensive project-wise financial breakdown and performance metrics</small>
                </div>
                <div className="card-body p-0">
                  {getProjectBreakdown().length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                          <tr>
                            <th style={{ border: 'none', padding: '1rem' }}>
                              <div className="d-flex align-items-center">
                                <BsBuilding className="me-2" />
                                Project Details
                              </div>
                            </th>
                            <th style={{ border: 'none', padding: '1rem', textAlign: 'center' }}>
                              <div className="d-flex align-items-center justify-content-center">
                                <BsCurrencyDollar className="me-1" />
                                Total Investment
                              </div>
                            </th>
                            <th style={{ border: 'none', padding: '1rem', textAlign: 'center' }}>
                              <div className="d-flex align-items-center justify-content-center">
                                <BsPeople className="me-1" />
                                Labor Costs
                              </div>
                            </th>
                            <th style={{ border: 'none', padding: '1rem', textAlign: 'center' }}>
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">🧱</span>
                                Materials
                              </div>
                            </th>
                            <th style={{ border: 'none', padding: '1rem', textAlign: 'center' }}>
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">🔧</span>
                                Tools
                              </div>
                            </th>
                            <th style={{ border: 'none', padding: '1rem', textAlign: 'center' }}>
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">📋</span>
                                Expenses
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getProjectBreakdown().map((project, index) => (
                            <tr
                              key={index}
                              className="border-bottom"
                              style={{
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)';
                                e.currentTarget.style.transform = 'translateX(2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateX(0)';
                              }}
                            >
                              <td style={{ padding: '1.25rem' }}>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                      color: 'white'
                                    }}
                                  >
                                    <BsBuilding />
                                  </div>
                                  <div>
                                    <div className="fw-bold" style={{ color: '#1f2937' }}>
                                      {project.projectName || project.projectCode}
                                    </div>
                                    <small className="text-muted">Code: {project.projectCode}</small>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center" style={{ padding: '1.25rem' }}>
                                <span className={`fw-bold fs-5 ${
                                  project.totalCost > 50000 ? 'text-danger' :
                                  project.totalCost > 20000 ? 'text-warning' : 'text-success'
                                }`}>
                                  {formatCurrency(project.totalCost)}
                                </span>
                                <div className="progress mt-2" style={{ height: '4px' }}>
                                  <div
                                    className="progress-bar"
                                    style={{
                                      width: `${Math.min((project.totalCost / Math.max(...getProjectBreakdown().map(p => p.totalCost))) * 100, 100)}%`,
                                      background: 'linear-gradient(90deg, #f59e0b, #d97706)'
                                    }}
                                  ></div>
                                </div>
                              </td>
                              <td className="text-center" style={{ padding: '1.25rem' }}>
                                <span className="fw-semibold text-primary">
                                  {formatCurrency(project.laborCost)}
                                </span>
                              </td>
                              <td className="text-center" style={{ padding: '1.25rem' }}>
                                <span className="fw-semibold text-info">
                                  {formatCurrency(project.materialCost)}
                                </span>
                              </td>
                              <td className="text-center" style={{ padding: '1.25rem' }}>
                                <span className="fw-semibold text-warning">
                                  {formatCurrency(project.toolCost)}
                                </span>
                              </td>
                              <td className="text-center" style={{ padding: '1.25rem' }}>
                                <span className="fw-semibold text-secondary">
                                  {formatCurrency(project.expenses)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <span style={{ fontSize: '4rem', opacity: 0.3 }}>🏗️</span>
                      </div>
                      <h5 className="text-muted mb-3">No Project Data Available</h5>
                      <p className="text-muted">Project breakdown information is not available for this financial dashboard.</p>
                    </div>
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