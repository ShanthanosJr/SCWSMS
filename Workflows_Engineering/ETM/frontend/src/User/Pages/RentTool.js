import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaDollarSign, FaInfoCircle } from "react-icons/fa";

const API_BASE = "http://localhost:3005/api/tools";

const RentTool = () => {
  const { toolId } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  // Calculate the current date in YYYY-MM-DD format
  function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Calculate end date based on start date and days
  function calculateEndDate(start, daysToAdd) {
    const date = new Date(start);
    date.setDate(date.getDate() + parseInt(daysToAdd));
    return date.toISOString().split('T')[0];
  }

  useEffect(() => {
    // Fetch the selected tool details
    axios
      .get(`${API_BASE}/${toolId}`)
      .then((res) => {
        setTool(res.data);
        setTotalPrice(res.data.price); // Initial price is for 1 day
        setEndDate(calculateEndDate(startDate, days));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tool:", err);
        setLoading(false);
      });
  }, [toolId]);

  // Recalculate price when days change
  useEffect(() => {
    if (tool) {
      setTotalPrice(tool.price * days);
      setEndDate(calculateEndDate(startDate, days));
    }
  }, [days, tool, startDate]);

  // Update end date when start date changes
  useEffect(() => {
    if (startDate) {
      setEndDate(calculateEndDate(startDate, days));
    }
  }, [startDate, days]);

  const handleDaysChange = (e) => {
    const newDays = Math.max(1, parseInt(e.target.value) || 1);
    setDays(newDays);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleConfirmRent = () => {
    // Create the rental object with all necessary details
    const rentalData = {
      toolId,
      rentalStartDate: new Date(startDate),
      rentalEndDate: new Date(endDate),
      totalPrice,
      // Hardcoded user information until login is implemented
      userId: "65646ace43a19bca9af0907d", // Replace with a valid ID from your database
      userName: "Demo User" // This can help with debugging
    };

    console.log("Submitting rental:", rentalData);

    // Handle the rental logic
    axios
      .post("http://localhost:3005/api/rentals/create", rentalData)
      .then((response) => {
        console.log("Rental successful:", response.data);
        alert("Tool rented successfully!");
        navigate("/user/tools");
      })
      .catch((err) => {
        console.error("Error renting tool:", err);
        alert("Failed to rent the tool: " + (err.response?.data?.error || err.message));
      });
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

  if (!tool) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Tool not found!</p>
        <button className="btn btn-secondary" onClick={() => navigate("/user/tools")}>
          Back to Tools
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <button 
            className="btn btn-outline-secondary mb-4"
            onClick={() => navigate("/user/tools")}
          >
            Back to Tools
          </button>
          
          <h2 className="mb-4 text-center">Rent a Tool</h2>
          
          <div className="card shadow">
            <div className="row g-0">
              <div className="col-md-5">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={tool.model}
                    className="img-fluid rounded-start"
                    style={{ height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="bg-light d-flex align-items-center justify-content-center h-100"
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}
              </div>
              <div className="col-md-7">
                <div className="card-body">
                  <h4 className="card-title">{tool.model}</h4>
                  <p className="card-text">
                    <small className="text-muted">Serial: {tool.serial}</small>
                  </p>
                  <p className="card-text">
                    <strong>Daily Rate:</strong> LKR:{tool.price ? tool.price.toFixed(2) : "0.00"}
                  </p>
                  <p className="card-text">
                    <strong>Status:</strong>{" "}
                    <span className={`badge bg-${getStatusColor(tool.status)}`}>
                      {tool.status}
                    </span>
                  </p>
                  
                  <hr />
                  
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> Start Date
                    </label>
                    <input 
                      type="date" 
                      className="form-control"
                      min={getTodayString()}
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> Rental Duration (Days)
                    </label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={days}
                      min="1"
                      onChange={handleDaysChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> Return Date
                    </label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={endDate}
                      disabled
                    />
                  </div>
                  
                  <div className="alert alert-info d-flex align-items-start mb-4">
                    <FaInfoCircle className="me-2 mt-1" />
                    <div>
                      <strong>Total Cost:</strong> LKR:{totalPrice.toFixed(2)}
                      <br />
                      <small>Based on {days} day{days > 1 ? 's' : ''} rental period</small>
                    </div>
                  </div>
                  
                  <button
                    className="btn btn-success w-100"
                    onClick={handleConfirmRent}
                    disabled={tool.status !== "available"}
                  >
                    <FaDollarSign className="me-2" /> Confirm and Rent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default RentTool;