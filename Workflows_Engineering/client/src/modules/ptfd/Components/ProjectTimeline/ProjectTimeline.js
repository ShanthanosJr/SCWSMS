import React, { useState, useEffect, useCallback, useMemo , useRef} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import Nav from "../Nav/Nav";
import { exportTimelineToPDF } from '../ExportUtils';
import {
  BsCalendar,
  BsCurrencyDollar,
  BsPeople,
  BsFileEarmarkBarGraph,
  BsSearch,
  BsPieChart,
  BsBarChart,
  BsEye,
  BsTrash,
  BsPencil,
  BsGrid,
  BsList,
  BsBriefcase,
  BsActivity,
  BsShare,
  BsClock,
  BsShield,
  BsStopwatch,
  BsStarFill,
  BsGraphUpArrow,
  BsRadar,
  BsBellFill
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
  AreaChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

const URL = 'http://localhost:5050/project-timelines';

async function fetchTimelines() {
  try {
    const res = await axios.get(URL);
    return Array.isArray(res.data) ? res.data : (res.data?.timelines ?? []);
  } catch (err) {
    console.error('Error fetching timelines:', err);
    return [];
  }
}

export default function ProjectTimelines() {
  const navigate = useNavigate();

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'initial-1',
      type: 'system',
      title: 'System Initialized',
      message: 'Timeline Chronicle dashboard is ready for project tracking',
      timestamp: new Date(),
      icon: '📅',
      read: false
    }
  ]);
  const notifRef = useRef();

  // Calculate unread notification count
  const notificationCount = notifications.filter(n => !n.read).length;

  // Debug logging
  useEffect(() => {
    console.log('📍 ProjectTimelines component mounted');
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Navigate function:', typeof navigate, navigate);
  }, [navigate]);

  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterProject, setFilterProject] = useState("");

  // Enhanced state for modern features
  const [viewMode, setViewMode] = useState("overview"); // overview, analytics, timelines, table
  const [selectedTimelines, setSelectedTimelines] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [costRange, setCostRange] = useState({ min: "", max: "" });
  const [selectedTimelineDetail, setSelectedTimelineDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [quickFilter, setQuickFilter] = useState("");

  // Analytics modal states
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const previousTimelineCount = timelines.length;
      const data = await fetchTimelines();
      if (!mounted) return;
      
      // Check for new timelines
      if (previousTimelineCount > 0 && data.length > previousTimelineCount) {
        const newTimelinesCount = data.length - previousTimelineCount;
        addNotification(
          'addition', 
          `New Timeline${newTimelinesCount > 1 ? 's' : ''} Added`, 
          `${newTimelinesCount} new timeline${newTimelinesCount > 1 ? 's have' : ' has'} been created`, 
          '📅'
        );
      }
      
      setTimelines(data || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [timelines.length]);

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

  // Auto-refresh timelines every 30 seconds to catch new additions/updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newTimelines = await fetchTimelines();
        
        // Check for new timelines by comparing IDs
        const currentTimelineIds = timelines.map(t => t._id);
        const addedTimelines = newTimelines.filter(t => !currentTimelineIds.includes(t._id));
        
        if (addedTimelines.length > 0) {
          addedTimelines.forEach(timeline => {
            addNotification(
              'addition',
              'New Timeline Added',
              `Timeline for ${timeline.projectDetails?.pname || timeline.pcode} has been created`,
              '📅'
            );
          });
          setTimelines(newTimelines);
        }
      } catch (error) {
        console.error('Error refreshing timelines:', error);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [timelines]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project timeline? This action cannot be undone.")) {
      try {
        // Get timeline info before deletion for notification
        const timelineToDelete = timelines.find(t => t._id === id);
        const timelineName = timelineToDelete?.projectDetails?.pname || timelineToDelete?.pcode || 'Unknown Timeline';
        
        await axios.delete(`http://localhost:5050/project-timelines/${id}`);
        setTimelines((prevTimelines) => (prevTimelines || []).filter(t => t._id !== id));
        setSelectedTimelines((prevSelected) => (prevSelected || []).filter(selectedId => selectedId !== id));

        // Add deletion notification
        addNotification(
          'deletion',
          'Timeline Deleted',
          `${timelineName} timeline has been removed from the system`,
          '🗑️'
        );

        showNotification("success", "Project timeline deleted successfully!");
      } catch (error) {
        console.error("Error deleting timeline:", error);
        showNotification("error", "Error deleting project timeline. Please try again.");
      }
    }
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

  // Toggle timeline selection
  const toggleTimelineSelection = (timelineId) => {
    setSelectedTimelines(prev =>
      prev.includes(timelineId)
        ? prev.filter(id => id !== timelineId)
        : [...prev, timelineId]
    );
  };

  // Select all timelines
  const toggleSelectAll = () => {
    const filteredIds = getSortedAndFilteredTimelines().map(t => t._id);
    setSelectedTimelines(
      selectedTimelines.length === filteredIds.length ? [] : filteredIds
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

  const getSortedAndFilteredTimelines = () => {
    if (!Array.isArray(timelines)) return [];
    let filtered = timelines.filter(timeline => {
      // Search filter
      const matchesSearch =
        new Date(timeline.date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (timeline.tnotes && timeline.tnotes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (timeline.projectDetails?.pname && timeline.projectDetails.pname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (timeline.pcode && timeline.pcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (timeline.projectDetails?.pcode && timeline.projectDetails.pcode.toLowerCase().includes(searchTerm.toLowerCase()));

      // Project filter
      const matchesProject = !filterProject || timeline.pcode === filterProject;

      // Date range filter
      const matchesDateRange = (
        !dateRange.start || new Date(timeline.date) >= new Date(dateRange.start)
      ) && (
          !dateRange.end || new Date(timeline.date) <= new Date(dateRange.end)
        );

      // Cost range filter
      const timelineCost = calculateTotalCost(timeline);
      const matchesCostRange = (
        !costRange.min || timelineCost >= parseFloat(costRange.min)
      ) && (
          !costRange.max || timelineCost <= parseFloat(costRange.max)
        );

      // Quick filters
      const matchesQuickFilter = (() => {
        switch (quickFilter) {
          case 'today':
            return new Date(timeline.date).toDateString() === new Date().toDateString();
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(timeline.date) >= weekAgo;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return new Date(timeline.date) >= monthAgo;
          case 'high-cost':
            return timelineCost > 10000;
          case 'high-activity':
            return (timeline.workerCount + timeline.tengineerCount + timeline.architectCount) > 10;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesProject && matchesDateRange && matchesCostRange && matchesQuickFilter;
    });

    return filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case "date":
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case "project":
          aVal = a.projectDetails?.pname || a.pcode;
          bVal = b.projectDetails?.pname || b.pcode;
          break;
        case "workers":
          aVal = a.workerCount || 0;
          bVal = b.workerCount || 0;
          break;
        case "engineers":
          aVal = a.tengineerCount || 0;
          bVal = b.tengineerCount || 0;
          break;
        case "architects":
          aVal = a.architectCount || 0;
          bVal = b.architectCount || 0;
          break;
        case "expenses":
          aVal = calculateTotalCost(a);
          bVal = calculateTotalCost(b);
          break;
        case "hours":
          aVal = calculateTotalHours(a);
          bVal = calculateTotalHours(b);
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

  // Helper functions
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openTimelineDetailModal = (timeline) => {
    // This function would typically open a modal or navigate to detail page
    console.log('Opening timeline detail:', timeline);
    // For now, we'll just log the action
    // In a real implementation, this would open a modal or navigate to a detailed view
  };

  // Fetch combined analytics data (timelines + financial)
  const fetchAnalyticsData = async () => {
    try {
      setLoadingAnalytics(true);
      
      // Fetch both timelines and financial dashboards
      const [timelinesRes, financialRes] = await Promise.all([
        axios.get('http://localhost:5050/project-timelines'),
        axios.get('http://localhost:5050/financial-dashboard')
      ]);
      
      const timelinesData = Array.isArray(timelinesRes.data) ? timelinesRes.data : [];
      const financialData = Array.isArray(financialRes.data.data) ? financialRes.data.data : [];
      
      // Combine and enhance data
      const combinedData = timelinesData.map(timeline => {
        // Find related financial dashboard
        const relatedDashboard = financialData.find(dashboard => 
          dashboard.projectCode === timeline.pcode ||
          dashboard.projectCode === timeline.projectDetails?.pcode
        );
        
        // Calculate enhanced metrics
        const timelineCost = calculateTotalCost(timeline);
        const timelineHours = calculateTotalHours(timeline);
        const totalStaff = (timeline.workerCount || 0) + (timeline.tengineerCount || 0) + (timeline.architectCount || 0);
        const avgHourlyRate = timelineHours > 0 ? timelineCost / timelineHours : 0;
        
        return {
          ...timeline,
          relatedDashboard,
          timelineCost,
          timelineHours,
          totalStaff,
          avgHourlyRate,
          financialValue: relatedDashboard?.financialSummary?.grandTotal || 0,
          efficiency: Math.min(100, Math.max(50, (timelineHours / Math.max(totalStaff, 1)) * 10)),
          costPerWorker: totalStaff > 0 ? timelineCost / totalStaff : 0,
          productivity: timelineHours > 0 ? (timelineCost / timelineHours) * 8 : 0, // cost per 8-hour day
          riskLevel: timelineCost > 15000 ? 'High' : timelineCost > 8000 ? 'Medium' : 'Low',
          activityLevel: totalStaff > 15 ? 'High' : totalStaff > 8 ? 'Medium' : 'Low'
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

  const calculateTotalCost = (timeline) => {
    const expensesTotal = timeline.texpenses?.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0) || 0;
    const materialsTotal = timeline.tmaterials?.reduce((sum, mat) => sum + (parseFloat(mat.cost) || 0), 0) || 0;
    return expensesTotal + materialsTotal;
  };

  const calculateTotalHours = (timeline) => {
    const workerHours = timeline.tworker?.reduce((sum, w) => sum + (parseInt(w.hoursWorked) || 0), 0) || 0;
    const engineerHours = timeline.tengineer?.reduce((sum, e) => sum + (parseInt(e.hoursWorked) || 0), 0) || 0;
    const architectHours = timeline.tarchitect?.reduce((sum, a) => sum + (parseInt(a.hoursWorked) || 0), 0) || 0;
    return workerHours + engineerHours + architectHours;
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "⬆️" : "⬇️";
  };

  const getUniqueProjects = useCallback(() => {
    if (!Array.isArray(timelines)) return [];
    const projects = timelines.map(t => ({
      id: t.pcode,
      name: t.projectDetails?.pname || t.pcode,
      code: t.pcode
    }));
    return [...new Map(projects.map(p => [p.id, p])).values()];
  }, [timelines]);

  // Enhanced utility functions
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterProject("");
    setDateRange({ start: "", end: "" });
    setCostRange({ min: "", max: "" });
    setQuickFilter("");
    setCurrentPage(1);
  };

  const openDetailModal = (timeline) => {
    setSelectedTimelineDetail(timeline);
    setShowDetailModal(true);
    
    // Add timeline view notification
    addNotification(
      'view',
      'Timeline Viewed',
      `${timeline.projectDetails?.pname || timeline.pcode} timeline details were accessed`,
      '👁️'
    );
  };

  // Pagination
  const getPaginatedData = () => {
    const sorted = getSortedAndFilteredTimelines();
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
    if (!Array.isArray(timelines)) {
      return {
        totalTimelines: 0,
        uniqueProjects: 0,
        totalHours: 0,
        totalCost: 0,
        highCostTimelines: 0,
        highActivityTimelines: 0,
        completedTimelines: 0,
        totalStaff: 0,
        avgCost: 0
      };
    }
    const totalCost = timelines.reduce((sum, t) => sum + calculateTotalCost(t), 0);
    const totalHours = timelines.reduce((sum, t) => sum + calculateTotalHours(t), 0);
    const uniqueProjects = getUniqueProjects().length;
    const highCostTimelines = timelines.filter(t => calculateTotalCost(t) > 10000).length;
    const highActivityTimelines = timelines.filter(t => (t.workerCount + t.tengineerCount + t.architectCount) > 10).length;
    
    // Calculate completed timelines (assume timelines with notes or recent dates are completed)
    const currentDate = new Date();
    const completedTimelines = timelines.filter(t => {
      const timelineDate = new Date(t.date);
      const daysDiff = (currentDate - timelineDate) / (1000 * 60 * 60 * 24);
      return t.tnotes || daysDiff > 7; // Consider completed if has notes or older than 7 days
    }).length;
    
    // Calculate total staff
    const totalStaff = timelines.reduce((sum, t) => {
      return sum + (t.workerCount || 0) + (t.tengineerCount || 0) + (t.architectCount || 0);
    }, 0);

    return {
      totalTimelines: timelines.length,
      uniqueProjects,
      totalHours,
      totalCost,
      highCostTimelines,
      highActivityTimelines,
      completedTimelines,
      totalStaff,
      avgCost: timelines.length > 0 ? totalCost / timelines.length : 0
    };
  }, [timelines, getUniqueProjects]);

  // Chart data
  const chartData = useMemo(() => {
    if (!Array.isArray(timelines)) {
      return {
        workerData: [],
        costData: [],
        activityData: [],
        radarData: [],
        trendData: []
      };
    }
    // Worker type distribution for pie chart
    const workerTypes = timelines.reduce((acc, timeline) => {
      acc.workers = (acc.workers || 0) + (timeline.workerCount || 0);
      acc.engineers = (acc.engineers || 0) + (timeline.tengineerCount || 0);
      acc.architects = (acc.architects || 0) + (timeline.architectCount || 0);
      return acc;
    }, {});

    const workerData = Object.entries(workerTypes).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: type === 'workers' ? '#ef4444' : type === 'engineers' ? '#f59e0b' : '#10b981'
    }));

    // Cost by project for bar chart
    const costByProject = timelines.reduce((acc, timeline) => {
      const project = timeline.projectDetails?.pname || timeline.pcode || 'Unknown';
      const cost = calculateTotalCost(timeline);
      if (!acc[project]) {
        acc[project] = { project, totalCost: 0, count: 0 };
      }
      acc[project].totalCost += cost;
      acc[project].count += 1;
      return acc;
    }, {});

    const costData = Object.values(costByProject).map(item => ({
      ...item,
      avgCost: item.count > 0 ? item.totalCost / item.count : 0
    }));

    // Monthly activity data
    const monthlyData = timelines.reduce((acc, timeline) => {
      const date = new Date(timeline.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, timelines: 0, totalHours: 0 };
      }

      acc[monthKey].timelines += 1;
      acc[monthKey].totalHours += calculateTotalHours(timeline);

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
      { subject: 'Workers', A: timelines.reduce((sum, t) => sum + (t.workerCount || 0), 0) / timelines.length || 0, fullMark: 50 },
      { subject: 'Engineers', A: timelines.reduce((sum, t) => sum + (t.tengineerCount || 0), 0) / timelines.length || 0, fullMark: 50 },
      { subject: 'Architects', A: timelines.reduce((sum, t) => sum + (t.architectCount || 0), 0) / timelines.length || 0, fullMark: 50 },
      { subject: 'Hours', A: timelines.reduce((sum, t) => sum + calculateTotalHours(t), 0) / timelines.length || 0, fullMark: 100 },
      { subject: 'Cost', A: timelines.reduce((sum, t) => sum + calculateTotalCost(t), 0) / timelines.length / 1000 || 0, fullMark: 50 },
      { subject: 'Notes', A: timelines.filter(t => t.tnotes).length / timelines.length * 100 || 0, fullMark: 100 }
    ];

    // Monthly trend data for the area chart
    const trendData = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(item => ({
        month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        cost: timelines.filter(t => {
          const tDate = new Date(t.date);
          const tMonthKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
          return tMonthKey === item.month;
        }).reduce((sum, t) => sum + calculateTotalCost(t), 0),
        totalHours: item.totalHours
      }));

    // Staff data for pie chart
    const staffData = Object.entries(workerTypes).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: type === 'workers' ? '#ef4444' : type === 'engineers' ? '#f59e0b' : '#10b981'
    }));

    return { workerData, costData, activityData, radarData, trendData, staffData };
  }, [timelines]);

  const handleExportAll = () => {
    // For now, we'll create a summary report of all timelines
    const summaryData = {
      timelines: timelines,
      totalTimelines: timelines.length,
      totalCost: timelines.reduce((sum, t) => sum + calculateTotalCost(t), 0),
      totalHours: timelines.reduce((sum, t) => sum + calculateTotalHours(t), 0),
      generatedAt: new Date()
    };

    // Create a summary PDF using the export utility
    exportTimelineToPDF(summaryData, `timelines-summary-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div>
      {/* <Nav />*/}  
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

  const uniqueProjects = getUniqueProjects();
  const paginatedData = getPaginatedData();

  return (
    <div className="timeline-dashboard">
    {/* <Nav />*/}
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

        {/* Premium Timelines Dashboard-Style Hero Header */}
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
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
               // border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4), 0 4px 12px rgba(220, 38, 38, 0.2)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(220, 38, 38, 0.6), 0 6px 16px rgba(220, 38, 38, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4), 0 4px 12px rgba(220, 38, 38, 0.2)';
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
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
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
                  border: '1px solid rgba(220, 38, 38, 0.1)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(220, 38, 38, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
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
                    borderBottom: '1px solid rgba(220, 38, 38, 0.1)',
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="mb-0 fw-bold" style={{ color: '#991b1b', fontSize: '1.1rem' }}>
                      Timeline Notifications
                    </h6>
                    <div className="d-flex align-items-center gap-2">
                      <span 
                        style={{ 
                          fontSize: '0.8rem', 
                          color: '#dc2626',
                          fontWeight: '600',
                          background: 'rgba(220, 38, 38, 0.1)',
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
                            color: '#dc2626',
                            background: 'transparent',
                            border: '1px solid rgba(220, 38, 38, 0.3)',
                            borderRadius: '12px',
                            padding: '0.2rem 0.6rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(220, 38, 38, 0.1)';
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
                          case 'addition': return 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
                          case 'view': return 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)';
                          case 'update': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                          case 'deletion': return 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)';
                          case 'system': return 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)';
                          default: return 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
                        }
                      };

                      return (
                        <div 
                          key={notification.id}
                          style={{ 
                            padding: '1.5rem 2rem',
                            borderBottom: notifications.indexOf(notification) === notifications.length - 1 ? 'none' : '1px solid rgba(220, 38, 38, 0.05)',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                            background: notification.read ? 'transparent' : 'rgba(220, 38, 38, 0.02)',
                            borderLeft: notification.read ? 'none' : '3px solid #dc2626'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(220, 38, 38, 0.02)'}
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
                              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
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
                                        background: '#ef4444',
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
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)',
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
                {/* Company Logo */}
                <div className="mb-4 d-flex justify-content-center">
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid rgba(239, 68, 68, 0.1)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white'
                  }}>
                    <img 
                      src="/workflowsengineering.png" 
                      alt="Workflows Engineering Logo" 
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </div>
                
                <div className="d-flex align-items-center justify-content-center mb-4">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                    marginRight: '1rem'
                  }}>
                    <BsCalendar className="text-white fs-1" />
                  </div>
                  <div>
                    <h1 className="display-3 fw-bold mb-1" style={{
                      color: '#1a1a1a',
                      fontWeight: '700',
                      letterSpacing: '-0.02em'
                    }}>Timeline Nexus</h1>
                    {/*<p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                      Chronological mastery of project evolution
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
                  Your premium timeline management platform. Track daily activities, manage resources, and monitor progress across all your construction timelines.</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button onClick={() => navigate("/ptfd/financial-dashboard")} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #c53030',
                    color: '#c53030',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
                  }}>
                    <BsFileEarmarkBarGraph className="me-2" />Financial Dashboard
                  </button>
                  <button onClick={() => navigate("/ptfd/add-project-timeline")} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsCalendar className="me-2" />Forge New Timeline
                  </button>
                  <button onClick={handleExportAll} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #c53030',
                    color: '#c53030',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
                  }}>
                    <BsShare className="me-2" />Export All Timelines
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
                      <span style={{ fontSize: '1.5rem' }}>📈</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Records</h6>
                    <h3 className="mb-0 text-danger">{statistics.totalTimelines}</h3>
                    <small className="text-success">
                      <span className="me-1">↑</span>
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
                      <span style={{ fontSize: '1.5rem' }}>🏢</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Active Projects</h6>
                    <h3 className="mb-0 text-success">{statistics.uniqueProjects}</h3>
                    <small className="text-info">
                      <span className="me-1">📁</span>
                      {statistics.uniqueProjects > 0 ? 'Multiple sites' : 'No projects'}
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
                      <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Hours</h6>
                    <h3 className="mb-0 text-warning">
                      {statistics.totalHours.toLocaleString()}
                    </h3>
                    <small className="text-muted">
                      <span className="me-1">👥</span>
                      Workforce activity
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
                      <span style={{ fontSize: '1.5rem' }}>💰</span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1">Total Investment</h6>
                    <h3 className="mb-0 text-danger">
                      ${statistics.totalCost.toLocaleString()}
                    </h3>
                    <small className="text-success">
                      <span className="me-1">📈</span>
                      Budget tracking
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
                          className={`nav-link ${viewMode === 'timelines' ? 'active' : ''}`}
                          onClick={() => setViewMode('timelines')}
                        >
                          <BsGrid className="me-2" />
                          Timelines
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
                            placeholder="Search timelines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-auto">
                        <select
                          className="form-select form-select-sm"
                          value={filterProject}
                          onChange={(e) => setFilterProject(e.target.value)}
                        >
                          <option value="">All Projects</option>
                          {(uniqueProjects || []).map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name}
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
                          className="btn btn-outline-warning btn-sm"
                          onClick={handleShowAnalyticsModal}
                          style={{
                            borderColor: '#c53030',
                            color: '#c53030'
                          }}
                        >
                          <BsBarChart className="me-1" />
                          Analytics
                        </button>
                      </div>
                      <div className="col-auto">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={fetchTimelines}
                        >
                          <span className="me-1">🔄</span> Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Quick Actions Bar 
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm ${quickFilter === 'today' ? 'btn-primary' : 'btn-outline-primary'
                        }`}
                      onClick={() => setQuickFilter(quickFilter === 'today' ? '' : 'today')}
                    >
                      📅 Today
                    </button>
                    <button
                      className={`btn btn-sm ${quickFilter === 'week' ? 'btn-success' : 'btn-outline-success'
                        }`}
                      onClick={() => setQuickFilter(quickFilter === 'week' ? '' : 'week')}
                    >
                      📆 This Week
                    </button>
                    <button
                      className={`btn btn-sm ${quickFilter === 'month' ? 'btn-info' : 'btn-outline-info'
                        }`}
                      onClick={() => setQuickFilter(quickFilter === 'month' ? '' : 'month')}
                    >
                      📅 This Month
                    </button>
                    <button
                      className={`btn btn-sm ${quickFilter === 'high-cost' ? 'btn-warning' : 'btn-outline-warning'
                        }`}
                      onClick={() => setQuickFilter(quickFilter === 'high-cost' ? '' : 'high-cost')}
                    >
                      💰 High Cost
                    </button>
                    <button
                      className={`btn btn-sm ${quickFilter === 'high-activity' ? 'btn-danger' : 'btn-outline-danger'
                        }`}
                      onClick={() => setQuickFilter(quickFilter === 'high-activity' ? '' : 'high-activity')}
                    >
                      👥 High Activity
                    </button>
                  </div>
                </div> */}
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
                        <label className="form-label small text-muted">Min Cost ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0"
                          value={costRange.min}
                          onChange={(e) => setCostRange({ ...costRange, min: e.target.value })}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label className="form-label small text-muted">Max Cost ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="∞"
                          value={costRange.max}
                          onChange={(e) => setCostRange({ ...costRange, max: e.target.value })}
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
    background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%) !important;
    color: #fff !important;
    border-radius: 8px;
  }
  .nav-pills .nav-link {
    color: #c53030;
  }
  .nav-pills .nav-link:hover {
    color: #e53e3e !important;
  }
`}
        </style>

        {/* Overview Tab - Enhanced */}
        {viewMode === 'overview' && (
          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-8">
              <div className="row g-4">
                {/* Timeline Performance Analytics */}
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
                        <BsBarChart className="me-2" style={{ color: '#ef4444' }} />
                        Timeline Performance Analytics
                      </h5>
                      <small className="text-muted">Daily timeline activity overview</small>
                    </div>
                    <div className="card-body p-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[
                          { day: 'Mon', completed: 85, pending: 15, name: 'Monday' },
                          { day: 'Tue', completed: 90, pending: 10, name: 'Tuesday' },
                          { day: 'Wed', completed: 75, pending: 25, name: 'Wednesday' },
                          { day: 'Thu', completed: 95, pending: 5, name: 'Thursday' },
                          { day: 'Fri', completed: 80, pending: 20, name: 'Friday' },
                          { day: 'Sat', completed: 60, pending: 40, name: 'Saturday' },
                          { day: 'Sun', completed: 70, pending: 30, name: 'Sunday' }
                        ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#dc2626" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#fee2e2" stopOpacity={0.4} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(239, 68, 68, 0.1)" />
                          <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
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

                {/* Resource Management */}
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
                        <BsPeople className="me-2" style={{ color: '#ef4444' }} />
                        Resource Management
                      </h5>
                      <small className="text-muted">Staff allocation across timelines</small>
                    </div>
                    <div className="card-body p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {[
                        { role: 'Site Workers', count: Math.floor(statistics.totalStaff * 0.6), icon: '👷', color: '#ef4444' },
                        { role: 'Engineers', count: Math.floor(statistics.totalStaff * 0.25), icon: '👨‍💼', color: '#f59e0b' },
                        { role: 'Architects', count: Math.floor(statistics.totalStaff * 0.15), icon: '🏗️', color: '#dc2626' }
                      ].map((resource, idx) => (
                        <div key={idx} className="d-flex align-items-center mb-3 p-3 rounded-3" style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}>
                          <div
                            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: '45px',
                              height: '45px',
                              background: `${resource.color}15`,
                              border: `2px solid ${resource.color}30`
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>{resource.icon}</span>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold" style={{ color: '#1f2937' }}>{resource.role}</h6>
                            <p className="mb-0 text-muted small">{resource.count} active personnel</p>
                          </div>
                          <div className="text-end">
                            <span className="badge rounded-pill px-3 py-2" style={{
                              background: resource.color,
                              color: 'white'
                            }}>
                              {resource.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Progress Insights */}
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
                        <BsPieChart className="me-2" style={{ color: '#ef4444' }} />
                        Timeline Completion
                      </h5>
                      <small className="text-muted">Overall progress tracking</small>
                    </div>
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <defs>
                            <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7} />
                            </linearGradient>
                            <linearGradient id="remainingGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#fee2e2" stopOpacity={0.5} />
                            </linearGradient>
                          </defs>
                          <Pie
                            data={[
                              { name: 'Completed', value: Math.round((statistics.completedTimelines / statistics.totalTimelines) * 100 || 0), color: '#ef4444' },
                              { name: 'Remaining', value: 100 - Math.round((statistics.completedTimelines / statistics.totalTimelines) * 100 || 0), color: '#fee2e2' }
                            ]}
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
                          <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#ef4444" fontSize={28} fontWeight="bold">
                            {`${Math.round((statistics.completedTimelines / statistics.totalTimelines) * 100 || 0)}%`}
                          </text>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-3">
                        <div className="d-flex justify-content-center align-items-center mb-2">
                          <div className="me-3 d-flex align-items-center">
                            <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', background: '#ef4444' }}></div>
                            <small className="text-muted">Completed</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', background: '#fee2e2' }}></div>
                            <small className="text-muted">Remaining</small>
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
                {/* Recent Timeline Activity */}
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
                        <BsActivity className="me-2" style={{ color: '#ef4444' }} />
                        Recent Activity
                      </h5>
                      <small className="text-muted">Latest timeline updates</small>
                    </div>
                    <div className="card-body p-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {(timelines || []).slice(0, 5).map((timeline, idx) => (
                        <div key={idx} className="mb-3">
                          <div className="d-flex align-items-start p-3 rounded-3" style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                            onClick={() => openTimelineDetailModal(timeline)}>
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                              style={{
                                width: '40px',
                                height: '40px',
                                background: '#ef444415',
                                border: '2px solid #ef444430'
                              }}
                            >
                              <BsCalendar className="text-danger" />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-bold" style={{ color: '#1f2937', fontSize: '14px' }}>
                                {timeline.pcode || 'Timeline Entry'}
                              </h6>
                              <p className="mb-1 text-muted small">{formatDate(timeline.date)}</p>
                              <p className="mb-0 text-muted small">${calculateTotalCost(timeline).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cumulative Time Tracker */}
                <div className="col-12">
                  <div className="card border-0 shadow-lg" style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                    color: 'white'
                  }}>
                    <div className="card-body text-center p-5">
                      <h5 className="mb-3 d-flex align-items-center justify-content-center">
                        <BsClock className="me-2" />
                        Cumulative Hours
                      </h5>
                      <div className="mb-4">
                        <div
                          className="display-4 fw-bold mb-3"
                          style={{
                            fontFamily: 'monospace',
                            background: 'linear-gradient(135deg, #dc2626 0%, #fee2e2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          {statistics.totalHours.toLocaleString()}h
                        </div>
                        <p className="mb-0 text-white-50">Total workforce hours logged</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab - Enhanced */}
        {viewMode === 'analytics' && (
          <div className="row g-4">
            {/* Timeline Cost Trend */}
            <div className="col-lg-8">
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
                    <BsGraphUpArrow className="me-2" style={{ color: '#ef4444' }} />
                    Timeline Cost vs Hours Trend
                  </h5>
                  <small className="text-muted">Monthly timeline performance analysis</small>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="costAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="hoursAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(239, 68, 68, 0.1)" />
                      <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis
                        yAxisId="cost"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis
                        yAxisId="hours"
                        orientation="right"
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
                        formatter={(value, name) => [name === 'cost' ? `$${value.toLocaleString()}` : `${value}h`, name === 'cost' ? 'Total Cost' : 'Total Hours']}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Area
                        yAxisId="cost"
                        type="monotone"
                        dataKey="cost"
                        stroke="#ef4444"
                        strokeWidth={4}
                        fill="url(#costAreaGradient)"
                        name="Cost"
                      />
                      <Area
                        yAxisId="hours"
                        type="monotone"
                        dataKey="totalHours"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        fill="url(#hoursAreaGradient)"
                        name="Hours"
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Staff Distribution Pie */}
            <div className="col-lg-4">
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
                    <BsPieChart className="me-2" style={{ color: '#ef4444' }} />
                    Staff Distribution
                  </h5>
                  <small className="text-muted">Workforce allocation across roles</small>
                </div>
                <div className="card-body text-center d-flex flex-column justify-content-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <defs>
                        <linearGradient id="workersGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="engineersGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="architectsGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#991b1b" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={chartData.staffData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="url(#workersGradient)" />
                        <Cell fill="url(#engineersGradient)" />
                        <Cell fill="url(#architectsGradient)" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [`${value}`, 'Staff Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3">
                    {(chartData.staffData || []).map((item, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 rounded" style={{
                        background: `${item.color}10`,
                        border: `1px solid ${item.color}30`
                      }}>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle me-2" style={{ width: '12px', height: '12px', background: item.color }}></div>
                          <span className="small fw-medium" style={{ color: '#1f2937' }}>{item.name}</span>
                        </div>
                        <span className="badge rounded-pill" style={{ background: item.color, color: 'white' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Utilization Radar */}
            <div className="col-lg-6">
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
                    <BsRadar className="me-2" style={{ color: '#ef4444' }} />
                    Resource Utilization
                  </h5>
                  <small className="text-muted">Average per timeline across projects</small>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={chartData.radarData}>
                      <PolarGrid stroke="rgba(239, 68, 68, 0.2)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 50]}
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        tickCount={5}
                      />
                      <Radar
                        name="Average"
                        dataKey="A"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Timeline Performance Metrics */}
            <div className="col-lg-6">
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
                    <BsStarFill className="me-2" style={{ color: '#ef4444' }} />
                    Timeline Performance Metrics
                  </h5>
                  <small className="text-muted">Key performance indicators</small>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#ef4444' }}>92%</div>
                        <div className="small fw-medium text-muted">Timeline Adherence</div>
                        <div className="mt-2">
                          <BsStopwatch className="text-danger" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#f59e0b' }}>87%</div>
                        <div className="small fw-medium text-muted">Budget Efficiency</div>
                        <div className="mt-2">
                          <BsCurrencyDollar className="text-warning" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(153, 27, 27, 0.05) 100%)',
                        border: '1px solid rgba(220, 38, 38, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#dc2626' }}>{statistics.totalTimelines}</div>
                        <div className="small fw-medium text-muted">Active Timelines</div>
                        <div className="mt-2">
                          <BsCalendar className="text-danger" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 rounded-3" style={{
                        background: 'linear-gradient(135deg, rgba(185, 28, 28, 0.1) 0%, rgba(127, 29, 29, 0.05) 100%)',
                        border: '1px solid rgba(185, 28, 28, 0.2)'
                      }}>
                        <div className="display-6 fw-bold mb-2" style={{ color: '#b91c1c' }}>95%</div>
                        <div className="small fw-medium text-muted">Quality Score</div>
                        <div className="mt-2">
                          <BsShield className="text-danger" style={{ fontSize: '1.5rem' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timelines View (Grid-like, but since original is table, using simplified cards) */}
        {viewMode === 'timelines' && (
          <div className="row g-4">
            {(paginatedData.data || []).map((timeline) => (
              <div key={timeline._id} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow card-hover h-100">
                  <div className="card-body">
                    <h5 className="card-title">{timeline.projectDetails?.pname || 'Unknown Project'}</h5>
                    <p className="text-muted small">{new Date(timeline.date).toLocaleDateString()}</p>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <BsPeople className="me-2 text-muted" />
                        <small>Workers: {timeline.workerCount || 0}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <BsBriefcase className="me-2 text-muted" />
                        <small>Engineers: {timeline.tengineerCount || 0}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <BsCurrencyDollar className="me-2 text-muted" />
                        <small>${calculateTotalCost(timeline).toLocaleString()}</small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-danger text-white">
                        {calculateTotalHours(timeline)} Hours
                      </span>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => openDetailModal(timeline)}
                          title="View Details"
                        >
                          <BsEye />
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => navigate(`/ptfd/update-project-timeline/${timeline._id}`)}
                          title="Edit Timeline"
                        >
                          <BsPencil />
                        </button>
                        <button
                          className="btn btn-outline-success"
                          onClick={() => exportTimelineToPDF(timeline, `timeline-${timeline.pcode}-${new Date(timeline.date).toISOString().split('T')[0]}.pdf`)}
                          title="Export Timeline"
                        >
                          <BsFileEarmarkBarGraph />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(timeline._id)}
                          title="Delete Timeline"
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
        )}

        {/* Table View Tab */}
        {viewMode === 'table' && (
          <div className="container-fluid">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 d-flex align-items-center">
                    <span className="me-2">📈</span>
                    Project Timeline Records
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
                      <span style={{ fontSize: '4rem', opacity: 0.3 }}>📎</span>
                    </div>
                    <h4 className="text-muted mb-3">No timeline records found</h4>
                    <p className="text-muted mb-4">
                      {searchTerm || filterProject || quickFilter || dateRange.start || dateRange.end || costRange.min || costRange.max
                        ? 'Try adjusting your search criteria or filters.'
                        : 'Start by creating your first project timeline entry.'}
                    </p>
                    {!searchTerm && !filterProject && !quickFilter && (
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate("/add-project-timeline")}
                        style={{ borderRadius: '50px', padding: '12px 30px' }}
                      >
                        <span className="me-2">✨</span>
                        Create First Timeline
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-dark">
                          <tr>
                            <th style={{ width: '50px' }}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedTimelines.length === paginatedData.data.length && paginatedData.data.length > 0}
                                  onChange={toggleSelectAll}
                                />
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', minWidth: '140px' }}
                              onClick={() => handleSort("date")}
                            >
                              <div className="d-flex align-items-center">
                                <span className="me-2">📅</span>
                                Date {getSortIcon("date")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', minWidth: '200px' }}
                              onClick={() => handleSort("project")}
                            >
                              <div className="d-flex align-items-center">
                                <span className="me-2">🏢</span>
                                Project {getSortIcon("project")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}
                              onClick={() => handleSort("workers")}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">👷</span>
                                Workers {getSortIcon("workers")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}
                              onClick={() => handleSort("engineers")}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">👨‍💼</span>
                                Engineers {getSortIcon("engineers")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}
                              onClick={() => handleSort("architects")}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">🏗️</span>
                                Architects {getSortIcon("architects")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}
                              onClick={() => handleSort("hours")}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">⏱️</span>
                                Hours {getSortIcon("hours")}
                              </div>
                            </th>
                            <th
                              style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }}
                              onClick={() => handleSort("expenses")}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <span className="me-1">💰</span>
                                Cost {getSortIcon("expenses")}
                              </div>
                            </th>
                            <th style={{ minWidth: '150px' }}>
                              <span className="me-1">📝</span>Notes
                            </th>
                            <th style={{ width: '140px', textAlign: 'center' }}>
                              <span className="me-1">🔧</span>Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(paginatedData.data || []).map(timeline => (
                            <tr
                              key={timeline._id}
                              className={selectedTimelines.includes(timeline._id) ? 'table-active' : ''}
                              style={{ cursor: 'pointer' }}
                              onDoubleClick={() => openDetailModal(timeline)}
                            >
                              <td>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedTimelines.includes(timeline._id)}
                                    onChange={() => toggleTimelineSelection(timeline._id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <strong className="text-primary">
                                    {new Date(timeline.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </strong>
                                  <small className="text-muted">
                                    {new Date(timeline.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <strong className="text-dark">
                                    {timeline.projectDetails?.pname || 'Unknown Project'}
                                  </strong>
                                  <small className="text-muted">
                                    Code: {timeline.pcode}
                                  </small>
                                  <small className="text-muted">
                                    Number: {timeline.projectDetails?.pnumber || 'N/A'}
                                  </small>
                                  <div className="mt-1">
                                    <span className={`badge ${timeline.projectDetails?.pstatus === 'Active' ? 'bg-success' :
                                      timeline.projectDetails?.pstatus === 'Completed' ? 'bg-primary' :
                                        timeline.projectDetails?.pstatus === 'On Hold' ? 'bg-warning' :
                                          'bg-secondary'
                                      } bg-opacity-10 text-dark`}>
                                      {timeline.projectDetails?.pstatus || 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center">
                                <span className={`badge fs-6 ${(timeline.workerCount || 0) > 5 ? 'bg-success' :
                                  (timeline.workerCount || 0) > 2 ? 'bg-warning' : 'bg-light text-dark'
                                  }`}>
                                  {timeline.workerCount || 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`badge fs-6 ${(timeline.tengineerCount || 0) > 3 ? 'bg-info' :
                                  (timeline.tengineerCount || 0) > 1 ? 'bg-primary' : 'bg-light text-dark'
                                  }`}>
                                  {timeline.tengineerCount || 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`badge fs-6 ${(timeline.architectCount || 0) > 2 ? 'bg-danger' :
                                  (timeline.architectCount || 0) > 0 ? 'bg-warning' : 'bg-light text-dark'
                                  }`}>
                                  {timeline.architectCount || 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`badge text-dark fs-6 ${calculateTotalHours(timeline) > 40 ? 'bg-warning' :
                                  calculateTotalHours(timeline) > 20 ? 'bg-info' : 'bg-light'
                                  }`}>
                                  {calculateTotalHours(timeline)}h
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`fw-bold ${calculateTotalCost(timeline) > 10000 ? 'text-danger' :
                                  calculateTotalCost(timeline) > 5000 ? 'text-warning' : 'text-success'
                                  }`}>
                                  ${calculateTotalCost(timeline).toLocaleString()}
                                </span>
                              </td>
                              <td>
                                {timeline.tnotes ? (
                                  <div
                                    className="text-truncate"
                                    style={{ maxWidth: '150px' }}
                                    title={timeline.tnotes}
                                  >
                                    <small>{timeline.tnotes}</small>
                                  </div>
                                ) : (
                                  <span className="text-muted">
                                    <small>No notes</small>
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button
                                    className="btn btn-outline-info btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDetailModal(timeline);
                                    }}
                                    title="View Details"
                                  >
                                    👁️
                                  </button>
                                  <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      exportTimelineToPDF(timeline, `timeline-${timeline.pcode}-${new Date(timeline.date).toISOString().split('T')[0]}.pdf`);
                                    }}
                                    title="Export Timeline"
                                  >
                                    📄
                                  </button>
                                  <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/ptfd/update-project-timeline/${timeline._id}`);
                                    }}
                                    title="Edit Timeline"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(timeline._id);
                                    }}
                                    className="btn btn-outline-danger btn-sm"
                                    title="Delete Timeline"
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

                        <nav aria-label="Timeline pagination">
                          <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                              >
                                ⏮️
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
                                ⏭️
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

        {/* Enhanced Premium Timeline Modal with Correct Field Names */}
        {showDetailModal && selectedTimelineDetail && (
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
                {/* Premium Header with Reddish Gradient */}
                <div
                  className="modal-header border-0 position-relative"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
                    padding: '2rem 2.5rem 1.5rem',
                    color: '#ffffff'
                  }}
                >
                  {/* Background Pattern */}
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
                        background: 'linear-gradient(135deg,rgb(27, 2, 2) 0%, #dc2626 100%)',
                        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)'
                      }}
                    >
                      <i className="fas fa-calendar-check text-white fs-3"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="modal-title fw-bold mb-2 text-white">
                        Timeline Chronicle
                      </h3>
                      <p className="mb-0 text-white-50 fs-5">
                        {new Date(selectedTimelineDetail.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {/*<button
              type="button"
              className="btn-close btn-close-white position-relative"
              style={{
                fontSize: '1.2rem',
                padding: '1rem',
                filter: 'brightness(1.2)'
              }}
              onClick={() => setShowDetailModal(false)}
            ></button>*/}
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
                      Project Code: {selectedTimelineDetail.projectCode || selectedTimelineDetail.pcode}
                    </span>
                  </div>
                </div>

                {/* Premium Body */}
                <div className="modal-body" style={{ padding: '2.5rem' }}>

                  {/* Key Metrics Dashboard */}
                  <div className="row g-4 mb-5">
                    <div className="col-12">
                      <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#1f2937' }}>
                        <i className="fas fa-chart-line me-3 text-danger"></i>
                        Performance Metrics
                      </h5>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                            <i className="fas fa-users text-white fs-4"></i>
                          </div>
                          <h2 className="fw-bold text-black mb-1">{selectedTimelineDetail.workerCount || 0}</h2>
                          <p className="text-black-75 mb-0 fw-medium">Workforce Deployed</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
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
                            <i className="fas fa-hard-hat text-white fs-4"></i>
                          </div>
                          <h2 className="fw-bold text-black mb-1">{selectedTimelineDetail.tengineerCount || 0}</h2>
                          <p className="text-black-75 mb-0 fw-medium">Engineering Team</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
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
                            <i className="fas fa-drafting-compass text-white fs-4"></i>
                          </div>
                          <h2 className="fw-bold text-black mb-1">{selectedTimelineDetail.architectCount || 0}</h2>
                          <p className="text-black-75 mb-0 fw-medium">Design Architects</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #be123c 0%, #9f1239 100%)',
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
                            <i className="fas fa-clock text-white fs-4"></i>
                          </div>
                          <h2 className="fw-bold text-black mb-1">{calculateTotalHours(selectedTimelineDetail)}h</h2>
                          <p className="text-black-75 mb-0 fw-medium">Total Hours</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Information & Cost Analysis */}
                  <div className="row g-4 mb-5">

                    {/* Project Details */}
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
                            <i className="fas fa-building me-3 text-danger"></i>
                            Project Intelligence
                          </h6>

                          <div className="row g-4">
                            <div className="col-md-6">
                              <div className="border-start border-4 border-danger ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Name</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedTimelineDetail.projectDetails?.pname || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-warning ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Code</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedTimelineDetail.projectCode || selectedTimelineDetail.pcode || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-success ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Number</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedTimelineDetail.projectDetails?.pnumber || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-info ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Status</small>
                                <div className="mt-1">
                                  <span
                                    className="badge px-3 py-2 fw-semibold"
                                    style={{
                                      background: selectedTimelineDetail.projectDetails?.pstatus === 'In Progress' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                                        selectedTimelineDetail.projectDetails?.pstatus === 'Completed' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' :
                                          selectedTimelineDetail.projectDetails?.pstatus === 'Planned' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                            'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                      color: '#ffffff',
                                      borderRadius: '50px',
                                      fontSize: '0.85rem'
                                    }}
                                  >
                                    {selectedTimelineDetail.projectDetails?.pstatus || 'Unknown'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-primary ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Location</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedTimelineDetail.projectDetails?.plocation || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-secondary ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Project Owner</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedTimelineDetail.projectDetails?.powner || 'N/A'}
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
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
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
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
                            }}
                          >
                            <i className="fas fa-dollar-sign text-white fs-3"></i>
                          </div>
                          <h6 className="fw-bold mb-3 text-black-75">Daily Investment</h6>
                          <h2 className="fw-bold text-black mb-2">
                            ${calculateTotalCost(selectedTimelineDetail).toLocaleString()}
                          </h2>
                          <p className="text-black-50 mb-0 small">
                            Resource allocation for this timeline entry
                          </p>

                          {/* Cost Breakdown */}
                          <div className="mt-3 pt-3 border-top border-white border-opacity-25">
                            <div className="row text-center">
                              <div className="col-6">
                                <small className="text-black-75 d-block">Materials</small>
                                <strong className="text-black">
                                  ${(selectedTimelineDetail.tmaterials?.reduce((sum, mat) => sum + (parseFloat(mat.cost) || 0), 0) || 0).toLocaleString()}
                                </strong>
                              </div>
                              <div className="col-6">
                                <small className="text-black-75 d-block">Expenses</small>
                                <strong className="text-black">
                                  ${(selectedTimelineDetail.texpenses?.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0) || 0).toLocaleString()}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Details Section */}
                  <div className="row g-4 mb-5">
                    <div className="col-12">
                      <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#1f2937' }}>
                        <i className="fas fa-users me-3 text-danger"></i>
                        Team Composition
                      </h5>
                    </div>

                    {/* Workers Section */}
                    {selectedTimelineDetail.tworker && selectedTimelineDetail.tworker.length > 0 && (
                      <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                          <div className="card-header bg-danger text-white border-0" style={{ borderRadius: '16px 16px 0 0' }}>
                            <h6 className="mb-0 fw-bold">Workers ({selectedTimelineDetail.tworker.length})</h6>
                          </div>
                          <div className="card-body p-3">
                            {selectedTimelineDetail.tworker.slice(0, 3).map((worker, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <div>
                                  <p className="mb-0 fw-semibold">{worker.name}</p>
                                  <small className="text-muted">{worker.role}</small>
                                </div>
                                <span className="badge bg-light text-dark">{worker.hoursWorked || 0}h</span>
                              </div>
                            ))}
                            {selectedTimelineDetail.tworker.length > 3 && (
                              <small className="text-muted">+{selectedTimelineDetail.tworker.length - 3} more workers</small>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Engineers Section */}
                    {selectedTimelineDetail.tengineer && selectedTimelineDetail.tengineer.length > 0 && (
                      <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                          <div className="card-header bg-warning text-dark border-0" style={{ borderRadius: '16px 16px 0 0' }}>
                            <h6 className="mb-0 fw-bold">Engineers ({selectedTimelineDetail.tengineer.length})</h6>
                          </div>
                          <div className="card-body p-3">
                            {selectedTimelineDetail.tengineer.slice(0, 3).map((engineer, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <div>
                                  <p className="mb-0 fw-semibold">{engineer.name}</p>
                                  <small className="text-muted">{engineer.specialty}</small>
                                </div>
                                <span className="badge bg-light text-dark">{engineer.hoursWorked || 0}h</span>
                              </div>
                            ))}
                            {selectedTimelineDetail.tengineer.length > 3 && (
                              <small className="text-muted">+{selectedTimelineDetail.tengineer.length - 3} more engineers</small>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Architects Section */}
                    {selectedTimelineDetail.tarchitect && selectedTimelineDetail.tarchitect.length > 0 && (
                      <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                          <div className="card-header bg-success text-white border-0" style={{ borderRadius: '16px 16px 0 0' }}>
                            <h6 className="mb-0 fw-bold">Architects ({selectedTimelineDetail.tarchitect.length})</h6>
                          </div>
                          <div className="card-body p-3">
                            {selectedTimelineDetail.tarchitect.slice(0, 3).map((architect, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <div>
                                  <p className="mb-0 fw-semibold">{architect.name}</p>
                                  <small className="text-muted">{architect.specialty}</small>
                                </div>
                                <span className="badge bg-light text-dark">{architect.hoursWorked || 0}h</span>
                              </div>
                            ))}
                            {selectedTimelineDetail.tarchitect.length > 3 && (
                              <small className="text-muted">+{selectedTimelineDetail.tarchitect.length - 3} more architects</small>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes Section - Enhanced */}
                  {selectedTimelineDetail.tnotes && (
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
                          <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#b91c1c' }}>
                            <i className="fas fa-sticky-note me-3"></i>
                            Site Chronicle & Observations
                          </h6>
                          <div
                            className="p-4 rounded-3"
                            style={{
                              background: 'rgba(255, 255, 255, 0.7)',
                              border: '1px solid rgba(239, 68, 68, 0.1)',
                              fontStyle: 'italic',
                              lineHeight: '1.6'
                            }}
                          >
                            <p className="mb-0" style={{ color: '#7f1d1d' }}>
                              "{selectedTimelineDetail.tnotes}"
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
                    <i className="fas fa-calendar me-2"></i>
                    Created: {new Date(selectedTimelineDetail.createdAt || Date.now()).toLocaleDateString()}
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
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 1)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                      onClick={() => setShowDetailModal(false)}
                    >
                      <i className="fas fa-times me-2"></i>
                      Close
                    </button>

                    <button
                      type="button"
                      className="btn rounded-pill px-4 py-2 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
                      }}
                      onClick={() => {
                        setShowDetailModal(false);
                        navigate(`/ptfd/update-project-timeline/${selectedTimelineDetail._id}`);
                      }}
                    >
                      <i className="fas fa-edit me-2"></i>
                      Edit Timeline
                    </button>

                    <button
                      type="button"
                      className="btn rounded-pill px-4 py-2 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                        transition: 'all 0.3s ease',
                        marginLeft: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                      }}
                      onClick={() => {
                        setShowDetailModal(false);
                        navigate(`/ptfd/project-timelines-view/${selectedTimelineDetail._id}`);
                      }}
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      See More
                    </button>
                  </div>
                </div>

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
                    💡 <strong>Tips:</strong> Double-click rows for quick details • Use filters for precise searches •
                    Export data for external analysis
                  </small>
                </p>
              </div>
              <div className="col-md-6 text-end">
                <div className="d-flex justify-content-end gap-2">
                  <span className="badge bg-primary">
                    {paginatedData.totalItems} Total Records
                  </span>
                  <span className="badge bg-success">
                    {uniqueProjects.length} Projects
                  </span>
                  <span className="badge bg-info">
                    ${timelines.reduce((sum, t) => sum + calculateTotalCost(t), 0).toLocaleString()} Total Value
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
                <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '2rem 2.5rem 1.5rem', color: '#ffffff', borderRadius: '32px 32px 0 0' }}>
                  <div className="d-flex align-items-center">
                    <div className="me-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.2)' }}>
                      <BsBarChart className="text-white fs-3" />
                    </div>
                    <div>
                      <h3 className="modal-title fw-bold mb-2 text-white">Timeline & Financial Intelligence</h3>
                      <p className="mb-0 text-white opacity-75 fs-5">Comprehensive project insights and analytics</p>
                    </div>
                  </div>
                </div>
                <div className="modal-body" style={{ padding: '2.5rem' }}>
                  {loadingAnalytics ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading analytics data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="row g-4 mb-4">
                        <div className="col-lg-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <BsGraphUpArrow className="text-white fs-1 mb-3" />
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
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            <BsCurrencyDollar className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {analyticsData.length > 0 ? 
                                '$' + Math.round(analyticsData.reduce((sum, item) => sum + item.timelineCost, 0) / 1000) + 'K'
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
                              {analyticsData.reduce((sum, item) => sum + item.totalStaff, 0)}
                            </h2>
                            <p className="text-white opacity-75 mb-0">Total Workers</p>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <BsClock className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {analyticsData.length > 0 ? 
                                Math.round(analyticsData.reduce((sum, item) => sum + item.productivity, 0) / analyticsData.length)
                                : '0'
                              }
                            </h2>
                            <p className="text-white opacity-75 mb-0">Productivity</p>
                          </div>
                        </div>
                      </div>

                      <div className="row g-4">
                        <div className="col-lg-8">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-header border-0" style={{ background: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Timeline Intelligence</h6>
                              <small className="text-muted">Project timelines with financial integration</small>
                            </div>
                            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                              {analyticsData.length === 0 ? (
                                <div className="text-center py-4">
                                  <BsCalendar size={48} className="text-muted mb-3" />
                                  <h5 className="text-muted">No analytics data found</h5>
                                  <p className="text-muted">No timeline data with financial integration available.</p>
                                </div>
                              ) : (
                                analyticsData.map((item, idx) => {
                                  const efficiencyColor = item.efficiency >= 85 ? 'success' : 
                                                          item.efficiency >= 70 ? 'warning' : 'danger';
                                  const activityColor = item.activityLevel === 'High' ? 'danger' : 
                                                       item.activityLevel === 'Medium' ? 'warning' : 'success';
                                  
                                  return (
                                    <div key={item._id || idx} className="d-flex align-items-center mb-3 p-3 rounded hover-bg-light" style={{ transition: 'background-color 0.2s', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                      <div className="position-relative me-3">
                                        <div 
                                          className={`bg-danger rounded-circle d-flex align-items-center justify-content-center`} 
                                          style={{ width: '48px', height: '48px' }}
                                        >
                                          <BsCalendar className="text-white" />
                                        </div>
                                        <div 
                                          className="position-absolute bottom-0 end-0 bg-white rounded-circle d-flex align-items-center justify-content-center"
                                          style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                        >
                                          {item.activityLevel === 'High' ? '🔥' : 
                                           item.activityLevel === 'Medium' ? '⚡' : '📈'}
                                        </div>
                                      </div>
                                      <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                          <div>
                                            <span className="fw-semibold">{item.projectDetails?.pname || item.pcode || 'Unknown Timeline'}</span>
                                            <small className="text-muted ms-2">({formatDate(item.date)})</small>
                                          </div>
                                          <div className="d-flex gap-2">
                                            <span className={`badge bg-${efficiencyColor}`}>{Math.round(item.efficiency)}% eff</span>
                                            <small className="badge bg-secondary">{item.totalStaff} staff</small>
                                          </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-1">
                                          <small className="text-muted me-2">💰 ${item.timelineCost.toLocaleString()} timeline cost</small>
                                          <small className="text-muted">📈 ${item.financialValue.toLocaleString()} financial value</small>
                                        </div>
                                        <div className="progress" style={{ height: '6px' }}>
                                          <div className={`progress-bar bg-${activityColor}`} style={{ width: `${Math.min(item.totalStaff * 5, 100)}%` }}></div>
                                        </div>
                                        <small className="text-muted">Activity: {item.activityLevel} • Risk: {item.riskLevel} • Hours: {item.timelineHours}</small>
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
                                    <strong>🎯 Resource Optimization!</strong> Staff allocation insights generated.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                  `;
                                  document.body.appendChild(alert);
                                  setTimeout(() => alert.remove(), 4000);
                                }}
                              >
                                <BsPeople className="me-2" />Optimize Resources
                              </button>
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/ptfd/financial-dashboard')}
                              >
                                <BsCurrencyDollar className="me-2" />View Financial
                              </button>
                              <button 
                                className="btn btn-outline-warning"
                                onClick={() => {
                                  const alert = document.createElement('div');
                                  alert.className = 'alert alert-warning alert-dismissible fade show position-fixed';
                                  alert.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
                                  alert.innerHTML = `
                                    <strong>🛡️ Risk Analysis!</strong> Identifying potential project risks and mitigation strategies.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                  `;
                                  document.body.appendChild(alert);
                                  setTimeout(() => alert.remove(), 4000);
                                }}
                              >
                                <BsStopwatch className="me-2" />Risk Analysis
                              </button>
                              <button 
                                className="btn btn-outline-info"
                                onClick={fetchAnalyticsData}
                                disabled={loadingAnalytics}
                              >
                                <BsActivity className="me-2" />
                                {loadingAnalytics ? 'Refreshing...' : 'Refresh Data'}
                              </button>
                            </div>
                            
                            {/* Analytics Summary */}
                            {analyticsData.length > 0 && (
                              <div className="card-footer border-0 bg-light">
                                <h6 className="fw-bold mb-2">Intelligence Summary</h6>
                                <div className="row text-center">
                                  <div className="col-6">
                                    <small className="text-muted d-block">Timelines</small>
                                    <strong>{analyticsData.length}</strong>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">Total Hours</small>
                                    <strong>
                                      {analyticsData.reduce((sum, item) => sum + item.timelineHours, 0).toLocaleString()}h
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
                      className="btn btn-danger rounded-pill px-4" 
                      style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', border: 'none', color: '#fff' }}
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," + 
                          "Project,Date,Total Staff,Timeline Cost,Financial Value,Efficiency,Activity Level,Risk Level,Hours\n" +
                          analyticsData.map(item => 
                            `"${item.projectDetails?.pname || item.pcode || 'Unknown'}","${formatDate(item.date)}",${item.totalStaff},${item.timelineCost},${item.financialValue},${Math.round(item.efficiency)},"${item.activityLevel}","${item.riskLevel}",${item.timelineHours}`
                          ).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `timeline-analytics-${new Date().toISOString().split('T')[0]}.csv`);
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