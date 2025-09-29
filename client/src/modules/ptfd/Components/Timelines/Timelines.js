import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav"; // Import the Nav component

export default function Timelines() {
  const navigate = useNavigate();
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    fetchTimelines();
  }, []);

  const fetchTimelines = () => {
    setLoading(true);
    axios.get("http://localhost:5050/timelines")
      .then((res) => {
        setTimelines(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this timeline? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5050/timelines/${id}`);
        setTimelines(timelines.filter(t => t._id !== id));
        // Show success message
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        alert.innerHTML = `
          <strong>✅ Success!</strong> Timeline deleted successfully.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
      } catch (error) {
        console.error("Error deleting timeline:", error);
        alert("❌ Error deleting timeline. Please try again.");
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

  const getSortedAndFilteredTimelines = () => {
    let filtered = timelines.filter(timeline => 
      new Date(timeline.date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (timeline.tnotes && timeline.tnotes.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortField) {
        case "date":
          aVal = new Date(a.date);
          bVal = new Date(b.date);
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
          aVal = a.texpenses?.length || 0;
          bVal = b.texpenses?.length || 0;
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

  if (loading) {
    return (
      <>
        <Nav /> {/* Add Nav component here */}
        <div className="container mt-4">
          <div className="text-center">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading timeline records...</p>
          </div>
        </div>
      </>
    );
  }

  const sortedTimelines = getSortedAndFilteredTimelines();

  return (
    <>
      <Nav /> {/* Add Nav component here */}
      <div className="container mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h2 className="mb-0">📋 Project Timeline Management</h2>
                    <p className="mb-0 opacity-75">Track daily project activities and resources</p>
                  </div>
            <div className="col-lg-4" style={{position: 'relative', zIndex: 1000}}>
              {/* Primary Add Button */}
              <button 
                className="btn btn-light btn-lg shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔴 Add New Timeline Button Clicked!');

                  try {
                    navigate('/add-timeline');
                    console.log('✅ Navigation successful');
                  } catch (error) {
                    console.error('❌ Navigation error:', error);
                    // Fallback to window.location
                    window.location.href = '/add-timeline';
                  }
                }}
                style={{
                  borderRadius: '50px', 
                  padding: '12px 30px',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 1001
                }}
                type="button"
              >
                <span className="me-2">➕</span> Add New Timeline
              </button>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center border-primary">
              <div className="card-body">
                <h5 className="card-title text-primary">📅 Total Records</h5>
                <h2 className="text-primary">{timelines.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-success">
              <div className="card-body">
                <h5 className="card-title text-success">👷 Total Workers</h5>
                <h2 className="text-success">
                  {timelines.reduce((sum, t) => sum + (t.workerCount || 0), 0)}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-info">
              <div className="card-body">
                <h5 className="card-title text-info">⏱️ Total Hours</h5>
                <h2 className="text-info">
                  {timelines.reduce((sum, t) => sum + calculateTotalHours(t), 0)}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-danger">
              <div className="card-body">
                <h5 className="card-title text-danger">💰 Total Cost</h5>
                <h2 className="text-danger">
                  ${timelines.reduce((sum, t) => sum + calculateTotalCost(t), 0).toLocaleString()}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">🔍</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by date or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => setSearchTerm("")}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <small className="text-muted">
                      Showing {sortedTimelines.length} of {timelines.length} records
                    </small>
                    <button 
                      className="btn btn-outline-primary btn-sm ms-3"
                      onClick={fetchTimelines}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Records Table */}
        <div className="card shadow">
          <div className="card-header bg-light">
            <h5 className="mb-0">📊 Timeline Records</h5>
          </div>
          <div className="card-body p-0">
            {sortedTimelines.length === 0 ? (
              <div className="text-center p-5">
                <div className="mb-3">
                  <span style={{fontSize: '4rem'}}>📋</span>
                </div>
                <h4 className="text-muted">No timeline records found</h4>
                <p className="text-muted">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating your first timeline entry.'}
                </p>
                {!searchTerm && (
                  <button 
                    className="btn btn-primary btn-lg mt-3"
                    onClick={() => navigate("/add-timeline")}
                  >
                    ➕ Create First Timeline
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("date")}
                      >
                        📅 Date {getSortIcon("date")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("workers")}
                      >
                        👷 Workers {getSortIcon("workers")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("engineers")}
                      >
                        👨‍💼 Engineers {getSortIcon("engineers")}
                      </th>
                      <th 
                        style={{cursor: 'pointer', userSelect: 'none'}}
                        onClick={() => handleSort("architects")}
                      >
                        🏛️ Architects {getSortIcon("architects")}
                      </th>
                      <th>⏱️ Hours</th>
                      <th>💰 Cost</th>
                      <th>📝 Notes</th>
                      <th>🔧 Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTimelines.map(timeline => (
                      <tr key={timeline._id}>
                        <td>
                          <strong>
                            {new Date(timeline.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </strong>
                          <br />
                          <small className="text-muted">
                            {new Date(timeline.date).toLocaleDateString('en-US', { weekday: 'long' })}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-primary fs-6">
                            {timeline.workerCount || 0}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success fs-6">
                            {timeline.tengineerCount || 0}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info fs-6">
                            {timeline.architectCount || 0}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning text-dark fs-6">
                            {calculateTotalHours(timeline)}h
                          </span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">
                            ${calculateTotalCost(timeline).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          {timeline.tnotes ? (
                            <span 
                              className="text-truncate d-inline-block" 
                              style={{maxWidth: '150px'}}
                              title={timeline.tnotes}
                            >
                              {timeline.tnotes}
                            </span>
                          ) : (
                            <span className="text-muted">No notes</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-outline-info btn-sm"
                              onClick={() => navigate(`/timeline/${timeline._id}`)}
                              title="View Details"
                            >
                              👁️
                            </button>
                            <button 
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => navigate(`/update-timeline/${timeline._id}`)}
                              title="Edit Timeline"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDelete(timeline._id)} 
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
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-muted">
          <p>
            <small>
              💡 Click on column headers to sort • Use search to filter records • 
              Click 👁️ to view details, ✏️ to edit, or 🗑️ to delete
            </small>
          </p>
        </div>
      </div>
    </>
  );
}