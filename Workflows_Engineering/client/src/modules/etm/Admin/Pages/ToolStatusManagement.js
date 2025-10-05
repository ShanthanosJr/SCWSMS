import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaHistory, FaTools, FaInfoCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import StatusChangeForm from "../Components/StatusChangeForm";
import MaintenanceForm from "../Components/MaintenanceForm";
import StatusHistoryList from "../Components/StatusHistoryList";
import MaintenanceHistoryList from "../Components/MaintenanceHistoryList";

const API_BASE = process.env.REACT_APP_ETM_API_BASE_URL || "http://localhost:5002/api/tools";

const ToolStatusManagement = () => {
  const navigate = useNavigate();
  const { toolId } = useParams();
  
  const [tool, setTool] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("status");
  
  useEffect(() => {
    fetchToolData();
  }, [toolId]);
  
  const fetchToolData = async () => {
    setLoading(true);
    try {
      // Fetch tool details
      const toolResponse = await axios.get(`${API_BASE}/${toolId}`);
      setTool(toolResponse.data);
      
      // Fetch status history
      const statusResponse = await axios.get(`${API_BASE}/status-history/${toolId}`);
      setStatusHistory(statusResponse.data);
      
      // Fetch maintenance history
      const maintenanceResponse = await axios.get(`${API_BASE}/maintenance-history/${toolId}`);
      setMaintenanceHistory(maintenanceResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tool data:", error);
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (data) => {
    try {
      await axios.put(`${API_BASE}/update-status`, {
        toolId,
        ...data
      });
      fetchToolData();
    } catch (error) {
      console.error("Error updating tool status:", error);
    }
  };
  
  const handleMaintenanceLog = async (data) => {
    try {
      await axios.post(`${API_BASE}/maintenance`, {
        toolId,
        ...data
      });
      fetchToolData();
    } catch (error) {
      console.error("Error logging maintenance:", error);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!tool) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Tool not found!</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />
          Back to Tools
        </button>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />
          Back to Tools
        </button>
        <h2 className="fw-bold text-center mb-0">Tool Management</h2>
        <div></div> {/* Empty div for flex spacing */}
      </div>
      
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h3 className="card-title">{tool.model}</h3>
              <p className="text-muted mb-0">Serial: {tool.serial}</p>
            </div>
            <div className="col-md-6 text-md-end">
              <span className={`badge bg-${getStatusColor(tool.status)} p-2 fs-6`}>
                {tool.status}
              </span>
              <p className="small text-muted mt-1 mb-0">
                Purchase Date: {new Date(tool.purchaseDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "status" ? "active" : ""}`}
            onClick={() => setActiveTab("status")}
          >
            <FaHistory className="me-2" />
            Status Tracking
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "maintenance" ? "active" : ""}`}
            onClick={() => setActiveTab("maintenance")}
          >
            <FaTools className="me-2" />
            Maintenance Log
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <FaInfoCircle className="me-2" />
            Tool Information
          </button>
        </li>
      </ul>
      
      {/* Status Tab Content */}
      {activeTab === "status" && (
        <div className="row">
          <div className="col-md-5">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="mb-0">Change Status</h5>
              </div>
              <div className="card-body">
                <StatusChangeForm 
                  currentStatus={tool.status} 
                  onSubmit={handleStatusChange} 
                />
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Status History</h5>
              </div>
              <div className="card-body">
                <StatusHistoryList history={statusHistory} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Maintenance Tab Content */}
      {activeTab === "maintenance" && (
        <div className="row">
          <div className="col-md-5">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-light">
                <h5 className="mb-0">Log Maintenance</h5>
              </div>
              <div className="card-body">
                <MaintenanceForm onSubmit={handleMaintenanceLog} />
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Maintenance History</h5>
              </div>
              <div className="card-body">
                <MaintenanceHistoryList history={maintenanceHistory} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Info Tab Content */}
      {activeTab === "info" && (
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">Tool Details</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <th>Model:</th>
                      <td>{tool.model}</td>
                    </tr>
                    <tr>
                      <th>Serial Number:</th>
                      <td>{tool.serial}</td>
                    </tr>
                    <tr>
                      <th>Status:</th>
                      <td>
                        <span className={`badge bg-${getStatusColor(tool.status)}`}>
                          {tool.status}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Purchase Date:</th>
                      <td>{new Date(tool.purchaseDate).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <th>Usage Hours:</th>
                      <td>{tool.usageHours}</td>
                    </tr>
                    <tr>
                      <th>Depreciation Rate:</th>
                      <td>{tool.depreciationRate * 100}% per year</td>
                    </tr>
                    <tr>
                      <th>Created At:</th>
                      <td>{new Date(tool.createdAt).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th>Last Updated:</th>
                      <td>{new Date(tool.updatedAt).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get Bootstrap color for status
function getStatusColor(status) {
  const colors = {
    available: "success",
    "in use": "primary",
    "under maintenance": "warning",
    retired: "secondary",
  };
  return colors[status] || "secondary";
}

export default ToolStatusManagement;