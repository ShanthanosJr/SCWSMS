import React, { useState, useEffect } from "react";
import { reportIncident, getIncidents } from "../services/incidentService";
import IncidentForm from "../components/incidents/IncidentForm";
import IncidentList from "../components/incidents/IncidentList";
import "../styles/globals.css";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch {
      alert("❌ Failed to load incidents");
    }
  };

  const handleReportIncident = async (incidentData) => {
    try {
      await reportIncident(incidentData);
      alert("✅ Incident reported successfully");
      loadIncidents();
    } catch {
      alert("❌ Failed to report incident");
    }
  };

  return (
    <div className="wspm-container">
      {/* Header */}
      <div className="wspm-header">
        <h1>Incident Management</h1>
        <p>Report and track workplace incidents to maintain safety standards</p>
      </div>

      <div className="wspm-content">
        {/* Incident Report Form */}
        <div className="wspm-content-card">
          <div className="wspm-card-header">
            <div className="wspm-card-icon">
              <span>⚠️</span>
            </div>
            <h2>Report New Incident</h2>
          </div>
          <IncidentForm onReport={handleReportIncident} />
        </div>

        {/* Incidents List */}
        <div className="wspm-content-card">
          <div className="wspm-card-header-with-count">
            <h2>Incident Reports</h2>
            <div className="wspm-card-count">
              Total Incidents: {incidents.length}
            </div>
          </div>
          <IncidentList incidents={incidents} />
        </div>
      </div>
    </div>
  );
}