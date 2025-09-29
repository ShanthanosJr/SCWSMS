import React from "react";
import { FaEye, FaEdit, FaTrash, FaArrowLeft, FaExchangeAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const statusColors = {
  available: "success",
  "in use": "primary",
  "under maintenance": "warning",
  retired: "secondary",
};

const ToolList = ({ tools, loading, onUpdate, onView, onDelete }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" />
        Back
      </button>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle shadow-sm">
          <thead className="table-warning">
            <tr>
              <th>Image</th>
              <th>Model</th>
              <th>Serial</th>
              <th>Status</th>
              <th>Purchase Date</th>
              <th>Usage Hours</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  No tools found. Add a tool to get started.
                </td>
              </tr>
            ) : (
              tools.map(tool => (
                <tr key={tool._id}>
                  <td>
                    {tool.image ? (
                      <img
                        src={tool.image}
                        alt={tool.model}
                        style={{ maxWidth: "50px", maxHeight: "50px", objectFit: "cover" }}
                      />
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                  </td>
                  <td className="fw-semibold">{tool.model}</td>
                  <td>{tool.serial}</td>
                  <td>
                    <span className={`badge bg-${statusColors[tool.status] || "secondary"}`}>
                      {tool.status}
                    </span>
                  </td>
                  <td>{new Date(tool.purchaseDate).toLocaleDateString()}</td>
                  <td>{tool.usageHours}</td>
                  <td>LKR:{tool.price ? tool.price.toFixed(2) : "0.00"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => onView(tool)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onUpdate(tool)}
                        title="Update Tool"
                      >
                        <FaEdit />
                      </button>
                      <Link
                        to={`/admin/tools/${tool._id}/status`}
                        className="btn btn-sm btn-warning"
                        title="Status & Maintenance"
                      >
                        <FaExchangeAlt />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(tool._id)}
                        title="Delete Tool"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ToolList;