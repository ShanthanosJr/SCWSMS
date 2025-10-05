import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";
import Nav from "../../Nav/Nav";

const ToolHome = () => (
  <div className="App">
    <Nav />
    {/* Themed Header Bar */}
    <header className="caution-tape-bar top-bar" style={{ background: "#ffd700", color: "#222", padding: "1rem 0", fontWeight: "bold", letterSpacing: "0.1em" }}>
      <div>WORKFLOWS ENGINEERING - Equipment & Tool Management</div>
    </header>

    {/* Hero Section */}
    <section className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh", background: "#fffbe6" }}>
      <h1 style={{ fontWeight: 700, fontSize: "2.5rem", marginTop: "2rem" }}>
        Welcome to <span style={{ color: "#ff8c00" }}>ETM Dashboard</span>
      </h1>
      <p style={{ fontSize: "1.2rem", margin: "1.5rem 0", maxWidth: 600 }}>
        Manage your construction tools, rentals, and inventory with ease. Track usage, status, and availability in real time.
      </p>
      <div className="d-flex gap-3">
        <a href="/etm/admin/tools" className="btn btn-warning btn-lg shadow">Manage Tools</a>
        <Link to="/etm/admin/rentals" className="btn btn-warning btn-lg">
          <FaClipboardList className="me-2" />
          Manage Rentals
        </Link>
      </div>
    </section>

    {/* Features Section */}
    <section className="container py-5">
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="p-4 border rounded shadow-sm bg-light">
            <div style={{ fontSize: "2.5rem" }}>🛠️</div>
            <h4 className="mt-3">Tool Inventory</h4>
            <p>Track all your tools, update status, and monitor depreciation.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-4 border rounded shadow-sm bg-light">
            <div style={{ fontSize: "2.5rem" }}>📋</div>
            <h4 className="mt-3">Rental Management</h4>
            <p>Start and end rentals, view current and overdue rentals easily.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-4 border rounded shadow-sm bg-light">
            <div style={{ fontSize: "2.5rem" }}>📊</div>
            <h4 className="mt-3">Dashboard</h4>
            <p>See tool usage, rental stats, and system health at a glance.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="text-center py-4" style={{ background: "#fffbe6", borderTop: "2px solid #ffd700" }}>
      <div>© 2025 Workflows Engineering | ETM System</div>
    </footer>
  </div>
);

export default ToolHome;