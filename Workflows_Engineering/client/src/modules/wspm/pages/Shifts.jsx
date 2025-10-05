import React, { useState, useEffect } from "react";
import { requestShiftSwap, getShiftSwaps, suggestReplacement } from "../services/shiftService";
import ShiftForm from "../components/shift/ShiftForm";
import ShiftList from "../components/shift/ShiftList";
import "../styles/globals.css";

export default function Shifts() {
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    loadSwaps();
  }, []);

  const loadSwaps = async () => {
    try {
      const data = await getShiftSwaps();
      setSwaps(data);
    } catch {
      alert("❌ Failed to load shift swaps");
    }
  };

  const handleShiftRequest = async (requestData) => {
    try {
      await requestShiftSwap(requestData);
      alert("✅ Shift swap requested successfully");
      loadSwaps();
    } catch {
      alert("❌ Failed to request swap");
    }
  };

  const handleSuggest = async (id) => {
    try {
      await suggestReplacement(id);
      alert("✅ Replacement suggested");
      loadSwaps();
    } catch {
      alert("❌ Failed to suggest replacement");
    }
  };

  return (
    <div className="wspm-container">
      {/* Header */}
      <div className="wspm-header">
        <h1>WORKFLOWS ENGINEERING</h1>
        <p>Equipment & Tool Management</p>
      </div>

      <div className="wspm-dashboard-container">
        <div className="wspm-content-card">
          <h2 className="wspm-content-card-title">Shift Management</h2>
          <p className="wspm-content-card-description">Manage shift swaps, requests, and schedule adjustments.</p>
        </div>

        {/* Shift Request Form */}
        <div className="wspm-content-card">
          <h3 className="wspm-card-title">Request Shift Swap</h3>
          <ShiftForm onRequest={handleShiftRequest} />
        </div>

        {/* Shift Requests List */}
        <div className="wspm-content-card">
          <h3 className="wspm-card-title">Shift Swap Requests</h3>
          <ShiftList swaps={swaps} onSuggest={handleSuggest} />
        </div>
      </div>
    </div>
  );
}