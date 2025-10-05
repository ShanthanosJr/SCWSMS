import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
//import Nav from '../Nav/Nav';
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
  BsActivity,
  BsReverseListColumnsReverse,
  BsClock,
  BsShield,
  BsLightning,
  BsFire,
  BsStopwatch,
  BsGear,
  BsPersonCheck,
  BsBellFill,
  BsClipboardData,
  BsTrophyFill,
  BsStarFill,
  BsHeartFill,
  BsChatDots,
  BsBarChartFill,
  BsGraphUpArrow,
  BsBullseye,
  BsShieldCheck,
  BsTools,
  BsChatRight,
  BsBricks
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
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  //const [notificationTime, setNotificationTime] = useState('');
  // const [currentTimer] = useState(0); // Removed unused variable

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'initial-1',
      type: 'system',
      title: 'System Initialized',
      message: 'Projects Nexus dashboard is ready for construction management',
      timestamp: new Date(),
      icon: '🏢',
      read: false
    }
  ]);
  const notifRef = useRef();

  // Calculate unread notification count
  const notificationCount = notifications.filter(n => !n.read).length;

  // Team modal states
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const previousProjectCount = projects.length;
      const data = await fetchHandlers();
      if (!mounted) return;
      
      // Check for new projects
      if (previousProjectCount > 0 && data.length > previousProjectCount) {
        const newProjectsCount = data.length - previousProjectCount;
        addNotification(
          'addition', 
          `New Project${newProjectsCount > 1 ? 's' : ''} Added`, 
          `${newProjectsCount} new project${newProjectsCount > 1 ? 's have' : ' has'} been created`, 
          '🏢'
        );
      }
      
      setProjects(data || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [projects.length]);

  // Fetch team members from ProfileDashboard API
  const fetchTeamMembers = async () => {
    try {
      setLoadingTeam(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setTeamMembers([]);
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get('http://localhost:5050/api/users', config);
      const users = Array.isArray(response.data) ? response.data : [];
      
      // Filter active users and add performance metrics
      const activeUsers = users
        .filter(user => (user.status || 'Active') === 'Active')
        .map(user => ({
          ...user,
          // Generate mock performance metrics based on user data
          performance: Math.floor(Math.random() * 20) + 80, // 80-99%
          dailyHours: (Math.random() * 2 + 7).toFixed(1), // 7.0-9.0 hours
          efficiency: Math.floor(Math.random() * 15) + 85, // 85-99%
          safetyScore: Math.floor(Math.random() * 5) + 95 // 95-99%
        }))
        .slice(0, 12); // Limit to 12 team members
      
      setTeamMembers(activeUsers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    } finally {
      setLoadingTeam(false);
    }
  };

  // Fetch team members when team modal is opened
  const handleShowTeamModal = () => {
    setShowTeamModal(true);
    fetchTeamMembers();
  };

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

  // Auto-refresh projects every 30 seconds to catch new additions/updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newProjects = await fetchHandlers();
        
        // Check for new projects by comparing IDs
        const currentProjectIds = projects.map(p => p._id);
        const addedProjects = newProjects.filter(p => !currentProjectIds.includes(p._id));
        
        if (addedProjects.length > 0) {
          addedProjects.forEach(project => {
            addNotification(
              'addition',
              'New Project Added',
              `${project.pname} has been created`,
              '🏢'
            );
          });
          setProjects(newProjects);
        }
      } catch (error) {
        console.error('Error refreshing projects:', error);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [projects]);

  // Function to open project detail modal
  const openProjectDetailModal = (project) => {
    setSelectedProjectDetail(project);
    setShowDetailModal(true);
    
    // Add project view notification
    addNotification(
      'view',
      'Project Viewed',
      `${project.pname} details were accessed`,
      '👁️'
    );
  };

  // Function for project updates (can be called when projects are edited)
  // eslint-disable-next-line no-unused-vars
  const handleProjectUpdate = (project) => {
    addNotification(
      'update',
      'Project Updated',
      `${project.pname} has been modified`,
      '⚙️'
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        // Get project name before deletion for notification
        const projectToDelete = projects.find(p => p._id === id);
        const projectName = projectToDelete?.pname || 'Unknown Project';
        
        await axios.delete(`http://localhost:5050/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p._id !== id));
        
        // Add deletion notification
        addNotification(
          'deletion',
          'Project Deleted',
          `${projectName} has been removed from the system`,
          '🗑️'
        );
        
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        alert.innerHTML = `
          <strong>✅ Success!</strong> Project "${projectName}" deleted successfully.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => {
          if (alert.parentNode) {
            alert.remove();
          }
        }, 3000);
      } catch (error) {
        console.error("Error deleting project:", error);
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        errorAlert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        errorAlert.innerHTML = `
          <strong>❌ Error!</strong> Error deleting project. Please try again.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(errorAlert);
        setTimeout(() => {
          if (errorAlert.parentNode) {
            errorAlert.remove();
          }
        }, 5000);
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
    if (!projects || projects.length === 0) {
      return [];
    }

    let filtered = projects.filter(project => {
      if (!project) return false;

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
      if (!a || !b) return 0;

      let aVal, bVal;

      switch (sortField) {
        case "pcreatedat":
          aVal = a.pcreatedat ? new Date(a.pcreatedat) : new Date(0);
          bVal = b.pcreatedat ? new Date(b.pcreatedat) : new Date(0);
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
          aVal = a.penddate ? new Date(a.penddate) : new Date(0);
          bVal = b.penddate ? new Date(b.penddate) : new Date(0);
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

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const cleanNumber = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
    }
    return 0;
  };


  // Calculate statistics
  const statistics = useMemo(() => {
    // Add null checks for projects array
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        totalBudget: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalIssues: 0,
        overdueProjects: 0,
        avgBudget: 0
      };
    }

    const totalBudget = projects.reduce((sum, p) => sum + cleanNumber(p?.pbudget), 0);
    const activeProjects = projects.filter(p => p?.pstatus === "In Progress").length;
    const completedProjects = projects.filter(p => p?.pstatus === "Completed").length;
    const totalIssues = projects.reduce((sum, p) => sum + (p?.pissues?.length || 0), 0);
    const overdueProjects = projects.filter(p => {
      if (!p?.penddate || !p?.pstatus) return false;
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
    // Add null checks for projects array
    if (!projects || projects.length === 0) {
      return {
        statusData: [],
        budgetData: [],
        progressData: []
      };
    }

    // Status distribution for pie chart
    const statusCounts = projects.reduce((acc, project) => {
      if (!project) return acc;
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
      if (!project) return acc;
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
      if (!project || !project.pcreatedat) return acc;

      const createdDate = new Date(project.pcreatedat);
      // Check if date is valid
      if (isNaN(createdDate.getTime())) return acc;

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
       {/* <Nav /> */}
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
     {/* <Nav /> */} 
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

        {/* Premium Projects Dashboard-Style Header */}
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
                background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
               // border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 8px 25px rgba(30, 132, 73, 0.4), 0 4px 12px rgba(30, 132, 73, 0.2)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(30, 132, 73, 0.6), 0 6px 16px rgba(30, 132, 73, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 132, 73, 0.4), 0 4px 12px rgba(30, 132, 73, 0.2)';
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
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
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
                  border: '1px solid rgba(30, 132, 73, 0.1)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(30, 132, 73, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
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
                    borderBottom: '1px solid rgba(30, 132, 73, 0.1)',
                    background: 'linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="mb-0 fw-bold" style={{ color: '#15803d', fontSize: '1.1rem' }}>
                      Project Notifications
                    </h6>
                    <div className="d-flex align-items-center gap-2">
                      <span 
                        style={{ 
                          fontSize: '0.8rem', 
                          color: '#1e8449',
                          fontWeight: '600',
                          background: 'rgba(30, 132, 73, 0.1)',
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
                            color: '#1e8449',
                            background: 'transparent',
                            border: '1px solid rgba(30, 132, 73, 0.3)',
                            borderRadius: '12px',
                            padding: '0.2rem 0.6rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(30, 132, 73, 0.1)';
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
                          case 'addition': return 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)';
                          case 'view': return 'linear-gradient(135deg, #16a085 0%, #2ecc71 100%)';
                          case 'update': return 'linear-gradient(135deg, #f39c12 0%, #f1c40f 100%)';
                          case 'deletion': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                          case 'system': return 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
                          default: return 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
                        }
                      };

                      return (
                        <div 
                          key={notification.id}
                          style={{ 
                            padding: '1.5rem 2rem',
                            borderBottom: notifications.indexOf(notification) === notifications.length - 1 ? 'none' : '1px solid rgba(30, 132, 73, 0.05)',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                            background: notification.read ? 'transparent' : 'rgba(30, 132, 73, 0.02)',
                            borderLeft: notification.read ? 'none' : '3px solid #1e8449'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f0fff4'}
                          onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(30, 132, 73, 0.02)'}
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
                              boxShadow: '0 4px 12px rgba(30, 132, 73, 0.3)',
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
                    boxShadow: '0 10px 30px rgba(30, 132, 73, 0.3)',
                    border: '3px solid rgba(30, 132, 73, 0.2)',
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
                    <BsCalendar className="me-2" />View Timelines
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
                    <BsReverseListColumnsReverse className="me-2" />View Requests
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
                <h3 className="fw-bold mb-1">${(statistics.totalBudget / 1000).toFixed(1)}M</h3>
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
            {/* Team Performance Dashboard */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-body px-4 pt-3 pb-4"><br></br>
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }}>
                        <BsPeople className="text-white fs-1" />
                      </div>
                      <span className="position-absolute top-0 end-0 badge bg-primary rounded-pill">24</span>
                    </div>
                    <h4 className="mt-3 mb-1 fw-bold" style={{ color: '#2c3e50' }}>Team Performance</h4>
                    <p className="text-muted mb-0">Comprehensive workforce analytics</p>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-4">
                      <div className="p-3 rounded-lg text-center" style={{ background: '#e8f5e9', border: '1px solid #e3effa' }}>
                        <BsPersonCheck className="text-primary fs-3 mb-2" />
                        <h5 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>24</h5>
                        <small className="text-muted">Active</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 rounded-lg text-center" style={{ background: '#fffaf0', border: '1px solid #feebc8' }}>
                        <BsClock className="text-warning fs-3 mb-2" />
                        <h5 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>3</h5>
                        <small className="text-muted">On Break</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 rounded-lg text-center" style={{ background: '#fff5f5', border: '1px solid #fee2e2' }}>
                        <BsShield className="text-danger fs-3 mb-2" />
                        <h5 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>2</h5>
                        <small className="text-muted">Issues</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-dark">Overall Efficiency</span>
                      <span className="badge bg-primary-subtle text-primary">94%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e9ecef' }}>
                      <div className="progress-bar bg-primary" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-dark">Task Completion Rate</span>
                      <span className="badge bg-success-subtle text-success">88%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e9ecef' }}>
                      <div className="progress-bar bg-success" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-dark">Safety Compliance</span>
                      <span className="badge bg-warning-subtle text-warning">91%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e9ecef' }}>
                      <div className="progress-bar bg-warning" style={{ width: '91%' }}></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-dark">Goal Achievement</span>
                      <span className="badge bg-info-subtle text-info">76%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e9ecef' }}>
                      <div className="progress-bar bg-info" style={{ width: '76%' }}></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-dark">Resource Utilization</span>
                      <span className="badge bg-danger-subtle text-danger">87%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e9ecef' }}>
                      <div className="progress-bar bg-danger" style={{ width: '87%' }}></div>
                    </div>
                  </div><br></br>
                  {/*<div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-dark">Tools Utilization</span>
                      <span className="badge bg-success-subtle text-success">95%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e9ecef' }}>
                      <div className="progress-bar bg-success" style={{ width: '95%' }}></div>
                    </div>
                  </div>*/}

                  <button
                    className="btn btn-primary w-100 rounded-pill"
                    onClick={handleShowTeamModal}
                    style={{ background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)', border: 'none' }}
                  >
                    <BsPeople className="me-2" />View Team Details
                  </button>
                </div>
              </div>
            </div>

            {/* Project Progress */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-header border-0 bg-transparent pb-0 pt-4 px-4">
                </div>
                <div className="card-body px-4 pt-3 pb-4">
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }}>
                        <BsGraphUp className="text-white fs-1" />
                      </div>
                      <span className="position-absolute top-0 end-0 badge bg-primary rounded-pill">{statistics.completedProjects}</span>
                    </div>
                    <h4 className="mt-3 mb-1 fw-bold" style={{ color: '#2c3e50' }}>Project Progress</h4>
                    <p className="text-muted mb-0">Status of ongoing initiatives</p>
                  </div>

                  {filteredProjects.slice(0, 4).map((project, index) => (
                    <div key={project._id} className="mb-4 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <h6 className="mb-1 fw-semibold" style={{ color: '#2c3e50' }}>{project.pname}</h6>
                          <small className="text-muted">{project.plocation}</small>
                        </div>
                        <div className="text-end">
                          <small className="fw-bold" style={{ color: '#2c3e50' }}>
                            {project.pstatus === 'Completed' ? '100%' :
                              project.pstatus === 'In Progress' ? '65%' :
                                project.pstatus === 'On Hold' ? '35%' : '0%'}
                          </small>
                        </div>
                      </div>
                      <div className="progress mb-2" style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e9ecef' }}>
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
                        <span className="badge bg-secondary-subtle text-secondary">{project.ptype}</span>
                        <span className={`badge bg-${getStatusColor(project.pstatus)}-subtle text-${getStatusColor(project.pstatus)}`}>
                          {project.pstatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Analytics Hub */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-header border-0 bg-transparent pb-0 pt-4 px-4">
                </div>
                <div className="card-body px-4 pt-3 pb-4">
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }}>
                        <BsTrophyFill className="text-white fs-1" />
                      </div>
                      <span className="position-absolute top-0 end-0 badge bg-primary rounded-pill">A+</span>
                    </div>
                    <h4 className="mt-3 mb-1 fw-bold" style={{ color: '#2c3e50' }}>Project Health Score</h4>
                    <p className="text-muted mb-0">Superior operational metrics</p>
                  </div>
                  {/* Row 1 */}
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded-lg p-3 text-center" style={{ border: '1px solid #e9ecef' }}>
                        <BsGraphUpArrow className="text-success fs-3 mb-2" />
                        <div className="fw-bold" style={{ color: '#2c3e50' }}>+12%</div>
                        <small className="text-muted">Efficiency</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-lg p-3 text-center" style={{ border: '1px solid #e9ecef' }}>
                        <BsBullseye className="text-primary fs-3 mb-2" />
                        <div className="fw-bold" style={{ color: '#2c3e50' }}>98%</div>
                        <small className="text-muted">On-Target</small>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded-lg p-3 text-center" style={{ border: '1px solid #e9ecef' }}>
                        <BsShieldCheck className="text-warning fs-3 mb-2" />
                        <div className="fw-bold" style={{ color: '#2c3e50' }}>92%</div>
                        <small className="text-muted">Safety</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-lg p-3 text-center" style={{ border: '1px solid #e9ecef' }}>
                        <BsTools className="text-danger fs-3 mb-2" />
                        <div className="fw-bold" style={{ color: '#2c3e50' }}>95%</div>
                        <small className="text-muted">Tool Utilization</small>
                      </div>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded-lg p-3 text-center" style={{ border: '1px solid #e9ecef' }}>
                        <BsChatRight className="text-warning fs-3 mb-2" />
                        <div className="fw-bold" style={{ color: '#2c3e50' }}>92%</div>
                        <small className="text-muted">Quality Control</small>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="bg-light rounded-lg p-3 text-center" style={{ border: '1px solid #e9ecef' }}>
                        <BsBricks className="text-danger fs-3 mb-2" />
                        <div className="fw-bold" style={{ color: '#2c3e50' }}>95%</div>
                        <small className="text-muted">Equipment Efficiency</small>
                      </div>
                    </div>
                  </div><br></br>
                  <button
                    className="btn btn-primary w-100 rounded-pill"
                    onClick={() => setShowAnalyticsModal(true)}
                    style={{ background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)', border: 'none' }}
                  >
                    <BsClipboardData className="me-2" />View Full Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Time Tracker & Notifications */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-header border-0 bg-transparent pb-0 pt-4 px-4">
                </div>
                <div className="card-body px-4 pt-3 pb-4">
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }}>
                        <BsStopwatch className="text-white fs-1" />
                      </div>
                      <span className="position-absolute top-0 end-0 badge bg-primary rounded-pill">ON</span>
                    </div>
                    <h4 className="mt-3 mb-1 fw-bold" style={{ color: '#2c3e50' }}>Project Time Management</h4>
                    <p className="text-muted mb-0">Real-time tracking and alerts</p>
                  </div>

                  <div className="row g-3 mb-4">
                    {/* Daily Work Time */}
                    <div className="col-md-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#f3e5f5', border: '1px solid #e1bee7' }}>
                        <BsClock className="fs-2 mb-2" style={{ color: '#9b59b6' }} />
                        <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>
                          {Math.floor(12)}h {Math.floor(50)}m
                        </h3>
                        <small className="text-muted">Daily Work Time</small>
                      </div>
                    </div>

                    {/* Productivity Index */}
                    <div className="col-md-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#e8f5e9', border: '1px solid #c8e6c9' }}>
                        <BsLightning className="fs-2 mb-2 text-success" />
                        <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>127%</h3>
                        <small className="text-muted">Productivity Index</small>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    {/* Attendance Rate */}
                    <div className="col-md-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#e3f2fd', border: '1px solid #bbdefb' }}>
                        <BsPersonCheck className="fs-2 mb-2" style={{ color: '#2980b9' }} />
                        <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>93%</h3>
                        <small className="text-muted">Attendance Rate</small>
                      </div>
                    </div>

                    {/* Task Completion */}
                    <div className="col-md-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#fff3e0', border: '1px solid #ffe0b2' }}>
                        <BsCheckCircle className="fs-2 mb-2" style={{ color: '#e67e22' }} />
                        <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>89%</h3>
                        <small className="text-muted">Task Completion</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Activity Feed */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-header border-0 bg-transparent pb-0 pt-4 px-4">
                </div>
                <div className="card-body px-4 pt-3 pb-4">
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }}>
                        <BsChatDots className="text-white fs-1" />
                      </div>
                      <span className="position-absolute top-0 end-0 badge bg-primary rounded-pill">5</span>
                    </div>
                    <h4 className="mt-3 mb-1 fw-bold" style={{ color: '#2c3e50' }}>Activity Center</h4>
                    <p className="text-muted mb-0">Recent updates and communications</p>
                  </div>

                  <div className="activity-feed">
                    <div className="d-flex mb-3 pb-3 border-bottom">
                      <div className="flex-shrink-0">
                        <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                          <BsCheckCircle className="text-success" size={18} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1 fw-semibold" style={{ color: '#2c3e50' }}>Foundation inspection completed</p>
                            <small className="text-muted">Downtown Office • 2h ago</small>
                          </div>
                          <span className="badge bg-success-subtle text-success">High</span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex mb-3 pb-3 border-bottom">
                      <div className="flex-shrink-0">
                        <div className="bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                          <BsExclamationTriangle className="text-warning" size={18} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1 fw-semibold" style={{ color: '#2c3e50' }}>Weather delay reported</p>
                            <small className="text-muted">Residential Tower • 4h ago</small>
                          </div>
                          <span className="badge bg-warning-subtle text-warning">Medium</span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex mb-3 pb-3 border-bottom">
                      <div className="flex-shrink-0">
                        <div className="bg-info-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                          <BsPeople className="text-info" size={18} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1 fw-semibold" style={{ color: '#2c3e50' }}>New team member assigned</p>
                            <small className="text-muted">Shopping Center • 6h ago</small>
                          </div>
                          <span className="badge bg-info-subtle text-info">Info</span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex mb-3">
                      <div className="flex-shrink-0">
                        <div className="bg-secondary-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                          <BsFire className="text-secondary" size={18} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1 fw-semibold" style={{ color: '#2c3e50' }}>Emergency drill completed</p>
                            <small className="text-muted">All Sites • 2d ago</small>
                          </div>
                          <span className="badge bg-secondary-subtle text-secondary">Low</span>
                        </div>
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
            {/* Premium KPI Dashboard */}
            <div className="col-12">
              <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-header border-0 bg-transparent pb-0 pt-4 px-4">
                  <h5 className="mb-1 fw-bold" style={{ color: '#2c3e50' }}>
                    <BsBarChartFill className="me-2" style={{ color: '#3498db' }} />
                    Executive Dashboard
                  </h5>
                  <small className="text-muted">Key performance indicators</small>
                </div>
                <div className="card-body px-4 pt-3 pb-4">
                  <div className="row g-4">
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#f1f8fd', border: '1px solid #e3effa' }}>
                        <BsGraphUpArrow className="text-primary fs-1 mb-3" />
                        <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>+18%</h4>
                        <small className="text-muted">ROI Growth</small>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#e8f5e9', border: '1px solid #c8e6c9' }}>
                        <BsTrophyFill className="text-success fs-1 mb-3" />
                        <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>94.5%</h4>
                        <small className="text-muted">Quality Score</small>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#fffaf0', border: '1px solid #feebc8' }}>
                        <BsStopwatch className="text-warning fs-1 mb-3" />
                        <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>127%</h4>
                        <small className="text-muted">Efficiency</small>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#fff5f5', border: '1px solid #fee2e2' }}>
                        <BsShield className="text-danger fs-1 mb-3" />
                        <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>99.2%</h4>
                        <small className="text-muted">Safety Rate</small>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#f3e5f5', border: '1px solid #e1bee7' }}>
                        <BsHeartFill className="text-purple fs-1 mb-3" style={{ color: '#9b59b6' }} />
                        <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>8.9/10</h4>
                        <small className="text-muted">Satisfaction</small>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="text-center p-3 rounded-lg" style={{ background: '#e0f7fa', border: '1px solid #b2ebf2' }}>
                        <BsBullseye className="text-info fs-1 mb-3" />
                        <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>87%</h4>
                        <small className="text-muted">On-Target</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Distribution Chart */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-header border-0 bg-transparent pb-0 pt-4 px-4">
                  <h5 className="mb-1 fw-bold" style={{ color: '#2c3e50' }}>
                    <BsPieChart className="me-2" style={{ color: '#2ecc71' }} />
                    Status Distribution
                  </h5>
                  <small className="text-muted">Project portfolio overview</small>
                </div>
                <div className="card-body px-4 pt-3 pb-4">
                  <div className="chart-container" style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
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
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-header border-0 bg-transparent pb-0 pt-4 px-4">
                  <h5 className="mb-1 fw-bold" style={{ color: '#2c3e50' }}>
                    <BsBarChart className="me-2" style={{ color: '#e67e22' }} />
                    Budget by Type
                  </h5>
                  <small className="text-muted">Allocation across categories</small>
                </div>
                <div className="card-body px-4 pt-3 pb-4">
                  <div className="chart-container" style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.budgetData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                        <XAxis dataKey="type" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip formatter={(value) => [`$${(value / 1000).toFixed(0)}K`, 'Total Budget']} contentStyle={{ background: '#ffffff', border: '1px solid #dee2e6', borderRadius: '8px' }} />
                        <Bar dataKey="totalBudget" fill="#667eea" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Progress Chart */}
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="card-header border-0 bg-transparent pb-0 pt-4 px-4">
                  <h5 className="mb-1 fw-bold" style={{ color: '#2c3e50' }}>
                    <BsGraphUp className="me-2" style={{ color: '#9b59b6' }} />
                    Monthly Progress
                  </h5>
                  <small className="text-muted">Creation and completion trends</small>
                </div>
                <div className="card-body px-4 pt-3 pb-4">
                  <div className="chart-container" style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={chartData.progressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #dee2e6', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="created" stackId="1" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="completed" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
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

        {/* Project Detail Modal */}
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

        {/* Advanced Team Performance Modal */}
        {showTeamModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1055 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content border-0 shadow-2xl" style={{ borderRadius: '32px', background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)' }}>
                <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '2rem 2.5rem 1.5rem', color: '#ffffff', borderRadius: '32px 32px 0 0' }}>
                  <div className="d-flex align-items-center">
                    <div className="me-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.2)' }}>
                      <BsPeople className="text-white fs-3" />
                    </div>
                    <div>
                      <h3 className="modal-title fw-bold mb-2 text-white">Team Performance Analytics</h3>
                      <p className="mb-0 text-white opacity-75 fs-5">Real-time administrator workforce dashboard</p>
                    </div>
                  </div>
                </div>
                <div className="modal-body" style={{ padding: '2.5rem' }}>
                  {loadingTeam ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading team data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="row g-4 mb-4">
                        <div className="col-md-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <BsPersonCheck className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">{teamMembers.length}</h2>
                            <p className="text-white opacity-75 mb-0">Active Admins</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}>
                            <BsStopwatch className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {teamMembers.length > 0 ? 
                                (teamMembers.reduce((sum, member) => sum + parseFloat(member.dailyHours), 0) / teamMembers.length).toFixed(1) + 'h' 
                                : '0h'
                              }
                            </h2>
                            <p className="text-white opacity-75 mb-0">Avg Daily Hours</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <BsTrophyFill className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {teamMembers.length > 0 ? 
                                Math.round(teamMembers.reduce((sum, member) => sum + member.efficiency, 0) / teamMembers.length) + '%'
                                : '0%'
                              }
                            </h2>
                            <p className="text-white opacity-75 mb-0">Avg Efficiency</p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            <BsShield className="text-white fs-1 mb-3" />
                            <h2 className="text-white fw-bold mb-1">
                              {teamMembers.length > 0 ? 
                                (teamMembers.reduce((sum, member) => sum + member.safetyScore, 0) / teamMembers.length).toFixed(1) + '%'
                                : '0%'
                              }
                            </h2>
                            <p className="text-white opacity-75 mb-0">Safety Score</p>
                          </div>
                        </div>
                      </div>

                      <div className="row g-4">
                        <div className="col-lg-8">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-header border-0" style={{ background: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Administrator Performance</h6>
                              <small className="text-muted">Current team members and their performance metrics</small>
                            </div>
                            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                              {teamMembers.length === 0 ? (
                                <div className="text-center py-4">
                                  <BsPeople size={48} className="text-muted mb-3" />
                                  <h5 className="text-muted">No team members found</h5>
                                  <p className="text-muted">No active administrators are currently available.</p>
                                </div>
                              ) : (
                                teamMembers.map((member, idx) => {
                                  const initials = member.name ? 
                                    member.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                                    'AD';
                                  const performanceColor = member.performance >= 95 ? 'success' : 
                                                          member.performance >= 85 ? 'warning' : 'danger';
                                  
                                  return (
                                    <div key={member._id || idx} className="d-flex align-items-center mb-3 p-2 rounded hover-bg-light" style={{ transition: 'background-color 0.2s' }}>
                                      <div className="position-relative me-3">
                                        {member.avatar ? (
                                          <img
                                            src={`http://localhost:5050${member.avatar}`}
                                            alt={member.name}
                                            className="rounded-circle"
                                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                              e.target.nextSibling.style.display = 'flex';
                                            }}
                                          />
                                        ) : null}
                                        <div 
                                          className={`bg-${performanceColor} rounded-circle d-flex align-items-center justify-content-center`} 
                                          style={{ 
                                            width: '48px', 
                                            height: '48px',
                                            display: member.avatar ? 'none' : 'flex'
                                          }}
                                        >
                                          <span className="text-white fw-bold">{initials}</span>
                                        </div>
                                      </div>
                                      <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                          <div>
                                            <span className="fw-semibold">{member.name || 'Unknown'}</span>
                                            <small className="text-muted ms-2">({member.department || 'General'})</small>
                                          </div>
                                          <div className="d-flex gap-2">
                                            <span className={`badge bg-${performanceColor}`}>{member.performance}%</span>
                                            <small className="text-muted">{member.dailyHours}h daily</small>
                                          </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-1">
                                          <small className="text-muted me-2">📧 {member.email || 'No email'}</small>
                                          <small className="text-muted">🎂 {member.age || 'N/A'} years</small>
                                        </div>
                                        <div className="progress" style={{ height: '6px' }}>
                                          <div className={`progress-bar bg-${performanceColor}`} style={{ width: `${member.performance}%` }}></div>
                                        </div>
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
                              <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Team Actions</h6>
                              <small className="text-muted">Manage your team efficiently</small>
                            </div>
                            <div className="card-body d-grid gap-2">
                              <button 
                                className="btn btn-outline-success"
                                onClick={() => {
                                  const alert = document.createElement('div');
                                  alert.className = 'alert alert-info alert-dismissible fade show position-fixed';
                                  alert.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
                                  alert.innerHTML = `
                                    <strong>📢 Team Alert Sent!</strong> All active administrators have been notified.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                  `;
                                  document.body.appendChild(alert);
                                  setTimeout(() => alert.remove(), 4000);
                                }}
                              >
                                <BsBellFill className="me-2" />Send Team Alert
                              </button>
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/ptfd/profile-dashboard')}
                              >
                                <BsClipboardData className="me-2" />View All Profiles
                              </button>
                              <button 
                                className="btn btn-outline-warning"
                                onClick={() => {
                                  const alert = document.createElement('div');
                                  alert.className = 'alert alert-warning alert-dismissible fade show position-fixed';
                                  alert.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
                                  alert.innerHTML = `
                                    <strong>⚙️ Feature Coming Soon!</strong> Team settings will be available in the next update.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                  `;
                                  document.body.appendChild(alert);
                                  setTimeout(() => alert.remove(), 4000);
                                }}
                              >
                                <BsGear className="me-2" />Team Settings
                              </button>
                              <button 
                                className="btn btn-outline-info"
                                onClick={fetchTeamMembers}
                                disabled={loadingTeam}
                              >
                                <BsChatDots className="me-2" />
                                {loadingTeam ? 'Refreshing...' : 'Refresh Data'}
                              </button>
                            </div>
                            
                            {/* Team Summary */}
                            {teamMembers.length > 0 && (
                              <div className="card-footer border-0 bg-light">
                                <h6 className="fw-bold mb-2">Team Summary</h6>
                                <div className="row text-center">
                                  <div className="col-6">
                                    <small className="text-muted d-block">Departments</small>
                                    <strong>{new Set(teamMembers.map(m => m.department || 'General')).size}</strong>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">Avg Age</small>
                                    <strong>
                                      {Math.round(teamMembers.reduce((sum, m) => sum + (m.age || 0), 0) / teamMembers.length) || 0}
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
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowTeamModal(false)}>Close</button>
                  {teamMembers.length > 0 && (
                    <button 
                      type="button" 
                      className="btn btn-success rounded-pill px-4" 
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," + 
                          "Name,Email,Department,Age,Status,Performance,Daily Hours,Efficiency,Safety Score\n" +
                          teamMembers.map(member => 
                            `"${member.name || 'Unknown'}","${member.email || 'N/A'}","${member.department || 'General'}",${member.age || 'N/A'},"${member.status || 'Active'}",${member.performance},${member.dailyHours},${member.efficiency},${member.safetyScore}`
                          ).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `team-report-${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Export Team Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Analytics Modal */}
        {showAnalyticsModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1055 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content border-0 shadow-2xl" style={{ borderRadius: '32px', background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)' }}>
                <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', padding: '2rem 2.5rem 1.5rem', color: '#ffffff', borderRadius: '32px 32px 0 0' }}>
                  <div className="d-flex align-items-center">
                    <div className="me-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.2)' }}>
                      <BsBarChartFill className="text-white fs-3" />
                    </div>
                    <div>
                      <h3 className="modal-title fw-bold mb-2 text-white">Advanced Analytics Hub</h3>
                      <p className="mb-0 text-white opacity-75 fs-5">AI-powered insights and predictive analytics</p>
                    </div>
                  </div>
                </div>
                <div className="modal-body" style={{ padding: '2.5rem' }}>
                  <div className="row g-4 mb-4">
                    <div className="col-lg-3">
                      <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <BsGraphUpArrow className="text-white fs-1 mb-3" />
                        <h2 className="text-white fw-bold mb-1">+23%</h2>
                        <p className="text-white opacity-75 mb-0">Productivity Gain</p>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <BsBullseye className="text-white fs-1 mb-3" />
                        <h2 className="text-white fw-bold mb-1">87%</h2>
                        <p className="text-white opacity-75 mb-0">Target Achievement</p>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                        <BsLightning className="text-white fs-1 mb-3" />
                        <h2 className="text-white fw-bold mb-1">142%</h2>
                        <p className="text-white opacity-75 mb-0">Efficiency Score</p>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="text-center p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                        <BsStarFill className="text-white fs-1 mb-3" />
                        <h2 className="text-white fw-bold mb-1">A+</h2>
                        <p className="text-white opacity-75 mb-0">Overall Grade</p>
                      </div>
                    </div>
                  </div>

                  <div className="row g-4">
                    <div className="col-lg-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header border-0" style={{ background: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                          <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Predictive Insights</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-semibold">Project Completion Forecast</span>
                              <span className="badge bg-success">On Track</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div className="progress-bar bg-success" style={{ width: '78%' }}></div>
                            </div>
                            <small className="text-muted">Expected completion: 15 days ahead of schedule</small>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-semibold">Budget Utilization</span>
                              <span className="badge bg-warning">Monitor</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div className="progress-bar bg-warning" style={{ width: '67%' }}></div>
                            </div>
                            <small className="text-muted">67% utilized - $2.3M remaining</small>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-semibold">Risk Assessment</span>
                              <span className="badge bg-success">Low Risk</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div className="progress-bar bg-success" style={{ width: '23%' }}></div>
                            </div>
                            <small className="text-muted">Risk score: 23/100 - Excellent safety rating</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header border-0" style={{ background: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                          <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>AI Recommendations</h6>
                        </div>
                        <div className="card-body">
                          <div className="d-flex align-items-start mb-3">
                            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                              <BsLightning className="text-white" size={16} />
                            </div>
                            <div>
                              <p className="mb-1 fw-semibold">Optimize Resource Allocation</p>
                              <small className="text-muted">Redistribute 3 workers from Project A to Project B for 15% efficiency gain</small>
                            </div>
                          </div>

                          <div className="d-flex align-items-start mb-3">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                              <BsClock className="text-white" size={16} />
                            </div>
                            <div>
                              <p className="mb-1 fw-semibold">Schedule Optimization</p>
                              <small className="text-muted">Adjust timeline for foundation work to avoid weather delays</small>
                            </div>
                          </div>

                          <div className="d-flex align-items-start mb-3">
                            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                              <BsCurrencyDollar className="text-white" size={16} />
                            </div>
                            <div>
                              <p className="mb-1 fw-semibold">Cost Reduction Opportunity</p>
                              <small className="text-muted">Bulk material purchase could save $45,000 across 3 projects</small>
                            </div>
                          </div>

                          <div className="d-flex align-items-start">
                            <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                              <BsShield className="text-white" size={16} />
                            </div>
                            <div>
                              <p className="mb-1 fw-semibold">Safety Enhancement</p>
                              <small className="text-muted">Schedule additional safety training for high-risk activities</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0" style={{ padding: '1.5rem 2.5rem 2rem' }}>
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowAnalyticsModal(false)}>Close</button>
                  {/*<button type="button" className="btn btn-primary rounded-pill px-4" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', border: 'none' }}>Export Analytics</button>*/}
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