import React, { useState, useEffect } from "react";
import {
  checkIn,
  checkOut,
  getLogs,
  getWorkerStatus,
} from "../services/attendanceService";
import QRScanner from "../components/attendance/QRScanner";
import AttendanceTable from "../components/attendance/AttendanceTable";
import "../styles/globals.css";

export default function Attendance() {
  const [logs, setLogs] = useState([]);
  const [workerId, setWorkerId] = useState("");
  const [workerStatus, setWorkerStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (workerId.trim()) {
      checkWorkerStatus(workerId.trim());
    } else {
      setWorkerStatus(null);
    }
  }, [workerId]);

  const loadLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load logs:", err);
      alert("❌ Failed to load logs");
    }
  };

  const checkWorkerStatus = async (id) => {
    try {
      const status = await getWorkerStatus(id);
      setWorkerStatus(status);
    } catch (err) {
      setWorkerStatus(null);
    }
  };

  const handleCheckIn = async (method = "Manual") => {
    if (!workerId.trim()) return alert("⚠️ Please enter Worker ID");

    setLoading(true);
    try {
      await checkIn(workerId.trim(), method);
      alert("✅ Worker checked in successfully");
      setWorkerId("");
      setWorkerStatus(null);
      loadLogs();
    } catch (err) {
      console.error("Check-in failed:", err);
      alert(`❌ Check-in failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (method = "Manual") => {
    if (!workerId.trim()) return alert("⚠️ Please enter Worker ID");

    setLoading(true);
    try {
      await checkOut(workerId.trim(), method);
      alert("✅ Worker checked out successfully");
      setWorkerId("");
      setWorkerStatus(null);
      loadLogs();
    } catch (err) {
      console.error("Check-out failed:", err);
      alert(`❌ Check-out failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (scannedId) => {
    setWorkerId(scannedId);

    // Auto check-in/check-out based on current status
    try {
      const status = await getWorkerStatus(scannedId);

      if (status.isCheckedIn) {
        // Worker is checked in, so check them out
        await handleCheckOut("QR");
      } else {
        // Worker is not checked in, so check them in
        await handleCheckIn("QR");
      }
    } catch (err) {
      console.error("QR scan processing failed:", err);
      alert("❌ Failed to process QR scan. Please try manual entry.");
    }
  };

  return (
    <div className="wspm-container">
      {/* Header */}
      <div className="wspm-header">
        <h1>Attendance Management</h1>
        <p>Track worker check-ins and check-outs with QR scanning or manual entry</p>
      </div>

      <div className="wspm-content">
        {/* Attendance Actions */}
        <div className="wspm-grid">
          {/* Manual Entry */}
          <div className="wspm-content-card">
            <h2>Manual Entry</h2>
            <div className="wspm-form">
              <div className="wspm-form-group">
                <input
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                  placeholder="Enter Worker ID (e.g., W001)"
                  className="wspm-form-input"
                />

                {/* Worker Status Display */}
                {workerStatus && (
                  <div
                    className={`wspm-status-display ${
                      workerStatus.isCheckedIn
                        ? "wspm-status-display-checked-in"
                        : "wspm-status-display-available"
                    }`}
                  >
                    <div className="wspm-status-display-content">
                      <div>
                        <p className="wspm-status-display-name">
                          {workerStatus.name}
                        </p>
                        <p className="wspm-status-display-text">
                          Status:{" "}
                          {workerStatus.isCheckedIn ? (
                            <span className="wspm-status-display-checked-in-text">
                              Checked In
                            </span>
                          ) : (
                            <span className="wspm-status-display-available-text">
                              Available
                            </span>
                          )}
                        </p>
                        {workerStatus.isCheckedIn &&
                          workerStatus.lastCheckIn && (
                            <p className="wspm-status-display-time">
                              Since:{" "}
                              {new Date(
                                workerStatus.lastCheckIn
                              ).toLocaleTimeString()}
                            </p>
                          )}
                      </div>
                      <div
                        className={`wspm-status-indicator ${
                          workerStatus.isCheckedIn
                            ? "wspm-status-indicator-checked-in"
                            : "wspm-status-indicator-available"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="wspm-button-group">
                <button
                  onClick={() => handleCheckIn()}
                  disabled={loading || workerStatus?.isCheckedIn}
                  className="wspm-btn wspm-btn-success"
                >
                  {loading ? "Processing..." : "✅ Check In"}
                </button>
                <button
                  onClick={() => handleCheckOut()}
                  disabled={loading || !workerStatus?.isCheckedIn}
                  className="wspm-btn wspm-btn-error"
                >
                  {loading ? "Processing..." : "❌ Check Out"}
                </button>
              </div>

              <div className="wspm-form-hint">
                {workerStatus?.isCheckedIn
                  ? "Worker is currently checked in. Click Check Out to end shift."
                  : "Worker is available. Click Check In to start shift."}
              </div>
            </div>
          </div>

          {/* QR Scanner */}
          <div className="wspm-content-card">
            <h2>QR Code Scanner</h2>
            <QRScanner onScan={handleQRScan} />
          </div>
        </div>

        {/* Attendance Logs */}
        <div className="wspm-content-card">
          <div className="wspm-card-header-with-count">
            <h2>Today's Attendance Logs</h2>
            <div className="wspm-card-actions">
              <button
                onClick={loadLogs}
                className="wspm-btn wspm-btn-secondary"
              >
                🔄 Refresh
              </button>
              <div className="wspm-card-count">
                Total Entries: {logs.length}
              </div>
            </div>
          </div>
          <AttendanceTable logs={logs} />
        </div>
      </div>
    </div>
  );
}