import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import { useNavigate } from "react-router-dom";
import Projects from './Projects';

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
  const [sortField, setSortField] = useState("pcreatedat");
  const [sortDirection, setSortDirection] = useState("desc");
  const [viewMode, setViewMode] = useState("cards");

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

  const getSortedAndFilteredProjects = () => {
    let filtered = projects.filter(project => 
      (project.pname && project.pname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.plocation && project.plocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.pdescription && project.pdescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.pobservations && project.pobservations.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

  const calculateTotalBudget = () => {
    return projects.reduce((sum, p) => sum + (parseFloat(p.pbudget) || 0), 0);
  };

  const calculateActiveProjects = () => {
    return projects.filter(p => p.pstatus === "In Progress").length;
  };

  const calculateTotalIssues = () => {
    return projects.reduce((sum, p) => sum + (p.pissues?.length || 0), 0);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "⬆️" : "⬇️";
  };

  const getProjectImage = (project) => {
    if (project.pimg) {
      return project.pimg;
    }
    
    const defaultImages = {
      'Residential': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop&auto=format',
      'Commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop&auto=format',
      'Infrastructure': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=250&fit=crop&auto=format',
      'Industrial': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop&auto=format',
      default: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop&auto=format'
    };
    
    return defaultImages[project.ptype] || defaultImages.default;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'success';
      case 'Completed': return 'primary';
      case 'On Hold': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="container mt-4">
          <div className="text-center">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading project records...</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedProjects = getSortedAndFilteredProjects();

  return (
    <div>
      <Nav />
      <div className="container-fluid mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <div className="row align-items-center text-white">
                  <div className="col-md-6">
                    <h2 className="mb-0">🏗️ Project Management</h2>
                    <p className="mb-0 opacity-75">Track and manage construction projects</p>
                  </div>
                  <div className="col-md-6 text-end">
                    <button 
                      className="btn btn-light btn-lg shadow-sm"
                      onClick={() => navigate("/add-project")}
                    >
                      ➕ Add New Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card text-center border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div className="card-body text-white">
                <div className="mb-2" style={{fontSize: '2rem'}}>📋</div>
                <h5 className="card-title">Total Projects</h5>
                <h2 className="fw-bold">{projects.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card text-center border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'}}>
              <div className="card-body text-white">
                <div className="mb-2" style={{fontSize: '2rem'}}>💰</div>
                <h5 className="card-title">Total Budget</h5>
                <h2 className="fw-bold">
                  ${calculateTotalBudget().toLocaleString()}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card text-center border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #0099f7 0%, #f11712 100%)'}}>
              <div className="card-body text-white">
                <div className="mb-2" style={{fontSize: '2rem'}}>🚧</div>
                <h5 className="card-title">Active Projects</h5>
                <h2 className="fw-bold">
                  {calculateActiveProjects()}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card text-center border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)'}}>
              <div className="card-body text-white">
                <div className="mb-2" style={{fontSize: '2rem'}}>⚠️</div>
                <h5 className="card-title">Total Issues</h5>
                <h2 className="fw-bold">
                  {calculateTotalIssues()}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter and View Toggle */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">🔍</span>
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        placeholder="Search by name, location, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          className="btn btn-outline-secondary border-0"
                          onClick={() => setSearchTerm("")}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <div className="btn-group me-3" role="group">
                      <button 
                        className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                        onClick={() => setViewMode('cards')}
                      >
                        🗂️ Cards
                      </button>
                      <button 
                        className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                        onClick={() => setViewMode('table')}
                      >
                        📊 Table
                      </button>
                    </div>
                    <small className="text-muted me-3">
                      Showing {sortedProjects.length} of {projects.length} records
                    </small>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={async () => {
                        setLoading(true);
                        const data = await fetchHandlers();
                        setProjects(data || []);
                        setLoading(false);
                      }}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>
                
                {/* Sort Controls for Card View */}
                {viewMode === 'cards' && (
                  <div className="row mt-3">
                    <div className="col-12">
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
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Display */}
        {sortedProjects.length === 0 ? (
          <div className="text-center p-5">
            <div className="mb-4">
              <span style={{fontSize: '6rem', opacity: 0.3}}>🏗️</span>
            </div>
            <h3 className="text-muted mb-3">No project records found</h3>
            <p className="text-muted mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating your first project entry.'}
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary btn-lg shadow"
                onClick={() => navigate("/add-project")}
              >
                ➕ Create First Project
              </button>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          <div className="row justify-content-center">
            {sortedProjects.map((project, i) => (
              <Projects key={project._id ?? i} project={project} onDelete={handleDelete}/>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="card shadow border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">📊 Project Records</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("pname")}
                      >
                        📋 Name {getSortIcon("pname")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("pcode")}
                      >
                        🔢 Code {getSortIcon("pcode")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("plocation")}
                      >
                        📍 Location {getSortIcon("plocation")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("ptype")}
                      >
                        🏗️ Type {getSortIcon("ptype")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("pbudget")}
                      >
                        💰 Budget {getSortIcon("pbudget")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("pstatus")}
                      >
                        📊 Status {getSortIcon("pstatus")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("ppriority")}
                      >
                        ⚠️ Priority {getSortIcon("ppriority")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("pcreatedat")}
                      >
                        📅 Start Date {getSortIcon("pcreatedat")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("penddate")}
                      >
                        🗓️ End Date {getSortIcon("penddate")}
                      </th>
                      <th>📝 Notes</th>
                      <th>🔧 Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProjects.map(project => (
                      <tr key={project._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={getProjectImage(project)} 
                              alt={project.pname}
                              className="rounded me-2"
                              style={{width: '40px', height: '40px', objectFit: 'cover'}}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop&auto=format';
                              }}
                            />
                            <div>
                              <strong>{project.pname}</strong>
                              <br />
                              <small className="text-muted">{project.pnumber}</small>
                            </div>
                          </div>
                        </td>
                        <td>{project.pcode}</td>
                        <td>{project.plocation}</td>
                        <td>
                          <span className="badge bg-info fs-6">
                            {project.ptype}
                          </span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">
                            ${parseFloat(project.pbudget || 0).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusColor(project.pstatus)} fs-6`}>
                            {project.pstatus}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${getPriorityColor(project.ppriority)} fs-6`}>
                            {project.ppriority}
                          </span>
                        </td>
                        <td>
                          <strong>
                            {new Date(project.pcreatedat).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </strong>
                          <br />
                          <small className="text-muted">
                            {new Date(project.pcreatedat).toLocaleDateString('en-US', { weekday: 'long' })}
                          </small>
                        </td>
                        <td>
                          <strong>
                            {new Date(project.penddate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </strong>
                          <br />
                          <small className="text-muted">
                            {new Date(project.penddate).toLocaleDateString('en-US', { weekday: 'long' })}
                          </small>
                        </td>
                        <td>
                          {project.pobservations ? (
                            <span 
                              className="text-truncate d-inline-block" 
                              style={{maxWidth: '150px'}}
                              title={project.pobservations}
                            >
                              {project.pobservations}
                            </span>
                          ) : (
                            <span className="text-muted">No notes</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-outline-info btn-sm"
                              onClick={() => navigate(`/project-view/${project._id}`)}
                              title="View Details"
                            >
                              👁️
                            </button>
                            <button 
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => navigate(`/projects/${project._id}`)}
                              title="Edit Project"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDelete(project._id)} 
                              className="btn btn-outline-danger btn-sm"
                              title="Delete Project"
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
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 text-center text-muted">
          <p>
            <small>
              💡 Switch between card and table views • Use search to filter records • 
              Click 👁️ to view details, ✏️ to edit, or 🗑️ to delete
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}