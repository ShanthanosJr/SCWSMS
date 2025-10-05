import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";

export default function TimelinesDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5050/timelines/${id}`)
      .then((res) => {
        setTimeline(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching timeline:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="container mt-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (!timeline) {
    return (
      <>
        <Nav />
        <div className="container mt-4">
          <div className="alert alert-danger">
            <h4>⚠️ Timeline Not Found</h4>
            <p>The requested timeline could not be found.</p>
            <button className="btn btn-primary" onClick={() => navigate("/timelines")}>
              ← Back to Timelines
            </button>
          </div>
        </div>
      </>
    );
  }

  const calculateTotalHours = (workers) => {
    return workers.reduce((total, worker) => total + (parseInt(worker.hoursWorked) || 0), 0);
  };

  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + (parseFloat(expense.amount) || 0), 0);
  };

  const calculateTotalMaterialCosts = (materials) => {
    return materials.reduce((total, material) => total + (parseFloat(material.cost) || 0), 0);
  };

  return (
    <>
      <Nav />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div className="card shadow mb-4">
              <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">📅 Timeline Details</h2>
                  <p className="mb-0 opacity-75">
                    Date: {new Date(timeline.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-end">
                  <button 
                    className="btn btn-light btn-sm me-2"
                    onClick={() => navigate(`/update-timeline/${id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={() => navigate("/timelines")}
                  >
                    ← Back
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card text-center border-primary">
                  <div className="card-body">
                    <h5 className="card-title text-primary">👷 Workers</h5>
                    <h2 className="text-primary">{timeline.tworker?.length || 0}</h2>
                    <small className="text-muted">{calculateTotalHours(timeline.tworker || [])} total hours</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center border-success">
                  <div className="card-body">
                    <h5 className="card-title text-success">👨‍💼 Engineers</h5>
                    <h2 className="text-success">{timeline.tengineer?.length || 0}</h2>
                    <small className="text-muted">{calculateTotalHours(timeline.tengineer || [])} total hours</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center border-info">
                  <div className="card-body">
                    <h5 className="card-title text-info">🏛️ Architects</h5>
                    <h2 className="text-info">{timeline.tarchitect?.length || 0}</h2>
                    <small className="text-muted">{calculateTotalHours(timeline.tarchitect || [])} total hours</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center border-danger">
                  <div className="card-body">
                    <h5 className="card-title text-danger">💰 Total Cost</h5>
                    <h2 className="text-danger">
                      ${(calculateTotalExpenses(timeline.texpenses || []) + calculateTotalMaterialCosts(timeline.tmaterials || [])).toLocaleString()}
                    </h2>
                    <small className="text-muted">Expenses + Materials</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Workers Section */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">👷 Workers ({timeline.tworker?.length || 0})</h5>
                  </div>
                  <div className="card-body">
                    {timeline.tworker && timeline.tworker.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Role</th>
                              <th>Hours</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeline.tworker.map((worker, index) => (
                              <tr key={index}>
                                <td className="fw-bold">{worker.name}</td>
                                <td>{worker.role}</td>
                                <td>
                                  <span className="badge bg-primary">{worker.hoursWorked}h</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No workers assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Engineers Section */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">👨‍💼 Engineers ({timeline.tengineer?.length || 0})</h5>
                  </div>
                  <div className="card-body">
                    {timeline.tengineer && timeline.tengineer.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Specialty</th>
                              <th>Hours</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeline.tengineer.map((engineer, index) => (
                              <tr key={index}>
                                <td className="fw-bold">{engineer.name}</td>
                                <td>{engineer.specialty}</td>
                                <td>
                                  <span className="badge bg-success">{engineer.hoursWorked}h</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No engineers assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Architects Section */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0">🏛️ Architects ({timeline.tarchitect?.length || 0})</h5>
                  </div>
                  <div className="card-body">
                    {timeline.tarchitect && timeline.tarchitect.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Specialty</th>
                              <th>Hours</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeline.tarchitect.map((architect, index) => (
                              <tr key={index}>
                                <td className="fw-bold">{architect.name}</td>
                                <td>{architect.specialty}</td>
                                <td>
                                  <span className="badge bg-info">{architect.hoursWorked}h</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No architects assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Managers Section */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">📋 Project Managers ({timeline.tprojectManager?.length || 0})</h5>
                  </div>
                  <div className="card-body">
                    {timeline.tprojectManager && timeline.tprojectManager.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {timeline.tprojectManager.map((manager, index) => (
                          <div key={index} className="list-group-item d-flex justify-content-between">
                            <div>
                              <strong>{manager.name}</strong>
                            </div>
                            <div className="text-muted">
                              📞 {manager.contact}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No project managers assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Materials Section */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">🧱 Materials ({timeline.tmaterials?.length || 0})</h5>
                  </div>
                  <div className="card-body">
                    {timeline.tmaterials && timeline.tmaterials.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Material</th>
                              <th>Quantity</th>
                              <th>Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeline.tmaterials.map((material, index) => (
                              <tr key={index}>
                                <td>{material.name}</td>
                                <td>
                                  <span className="badge bg-secondary">
                                    {material.quantity} {material.unit}
                                  </span>
                                </td>
                                <td className="text-success fw-bold">
                                  ${parseFloat(material.cost || 0).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="table-active">
                              <th colSpan="2">Total Material Cost</th>
                              <th className="text-success">
                                ${calculateTotalMaterialCosts(timeline.tmaterials).toLocaleString()}
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No materials recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tools Section */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">🔧 Tools & Equipment ({timeline.ttools?.length || 0})</h5>
                  </div>
                  <div className="card-body">
                    {timeline.ttools && timeline.ttools.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Tool/Equipment</th>
                              <th>Quantity</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeline.ttools.map((tool, index) => (
                              <tr key={index}>
                                <td>{tool.name}</td>
                                <td>
                                  <span className="badge bg-dark">{tool.quantity}</span>
                                </td>
                                <td>
                                  <span className={`badge ${
                                    tool.status?.includes('Available') ? 'bg-success' :
                                    tool.status?.includes('In Use') ? 'bg-primary' :
                                    tool.status?.includes('Maintenance') ? 'bg-warning' :
                                    tool.status?.includes('Damaged') ? 'bg-danger' :
                                    tool.status?.includes('Ordered') ? 'bg-info' :
                                    'bg-secondary'
                                  }`}>
                                    {tool.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No tools recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Expenses Section */}
              <div className="col-lg-12 mb-4">
                <div className="card">
                  <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">💰 Expenses ({timeline.texpenses?.length || 0})</h5>
                  </div>
                  <div className="card-body">
                    {timeline.texpenses && timeline.texpenses.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Date</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeline.texpenses.map((expense, index) => (
                              <tr key={index}>
                                <td>{expense.description}</td>
                                <td>
                                  {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="text-danger fw-bold">
                                  ${parseFloat(expense.amount || 0).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="table-active">
                              <th colSpan="2">Total Expenses</th>
                              <th className="text-danger">
                                ${calculateTotalExpenses(timeline.texpenses).toLocaleString()}
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No expenses recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {timeline.tnotes && (
                <div className="col-lg-12 mb-4">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">📝 Notes & Observations</h5>
                    </div>
                    <div className="card-body">
                      <div className="p-3 bg-light rounded">
                        <pre className="mb-0" style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>
                          {timeline.tnotes}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body text-center">
                    <button 
                      className="btn btn-primary btn-lg me-3"
                      onClick={() => navigate(`/update-timeline/${id}`)}
                    >
                      ✏️ Edit Timeline
                    </button>
                    <button 
                      className="btn btn-secondary btn-lg me-3"
                      onClick={() => navigate("/timelines")}
                    >
                      📋 View All Timelines
                    </button>
                    <button 
                      className="btn btn-success btn-lg"
                      onClick={() => window.print()}
                    >
                      🖨️ Print Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            .btn, .card-header .btn {
              display: none !important;
            }
            .card {
              border: 1px solid #000 !important;
              box-shadow: none !important;
            }
            .card-header {
              background-color: #f8f9fa !important;
              color: #000 !important;
            }
            body {
              font-size: 12px;
            }
          }
        `}</style>
      </div>
    </>
  );
}