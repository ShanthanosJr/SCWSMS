import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaExclamationTriangle, FaCheck, FaHistory, FaNotesMedical, FaFilePdf } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import RentalNotes from "../Components/RentalNotes";
import PDFDownloadButton from "../Components/PDFDownloadButton";

const API_BASE = "http://localhost:3005/api/rentals";

const RentalManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current");
  const [currentRentals, setCurrentRentals] = useState([]);
  const [overdueRentals, setOverdueRentals] = useState([]);
  const [historyRentals, setHistoryRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  // Fetch data based on active tab
  useEffect(() => {
    fetchRentalData();
  }, [activeTab]);

  const fetchRentalData = async () => {
    setLoading(true);
    try {
      // Fetch current rentals
      const currentResponse = await axios.get(`${API_BASE}/current`);
      setCurrentRentals(currentResponse.data);
      
      // Fetch overdue rentals
      const overdueResponse = await axios.get(`${API_BASE}/overdue`);
      setOverdueRentals(overdueResponse.data);
      
      // Fetch rental history (completed rentals)
      const historyResponse = await axios.get(`${API_BASE}/history`);
      setHistoryRentals(historyResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rental data:", error);
      setLoading(false);
    }
  };

  const handleReturnRental = async (rentalId) => {
    if (window.confirm("Mark this rental as returned?")) {
      try {
        const response = await axios.post(`${API_BASE}/end`, { rentalId });
        console.log("Return response:", response.data);
        fetchRentalData(); // Refresh data
        alert("Rental successfully marked as returned.");
      } catch (error) {
        console.error("Error ending rental:", error);
        const errorMessage = error.response?.data?.error || error.message;
        console.error("Detailed error:", errorMessage);
        alert("Failed to process return: " + errorMessage);
      }
    }
  };

  const openNotesModal = (rental) => {
    setSelectedRental(rental);
    setShowNotesModal(true);
  };

  const handleNotesUpdate = async (rentalId, notes) => {
    try {
      await axios.put(`${API_BASE}/update-notes`, { rentalId, notes });
      fetchRentalData(); // Refresh data
      setShowNotesModal(false);
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Failed to update notes: " + (error.response?.data?.error || error.message));
    }
  };

  const renderRentalTable = (rentals, isOverdue = false, isHistory = false) => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (rentals.length === 0) {
      return (
        <div className="text-center py-4 text-muted">
          {isOverdue ? "No overdue rentals found." : 
           isHistory ? "No rental history found." :
           "No active rentals found."}
        </div>
      );
    }

    let tableHeaderClass = "table-primary";
    if (isOverdue) tableHeaderClass = "table-danger";
    if (isHistory) tableHeaderClass = "table-secondary";

    return (
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className={tableHeaderClass}>
            <tr>
              <th>Tool</th>
              <th>Rented By</th>
              <th>Start Date</th>
              <th>{isHistory ? "Return Date" : "Due Date"}</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental._id} className={isOverdue ? "table-danger bg-opacity-25" : ""}>
                <td>
                  <div className="d-flex align-items-center">
                    {rental.toolId && rental.toolId.image ? (
                      <img
                        src={rental.toolId.image}
                        alt={rental.toolId.model}
                        style={{ height: "40px", width: "40px", objectFit: "cover" }}
                        className="me-2 rounded"
                      />
                    ) : null}
                    <div>
                      <div className="fw-bold">
                        {rental.toolId ? rental.toolId.model : "Unknown Tool"}
                      </div>
                      <small className="text-muted">
                        {rental.toolId ? rental.toolId.serial : ""}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  {rental.userId ? (
                    rental.userId.name || `User ID: ${rental.userId._id?.toString().slice(-6) || "Unknown"}`
                  ) : (
                    "Unknown User"
                  )}
                </td>
                <td>{new Date(rental.rentalStartDate).toLocaleDateString()}</td>
                <td>
                  {isHistory && rental.actualReturnDate ? 
                    new Date(rental.actualReturnDate).toLocaleDateString() :
                    new Date(rental.rentalEndDate).toLocaleDateString()}
                  
                  {isOverdue && (
                    <span className="ms-2 text-danger">
                      <FaExclamationTriangle />
                    </span>
                  )}
                </td>
                <td>
                  <span className={`badge ${
                    rental.status === 'returned' ? 'bg-success' : 
                    rental.status === 'overdue' ? 'bg-danger' : 'bg-primary'
                  }`}>
                    {rental.status}
                  </span>
                </td>
                <td>
                  {rental.notes ? (
                    <span className="text-muted text-truncate d-inline-block" style={{ maxWidth: "100px" }}>
                      {rental.notes}
                    </span>
                  ) : (
                    <span className="text-muted">No notes</span>
                  )}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    {!isHistory && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleReturnRental(rental._id)}
                        title="Mark as Returned"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => openNotesModal(rental)}
                      title="Add/Edit Notes"
                    >
                      <FaNotesMedical />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate("/admin")}>
          <FaArrowLeft className="me-2" />
          Back
        </button>
        <h2 className="mb-0">Rental Management</h2>
        <div>
          {activeTab === "history" && historyRentals.length > 0 && (
            <PDFDownloadButton data={historyRentals} />
          )}
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "current" ? "active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            Current Rentals ({currentRentals.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "overdue" ? "active" : ""}`}
            onClick={() => setActiveTab("overdue")}
          >
            <span className="text-danger">
              <FaExclamationTriangle className="me-1" />
              Overdue Rentals ({overdueRentals.length})
            </span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <FaHistory className="me-1" />
            Rental History ({historyRentals.length})
          </button>
        </li>
      </ul>

      {activeTab === "current" && renderRentalTable(currentRentals)}
      {activeTab === "overdue" && renderRentalTable(overdueRentals, true)}
      {activeTab === "history" && (
        <>
          
          {renderRentalTable(historyRentals, false, true)}
        </>
      )}

      {showNotesModal && selectedRental && (
        <RentalNotes
          rental={selectedRental}
          onClose={() => setShowNotesModal(false)}
          onSave={handleNotesUpdate}
        />
      )}
    </div>
  );
};

export default RentalManagement;