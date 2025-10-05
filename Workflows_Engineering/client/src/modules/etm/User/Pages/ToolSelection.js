import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const API_BASE = process.env.REACT_APP_ETM_API_BASE_URL || "http://localhost:5002/api/tools";

const ToolSelection = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  useEffect(() => {
    // Fetch all tools
    axios
      .get(API_BASE)
      .then((res) => {
        // Only show available tools by default for users
        const availableTools = res.data.filter(tool => tool.status === "available");
        setTools(res.data);
        setFilteredTools(availableTools);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tools:", err);
        setLoading(false);
      });
  }, []);

  // Apply filters whenever search term or price filter changes
  useEffect(() => {
    let result = [...tools];
    
    // Only show available tools by default
    result = result.filter(tool => tool.status === "available");
    
    // Apply search
    if (searchTerm) {
      result = result.filter(tool => 
        tool.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price filter
    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under50":
          result = result.filter(tool => (tool.price || 0) < 50);
          break;
        case "50to100":
          result = result.filter(tool => (tool.price || 0) >= 50 && (tool.price || 0) <= 100);
          break;
        case "100to200":
          result = result.filter(tool => (tool.price || 0) > 100 && (tool.price || 0) <= 200);
          break;
        case "over200":
          result = result.filter(tool => (tool.price || 0) > 200);
          break;
        default:
          break;
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
    
    setFilteredTools(result);
  }, [searchTerm, priceFilter, sortOrder, tools]);

  const handleRentTool = (toolId) => {
    // Navigate to the rent tool page with the selected tool ID
    navigate(`/etm/user/rent/${toolId}`);
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("all");
    setSortOrder("asc");
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Available Tools for Rent</h2>
      
      {/* Search and Filter Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaFilter />
                </span>
                <select
                  className="form-select"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="under50">Under LKR:50</option>
                  <option value="50to100">LKR:50 - LKR:100</option>
                  <option value="100to200">LKR:100 - LKR:200</option>
                  <option value="over200">Over LKR:200</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-outline-primary w-100"
                onClick={handleSortToggle}
              >
                {sortOrder === "asc" ? <FaSortAmountUp className="me-2" /> : <FaSortAmountDown className="me-2" />}
                Price {sortOrder === "asc" ? "Low to High" : "High to Low"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Filter summary */}
        <div className="card-footer bg-white py-2">
          <div className="d-flex justify-content-between align-items-center">
            <small>
              <strong>{filteredTools.length}</strong> available tools
            </small>
            {(searchTerm || priceFilter !== "all") && (
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

      {/* Tool Cards */}
      <div className="row">
        {filteredTools.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <h5>No tools match your search criteria</h5>
            <button className="btn btn-outline-primary mt-3" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <div className="col-md-4 mb-4" key={tool._id}>
              <div className="card shadow-sm h-100">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={tool.model}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="card-img-top bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{tool.model}</h5>
                  <p className="card-text">
                    <strong>Price:</strong> LKR:{tool.price ? tool.price.toFixed(2) : "0.00"}/day
                  </p>
                  <p className="card-text">
                    <strong>Status:</strong>{" "}
                    <span className={`badge bg-${getStatusColor(tool.status)}`}>
                      {tool.status}
                    </span>
                  </p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => handleRentTool(tool._id)}
                    disabled={tool.status !== "available"}
                  >
                    Rent This Tool
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper function to get Bootstrap color for status
const getStatusColor = (status) => {
  const colors = {
    available: "success",
    "in use": "primary",
    "under maintenance": "warning",
    retired: "secondary",
  };
  return colors[status] || "secondary";
};

export default ToolSelection;