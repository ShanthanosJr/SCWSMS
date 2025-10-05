import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import Nav from "../Nav/Nav";
//import AdminHeadFoot from "../Nav/adminHeadFoot";
import { exportFinancialDashboardToPDF } from '../ExportUtils';
import {
  BsCurrencyDollar,
  BsGraphUp,
  BsPeople,
  BsFileEarmarkBarGraph,
  BsCalculator,
  BsSearch,
  BsPieChart,
  BsBarChart,
  BsCheckCircle,
  BsEye,
  BsTrash,
  BsPencil,
  BsGrid,
  BsList,
  BsBriefcase,
  BsExclamationTriangle,
  BsActivity,
  BsShare,
  BsDownload,
  BsCalendar,
  BsBellFill
} from 'react-icons/bs';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const URL = 'http://localhost:5050/financial-dashboard';

async function fetchFinancialDashboards() {
  try {
    const res = await axios.get(URL);
    return Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    console.error('Error fetching financial dashboards:', err);
    return [];
  }
}

export default function FinancialDashboard() {
  const navigate = useNavigate();

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'initial-1',
      type: 'system',
      title: 'System Initialized',
      message: 'Financial Nexus dashboard is ready for financial intelligence',
      timestamp: new Date(),
      icon: '💰',
      read: false
    }
  ]);
  const notifRef = useRef();

  // Calculate unread notification count
  const notificationCount = notifications.filter(n => !n.read).length;

  // Debug logging
  useEffect(() => {
    console.log('💰 FinancialDashboard component mounted');
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Navigate function:', typeof navigate, navigate);
  }, [navigate]);

  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");

  // Enhanced state for modern features
  const [viewMode, setViewMode] = useState("overview"); // overview, analytics, dashboards, table
  const [selectedDashboards, setSelectedDashboards] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [valueRange, setValueRange] = useState({ min: "", max: "" });
  const [selectedDashboardDetail, setSelectedDashboardDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [quickFilter, setQuickFilter] = useState("");

  // New calculation form states
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [dashboardName, setDashboardName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [calculatingNew, setCalculatingNew] = useState(false);

  // Additional states for the enhanced calculation modal
  const [selectedMetrics, setSelectedMetrics] = useState([
    'totalCost', 'totalHours', 'workerCount', 'engineerCount', 'architectCount', 'avgDailyCost'
  ]);
  const [selectedCharts, setSelectedCharts] = useState(['line', 'bar', 'pie']);
  const [groupBy, setGroupBy] = useState('day');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [minHours, setMinHours] = useState('');
  const [maxHours, setMaxHours] = useState('');
  const [includeNotes, setIncludeNotes] = useState('all');
  const [includeForecast, setIncludeForecast] = useState(false);
  const [emailReport, setEmailReport] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  // Analytics modal states
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // Toggle metric selection
  const toggleMetric = (metric) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // Handle preview dashboard
  const handlePreviewDashboard = () => {
    // This would typically open a preview modal or navigate to a preview page
    console.log('Previewing dashboard with current settings');
    showNotification('info', 'Preview functionality would be implemented here');
  };

  // Fetch combined analytics data (financial + timeline)
  const fetchAnalyticsData = async () => {
    try {
      setLoadingAnalytics(true);

      // Fetch both financial dashboards and timelines
      const [financialRes, timelinesRes] = await Promise.all([
        axios.get('http://localhost:5050/financial-dashboard'),
        axios.get('http://localhost:5050/project-timelines')
      ]);

      const financialData = Array.isArray(financialRes.data.data) ? financialRes.data.data : [];
      const timelinesData = Array.isArray(timelinesRes.data) ? timelinesRes.data : [];

      // Combine and enhance data
      const combinedData = financialData.map(dashboard => {
        // Find related timelines
        const relatedTimelines = timelinesData.filter(timeline =>
          timeline.pcode === dashboard.projectCode ||
          timeline.projectDetails?.pcode === dashboard.projectCode
        );

        // Calculate enhanced metrics
        const timelinesCost = relatedTimelines.reduce((sum, t) => {
          const materialsCost = t.tmaterials?.reduce((ms, m) => ms + (parseFloat(m.cost) || 0), 0) || 0;
          const expensesCost = t.texpenses?.reduce((es, e) => es + (parseFloat(e.amount) || 0), 0) || 0;
          return sum + materialsCost + expensesCost;
        }, 0);

        const totalWorkers = relatedTimelines.reduce((sum, t) => sum + (t.workerCount || 0) + (t.tengineerCount || 0) + (t.architectCount || 0), 0);
        const avgDailyCost = relatedTimelines.length > 0 ? timelinesCost / relatedTimelines.length : 0;

        return {
          ...dashboard,
          relatedTimelines,
          timelinesCount: relatedTimelines.length,
          timelinesCost,
          totalWorkers,
          avgDailyCost,
          efficiency: Math.min(100, Math.max(60, 100 - (timelinesCost / (dashboard.financialSummary?.grandTotal || 1)) * 50)),
          riskScore: Math.max(10, Math.min(90, (timelinesCost / (dashboard.financialSummary?.grandTotal || 1)) * 100)),
          projectHealth: totalWorkers > 15 ? 'High Activity' : totalWorkers > 8 ? 'Medium Activity' : 'Low Activity'
        };
      });

      setAnalyticsData(combinedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setAnalyticsData([]);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Handle analytics modal opening
  const handleShowAnalyticsModal = () => {
    setShowAnalyticsModal(true);
    fetchAnalyticsData();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const previousDashboardCount = dashboards.length;
      const data = await fetchFinancialDashboards();
      if (!mounted) return;
      
      // Check for new dashboards
      if (previousDashboardCount > 0 && data.length > previousDashboardCount) {
        const newDashboardsCount = data.length - previousDashboardCount;
        addNotification(
          'addition', 
          `New Financial Dashboard${newDashboardsCount > 1 ? 's' : ''} Created`, 
          `${newDashboardsCount} new dashboard${newDashboardsCount > 1 ? 's have' : ' has'} been added`, 
          '💰'
        );
      }
      
      setDashboards(data || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [dashboards.length]);

  // Handle notification outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add notification helper function
  const addNotification = (type, title, message, icon = '📢') => {
    const newNotification = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date(),
      icon,
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep only latest 10 notifications
  };

  // Handle notification click to mark as read
  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setShowNotifications(false);
  };

  // Format timestamp for notifications
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Auto-refresh dashboards every 30 seconds to catch new additions/updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newDashboards = await fetchFinancialDashboards();
        
        // Check for new dashboards by comparing IDs
        const currentDashboardIds = dashboards.map(d => d._id);
        const addedDashboards = newDashboards.filter(d => !currentDashboardIds.includes(d._id));
        
        if (addedDashboards.length > 0) {
          addedDashboards.forEach(dashboard => {
            addNotification(
              'addition',
              'New Financial Dashboard Created',
              `${dashboard.dashboardName || 'New Dashboard'} has been added to the system`,
              '💰'
            );
          });
          setDashboards(newDashboards);
        }
      } catch (error) {
        console.error('Error refreshing dashboards:', error);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [dashboards]);

  const fetchAvailableProjects = useCallback(async () => {
    try {
      console.log('🔄 Fetching available projects...');
      const response = await axios.get('http://localhost:5050/financial-dashboard/config/projects');
      const projects = response.data.data || [];
      const mappedProjects = projects.map(project => ({
        id: project.pcode,
        name: project.pname,
        code: project.pcode,
        type: project.ptype,
        priority: project.ppriority,
        status: project.pstatus
      }));
      setAvailableProjects(mappedProjects);
      console.log(`✅ Loaded ${mappedProjects.length} projects`);
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      setAvailableProjects([]);
    }
  }, []);

  useEffect(() => {
    fetchAvailableProjects();
  }, [fetchAvailableProjects]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this financial dashboard? This action cannot be undone.")) {
      try {
        // Get dashboard info before deletion for notification
        const dashboardToDelete = dashboards.find(d => d._id === id);
        const dashboardName = dashboardToDelete?.dashboardName || 'Unknown Dashboard';
        
        await axios.delete(`${URL}/${id}`);
        setDashboards(dashboards.filter(d => d._id !== id));
        setSelectedDashboards(selectedDashboards.filter(selectedId => selectedId !== id));
        
        // Add deletion notification
        addNotification(
          'deletion',
          'Financial Dashboard Deleted',
          `${dashboardName} has been removed from the system`,
          '🗑️'
        );
        
        showNotification("success", "Financial dashboard deleted successfully!");
      } catch (error) {
        console.error("Error deleting dashboard:", error);
        showNotification("error", "Error deleting financial dashboard. Please try again.");
      }
    }
  };

  // Handle view dashboard with notification
  const handleViewDashboard = (dashboard) => {
    // Add view notification
    addNotification(
      'view',
      'Financial Dashboard Viewed',
      `${dashboard.dashboardName || 'Dashboard'} details have been accessed`,
      '👁️'
    );
    
    // Open detail modal
    openDetailModal(dashboard);
  };

  // Enhanced notification system
  const showNotification = (type, message) => {
    const alertClass = {
      success: 'alert-success',
      error: 'alert-danger',
      warning: 'alert-warning',
      info: 'alert-info'
    }[type];

    const alert = document.createElement('div');
    alert.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 1055; min-width: 350px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    alert.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="me-2">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </div>
        <div>${message}</div>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
      </div>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
  };

  // Toggle dashboard selection
  const toggleDashboardSelection = (dashboardId) => {
    setSelectedDashboards(prev =>
      prev.includes(dashboardId)
        ? prev.filter(id => id !== dashboardId)
        : [...prev, dashboardId]
    );
  };

  // Select all dashboards
  const toggleSelectAll = () => {
    const filteredIds = getSortedAndFilteredDashboards().map(d => d._id);
    setSelectedDashboards(
      selectedDashboards.length === filteredIds.length ? [] : filteredIds
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedAndFilteredDashboards = () => {
    let filtered = dashboards.filter(dashboard => {
      // Search filter
      const matchesSearch =
        dashboard.dashboardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dashboard.dashboardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dashboard.status && dashboard.status.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus = !filterStatus || dashboard.status === filterStatus;

      // Date range filter
      const matchesDateRange = (
        !dateRange.start || new Date(dashboard.createdAt) >= new Date(dateRange.start)
      ) && (
          !dateRange.end || new Date(dashboard.createdAt) <= new Date(dateRange.end)
        );

      // Value range filter
      const dashboardValue = dashboard.financialSummary?.grandTotal || 0;
      const matchesValueRange = (
        !valueRange.min || dashboardValue >= parseFloat(valueRange.min)
      ) && (
          !valueRange.max || dashboardValue <= parseFloat(valueRange.max)
        );

      // Quick filters
      const matchesQuickFilter = (() => {
        switch (quickFilter) {
          case 'today':
            return new Date(dashboard.createdAt).toDateString() === new Date().toDateString();
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(dashboard.createdAt) >= weekAgo;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return new Date(dashboard.createdAt) >= monthAgo;
          case 'high-value':
            return dashboardValue > 50000;
          case 'active':
            return dashboard.status === 'Active';
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDateRange && matchesValueRange && matchesQuickFilter;
    });

    return filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case "createdAt":
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case "dashboardName":
          aVal = a.dashboardName || '';
          bVal = b.dashboardName || '';
          break;
        case "status":
          aVal = a.status || '';
          bVal = b.status || '';
          break;
        case "grandTotal":
          aVal = a.financialSummary?.grandTotal || 0;
          bVal = b.financialSummary?.grandTotal || 0;
          break;
        default:
          aVal = a[sortField];
          bVal = b[sortField];
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "⬆️" : "⬇️";
  };

  const getUniqueStatuses = useCallback(() => {
    const statuses = dashboards.map(d => d.status).filter(Boolean);
    return [...new Set(statuses)];
  }, [dashboards]);

  // Enhanced utility functions
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setDateRange({ start: "", end: "" });
    setValueRange({ min: "", max: "" });
    setQuickFilter("");
    setCurrentPage(1);
  };

  const openDetailModal = (dashboard) => {
    setSelectedDashboardDetail(dashboard);
    setShowDetailModal(true);
  };

  // Pagination
  const getPaginatedData = () => {
    const sorted = getSortedAndFilteredDashboards();
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return {
      data: sorted.slice(startIndex, endIndex),
      totalItems: sorted.length,
      totalPages: Math.ceil(sorted.length / 10)
    };
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalValue = dashboards.reduce((sum, d) => sum + (d.financialSummary?.grandTotal || 0), 0);
    const activeDashboards = dashboards.filter(d => d.status === 'Active').length;
    const highValueDashboards = dashboards.filter(d => (d.financialSummary?.grandTotal || 0) > 50000).length;

    return {
      totalDashboards: dashboards.length,
      activeDashboards,
      totalValue,
      avgValue: dashboards.length > 0 ? totalValue / dashboards.length : 0,
      highValueDashboards
    };
  }, [dashboards]);

  // Chart data
  const chartData = useMemo(() => {
    // Status distribution for pie chart
    const statusDistribution = dashboards.reduce((acc, dashboard) => {
      const status = dashboard.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'Active' ? '#f59e0b' : status === 'Inactive' ? '#ef4444' : '#6b7280'
    }));

    // Value by dashboard for bar chart
    const valueData = dashboards.slice(0, 10).map(dashboard => ({
      name: dashboard.dashboardName?.substring(0, 15) + '...' || 'Unknown',
      value: dashboard.financialSummary?.grandTotal || 0,
      id: dashboard.dashboardId
    })).sort((a, b) => b.value - a.value);

    // Monthly creation data
    const monthlyData = dashboards.reduce((acc, dashboard) => {
      const date = new Date(dashboard.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, dashboards: 0, totalValue: 0 };
      }

      acc[monthKey].dashboards += 1;
      acc[monthKey].totalValue += dashboard.financialSummary?.grandTotal || 0;

      return acc;
    }, {});

    const activityData = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(item => ({
        ...item,
        month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));

    // Hexagonal (Radar) chart data
    const radarData = [
      { subject: 'Active', A: statistics.activeDashboards, fullMark: Math.max(dashboards.length, 10) },
      { subject: 'High Value', A: statistics.highValueDashboards, fullMark: Math.max(dashboards.length, 10) },
      { subject: 'Total Count', A: dashboards.length, fullMark: Math.max(dashboards.length, 10) },
      { subject: 'Avg Value', A: statistics.avgValue / 1000, fullMark: 100 },
      { subject: 'Recent', A: dashboards.filter(d => new Date(d.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, fullMark: Math.max(dashboards.length, 10) },
      { subject: 'Coverage', A: dashboards.length > 0 ? 100 : 0, fullMark: 100 }
    ];

    return { statusData, valueData, activityData, radarData };
  }, [dashboards, statistics]);

  const handleCalculateNewDashboard = async () => {
    if (!dashboardName.trim()) {
      alert('Please enter a dashboard name');
      return;
    }

    try {
      setCalculatingNew(true);
      console.log('🔢 Starting new financial calculation...');

      const calculationData = {
        dashboardName,
        selectedProjects: selectedProjects.length > 0 ? selectedProjects : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const response = await axios.post(`${URL}/calculate`, calculationData);
      console.log('✅ Response:', response.data);

      console.log('✅ Financial calculation completed');
      showNotification('success', 'Financial dashboard calculated successfully!');
      
      // Add creation notification
      addNotification(
        'addition',
        'New Financial Dashboard Created',
        `${dashboardName} has been successfully calculated and added`,
        '💰'
      );

      // Reset form and close modal
      setDashboardName('');
      setSelectedProjects([]);
      setDateFrom('');
      setDateTo('');
      setShowCalculationModal(false);

      // Refresh dashboards
      const data = await fetchFinancialDashboards();
      setDashboards(data || []);

    } catch (error) {
      console.error('❌ Error calculating dashboard:', error);
      showNotification('error', `Error calculating financial dashboard: ${error.response?.data?.message || error.message}`);
    } finally {
      setCalculatingNew(false);
    }
  };

  const handleExportAll = () => {
    const summaryData = {
      dashboards: dashboards,
      totalDashboards: dashboards.length,
      totalValue: dashboards.reduce((sum, d) => sum + (d.financialSummary?.grandTotal || 0), 0),
      activeDashboards: dashboards.filter(d => d.status === 'Active').length,
      generatedAt: new Date()
    };

    exportFinancialDashboardToPDF(summaryData, `financial-dashboards-summary-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div>
        {/*<AdminHeadFoot />*/}
       {/*<Nav />*/} 
        <div className="container mt-4">
          <div className="text-center">
            <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading financial dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const uniqueStatuses = getUniqueStatuses();
  const paginatedData = getPaginatedData();

  return (
    <div className="financial-dashboard">
     {/* <Nav /> */}
      <div className="container-fluid mt-4">
        <style>{`
          .chart-container { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .stats-card { transition: transform 0.2s; }
          .stats-card:hover { transform: translateY(-2px); }
          .golden-gradient { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
          .success-gradient { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); }
          .warning-gradient { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
          .info-gradient { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
          .progress-bar-custom { height: 8px; border-radius: 4px; }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-12px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>

        {/* Premium Financial Dashboard-Style Hero Header */}
        <section className="container-fluid px-4 py-5" style={{
          background: 'linear-gradient(135deg, #fdfcfb 0%, #f8f7f4 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Notification Icon - Upper Right */}
          <div 
            className="position-absolute" 
            ref={notifRef}
            style={{ 
              top: '2rem', 
              right: '2rem', 
              zIndex: 10 
            }}
          >
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
               // border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4), 0 4px 12px rgba(245, 158, 11, 0.2)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.6), 0 6px 16px rgba(245, 158, 11, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4), 0 4px 12px rgba(245, 158, 11, 0.2)';
              }}
            >
              <BsBellFill
                size={26}
                style={{ 
                  color: '#ffffff',
                  transition: 'all 0.2s ease',
                }}
              />
              {notificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
                  }}
                >
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 1rem)',
                  right: '0',
                  width: '420px',
                  background: '#ffffff',
                  border: '1px solid rgba(245, 158, 11, 0.1)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(245, 158, 11, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
                  animation: 'slideDown 0.3s ease-out',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                 // border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {/* Notification Header */}
                <div 
                  style={{ 
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid rgba(245, 158, 11, 0.1)',
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="mb-0 fw-bold" style={{ color: '#92400e', fontSize: '1.1rem' }}>
                      Financial Notifications
                    </h6>
                    <div className="d-flex align-items-center gap-2">
                      <span 
                        style={{ 
                          fontSize: '0.8rem', 
                          color: '#f59e0b',
                          fontWeight: '600',
                          background: 'rgba(245, 158, 11, 0.1)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                        }}
                      >
                        {notificationCount} New
                      </span>
                      {notificationCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{
                            fontSize: '0.75rem',
                            color: '#f59e0b',
                            background: 'transparent',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '12px',
                            padding: '0.2rem 0.6rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(245, 158, 11, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notification List */}
                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="text-center py-5">
                      <div style={{ opacity: 0.5, fontSize: '3rem' }}>🔔</div>
                      <p className="text-muted mt-2">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const getNotificationGradient = (type) => {
                        switch (type) {
                          case 'addition': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                          case 'view': return 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)';
                          case 'update': return 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)';
                          case 'deletion': return 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                          case 'system': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
                          default: return 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
                        }
                      };

                      return (
                        <div 
                          key={notification.id}
                          style={{ 
                            padding: '1.5rem 2rem',
                            borderBottom: notifications.indexOf(notification) === notifications.length - 1 ? 'none' : '1px solid rgba(245, 158, 11, 0.05)',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                            background: notification.read ? 'transparent' : 'rgba(245, 158, 11, 0.02)',
                            borderLeft: notification.read ? 'none' : '3px solid #f59e0b'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fffbeb'}
                          onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(245, 158, 11, 0.02)'}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="d-flex">
                            <div style={{ 
                              width: '50px', 
                              height: '50px', 
                              background: getNotificationGradient(notification.type),
                              borderRadius: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '1rem',
                              flexShrink: 0,
                              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                              opacity: notification.read ? 0.6 : 1
                            }}>
                              <span style={{ fontSize: '1.4rem' }}>{notification.icon}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className="d-flex align-items-start justify-content-between">
                                <div>
                                  <p className="mb-1 fw-semibold" style={{ 
                                    color: notification.read ? '#6b7280' : '#1a1a1a', 
                                    fontSize: '0.95rem' 
                                  }}>
                                    {notification.title}
                                    {!notification.read && (
                                      <span style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        background: '#f59e0b',
                                        borderRadius: '50%',
                                        marginLeft: '0.5rem'
                                      }}></span>
                                    )}
                                  </p>
                                  <p className="mb-0 text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                    {notification.message}
                                  </p>
                                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    {formatTimestamp(notification.timestamp)}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.03) 0%, transparent 50%)',
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
                {/* Logo Section */}
                <div className="mb-4 d-flex justify-content-center">
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 252, 251, 0.8) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                    border: '3px solid rgba(245, 158, 11, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <img
                      src="/workflowsengineering.png"
                      alt="Workflows Engineering Logo"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        borderRadius: '50%'
                      }}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center mb-4">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                    }}>Financial Nexus</h1>
                    {/*<p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                      Orchestrate fiscal intelligence with unparalleled acuity
                    </p>*/}
                  </div>
                </div>
                <p className="lead mb-4" style={{
                  color: '#6b7280',
                  fontSize: '1.25rem',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  Your premium financial management platform. Track monetary flows, analyze performance metrics, and monitor fiscal health across all your enterprise dashboards.</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button onClick={() => navigate("/ptfd/projects")} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #f59e0b',
                    color: '#f59e0b',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                  }}>
                    <BsBriefcase className="me-2" />View Projects
                  </button>
                  <button onClick={() => setShowCalculationModal(true)} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsCalculator className="me-2" />Forge New Dashboard
                  </button>
                  <button onClick={handleExportAll} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #f59e0b',
                    color: '#f59e0b',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                  }}>
                    <BsShare className="me-2" />Export All Dashboards
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
                      <span style={{ fontSize: '1.5rem' }}>📊</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Dashboards</h6>
                    <h3 className="mb-0 text-warning">{statistics.totalDashboards}</h3>
                    <small className="text-success">
                      <span className="me-1">↗</span>
                      Active tracking
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3">
                      <span style={{ fontSize: '1.5rem' }}>✅</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Active Dashboards</h6>
                    <h3 className="mb-0 text-success">{statistics.activeDashboards}</h3>
                    <small className="text-info">
                      <span className="me-1">📈</span>
                      {statistics.activeDashboards > 0 ? 'Multiple active' : 'No active dashboards'}
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
                      <span style={{ fontSize: '1.5rem' }}>💰</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Value</h6>
                    <h3 className="mb-0 text-warning">
                      {formatCurrency(statistics.totalValue)}
                    </h3>
                    <small className="text-muted">
                      <span className="me-1">💼</span>
                      Financial tracking
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
                      <span style={{ fontSize: '1.5rem' }}>📈</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Average Value</h6>
                    <h3 className="mb-0 text-warning">
                      {formatCurrency(statistics.avgValue)}
                    </h3>
                    <small className="text-success">
                      <span className="me-1">📊</span>
                      Performance metric
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
                          className={`nav-link ${viewMode === 'dashboards' ? 'active' : ''}`}
                          onClick={() => setViewMode('dashboards')}
                        >
                          <BsGrid className="me-2" />
                          Dashboards
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
                            placeholder="Search dashboards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-auto">
                        <select
                          className="form-select form-select-sm"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          {uniqueStatuses.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-auto">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        >
                          <span className="me-1">🔧</span>
                          {showAdvancedFilters ? 'Hide' : 'Advanced'} Filters
                        </button>
                      </div>
                      <div className="col-auto">
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={clearAllFilters}
                        >
                          <span className="me-1">🧹</span> Clear All
                        </button>
                      </div>
                      <div className="col-auto">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setLoading(true);
                            fetchFinancialDashboards().then(data => {
                              setDashboards(data || []);
                              setLoading(false);
                            });
                          }}
                        >
                          <span className="me-1">🔄</span> Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Filters - Collapsible */}
                {showAdvancedFilters && (
                  <div className="border-top pt-4 mt-4">
                    <h6 className="text-muted mb-3">
                      <span className="me-2">🔧</span>Advanced Filters
                    </h6>
                    <div className="row g-3">
                      <div className="col-lg-3">
                        <label className="form-label small text-muted">Date Range Start</label>
                        <input
                          type="date"
                          className="form-control"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label className="form-label small text-muted">Date Range End</label>
                        <input
                          type="date"
                          className="form-control"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label className="form-label small text-muted">Min Value ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0"
                          value={valueRange.min}
                          onChange={(e) => setValueRange({ ...valueRange, min: e.target.value })}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label className="form-label small text-muted">Max Value ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="∞"
                          value={valueRange.max}
                          onChange={(e) => setValueRange({ ...valueRange, max: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
              color: #f59e0b;
            }
          `}
        </style>

        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <div className="row g-4">
            {/* Executive Command Center */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.95) 50%, rgba(51,65,85,0.93) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Animated background grid */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `
                    linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px',
                  opacity: 0.3,
                  animation: 'pulse 4s ease-in-out infinite'
                }}></div>

                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="mb-0 d-flex align-items-center" style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                        <span className="me-3" style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%',
                          animation: 'pulse 2s infinite',
                          boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
                        }}></span>
                        EXECUTIVE COMMAND CENTER
                      </h5>
                      <p className="text-muted mb-0 mt-1" style={{ color: '#94a3b8' }}>Real-time financial intelligence monitoring</p>
                    </div>
                    <div className="d-flex gap-2">
                      <span className="badge" style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>LIVE</span>
                      <span className="badge" style={{
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>SECURE</span>
                    </div>
                  </div>
                </div>

                <div className="card-body p-4" style={{ position: 'relative', zIndex: 2 }}>
                  {/* Executive Dashboard Grid */}
                  <div className="row g-3 mb-4">
                    {/* Mission Critical Alerts */}
                    <div className="col-md-6">
                      <div className="p-3 rounded-4" style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        position: 'relative'
                      }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="mb-0 fw-bold" style={{ color: '#ef4444' }}>🚨 CRITICAL ALERTS</h6>
                          <span className="badge" style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            fontSize: '10px'
                          }}>PRIORITY-1</span>
                        </div>
                        <div className="small mb-2" style={{ color: '#f1f5f9' }}>
                          High-value thresholds exceeded: <span className="fw-bold text-warning">{statistics.totalDashboards > 5 ? '2' : '0'}</span>
                        </div>
                        <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                          <div className="progress-bar" style={{
                            width: statistics.totalDashboards > 5 ? '75%' : '0%',
                            background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                            borderRadius: '2px'
                          }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Pulse */}
                    <div className="col-md-6">
                      <div className="p-3 rounded-4" style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="mb-0 fw-bold" style={{ color: '#10b981' }}>📊 FINANCIAL PULSE</h6>
                          <span className="badge" style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            fontSize: '10px'
                          }}>OPTIMAL</span>
                        </div>
                        <div className="small mb-2" style={{ color: '#f1f5f9' }}>
                          Active monitoring: <span className="fw-bold text-success">{statistics.activeDashboards} systems</span>
                        </div>
                        <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                          <div className="progress-bar" style={{
                            width: '92%',
                            background: 'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius: '2px'
                          }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Intelligence */}
                    <div className="col-md-6">
                      <div className="p-3 rounded-4" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="mb-0 fw-bold" style={{ color: '#f59e0b' }}>💰 REVENUE INTEL</h6>
                          <span className="badge" style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            fontSize: '10px'
                          }}>TRACKING</span>
                        </div>
                        <div className="small mb-2" style={{ color: '#f1f5f9' }}>
                          Total portfolio: <span className="fw-bold text-warning">{formatCurrency(statistics.totalValue)}</span>
                        </div>
                        <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                          <div className="progress-bar" style={{
                            width: '88%',
                            background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                            borderRadius: '2px'
                          }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Threat Assessment */}
                    <div className="col-md-6">
                      <div className="p-3 rounded-4" style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="mb-0 fw-bold" style={{ color: '#6366f1' }}>🛡️ SECURITY STATUS</h6>
                          <span className="badge" style={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1',
                            fontSize: '10px'
                          }}>SECURED</span>
                        </div>
                        <div className="small mb-2" style={{ color: '#f1f5f9' }}>
                          Risk assessment: <span className="fw-bold text-info">Low risk profile</span>
                        </div>
                        <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                          <div className="progress-bar" style={{
                            width: '96%',
                            background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
                            borderRadius: '2px'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary Panel */}
                  <div className="row g-3 mt-2">
                    <div className="col-12">
                      <div className="p-4 rounded-4" style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.15)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <div className="row g-4">
                          <div className="col-md-3 text-center">
                            <div className="mb-2">
                              <span style={{
                                fontSize: '2.5rem',
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold'
                              }}>{Math.floor(statistics.totalValue / 1000)}</span>
                            </div>
                            <div className="small fw-semibold" style={{ color: '#cbd5e1' }}>THREAT LEVEL</div>
                            <div className="small" style={{ color: '#64748b' }}>Security index</div>
                          </div>
                          <div className="col-md-3 text-center">
                            <div className="mb-2">
                              <span style={{
                                fontSize: '2.5rem',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold'
                              }}>{statistics.activeDashboards * 12}</span>
                            </div>
                            <div className="small fw-semibold" style={{ color: '#cbd5e1' }}>DATA STREAMS</div>
                            <div className="small" style={{ color: '#64748b' }}>Live connections</div>
                          </div>
                          <div className="col-md-3 text-center">
                            <div className="mb-2">
                              <span style={{
                                fontSize: '1.8rem',
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold'
                              }}>${Math.floor(statistics.totalValue / 1000)}K</span>
                            </div>
                            <div className="small fw-semibold" style={{ color: '#cbd5e1' }}>FLOW RATE</div>
                            <div className="small" style={{ color: '#64748b' }}>Per minute</div>
                          </div>
                          <div className="col-md-3 text-center">
                            <div className="mb-2">
                              <span style={{
                                fontSize: '2rem',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold'
                              }}>{statistics.totalDashboards > 5 ? '99.7' : '94.2'}%</span>
                            </div>
                            <div className="small fw-semibold" style={{ color: '#cbd5e1' }}>EFFICIENCY</div>
                            <div className="small" style={{ color: '#64748b' }}>Command center</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Performance Excellence */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,249,195,0.8) 50%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(245, 158, 11, 0.15)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(251,191,36,0.1) 100%)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsGraphUp className="me-3" style={{ color: '#f59e0b', fontSize: '1.2rem' }} />
                    Performance Excellence
                  </h5>
                  <p className="text-center text-muted mb-0 mt-1">Executive dashboard insights</p>
                </div>
                <div className="card-body p-4">
                  <div className="activity-timeline">
                    <div className="d-flex align-items-start mb-4 position-relative">
                      <div className="flex-shrink-0 me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '42px',
                          height: '42px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}>
                          <BsCheckCircle className="text-white" size={18} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="p-3 rounded-3" style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 100%)',
                          border: '1px solid rgba(16, 185, 129, 0.1)'
                        }}>
                          <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>Financial Matrix Optimized</h6>
                          <p className="mb-1 small" style={{ color: '#4b5563' }}>Advanced calculations completed</p>
                          <small className="text-muted fw-semibold">💼 Executive Suite • 2h ago</small>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4 position-relative">
                      <div className="flex-shrink-0 me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '42px',
                          height: '42px',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                        }}>
                          <BsExclamationTriangle className="text-white" size={18} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="p-3 rounded-3" style={{
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.03) 100%)',
                          border: '1px solid rgba(245, 158, 11, 0.1)'
                        }}>
                          <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>High-Value Alert Triggered</h6>
                          <p className="mb-1 small" style={{ color: '#4b5563' }}>Premium threshold exceeded</p>
                          <small className="text-muted fw-semibold">💰 Revenue Intelligence • 4h ago</small>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4 position-relative">
                      <div className="flex-shrink-0 me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '42px',
                          height: '42px',
                          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                        }}>
                          <BsPeople className="text-white" size={18} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="p-3 rounded-3" style={{
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.03) 100%)',
                          border: '1px solid rgba(99, 102, 241, 0.1)'
                        }}>
                          <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>Executive Access Granted</h6>
                          <p className="mb-1 small" style={{ color: '#4b5563' }}>C-suite dashboard privileges</p>
                          <small className="text-muted fw-semibold">👥 Leadership Portal • 6h ago</small>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '42px',
                          height: '42px',
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                        }}>
                          <BsCalculator className="text-white" size={18} />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="p-3 rounded-3" style={{
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.03) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.1)'
                        }}>
                          <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>Strategic Calculation Initiated</h6>
                          <p className="mb-1 small" style={{ color: '#4b5563' }}>Enterprise-grade metrics processing</p>
                          <small className="text-muted fw-semibold">🚀 Strategic Analytics • 1d ago</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Financial Intelligence */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,249,195,0.8) 50%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(245, 158, 11, 0.15)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(251,191,36,0.1) 100%)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsBarChart className="me-3" style={{ color: '#f59e0b', fontSize: '1.2rem' }} />
                    Financial Intelligence Radar
                  </h5>
                  <p className="text-center text-muted mb-0 mt-1">Multi-dimensional performance analysis</p>
                </div>
                <div className="card-body p-4">
                  <div className="chart-container position-relative">
                    <ResponsiveContainer width="100%" height={320}>
                      <RadarChart cx="50%" cy="50%" outerRadius="85%" data={chartData.radarData}>
                        <defs>
                          <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                            <stop offset="50%" stopColor="#d97706" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#92400e" stopOpacity={0.4} />
                          </linearGradient>
                        </defs>
                        <PolarGrid stroke="rgba(245, 158, 11, 0.2)" radialLines={true} />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fontSize: 12, fontWeight: '600', fill: '#4b5563' }}
                          className="text-sm"
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                          tickCount={4}
                        />
                        <Radar
                          name="Financial Metrics"
                          dataKey="A"
                          stroke="#f59e0b"
                          fill="url(#radarGradient)"
                          strokeWidth={3}
                          dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                            fontSize: '13px'
                          }}
                          formatter={(value, name) => [`${value}%`, 'Performance Score']}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-warning btn-sm rounded-pill px-5"
                      onClick={handleShowAnalyticsModal}
                      style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', color: '#fff' }}
                    >
                      <BsBarChart className="me-2" />Advanced Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Status Analytics */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,249,195,0.8) 50%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(245, 158, 11, 0.15)'
              }}>
                <div className="card-header border-0" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(251,191,36,0.1) 100%)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center justify-content-center" style={{ color: '#1f2937', fontWeight: 'bold' }}>
                    <BsPieChart className="me-3" style={{ color: '#f59e0b', fontSize: '1.2rem' }} />
                    Executive Status Distribution
                  </h5>
                  <p className="text-center text-muted mb-0 mt-1">Portfolio performance breakdown</p>
                </div>
                <div className="card-body p-4">
                  <div className="chart-container position-relative">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <defs>
                          <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
                          </filter>
                        </defs>
                        <Pie
                          data={chartData.statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={110}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="white"
                          strokeWidth={3}
                          filter="url(#dropshadow)"
                        >
                          {chartData.statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                            fontSize: '13px'
                          }}
                          formatter={(value, name) => [value, `${name} Dashboards`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab - Enhanced */}
        {viewMode === 'analytics' && (
          <div className="row g-4">
            {/* Financial Performance Trends */}
            <div className="col-lg-8">
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
                    <BsActivity className="me-2" style={{ color: '#f59e0b' }} />
                    Financial Performance Timeline
                  </h5>
                  <small className="text-muted">Monthly dashboard creation and value trends</small>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData.activityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="valueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="dashboardAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 158, 11, 0.1)" />
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
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value, name) => [
                          name === 'totalValue' ? formatCurrency(value) : value,
                          name === 'totalValue' ? 'Total Value' : 'Dashboards Created'
                        ]}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Area
                        type="monotone"
                        dataKey="totalValue"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        fill="url(#valueAreaGradient)"
                        name="Total Value"
                      />
                      <Area
                        type="monotone"
                        dataKey="dashboards"
                        stroke="#d97706"
                        strokeWidth={3}
                        fill="url(#dashboardAreaGradient)"
                        name="Dashboards"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Value Distribution */}
            <div className="col-lg-4">
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
                    <BsPieChart className="me-2" style={{ color: '#f59e0b' }} />
                    Value Distribution
                  </h5>
                  <small className="text-muted">Top dashboards by value</small>
                </div>
                <div className="card-body p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {chartData.valueData.slice(0, 5).map((dashboard, idx) => (
                    <div key={idx} className="mb-3 p-3 rounded-3" style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(245, 158, 11, 0.1)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold" style={{ color: '#1f2937', fontSize: '14px' }}>
                            {dashboard.name}
                          </h6>
                          <small className="text-muted">ID: {dashboard.id}</small>
                        </div>
                        <div className="text-end">
                          <span className="badge rounded-pill" style={{
                            background: dashboard.value > 50000 ? '#10b981' : dashboard.value > 10000 ? '#f59e0b' : '#6b7280',
                            color: 'white'
                          }}>
                            {formatCurrency(dashboard.value)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="progress" style={{ height: '4px' }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${Math.min((dashboard.value / Math.max(...chartData.valueData.map(d => d.value))) * 100, 100)}%`,
                              background: 'linear-gradient(90deg, #f59e0b, #d97706)'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Intelligence Metrics */}
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
                    <BsGraphUp className="me-2" style={{ color: '#f59e0b' }} />
                    Financial Intelligence Metrics
                  </h5>
                  <small className="text-muted">Comprehensive performance indicators</small>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-3">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#f59e0b' }}>92%</div>
                        <div className="small fw-medium text-muted">Portfolio Growth</div>
                        <div className="mt-2">
                          <BsGraphUp className="text-warning" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#10b981' }}>87%</div>
                        <div className="small fw-medium text-muted">Accuracy Rate</div>
                        <div className="mt-2">
                          <BsActivity className="text-success" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#3b82f6' }}>{statistics.highValueDashboards}</div>
                        <div className="small fw-medium text-muted">High-Value Assets</div>
                        <div className="mt-2">
                          <BsCurrencyDollar className="text-primary" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#8b5cf6' }}>95%</div>
                        <div className="small fw-medium text-muted">System Efficiency</div>
                        <div className="mt-2">
                          <BsFileEarmarkBarGraph className="text-purple" style={{ fontSize: '1.5rem', color: '#8b5cf6' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboards View (Grid-like cards) */}
        {viewMode === 'dashboards' && (
          <>
            <div className="row g-4">
              {paginatedData.data.map((dashboard) => (
                <div key={dashboard._id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow card-hover h-100">
                    <div className="card-body">
                      <h5 className="card-title">{dashboard.dashboardName || 'Unknown Dashboard'}</h5>
                      <p className="text-muted small">{new Date(dashboard.createdAt).toLocaleDateString()}</p>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <BsFileEarmarkBarGraph className="me-2 text-muted" />
                          <small>ID: {dashboard.dashboardId}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <BsCheckCircle className="me-2 text-muted" />
                          <small>Status: {dashboard.status || 'Unknown'}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <BsCurrencyDollar className="me-2 text-muted" />
                          <small>{formatCurrency(dashboard.financialSummary?.grandTotal || 0)}</small>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${dashboard.status === 'Active' ? 'bg-success' : 'bg-secondary'} text-white`}>
                          {dashboard.status || 'Unknown'}
                        </span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleViewDashboard(dashboard)}
                            title="View Details"
                          >
                            <BsEye />
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => navigate(`/ptfd/financial-dashboard/${dashboard._id}`)}
                            title="Edit Dashboard"
                          >
                            <BsPencil />
                          </button>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => exportFinancialDashboardToPDF(dashboard, `dashboard-${dashboard.dashboardId}-${new Date(dashboard.createdAt).toISOString().split('T')[0]}.pdf`)}
                            title="Export Dashboard"
                          >
                            <BsDownload />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(dashboard._id)}
                            title="Delete Dashboard"
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

            {/* Card View Pagination */}
            {paginatedData.totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4 p-4 bg-light rounded-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted small">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginatedData.totalItems)} of {paginatedData.totalItems} dashboards
                  </span>
                </div>

                <nav aria-label="Dashboard card pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        title="First Page"
                      >
                        ⮞
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Previous Page"
                      >
                        ⬅️
                      </button>
                    </li>

                    {[...Array(Math.min(5, paginatedData.totalPages))].map((_, index) => {
                      const pageNumber = Math.max(1, Math.min(
                        paginatedData.totalPages - 4,
                        currentPage - 2
                      )) + index;

                      if (pageNumber <= paginatedData.totalPages) {
                        return (
                          <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(pageNumber)}
                              title={`Page ${pageNumber}`}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      }
                      return null;
                    })}

                    <li className={`page-item ${currentPage === paginatedData.totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === paginatedData.totalPages}
                        title="Next Page"
                      >
                        ➡️
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === paginatedData.totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(paginatedData.totalPages)}
                        disabled={currentPage === paginatedData.totalPages}
                        title="Last Page"
                      >
                        ⭐
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* Empty State for Card View */}
            {paginatedData.totalItems === 0 && (
              <div className="text-center py-5">
                <div className="mb-4">
                  <span style={{ fontSize: '4rem', opacity: 0.3 }}>📊</span>
                </div>
                <h4 className="text-muted mb-3">No financial dashboards found</h4>
                <p className="text-muted mb-4">
                  {searchTerm || filterStatus || quickFilter || dateRange.start || dateRange.end || valueRange.min || valueRange.max
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Start by creating your first financial dashboard.'}
                </p>
                {!searchTerm && !filterStatus && !quickFilter && (
                  <button
                    className="btn btn-warning btn-lg"
                    onClick={() => setShowCalculationModal(true)}
                    style={{ borderRadius: '50px', padding: '12px 30px' }}
                  >
                    <span className="me-2">✨</span>
                    Create First Dashboard
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Table View Tab */}
        {viewMode === 'table' && (
          <div className="container-fluid">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 d-flex align-items-center">
                    <span className="me-2">📊</span>
                    Financial Dashboard Records
                  </h5>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark fs-6">
                      Page {currentPage} of {paginatedData.totalPages}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                {paginatedData.totalItems === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <span style={{ fontSize: '4rem', opacity: 0.3 }}>🔍</span>
                    </div>
                    <h4 className="text-muted mb-3">No dashboard records found</h4>
                    <p className="text-muted mb-4">
                      {searchTerm || filterStatus || quickFilter || dateRange.start || dateRange.end || valueRange.min || valueRange.max
                        ? 'Try adjusting your search criteria or filters.'
                        : 'Start by creating your first financial dashboard.'}
                    </p>
                    {!searchTerm && !filterStatus && !quickFilter && (
                      <button
                        className="btn btn-warning btn-lg"
                        onClick={() => setShowCalculationModal(true)}
                        style={{ borderRadius: '50px', padding: '12px 30px' }}
                      >
                        <span className="me-2">✨</span>
                        Create First Dashboard
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-warning">
                          <tr>
                            <th style={{ width: '50px' }}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedDashboards.length === paginatedData.data.length && paginatedData.data.length > 0}
                                  onChange={toggleSelectAll}
                                />
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', minWidth: '140px' }}
                              onClick={() => handleSort("createdAt")}
                            >
                              <div className="d-flex align-items-center">
                                <span className="me-2">📅</span>
                                Created {getSortIcon("createdAt")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', minWidth: '200px' }}
                              onClick={() => handleSort("dashboardName")}
                            >
                              <div className="d-flex align-items-center">
                                <span className="me-2">📊</span>
                                Dashboard {getSortIcon("dashboardName")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}
                              onClick={() => handleSort("status")}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">✅</span>
                                Status {getSortIcon("status")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}
                              onClick={() => handleSort("grandTotal")}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">💰</span>
                                Total Value {getSortIcon("grandTotal")}
                              </div>
                            </th>
                            <th style={{ minWidth: '120px' }}>
                              <span className="me-1">🆔</span>ID
                            </th>
                            <th style={{ width: '140px', textAlign: 'center' }}>
                              <span className="me-1">🔧</span>Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedData.data.map(dashboard => (
                            <tr
                              key={dashboard._id}
                              className={selectedDashboards.includes(dashboard._id) ? 'table-active' : ''}
                              style={{ cursor: 'pointer' }}
                              onDoubleClick={() => handleViewDashboard(dashboard)}
                            >
                              <td>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedDashboards.includes(dashboard._id)}
                                    onChange={() => toggleDashboardSelection(dashboard._id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <strong className="text-primary">
                                    {new Date(dashboard.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </strong>
                                  <small className="text-muted">
                                    {new Date(dashboard.createdAt).toLocaleDateString('en-US', { weekday: 'long' })}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <strong className="text-dark">
                                    {dashboard.dashboardName || 'Unknown Dashboard'}
                                  </strong>
                                  <small className="text-muted">
                                    Created: {new Date(dashboard.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                              </td>
                              <td className="text-center">
                                <span className={`badge fs-6 ${dashboard.status === 'Active' ? 'bg-success' :
                                  dashboard.status === 'Inactive' ? 'bg-danger' : 'bg-secondary'
                                  }`}>
                                  {dashboard.status || 'Unknown'}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`fw-bold ${(dashboard.financialSummary?.grandTotal || 0) > 50000 ? 'text-success' :
                                  (dashboard.financialSummary?.grandTotal || 0) > 10000 ? 'text-warning' : 'text-muted'
                                  }`}>
                                  {formatCurrency(dashboard.financialSummary?.grandTotal || 0)}
                                </span>
                              </td>
                              <td>
                                <small className="text-muted font-monospace">
                                  {dashboard.dashboardId}
                                </small>
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button
                                    className="btn btn-outline-info btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDashboard(dashboard);
                                    }}
                                    title="View Details"
                                  >
                                    👁️
                                  </button>
                                  <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      exportFinancialDashboardToPDF(dashboard, `dashboard-${dashboard.dashboardId}-${new Date(dashboard.createdAt).toISOString().split('T')[0]}.pdf`);
                                    }}
                                    title="Export Dashboard"
                                  >
                                    📄
                                  </button>
                                  <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/ptfd/financial-dashboard/${dashboard._id}`);
                                    }}
                                    title="Edit Dashboard"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(dashboard._id);
                                    }}
                                    className="btn btn-outline-danger btn-sm"
                                    title="Delete Dashboard"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Enhanced Pagination */}
                    {paginatedData.totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center p-4 border-top bg-light">
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-muted small">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginatedData.totalItems)} of {paginatedData.totalItems} entries
                          </span>
                        </div>

                        <nav aria-label="Dashboard pagination">
                          <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                              >
                                ⮞
                              </button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                ⬅️
                              </button>
                            </li>

                            {[...Array(Math.min(5, paginatedData.totalPages))].map((_, index) => {
                              const pageNumber = Math.max(1, Math.min(
                                paginatedData.totalPages - 4,
                                currentPage - 2
                              )) + index;

                              if (pageNumber <= paginatedData.totalPages) {
                                return (
                                  <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                    <button
                                      className="page-link"
                                      onClick={() => setCurrentPage(pageNumber)}
                                    >
                                      {pageNumber}
                                    </button>
                                  </li>
                                );
                              }
                              return null;
                            })}

                            <li className={`page-item ${currentPage === paginatedData.totalPages ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === paginatedData.totalPages}
                              >
                                ➡️
                              </button>
                            </li>
                            <li className={`page-item ${currentPage === paginatedData.totalPages ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(paginatedData.totalPages)}
                                disabled={currentPage === paginatedData.totalPages}
                              >
                                ⭐
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Premium Dashboard Modal */}
        {showDetailModal && selectedDashboardDetail && (
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
                {/* Premium Header with Golden Gradient */}
                <div
                  className="modal-header border-0 position-relative"
                  style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #ffeb3b 100%)',
                    padding: '2rem 2.5rem 1.5rem',
                    color: '#1a1a1a'
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
                        background: 'linear-gradient(135deg, #b8860b 0%, #d4af37 100%)',
                        boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)'
                      }}
                    >
                      <BsFileEarmarkBarGraph className="text-white fs-3" />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="modal-title fw-bold mb-2 text-black">
                        Financial Chronicle
                      </h3>
                      <p className="mb-0 text-black-75 fs-5">
                        {new Date(selectedDashboardDetail.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard ID Badge */}
                  <div className="mt-3 position-absolute top-0 end-0" style={{ marginTop: "50px", marginRight: "30px" }}>
                    <span
                      className="badge px-4 py-2 fw-semibold"
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        color: '#1a1a1a',
                        borderRadius: '100px',
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      Dashboard ID: {selectedDashboardDetail.dashboardId}
                    </span>
                  </div>
                </div>

                {/* Premium Body */}
                <div className="modal-body" style={{ padding: '2.5rem' }}>

                  {/* Key Metrics Dashboard */}
                  <div className="row g-4 mb-5">
                    <div className="col-12">
                      <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#1f2937' }}>
                        <BsGraphUp className="me-3 text-warning" />
                        Financial Metrics
                      </h5>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                            <BsCurrencyDollar className="text-white fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">
                            {formatCurrency(selectedDashboardDetail.financialSummary?.grandTotal || 0)}
                          </h2>
                          <p className="text-black-75 mb-0 fw-medium">Total Value</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
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
                            <BsCheckCircle className="text-white fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">{selectedDashboardDetail.status || 'Unknown'}</h2>
                          <p className="text-black-75 mb-0 fw-medium">Current Status</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
                            <BsActivity className="text-white fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">
                            {new Date(selectedDashboardDetail.createdAt).toLocaleDateString()}
                          </h2>
                          <p className="text-black-75 mb-0 fw-medium">Creation Date</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Information */}
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
                            <BsFileEarmarkBarGraph className="me-3 text-warning" />
                            Dashboard Intelligence
                          </h6>

                          <div className="row g-4">
                            <div className="col-md-6">
                              <div className="border-start border-4 border-warning ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Dashboard Name</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedDashboardDetail.dashboardName || 'Unknown Dashboard'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-success ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Dashboard ID</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedDashboardDetail.dashboardId || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-info ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Created Date</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {new Date(selectedDashboardDetail.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-primary ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Last Updated</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {new Date(selectedDashboardDetail.updatedAt || selectedDashboardDetail.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="col-lg-4">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          borderRadius: '24px',
                          background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                          color: '#1a1a1a'
                        }}
                      >
                        <div className="card-body p-4 text-center">
                          <div
                            className="mb-3 mx-auto d-inline-flex align-items-center justify-content-center"
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '18px',
                              background: 'linear-gradient(135deg, #b8860b 0%, #d4af37 100%)',
                              boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)'
                            }}
                          >
                            <BsCurrencyDollar className="text-white fs-3" />
                          </div>
                          <h6 className="fw-bold mb-3 text-black-75">Total Investment</h6>
                          <h2 className="fw-bold text-black mb-2">
                            {formatCurrency(selectedDashboardDetail.financialSummary?.grandTotal || 0)}
                          </h2>
                          <p className="text-black-50 mb-0 small">
                            Comprehensive financial valuation for this dashboard
                          </p>

                          {/* Additional Financial Details */}
                          <div className="mt-3 pt-3 border-top border-black border-opacity-25">
                            <div className="row text-center">
                              <div className="col-12">
                                <small className="text-black-75 d-block">Status</small>
                                <strong className="text-black">
                                  {selectedDashboardDetail.status || 'Unknown'}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    Created: {new Date(selectedDashboardDetail.createdAt).toLocaleDateString()}
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
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
                      }}
                      onClick={() => {
                        setShowDetailModal(false);
                        navigate(`/ptfd/financial-dashboard/${selectedDashboardDetail._id}`);
                      }}
                    >
                      <i className="fas fa-chart-line me-2"></i>
                      See More
                    </button>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Calculation Modal */}
        {showCalculationModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content border-0 shadow-xl" style={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #ffffff 0%, #fdfcfb 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div className="modal-header border-0 bg-transparent py-4 px-5">
                  <div className="d-flex align-items-center">
                    <div className="bg-gradient p-3 rounded-3 me-4" style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)'
                    }}>
                      <BsCalculator className="text-black fs-5" />
                    </div>
                    <div className="w-100 text-center">
                      <h2 className="h3 fw-bold mb-1" style={{ color: "#111827" }}>
                        Advanced Financial Calculator
                      </h2>
                      <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                        Create comprehensive financial analysis dashboard with advanced filters and metrics
                      </p>
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowCalculationModal(false)}></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleCalculateNewDashboard(); }}>
                  <div className="modal-body p-5 pt-0">
                    <ul className="nav nav-tabs nav-tabs-custom mb-4" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="basic-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#basic"
                          type="button"
                          role="tab"
                          aria-controls="basic"
                          aria-selected="true"
                        >
                          Basic Settings
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="metrics-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#metrics"
                          type="button"
                          role="tab"
                          aria-controls="metrics"
                          aria-selected="false"
                        >
                          Metrics & Charts
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="advanced-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#advanced"
                          type="button"
                          role="tab"
                          aria-controls="advanced"
                          aria-selected="false"
                        >
                          Advanced Filters
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content">
                      {/* Basic Settings Tab */}
                      <div className="tab-pane fade show active" id="basic" role="tabpanel">
                        {/* Dashboard Name */}
                        <div className="mb-4">
                          <label className="form-label fw-bold">Dashboard Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Q3 Financial Analysis"
                            value={dashboardName}
                            onChange={(e) => setDashboardName(e.target.value)}
                            required
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb'
                            }}
                          />
                        </div>

                        {/* Project Selection */}
                        <div className="mb-4">
                          <label className="form-label fw-bold d-flex align-items-center">
                            Select Projects ({availableProjects.length} available)
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info ms-auto"
                              onClick={() => setSelectedProjects(availableProjects.map(p => p.code || p.id))}
                            >
                              Select All
                            </button>
                          </label>
                          <select
                            multiple
                            className="form-control"
                            value={selectedProjects}
                            onChange={(e) => setSelectedProjects(Array.from(e.target.selectedOptions, option => option.value))}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem',
                              border: '1px solid #e5e7eb',
                              height: '150px'
                            }}
                          >
                            {availableProjects.length > 0 ? availableProjects.map(project => (
                              <option key={project.code || project.id} value={project.code || project.id}>
                                {project.name} ({project.code || project.id})
                              </option>
                            )) : (
                              <option disabled>No projects loaded</option>
                            )}
                          </select>
                          <small className="form-text text-muted mt-1">
                            Hold Ctrl/Cmd to select multiple. Leave empty for all projects. Selected: {selectedProjects.length}
                          </small>
                        </div>

                        {/* Date Range */}
                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <label className="form-label fw-bold">From Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={dateFrom}
                              onChange={(e) => setDateFrom(e.target.value)}
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#fdfcfb',
                                padding: '1rem 1.25rem',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-bold">To Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={dateTo}
                              onChange={(e) => setDateTo(e.target.value)}
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#fdfcfb',
                                padding: '1rem 1.25rem',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                          </div>
                        </div>

                        {/* Quick Date Presets */}
                        <div className="d-flex gap-2 mb-4 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              const today = new Date();
                              setDateFrom(new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0]);
                              setDateTo(new Date().toISOString().split('T')[0]);
                            }}
                          >
                            Last Week
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              const today = new Date();
                              setDateFrom(new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0]);
                              setDateTo(new Date().toISOString().split('T')[0]);
                            }}
                          >
                            Last Month
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              const today = new Date();
                              setDateFrom(new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0]);
                              setDateTo(new Date().toISOString().split('T')[0]);
                            }}
                          >
                            Last Quarter
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setDateFrom('');
                              setDateTo('');
                            }}
                          >
                            Clear Dates
                          </button>
                        </div>
                      </div>

                      {/* Metrics & Charts Tab */}
                      <div className="tab-pane fade" id="metrics" role="tabpanel">
                        <div className="mb-4">
                          <label className="form-label fw-bold">Select Metrics to Include</label>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="totalCost"
                                  checked={selectedMetrics.includes('totalCost')}
                                  onChange={() => toggleMetric('totalCost')}
                                />
                                <label className="form-check-label" htmlFor="totalCost">Total Cost</label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="totalHours"
                                  checked={selectedMetrics.includes('totalHours')}
                                  onChange={() => toggleMetric('totalHours')}
                                />
                                <label className="form-check-label" htmlFor="totalHours">Total Hours</label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="workerCount"
                                  checked={selectedMetrics.includes('workerCount')}
                                  onChange={() => toggleMetric('workerCount')}
                                />
                                <label className="form-check-label" htmlFor="workerCount">Worker Count</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="engineerCount"
                                  checked={selectedMetrics.includes('engineerCount')}
                                  onChange={() => toggleMetric('engineerCount')}
                                />
                                <label className="form-check-label" htmlFor="engineerCount">Engineer Count</label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="architectCount"
                                  checked={selectedMetrics.includes('architectCount')}
                                  onChange={() => toggleMetric('architectCount')}
                                />
                                <label className="form-check-label" htmlFor="architectCount">Architect Count</label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="avgDailyCost"
                                  checked={selectedMetrics.includes('avgDailyCost')}
                                  onChange={() => toggleMetric('avgDailyCost')}
                                />
                                <label className="form-check-label" htmlFor="avgDailyCost">Avg Daily Cost</label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-bold">Chart Types</label>
                          <select
                            multiple
                            className="form-control"
                            value={selectedCharts}
                            onChange={(e) => setSelectedCharts(Array.from(e.target.selectedOptions, option => option.value))}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem',
                              border: '1px solid #e5e7eb',
                              height: '150px'
                            }}
                          >
                            <option value="line">Line Chart (Trends)</option>
                            <option value="bar">Bar Chart (Comparisons)</option>
                            <option value="pie">Pie Chart (Distributions)</option>
                            <option value="area">Area Chart (Cumulative)</option>
                            <option value="radar">Radar Chart (Multi-Metrics)</option>
                          </select>
                          <small className="form-text text-muted mt-1">
                            Select chart types to include in the dashboard.
                          </small>
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-bold">Group By</label>
                          <select
                            className="form-control"
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <option value="day">Daily</option>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                            <option value="project">By Project</option>
                          </select>
                        </div>
                      </div>

                      {/* Advanced Filters Tab */}
                      <div className="tab-pane fade" id="advanced" role="tabpanel">
                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <label className="form-label fw-bold">Min Daily Cost ($)</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="0"
                              value={minCost}
                              onChange={(e) => setMinCost(e.target.value)}
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#fdfcfb',
                                padding: '1rem 1.25rem',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-bold">Max Daily Cost ($)</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="No limit"
                              value={maxCost}
                              onChange={(e) => setMaxCost(e.target.value)}
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#fdfcfb',
                                padding: '1rem 1.25rem',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                          </div>
                        </div>

                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <label className="form-label fw-bold">Min Hours</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="0"
                              value={minHours}
                              onChange={(e) => setMinHours(e.target.value)}
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#fdfcfb',
                                padding: '1rem 1.25rem',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-bold">Max Hours</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="No limit"
                              value={maxHours}
                              onChange={(e) => setMaxHours(e.target.value)}
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#fdfcfb',
                                padding: '1rem 1.25rem',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-bold">Include Notes</label>
                          <select
                            className="form-control"
                            value={includeNotes}
                            onChange={(e) => setIncludeNotes(e.target.value)}
                            style={{
                              borderRadius: '16px',
                              backgroundColor: '#fdfcfb',
                              padding: '1rem 1.25rem',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <option value="all">All Timelines</option>
                            <option value="withNotes">Only with Notes</option>
                            <option value="withoutNotes">Only without Notes</option>
                          </select>
                        </div>

                        <div className="form-check mb-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="includeForecast"
                            checked={includeForecast}
                            onChange={(e) => setIncludeForecast(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="includeForecast">
                            Include AI-Powered Forecast (Beta)
                          </label>
                          <small className="form-text text-muted">
                            Generate projections based on historical data
                          </small>
                        </div>

                        <div className="form-check mb-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="emailReport"
                            checked={emailReport}
                            onChange={(e) => setEmailReport(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="emailReport">
                            Send Report via Email
                          </label>
                          {emailReport && (
                            <input
                              type="email"
                              className="form-control mt-2"
                              placeholder="Enter email address"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              required={emailReport}
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#fdfcfb',
                                padding: '1rem 1.25rem',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0" style={{
                    background: 'linear-gradient(135deg, rgba(248,249,250,0.9) 0%, rgba(255,255,255,0.9) 100%)',
                    padding: '2rem'
                  }}>
                    <div className="d-flex gap-3 ms-auto">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => setShowCalculationModal(false)}
                        style={{
                          borderRadius: '50px',
                          padding: '12px 25px'
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-warning btn-lg"
                        onClick={handlePreviewDashboard}
                        disabled={calculatingNew || !dashboardName.trim()}
                        style={{
                          borderRadius: '50px',
                          padding: '12px 25px',
                          borderColor: '#d4af37',
                          color: '#d4af37'
                        }}
                      >
                        <BsEye className="me-2" />
                        Preview
                      </button>

                      <button
                        type="submit"
                        className="btn btn-warning btn-lg shadow-lg"
                        disabled={calculatingNew || !dashboardName.trim()}
                        style={{
                          borderRadius: '50px',
                          padding: '12px 30px',
                          background: 'linear-gradient(45deg, #d4af37, #f4d03f)',
                          border: 'none',
                          color: 'white'
                        }}
                      >
                        {calculatingNew ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Calculating...
                          </>
                        ) : (
                          <>
                            <BsCalculator className="me-2" />
                            Create Dashboard
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Modern Footer */}
        <div className="mt-5 py-4 border-top bg-light">
          <div className="text-center">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0 text-muted">
                  <small>
                    Tips: Double-click rows for quick details • Use filters for precise searches •
                    Export data for external analysis
                  </small>
                </p>
              </div>
              <div className="col-md-6 text-end">
                <div className="d-flex justify-content-end gap-2">
                  <span className="badge bg-warning text-dark">
                    {statistics.totalDashboards} Total Dashboards
                  </span>
                  {paginatedData.totalItems !== statistics.totalDashboards && (
                    <span className="badge bg-secondary text-white">
                      {paginatedData.totalItems} Filtered
                    </span>
                  )}
                  <span className="badge bg-success">
                    {statistics.activeDashboards} Active
                  </span>
                  <span className="badge bg-info">
                    {formatCurrency(statistics.totalValue)} Total Value
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Modal */}
        {showAnalyticsModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1055 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content border-0 shadow-2xl" style={{ borderRadius: '32px', background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)' }}>
                <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '2rem 2.5rem 1.5rem', color: '#ffffff', borderRadius: '32px 32px 0 0' }}>
                  <div className="d-flex align-items-center">
                    <div className="me-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.2)' }}>
                      <BsBarChart className="text-white fs-3" />
                    </div>
                    <div>
                      <h3 className="modal-title fw-bold mb-2 text-white">Financial & Timeline Intelligence</h3>
                      <p className="mb-0 text-white opacity-75 fs-5">Comprehensive project insights and analytics</p>
                    </div>
                  </div>
                </div>
                <div className="modal-body" style={{ padding: '2.5rem' }}>
                  {loadingAnalytics ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading analytics data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="row g-4 mb-4">
                        <div className="col-lg-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <BsGraphUp className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {analyticsData.length > 0 ?
                                Math.round(analyticsData.reduce((sum, item) => sum + item.efficiency, 0) / analyticsData.length) + '%'
                                : '0%'
                              }
                            </h2>
                            <p className="text-white opacity-75 mb-0">Avg Efficiency</p>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <BsCurrencyDollar className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {analyticsData.length > 0 ?
                                '$' + Math.round(analyticsData.reduce((sum, item) => sum + item.timelinesCost, 0) / 1000) + 'K'
                                : '$0'
                              }
                            </h2>
                            <p className="text-white opacity-75 mb-0">Timeline Costs</p>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}>
                            <BsPeople className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {analyticsData.reduce((sum, item) => sum + item.totalWorkers, 0)}
                            </h2>
                            <p className="text-white opacity-75 mb-0">Total Workers</p>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            <BsExclamationTriangle className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {analyticsData.length > 0 ?
                                Math.round(analyticsData.reduce((sum, item) => sum + item.riskScore, 0) / analyticsData.length)
                                : '0'
                              }
                            </h2>
                            <p className="text-white opacity-75 mb-0">Risk Score</p>
                          </div>
                        </div>
                      </div>

                      <div className="row g-4">
                        <div className="col-lg-8">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-header border-0" style={{ background: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Project Intelligence</h6>
                              <small className="text-muted">Financial dashboards with timeline integration</small>
                            </div>
                            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                              {analyticsData.length === 0 ? (
                                <div className="text-center py-4">
                                  <BsFileEarmarkBarGraph size={48} className="text-muted mb-3" />
                                  <h5 className="text-muted">No analytics data found</h5>
                                  <p className="text-muted">No financial dashboards with timeline data available.</p>
                                </div>
                              ) : (
                                analyticsData.map((item, idx) => {
                                  const efficiencyColor = item.efficiency >= 85 ? 'success' :
                                    item.efficiency >= 70 ? 'warning' : 'danger';
                                  const riskColor = item.riskScore <= 30 ? 'success' :
                                    item.riskScore <= 60 ? 'warning' : 'danger';

                                  return (
                                    <div key={item._id || idx} className="d-flex align-items-center mb-3 p-3 rounded hover-bg-light" style={{ transition: 'background-color 0.2s', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                                      <div className="position-relative me-3">
                                        <div
                                          className={`bg-warning rounded-circle d-flex align-items-center justify-content-center`}
                                          style={{ width: '48px', height: '48px' }}
                                        >
                                          <BsFileEarmarkBarGraph className="text-white" />
                                        </div>
                                        <div
                                          className="position-absolute bottom-0 end-0 bg-white rounded-circle d-flex align-items-center justify-content-center"
                                          style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                        >
                                          {item.projectHealth === 'High Activity' ? '🔥' :
                                            item.projectHealth === 'Medium Activity' ? '⚡' : '📊'}
                                        </div>
                                      </div>
                                      <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                          <div>
                                            <span className="fw-semibold">{item.dashboardName || 'Unknown Dashboard'}</span>
                                            <small className="text-muted ms-2">({item.timelinesCount} timelines)</small>
                                          </div>
                                          <div className="d-flex gap-2">
                                            <span className={`badge bg-${efficiencyColor}`}>{Math.round(item.efficiency)}% eff</span>
                                            <small className="badge bg-secondary">{item.totalWorkers} workers</small>
                                          </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-1">
                                          <small className="text-muted me-2">💰 ${item.timelinesCost.toLocaleString()} timeline costs</small>
                                          <small className="text-muted">📊 ${(item.financialSummary?.grandTotal || 0).toLocaleString()} total value</small>
                                        </div>
                                        <div className="progress" style={{ height: '6px' }}>
                                          <div className={`progress-bar bg-${riskColor}`} style={{ width: `${100 - item.riskScore}%` }}></div>
                                        </div>
                                        <small className="text-muted">Risk: {Math.round(item.riskScore)}% • Health: {item.projectHealth}</small>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-header border-0" style={{ background: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Smart Actions</h6>
                              <small className="text-muted">AI-powered recommendations</small>
                            </div>
                            <div className="card-body d-grid gap-2">
                              <button
                                className="btn btn-outline-success"
                                onClick={() => {
                                  const alert = document.createElement('div');
                                  alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
                                  alert.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
                                  alert.innerHTML = `
                                    <strong>🎯 Analysis Complete!</strong> Optimization recommendations generated.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                  `;
                                  document.body.appendChild(alert);
                                  setTimeout(() => alert.remove(), 4000);
                                }}
                              >
                                <BsGraphUp className="me-2" />Generate Insights
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/ptfd/project-timelines')}
                              >
                                <BsCalendar className="me-2" />View Timelines
                              </button>
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => {
                                  const alert = document.createElement('div');
                                  alert.className = 'alert alert-info alert-dismissible fade show position-fixed';
                                  alert.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
                                  alert.innerHTML = `
                                    <strong>📊 Predictive Analytics!</strong> ML models analyzing trends for future insights.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                  `;
                                  document.body.appendChild(alert);
                                  setTimeout(() => alert.remove(), 4000);
                                }}
                              >
                                <BsActivity className="me-2" />Predict Trends
                              </button>
                              <button
                                className="btn btn-outline-info"
                                onClick={fetchAnalyticsData}
                                disabled={loadingAnalytics}
                              >
                                <BsGraphUp className="me-2" />
                                {loadingAnalytics ? 'Refreshing...' : 'Refresh Data'}
                              </button>
                            </div>

                            {/* Analytics Summary */}
                            {analyticsData.length > 0 && (
                              <div className="card-footer border-0 bg-light">
                                <h6 className="fw-bold mb-2">Intelligence Summary</h6>
                                <div className="row text-center">
                                  <div className="col-6">
                                    <small className="text-muted d-block">Dashboards</small>
                                    <strong>{analyticsData.length}</strong>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">Timelines</small>
                                    <strong>
                                      {analyticsData.reduce((sum, item) => sum + item.timelinesCount, 0)}
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer border-0" style={{ padding: '1.5rem 2.5rem 2rem' }}>
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowAnalyticsModal(false)}>Close</button>
                  {analyticsData.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-warning rounded-pill px-4"
                      style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', color: '#fff' }}
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," +
                          "Dashboard,Timelines,Total Workers,Timeline Cost,Financial Value,Efficiency,Risk Score,Health\n" +
                          analyticsData.map(item =>
                            `"${item.dashboardName || 'Unknown'}",${item.timelinesCount},${item.totalWorkers},${item.timelinesCost},${item.financialSummary?.grandTotal || 0},${Math.round(item.efficiency)},${Math.round(item.riskScore)},"${item.projectHealth}"`
                          ).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `financial-timeline-analytics-${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Export Analytics
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}