import React, { useState, useEffect } from "react";
import axios from "axios";

const statusColors = {
  available: "success",
  "in use": "primary",
  "under maintenance": "warning",
  retired: "secondary",
};

const ViewToolDetails = ({ tool, onClose }) => {
  const [depreciation, setDepreciation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch depreciation data
    axios
      .get(`http://localhost:3005/api/tools/depreciation/${tool._id}`)
      .then((res) => {
        setDepreciation(res.data.depreciation);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching depreciation:", err);
        setLoading(false);
      });
  }, [tool._id]);

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-info bg-opacity-25">
            <h5 className="modal-title">Tool Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Left Side: Image and Basic Details */}
              <div className="col-md-5 text-center">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={tool.model}
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="text-muted">No Image Available</div>
                )}
                <h4 className="fw-bold mt-3">{tool.model}</h4>
                <p className="text-muted mb-1">Serial Number</p>
                <p className="fs-5">{tool.serial}</p>
                <p className="text-muted mb-1">Price</p>
                <p className="fs-5">LKR:{tool.price ? tool.price.toFixed(2) : "0.00"}</p>
              </div>

              {/* Right Side: Additional Details */}
              <div className="col-md-7">
                <div className="mb-3">
                  <small className="text-muted">Status</small>
                  <div>
                    <span className={`badge bg-${statusColors[tool.status] || "secondary"}`}>
                      {tool.status}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Purchase Date</small>
                  <div className="fs-5">{new Date(tool.purchaseDate).toLocaleDateString()}</div>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Usage Hours</small>
                  <div className="fs-5">{tool.usageHours} hours</div>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Depreciation Rate</small>
                  <div className="fs-5">{tool.depreciationRate * 100}% per year</div>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Current Depreciation</small>
                  <div className="fs-5">
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <span>{(depreciation * 100).toFixed(2)}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewToolDetails;