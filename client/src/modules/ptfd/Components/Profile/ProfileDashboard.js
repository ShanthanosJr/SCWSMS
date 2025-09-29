import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import {
  BsPerson,
  BsGraphUp,
  BsPeople,
  BsFileEarmarkBarGraph,
  BsSearch,
  BsPieChart,
  BsBarChart,
  BsCheckCircle,
  BsEye,
  BsTrash,
  //BsPencil,
  BsGrid,
  BsList,
  BsExclamationTriangle,
  BsActivity,
  BsCalendar,
  BsGeoAlt,
  BsBriefcase,
  BsEnvelope,
  BsPhone
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

const URL = 'http://localhost:5050/api/users';

async function fetchUsers() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return [];
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(URL, config);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Error fetching users:', err);
    if (err.response && err.response.status === 401) {
      window.location.href = '/signin';
    }
    return [];
  }
}

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [viewMode, setViewMode] = useState("overview");

  // Add these state variables
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/ptfd/signin');
      return;
    }
    
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await fetchUsers();
      if (!mounted) return;
      setUsers(data || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`${URL}/${id}`, config);
        setUsers((prev) => prev.filter((u) => u._id !== id));
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        alert.innerHTML = `
          <strong>Success!</strong> User deleted successfully.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
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
      'Active': returnHex ? '#6B46C1' : 'primary',
      'Inactive': returnHex ? '#ef4444' : 'danger',
      'Pending': returnHex ? '#f59e0b' : 'warning',
      'Suspended': returnHex ? '#6b7280' : 'secondary',
      'Unknown': returnHex ? '#8b5cf6' : 'info'
    };
    return colors[status] || colors['Unknown'];
  };

  const getSortedAndFilteredUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = (
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.employeeId && user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      const matchesStatus = statusFilter === "All" || (user.status || 'Active') === statusFilter;
      const matchesDepartment = departmentFilter === "All" || (user.department || 'General') === departmentFilter;
      
      let matchesAge = true;
      if (ageFilter !== "All") {
        const age = user.age || 0;
        switch (ageFilter) {
          case "18-25": matchesAge = age >= 18 && age <= 25; break;
          case "26-35": matchesAge = age >= 26 && age <= 35; break;
          case "36-50": matchesAge = age >= 36 && age <= 50; break;
          case "50+": matchesAge = age > 50; break;
          default: matchesAge = true;
        }
      }

      return matchesSearch && matchesStatus && matchesDepartment && matchesAge;
    });

    return filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case "createdAt":
          aVal = new Date(a.createdAt || 0);
          bVal = new Date(b.createdAt || 0);
          break;
        case "age":
          aVal = parseFloat(a.age) || 0;
          bVal = parseFloat(b.age) || 0;
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
          break;
        case "name":
          aVal = a.name || "";
          bVal = b.name || "";
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

  // Function to open user detail modal
  const openUserDetailModal = (user) => {
    setSelectedUserDetail(user);
    setShowDetailModal(true);
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => (u.status || 'Active') === "Active").length;
    const inactiveUsers = users.filter(u => (u.status || 'Active') === "Inactive").length;
    const avgAge = users.length > 0 ? users.reduce((sum, u) => sum + (parseFloat(u.age) || 0), 0) / users.length : 0;
    const highAgeUsers = users.filter(u => {
      const age = parseFloat(u.age) || 0;
      return age > 50;
    }).length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      avgAge,
      highAgeUsers
    };
  }, [users]);

  // Chart data
  const chartData = useMemo(() => {
    // Status distribution for pie chart
    const statusCounts = users.reduce((acc, user) => {
      const status = user.status || 'Active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: getStatusColor(status, true)
    }));

    // Age distribution for bar chart
    const ageGroups = users.reduce((acc, user) => {
      const age = user.age || 0;
      let group = 'Unknown';
      if (age >= 18 && age <= 25) group = '18-25';
      else if (age >= 26 && age <= 35) group = '26-35';
      else if (age >= 36 && age <= 50) group = '36-50';
      else if (age > 50) group = '50+';
      
      if (!acc[group]) {
        acc[group] = { ageGroup: group, count: 0, totalAge: 0 };
      }
      acc[group].count += 1;
      acc[group].totalAge += age;
      return acc;
    }, {});

    const ageData = Object.values(ageGroups).map(item => ({
      ...item,
      avgAge: item.count > 0 ? item.totalAge / item.count : 0
    }));

    // Monthly registration data
    const monthlyData = users.reduce((acc, user) => {
      const createdDate = new Date(user.createdAt || Date.now());
      const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, registered: 0, active: 0 };
      }

      acc[monthKey].registered += 1;
      if ((user.status || 'Active') === 'Active') {
        acc[monthKey].active += 1;
      }

      return acc;
    }, {});

    const registrationData = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(item => ({
        ...item,
        month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));

    return { statusData, ageData, registrationData };
  }, [users]);

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "⬆️" : "⬇️";
  };

  const filteredUsers = getSortedAndFilteredUsers();

  // Commented out export function
  // const handleExportAll = () => {
  //   // Create a summary report of all users
  //   const summaryData = {
  //     users: users,
  //     totalUsers: users.length,
  //     activeUsers: users.filter(u => (u.status || 'Active') === "Active").length,
  //     generatedAt: new Date()
  //   };
  //
  //   // For now, just log the data (you can implement PDF export later)
  //   console.log("Exporting users summary:", summaryData);
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
            <p className="mt-3 text-muted">Loading Administrator dashboard...</p>
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
          .premium-gradient { background: linear-gradient(135deg, #6B46C1 0%, #805AD5 100%); }
          .success-gradient { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
          .warning-gradient { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
          .info-gradient { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
          .progress-bar-custom { height: 8px; border-radius: 4px; }
        `}</style>

        {/* Premium User Dashboard Header */}
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
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(107, 70, 193, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(107, 70, 193, 0.03) 0%, transparent 50%)',
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
                    background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(107, 70, 193, 0.3)',
                    marginRight: '1rem'
                  }}>
                    <BsPeople className="text-white fs-1" />
                  </div>
                  <div>
                    <h1 className="display-3 fw-bold mb-1" style={{
                      color: '#1a1a1a',
                      fontWeight: '700',
                      letterSpacing: '-0.02em'
                    }}>Profile Nexus</h1>
                    <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                      Orchestrate team intelligence with unparalleled precision
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
                  Your premium Administrator management platform. Track profiles, manage teams, and ensure collaboration across all your organization.</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button onClick={() => navigate("/ptfd/projects")} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #6B46C1',
                    color: '#6B46C1',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(107, 70, 193, 0.2)'
                  }}>
                    <BsBriefcase className="me-2" />View Projects
                  </button>
                  <button onClick={() => navigate("/ptfd/project-timelines")} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(107, 70, 193, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <BsCalendar className="me-2" />View Timelines
                  </button>
                  <button onClick={() => navigate("/ptfd/financial-dashboard")}className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                    borderRadius: '50px',
                    border: '2px solid #6B46C1',
                    color: '#6B46C1',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(107, 70, 193, 0.2)'
                  }}>
                    <BsFileEarmarkBarGraph className="me-2" />View Dashboards
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Cards */}
        <div className="row mb-4 g-3">
          <div className="col-lg-3 col-md-6">
            <div className="card stats-card border-0 shadow h-100 text-white" style={{ background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)' }}>
              <div className="card-body text-center p-4">
                <BsPeople size={40} className="mb-3 opacity-75" />
                <h3 className="fw-bold mb-1">{statistics.totalUsers}</h3>
                <p className="mb-1">Total Administrators</p>
                <small className="opacity-75">+5 from last month</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card stats-card border-0 shadow h-100 text-white success-gradient">
              <div className="card-body text-center p-4">
                <BsCheckCircle size={40} className="mb-3 opacity-75" />
                <h3 className="fw-bold mb-1">{statistics.activeUsers}</h3>
                <p className="mb-1">Active Administrators</p>
                <small className="opacity-75">+8% from last quarter</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card stats-card border-0 shadow h-100 text-white info-gradient">
              <div className="card-body text-center p-4">
                <BsPerson size={40} className="mb-3 opacity-75" />
                <h3 className="fw-bold mb-1">{statistics.avgAge.toFixed(1)}</h3>
                <p className="mb-1">Average Administrator Age</p>
                <small className="opacity-75">Team demographics</small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card stats-card border-0 shadow h-100 text-white warning-gradient">
              <div className="card-body text-center p-4">
                <BsActivity size={40} className="mb-3 opacity-75" />
                <h3 className="fw-bold mb-1">{statistics.highAgeUsers}</h3>
                <p className="mb-1">Senior Members</p>
                <small className="opacity-75">Age 50+ Administrators</small>
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
                          className={`nav-link ${viewMode === 'profiles' ? 'active' : ''}`}
                          onClick={() => setViewMode('profiles')}
                        >
                          <BsGrid className="me-2" />
                          Profiles
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
                            placeholder="Search users..."
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
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending">Pending</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="col-auto">
                        <select
                          className="form-select form-select-sm"
                          value={departmentFilter}
                          onChange={(e) => setDepartmentFilter(e.target.value)}
                        >
                          <option value="All">All Departments</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="HR">HR</option>
                        </select>
                      </div>
                      <div className="col-auto">
                        <select
                          className="form-select form-select-sm"
                          value={ageFilter}
                          onChange={(e) => setAgeFilter(e.target.value)}
                        >
                          <option value="All">All Ages</option>
                          <option value="18-25">18-25</option>
                          <option value="26-35">26-35</option>
                          <option value="36-50">36-50</option>
                          <option value="50+">50+</option>
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
    background: linear-gradient(135deg, #6B46C1 0%, #805AD5 100%) !important;
    color: #fff !important;
    border-radius: 8px;
  }
  .nav-pills .nav-link {
    color: #6B46C1;
  }
  .nav-pills .nav-link:hover {
    color: #805AD5;
  }
`}
        </style>

        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <div className="row g-4">
            {/* User Activity */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsGraphUp className="me-2 text-primary" />
                    Administrator Activity
                  </h5>
                  <small className="text-muted">Current status of team members</small>
                </div>
                <div className="card-body">
                  {filteredUsers.slice(0, 4).map((user, index) => (
                    <div key={user._id} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <h6 className="mb-0">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                        <div className="text-end">
                          <small className="fw-bold">
                            {(user.status || 'Active') === 'Active' ? '100%' :
                             (user.status || 'Active') === 'Inactive' ? '25%' :
                             (user.status || 'Active') === 'Pending' ? '50%' : '75%'}
                          </small>
                        </div>
                      </div>
                      <div className="progress progress-bar-custom mb-2">
                        <div
                          className={`progress-bar bg-${getStatusColor(user.status || 'Active')}`}
                          style={{
                            width: `${(user.status || 'Active') === 'Active' ? 100 :
                                     (user.status || 'Active') === 'Inactive' ? 25 :
                                     (user.status || 'Active') === 'Pending' ? 50 : 75}%`
                          }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark">{user.department || 'General'}</span>
                        <span className={`badge bg-${getStatusColor(user.status || 'Active')}`}>
                          {user.status || 'Active'}
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
                  <small className="text-muted">Latest updates from your team</small>
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
                        <p className="mb-1 fw-semibold">New Administrator registration completed</p>
                        <small className="text-muted">John Doe joined Engineering • 2h ago</small>
                      </div>
                    </div>

                    <div className="d-flex mb-4">
                      <div className="flex-shrink-0">
                        <div className="bg-warning rounded-circle d-flex align-items-center justify-center" style={{ width: '32px', height: '32px' }}>
                          <BsExclamationTriangle className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold">Administrator update pending</p>
                        <small className="text-muted">Sarah Smith needs verification • 4h ago</small>
                      </div>
                    </div>

                    <div className="d-flex mb-4">
                      <div className="flex-shrink-0">
                        <div className="bg-info rounded-circle d-flex align-items-center justify-center" style={{ width: '32px', height: '32px' }}>
                          <BsPeople className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold">Department transfer approved</p>
                        <small className="text-muted">Mike Johnson moved to Marketing • 6h ago</small>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-center" style={{ width: '32px', height: '32px' }}>
                          <BsFileEarmarkBarGraph className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <p className="mb-1 fw-semibold">Monthly report generated</p>
                        <small className="text-muted">Team performance summary • 1d ago</small>
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
                    Administrator Status Distribution
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

            {/* Age Distribution Chart */}
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsBarChart className="me-2 text-primary" />
                    Administrator Age Distribution
                  </h5>
                </div>
                <div className="card-body">
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.ageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ageGroup" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, 'Count']} />
                        <Bar dataKey="count" fill="#6B46C1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Trends Chart */}
            <div className="col-12">
              <div className="card border-0 shadow">
                <div className="card-header bg-light border-0">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BsGraphUp className="me-2 text-primary" />
                    Registration Trends (Last 6 Months)
                  </h5>
                </div>
                <div className="card-body">
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={chartData.registrationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="registered" stackId="1" stroke="#6B46C1" fill="#6B46C1" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="active" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profiles Grid Tab */}
        {viewMode === 'profiles' && (
          <div>
            {/* Card View Filters */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className="text-muted me-2">Sort by:</span>
                      {['name', 'createdAt', 'age', 'status'].map(field => (
                        <button
                          key={field}
                          className={`btn btn-sm ${sortField === field ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => handleSort(field)}
                        >
                          {field === 'name' && '👤 Name'}
                          {field === 'createdAt' && '📅 Date'}
                          {field === 'age' && '🎂 Age'}
                          {field === 'status' && '📊 Status'}
                          {' ' + getSortIcon(field)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow card-hover h-100">
                    <div className="position-relative">
                      <img
                        src={user.avatar ? `http://localhost:5050${user.avatar}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=250&fit=crop&auto=format'}
                        alt={user.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          // Fallback to default image if the avatar fails to load
                          e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=250&fit=crop&auto=format';
                        }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className={`badge bg-${getStatusColor(user.status || 'Active')}`}>
                          {user.status || 'Active'}
                        </span>
                      </div>
                    </div>

                    <div className="card-body">
                      <h5 className="card-title">{user.name}</h5>
                      <p className="text-muted small">{user.employeeId || 'N/A'}</p>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <BsEnvelope className="me-2 text-muted" />
                          <small>{user.email}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <BsPerson className="me-2 text-muted" />
                          <small>Age: {user.age || 'N/A'}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <BsPhone className="me-2 text-muted" />
                          <small>{user.phoneNumber || 'N/A'}</small>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark">
                          {user.department || 'General'}
                        </span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openUserDetailModal(user)}
                            title="View Details"
                          >
                            <BsEye />
                          </button>
                          {/*<button
                            className="btn btn-outline-success"
                            onClick={() => console.log('Export user', user._id)}
                            title="Export User"
                          >
                            <BsFileEarmarkBarGraph />
                          </button>*/}
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(user._id)}
                            title="Delete User"
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
                <h5 className="mb-0">Administrator Records</h5>
                <small className="text-muted">
                  Showing {filteredUsers.length} of {users.length} Administrators
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
                        onClick={() => handleSort("name")}
                      >
                        Administrator Name {getSortIcon("name")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("email")}
                      >
                        Email {getSortIcon("email")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("employeeId")}
                      >
                        Administrator ID {getSortIcon("employeeId")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("age")}
                      >
                        Age {getSortIcon("age")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("status")}
                      >
                        Status {getSortIcon("status")}
                      </th>
                      <th
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort("createdAt")}
                      >
                        Joined {getSortIcon("createdAt")}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={user.avatar ? `http://localhost:5050${user.avatar}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&auto=format'}
                              alt={user.name}
                              className="rounded-circle me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              onError={(e) => {
                                // Fallback to default image if the avatar fails to load
                                e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&auto=format';
                              }}
                            />
                            <div>
                              <div className="fw-semibold">{user.name}</div>
                              <small className="text-muted">{user.department || 'General'}</small>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td><code>{user.employeeId || 'N/A'}</code></td>
                        <td className="fw-bold">{user.age || 'N/A'}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(user.status || 'Active')}`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                openUserDetailModal(user);
                              }}
                              title="View Details"
                            >
                              <BsEye />
                            </button>
                            {/*<button
                              className="btn btn-outline-success"
                              onClick={() => console.log('Export user', user._id)}
                              title="Export User"
                            >
                              <BsFileEarmarkBarGraph />
                            </button>*/}
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(user._id)}
                              title="Delete User"
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

        {/* Enhanced Premium User Modal */}
        {showDetailModal && selectedUserDetail && (
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
                {/* Premium Header with Purple Gradient */}
                <div
                  className="modal-header border-0 position-relative"
                  style={{
                    background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 50%, #9F7AEA 100%)',
                    padding: '2rem 2.5rem 1.5rem',
                    color: '#ffffff'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }}></div>

                  <div className="d-flex align-items-center position-relative">
                    <div
                      className="me-4 d-flex align-items-center justify-content-center"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #553C9A 0%, #6B46C1 100%)',
                        boxShadow: '0 8px 25px rgba(107, 70, 193, 0.4)'
                      }}
                    >
                      <BsPerson className="text-white fs-3" />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="modal-title fw-bold mb-2 text-white">
                        Administrator Profile
                      </h3>
                      <p className="mb-0 text-white-75 fs-5">
                        {new Date(selectedUserDetail.createdAt || Date.now()).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* User ID Badge */}
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
                      ID: {selectedUserDetail.employeeId || selectedUserDetail._id?.slice(-8)}
                    </span>
                  </div>
                </div>

                {/* Premium Body */}
                <div className="modal-body" style={{ padding: '2.5rem' }}>

                  {/* Key Metrics Dashboard */}
                  <div className="row g-4 mb-5">
                    <div className="col-12">
                      <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#1f2937' }}>
                        <BsGraphUp className="me-3 text-primary" />
                        Administrator Metrics
                      </h5>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
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
                            <BsPerson className="text-black fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">{selectedUserDetail.age || 'N/A'}</h2>
                          <p className="text-black-75 mb-0 fw-medium">Age</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #805AD5 0%, #9F7AEA 100%)',
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
                          <h2 className="fw-bold text-black mb-1">{selectedUserDetail.status || 'Active'}</h2>
                          <p className="text-black-75 mb-0 fw-medium">Current Status</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #9F7AEA 0%, #B794F4 100%)',
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
                            {new Date(selectedUserDetail.createdAt || Date.now()).toLocaleDateString()}
                          </h2>
                          <p className="text-black-75 mb-0 fw-medium">Join Date</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, #B794F4 0%, #D6BCFA 100%)',
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
                            <BsBriefcase className="text-black fs-4" />
                          </div>
                          <h2 className="fw-bold text-black mb-1">
                            {selectedUserDetail.department || 'General'}
                          </h2>
                          <p className="text-black-75 mb-0 fw-medium">Department</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Information */}
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
                            <BsPerson className="me-3 text-primary" />
                            Administrator Information
                          </h6>

                          <div className="row g-4">
                            <div className="col-md-6">
                              <div className="border-start border-4 border-primary ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Full Name</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedUserDetail.name || 'Unknown User'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-info ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Administrator ID</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedUserDetail.employeeId || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-warning ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Email Address</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedUserDetail.email || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-danger ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Phone Number</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedUserDetail.phoneNumber || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-success ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>NIC</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedUserDetail.nic || 'Not provided'}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="border-start border-4 border-secondary ps-3">
                                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Birth Year</small>
                                <p className="fw-bold mb-0 mt-1" style={{ color: '#1f2937' }}>
                                  {selectedUserDetail.birthYear || 'Not specified'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Summary */}
                    <div className="col-lg-4">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          borderRadius: '24px',
                          background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
                          color: '#ffffff'
                        }}
                      >
                        <div className="card-body p-4 text-center">
                          <img
                            src={selectedUserDetail.avatar ? `http://localhost:5050${selectedUserDetail.avatar}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format'}
                            alt={selectedUserDetail.name}
                            className="rounded-circle mb-3 mx-auto d-block"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                            onError={(e) => {
                              // Fallback to default image if the avatar fails to load
                              e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format';
                            }}
                          />
                          <h6 className="fw-bold mb-3 text-black-75">Administrator Profile</h6>
                          <h2 className="fw-bold text-black mb-2">
                            {selectedUserDetail.name}
                          </h2>
                          <p className="text-black-50 mb-0 small">
                            Member since {new Date(selectedUserDetail.createdAt || Date.now()).getFullYear()}
                          </p>

                          {/* Additional User Details */}
                          <div className="mt-3 pt-3 border-top border-white border-opacity-25">
                            <div className="row text-center">
                              <div className="col-6">
                                <small className="text-black-75 d-block">Status</small>
                                <strong className="text-black">
                                  {selectedUserDetail.status || 'Active'}
                                </strong>
                              </div>
                              <div className="col-6">
                                <small className="text-black-75 d-block">Department</small>
                                <strong className="text-black">
                                  {selectedUserDetail.department || 'General'}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Address */}
                  {selectedUserDetail.address && (
                    <div className="mb-4">
                      <div
                        className="card border-0 shadow-sm"
                        style={{
                          borderRadius: '24px',
                          background: 'linear-gradient(145deg, #f8f4ff 0%, #ede9fe 100%)',
                          border: '1px solid rgba(107, 70, 193, 0.2)'
                        }}
                      >
                        <div className="card-body p-4">
                          <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#553C9A' }}>
                            <BsGeoAlt className="me-3" />
                            Address Information
                          </h6>
                          <div
                            className="p-4 rounded-3"
                            style={{
                              background: 'rgba(255, 255, 255, 0.7)',
                              border: '1px solid rgba(107, 70, 193, 0.1)',
                              fontStyle: 'italic',
                              lineHeight: '1.6'
                            }}
                          >
                            <p className="mb-0" style={{ color: '#4C1D95' }}>
                              "{selectedUserDetail.address}"
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
                    Joined: {new Date(selectedUserDetail.createdAt || Date.now()).toLocaleDateString()}
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

                    {/*<button
                      type="button"
                      className="btn rounded-pill px-4 py-2 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(107, 70, 193, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(107, 70, 193, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(107, 70, 193, 0.4)';
                      }}
                      onClick={() => {
                        setShowDetailModal(false);
                        navigate(`/users/${selectedUserDetail._id}`);
                      }}
                    >
                      <BsPencil className="me-2" />
                      Edit User
                    </button>*/}

                   {/* <button
                      type="button"
                      className="btn rounded-pill px-4 py-2 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #553C9A 0%, #6B46C1 100%)',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(85, 60, 154, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(85, 60, 154, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(85, 60, 154, 0.4)';
                      }}
                      onClick={() => {
                        setShowDetailModal(false);
                        navigate(`/profile/${selectedUserDetail._id}`);
                      }}
                    >
                      <BsEye className="me-2" />
                      View Profile
                    </button>*/}
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
                  Switch between different views using the tabs above • Use filters and search to find specific users •
                  Export data and manage your team efficiently
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}