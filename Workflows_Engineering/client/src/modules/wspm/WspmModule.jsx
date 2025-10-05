import React from "react";
import { Routes, Route } from "react-router-dom";

// Import shared components
import Sidebar from "./components/shared/Sidebar";
import Navbar from "./components/shared/Navbar";

// Import pages
import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Safety from "./pages/Safety";
import Incidents from "./pages/Incidents";
import Training from "./pages/Training";
import Shifts from "./pages/Shifts";
import Reports from "./pages/Reports";

// Import custom styles
import "./styles/globals.css";

export default function WspmModule() {
  return (
    <div className="wspm-module-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="wspm-main-content">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="wspm-page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/training" element={<Training />} />
            <Route path="/shifts" element={<Shifts />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}