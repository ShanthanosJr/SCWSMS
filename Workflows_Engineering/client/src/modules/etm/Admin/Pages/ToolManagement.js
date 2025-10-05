import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaFilter } from "react-icons/fa";
import ToolList from "../Components/ToolList";
import CreateTool from "../Components/CreateTool";
import UpdateTool from "../Components/UpdateTool";
import ViewToolDetails from "../Components/ViewToolDetails";

const API_BASE = process.env.REACT_APP_ETM_API_BASE_URL 
  ? `${process.env.REACT_APP_ETM_API_BASE_URL}/tools` 
  : "http://localhost:5002/api/tools";

const ToolManagement = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("model");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchTools = () => {
    setLoading(true);
    axios.get(API_BASE)
      .then(res => {
        setTools(res.data);
        setFilteredTools(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tools:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // Apply filters whenever search term, status filter or tools change
  useEffect(() => {
    let result = [...tools];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(tool => 
        tool.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tool.serial.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(tool => tool.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "model":
          comparison = a.model.localeCompare(b.model);
          break;
        case "serial":
          comparison = a.serial.localeCompare(b.serial);
          break;
        case "purchaseDate":
          comparison = new Date(a.purchaseDate) - new Date(b.purchaseDate);
          break;
        case "price":
          comparison = (a.price || 0) - (b.price || 0);
          break;
        default:
          comparison = a.model.localeCompare(b.model);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredTools(result);
  }, [searchTerm, statusFilter, sortBy, sortDirection, tools]);

  const handleCreateTool = (newTool) => {
    axios.post(`${API_BASE}/create`, newTool)
      .then(() => {
        setShowCreate(false);
        fetchTools();
      })
      .catch(err => console.error("Error creating tool:", err));
  };

  const handleUpdateTool = (updatedTool) => {
    axios.put(`${API_BASE}/update/${selectedTool._id}`, updatedTool)
      .then(() => {
        setShowUpdate(false);
        setSelectedTool(null);
        fetchTools();
      })
      .catch(err => console.error("Error updating tool:", err));
  };

  const handleDeleteTool = (id) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      axios.delete(`${API_BASE}/delete/${id}`)
        .then(() => {
          fetchTools();
        })
        .catch(err => console.error("Error deleting tool:", err));
    }
  };

  const openUpdateModal = (tool) => {
    setSelectedTool(tool);
    setShowUpdate(true);
  };

  const openDetailsModal = (tool) => {
    setSelectedTool(tool);
    setShowDetails(true);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    const [newSortBy, newSortDirection] = value.split("-");
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("model");
    setSortDirection("asc");
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Tool Management</h2>
        <button className="btn btn-warning btn-lg" onClick={() => setShowCreate(true)}>
          + Add Tool
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by model or serial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaFilter />
                </span>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="in use">In Use</option>
                  <option value="under maintenance">Under Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={`${sortBy}-${sortDirection}`}
                onChange={handleSortChange}
              >
                <option value="model-asc">Model (A-Z)</option>
                <option value="model-desc">Model (Z-A)</option>
                <option value="purchaseDate-asc">Purchase Date (Oldest)</option>
                <option value="purchaseDate-desc">Purchase Date (Newest)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        <div className="card-footer bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              <strong>{filteredTools.length}</strong> of {tools.length} tools displayed
            </span>
            {(searchTerm || statusFilter !== "all") && (
              <button 
                className="btn btn-sm btn-link text-decoration-none"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tool List Component */}
      <ToolList 
        tools={filteredTools} 
        loading={loading} 
        onUpdate={openUpdateModal}
        onView={openDetailsModal}
        onDelete={handleDeleteTool}
      />

      {/* Create Tool Modal */}
      {showCreate && (
        <CreateTool 
          onSave={handleCreateTool}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Update Tool Modal */}
      {showUpdate && selectedTool && (
        <UpdateTool 
          tool={selectedTool}
          onSave={handleUpdateTool}
          onClose={() => setShowUpdate(false)}
        />
      )}

      {/* View Tool Details Modal */}
      {showDetails && selectedTool && (
        <ViewToolDetails 
          tool={selectedTool}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default ToolManagement;