import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    tworker: [],
    tengineer: [],
    tarchitect: [],
    tprojectManager: [],
    texpenses: [],
    tmaterials: [],
    ttools: [],
    tnotes: ""
  });

  // Dropdown options with emojis
  const workerRoles = [
    "👷 General Laborer",
    "🔨 Carpenter",
    "🧱 Mason/Bricklayer",
    "🔌 Electrician",
    "🚰 Plumber",
    "🎨 Painter",
    "🏗️ Crane Operator",
    "🚛 Heavy Equipment Operator",
    "⚒️ Welder",
    "🪜 Roofer",
    "🏠 Framer",
    "🔧 HVAC Technician",
    "🛡️ Safety Inspector",
    "📋 Site Supervisor",
    "🚧 Traffic Controller",
    "💪 Concrete Worker",
    "🪟 Glazier",
    "⚡ Power Line Technician",
    "🛠️ Maintenance Worker",
    "🚜 Landscaper"
  ];

  const engineerSpecialties = [
    "🏗️ Structural Engineering",
    "🌍 Civil Engineering",
    "⚡ Electrical Engineering",
    "🔧 Mechanical Engineering",
    "🌊 Environmental Engineering",
    "🛣️ Transportation Engineering",
    "🏔️ Geotechnical Engineering",
    "🏭 Industrial Engineering",
    "🔥 Fire Protection Engineering",
    "💻 Construction Technology",
    "🎯 Project Engineering",
    "⚙️ Systems Engineering",
    "🌡️ HVAC Engineering",
    "💡 Lighting Design",
    "🔊 Acoustical Engineering",
    "⚖️ Forensic Engineering"
  ];

  const architectSpecialties = [
    "🏢 Commercial Architecture",
    "🏠 Residential Architecture",
    "🏭 Industrial Architecture",
    "🌿 Landscape Architecture",
    "🏛️ Historic Preservation",
    "♿ Universal Design",
    "🌱 Sustainable Design",
    "🏥 Healthcare Architecture",
    "🎓 Educational Architecture",
    "🏨 Hospitality Architecture",
    "🏪 Retail Architecture",
    "🎭 Cultural Architecture",
    "🏗️ High-rise Design",
    "🚀 Modern/Contemporary",
    "📐 CAD/BIM Specialist",
    "🎨 Interior Architecture"
  ];

  const materialNames = [
    "🧱 Concrete Blocks",
    "🪵 Lumber/Wood",
    "🔩 Steel Beams",
    "🧱 Bricks",
    "💎 Cement",
    "🪨 Gravel/Aggregate",
    "🏗️ Rebar",
    "🪟 Glass Panels",
    "🧱 Insulation",
    "🏠 Roofing Materials",
    "🚪 Doors",
    "🪟 Windows",
    "⚡ Electrical Wire",
    "🚰 PVC Pipes",
    "🔧 Plumbing Fixtures",
    "🎨 Paint",
    "🔨 Nails/Screws",
    "🧱 Drywall",
    "🏗️ Scaffolding",
    "🛡️ Safety Barriers",
    "💡 Lighting Fixtures",
    "🔌 Electrical Panels",
    "🌡️ HVAC Components",
    "🪜 Flooring Materials",
    "🧱 Mortar",
    "⚙️ Hardware/Fasteners"
  ];

  const toolNames = [
    "🔨 Hammer",
    "🪚 Circular Saw",
    "🔧 Wrench Set",
    "🪛 Screwdriver Set",
    "📏 Measuring Tape",
    "📐 Level",
    "⚡ Power Drill",
    "🔌 Angle Grinder",
    "🏗️ Excavator",
    "🚛 Dump Truck",
    "🏗️ Crane",
    "🚜 Bulldozer",
    "⚒️ Welding Machine",
    "🔥 Plasma Cutter",
    "🪜 Ladder",
    "🏗️ Scaffolding System",
    "💨 Air Compressor",
    "🔨 Jackhammer",
    "🧱 Concrete Mixer",
    "📡 Surveying Equipment",
    "🛡️ Safety Harness",
    "👷 Hard Hat",
    "🥽 Safety Glasses",
    "🧤 Work Gloves",
    "👢 Steel Toe Boots",
    "🚧 Traffic Cones",
    "📋 Clipboard/Tablet",
    "📱 Construction Apps",
    "🔍 Inspection Tools",
    "⚡ Generator"
  ];

  // fetch timeline data
  useEffect(() => {
    axios
      .get(`http://localhost:5050/timelines/${id}`)
      .then((res) => {
        setForm(res.data);
      })
      .catch((err) => console.error("Error fetching timeline:", err));
  }, [id]);

  const addField = (key, newObj) => {
    setForm({ ...form, [key]: [...form[key], newObj] });
  };

  const updateField = (key, index, field, value) => {
    const updated = [...form[key]];
    updated[index][field] = value;
    setForm({ ...form, [key]: updated });
  };

  const removeField = (key, index) => {
    const updated = [...form[key]];
    updated.splice(index, 1);
    setForm({ ...form, [key]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // auto counts
    form.workerCount = form.tworker.length;
    form.tengineerCount = form.tengineer.length;
    form.architectCount = form.tarchitect.length;

    await axios.put(`http://localhost:5050/timelines/${id}`, form);
    alert("Timeline updated successfully");
    navigate("/timelines");
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h2 className="mb-0">✏️ Update Timeline Entry</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Date */}
                <div className="mb-4">
                  <label className="form-label fw-bold">📅 Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.date ? form.date.substring(0, 10) : ""}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>

                {/* Workers */}
                <div className="mb-4">
                  <h5 className="text-primary">👷 Workers</h5>
                  {form.tworker.map((w, i) => (
                    <div key={i} className="row mb-2 align-items-end">
                      <div className="col">
                        <label className="form-label small">Name</label>
                        <input
                          placeholder="Worker Name"
                          className="form-control"
                          value={w.name || ""}
                          onChange={(e) => updateField("tworker", i, "name", e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label small">Role</label>
                        <select
                          className="form-select"
                          value={w.role || ""}
                          onChange={(e) => updateField("tworker", i, "role", e.target.value)}
                        >
                          <option value="">Select Role</option>
                          {workerRoles.map((role, idx) => (
                            <option key={idx} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <label className="form-label small">Hours</label>
                        <input
                          placeholder="Hours"
                          type="number"
                          className="form-control"
                          value={w.hoursWorked || ""}
                          onChange={(e) => updateField("tworker", i, "hoursWorked", e.target.value)}
                        />
                      </div>
                      <div className="col-auto">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeField("tworker", i)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mb-3"
                    onClick={() => addField("tworker", { name: "", role: "", hoursWorked: 0 })}
                  >
                    ➕ Add Worker
                  </button>
                </div>

                {/* Engineers */}
                <div className="mb-4">
                  <h5 className="text-success">👨‍💼 Engineers</h5>
                  {form.tengineer.map((en, i) => (
                    <div key={i} className="row mb-2 align-items-end">
                      <div className="col">
                        <label className="form-label small">Name</label>
                        <input
                          placeholder="Engineer Name"
                          className="form-control"
                          value={en.name || ""}
                          onChange={(e) => updateField("tengineer", i, "name", e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label small">Specialty</label>
                        <select
                          className="form-select"
                          value={en.specialty || ""}
                          onChange={(e) => updateField("tengineer", i, "specialty", e.target.value)}
                        >
                          <option value="">Select Specialty</option>
                          {engineerSpecialties.map((specialty, idx) => (
                            <option key={idx} value={specialty}>{specialty}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <label className="form-label small">Hours</label>
                        <input
                          placeholder="Hours"
                          type="number"
                          className="form-control"
                          value={en.hoursWorked || ""}
                          onChange={(e) => updateField("tengineer", i, "hoursWorked", e.target.value)}
                        />
                      </div>
                      <div className="col-auto">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeField("tengineer", i)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm mb-3"
                    onClick={() => addField("tengineer", { name: "", specialty: "", hoursWorked: 0 })}
                  >
                    ➕ Add Engineer
                  </button>
                </div>

                {/* Architects */}
                <div className="mb-4">
                  <h5 className="text-info">🏛️ Architects</h5>
                  {form.tarchitect.map((a, i) => (
                    <div key={i} className="row mb-2 align-items-end">
                      <div className="col">
                        <label className="form-label small">Name</label>
                        <input
                          placeholder="Architect Name"
                          className="form-control"
                          value={a.name || ""}
                          onChange={(e) => updateField("tarchitect", i, "name", e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label small">Specialty</label>
                        <select
                          className="form-select"
                          value={a.specialty || ""}
                          onChange={(e) => updateField("tarchitect", i, "specialty", e.target.value)}
                        >
                          <option value="">Select Specialty</option>
                          {architectSpecialties.map((specialty, idx) => (
                            <option key={idx} value={specialty}>{specialty}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <label className="form-label small">Hours</label>
                        <input
                          placeholder="Hours"
                          type="number"
                          className="form-control"
                          value={a.hoursWorked || ""}
                          onChange={(e) => updateField("tarchitect", i, "hoursWorked", e.target.value)}
                        />
                      </div>
                      <div className="col-auto">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeField("tarchitect", i)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm mb-3"
                    onClick={() => addField("tarchitect", { name: "", specialty: "", hoursWorked: 0 })}
                  >
                    ➕ Add Architect
                  </button>
                </div>

                {/* Project Managers */}
                <div className="mb-4">
                  <h5 className="text-warning">📋 Project Managers</h5>
                  {form.tprojectManager.map((pm, i) => (
                    <div key={i} className="row mb-2 align-items-end">
                      <div className="col">
                        <label className="form-label small">Name</label>
                        <input
                          placeholder="Manager Name"
                          className="form-control"
                          value={pm.name || ""}
                          onChange={(e) => updateField("tprojectManager", i, "name", e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label small">Contact</label>
                        <input
                          placeholder="Phone/Email"
                          className="form-control"
                          value={pm.contact || ""}
                          onChange={(e) => updateField("tprojectManager", i, "contact", e.target.value)}
                        />
                      </div>
                      <div className="col-auto">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeField("tprojectManager", i)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-warning btn-sm mb-3"
                    onClick={() => addField("tprojectManager", { name: "", contact: "" })}
                  >
                    ➕ Add Manager
                  </button>
                </div>

                {/* Expenses */}
                <div className="mb-4">
                  <h5 className="text-danger">💰 Expenses</h5>
                  {form.texpenses.map((ex, i) => (
                    <div key={i} className="row mb-2 align-items-end">
                      <div className="col">
                        <label className="form-label small">Description</label>
                        <input
                          placeholder="Expense Description"
                          className="form-control"
                          value={ex.description || ""}
                          onChange={(e) => updateField("texpenses", i, "description", e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label small">Amount ($)</label>
                        <input
                          placeholder="Amount"
                          type="number"
                          className="form-control"
                          value={ex.amount || ""}
                          onChange={(e) => updateField("texpenses", i, "amount", e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label small">Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={ex.date ? ex.date.substring(0, 10) : ""}
                          onChange={(e) => updateField("texpenses", i, "date", e.target.value)}
                        />
                      </div>
                      <div className="col-auto">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeField("texpenses", i)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mb-3"
                    onClick={() => addField("texpenses", { description: "", amount: 0, date: "" })}
                  >
                    ➕ Add Expense
                  </button>
                </div>

                {/* Materials */}
                <div className="mb-4">
                  <h5 className="text-secondary">🧱 Materials</h5>
                  {form.tmaterials.map((m, i) => (
                    <div key={i} className="row mb-2 align-items-end">
                      <div className="col">
                        <label className="form-label small">Material</label>
                        <select
                          className="form-select"
                          value={m.name || ""}
                          onChange={(e) => updateField("tmaterials", i, "name", e.target.value)}
                        >
                          <option value="">Select Material</option>
                          {materialNames.map((material, idx) => (
                            <option key={idx} value={material}>{material}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <label className="form-label small">Quantity</label>
                        <input
                          placeholder="Qty"
                          type="number"
                          className="form-control"
                          value={m.quantity || ""}
                          onChange={(e) => updateField("tmaterials", i, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label small">Unit</label>
                        <select 
                          className="form-select" 
                          value={m.unit || ""}
                          onChange={(e) => updateField("tmaterials", i, "unit", e.target.value)}
                        >
                          <option value="">Unit</option>
                          <option value="pcs">Pieces</option>
                          <option value="kg">Kilograms</option>
                          <option value="m">Meters</option>
                          <option value="m²">Square Meters</option>
                          <option value="m³">Cubic Meters</option>
                          <option value="tons">Tons</option>
                          <option value="bags">Bags</option>
                          <option value="boxes">Boxes</option>
                        </select>
                      </div>
                      <div className="col">
                        <label className="form-label small">Cost ($)</label>
                        <input
                          placeholder="Cost"
                          type="number"
                          className="form-control"
                          value={m.cost || ""}
                          onChange={(e) => updateField("tmaterials", i, "cost", e.target.value)}
                        />
                      </div>
                      <div className="col-auto">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeField("tmaterials", i)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mb-3"
                    onClick={() => addField("tmaterials", { name: "", quantity: 0, unit: "", cost: 0 })}
                  >
                    ➕ Add Material
                  </button>
                </div>

                {/* Tools */}
                <div className="mb-4">
                  <h5 className="text-dark">🔧 Tools & Equipment</h5>
                  {form.ttools.map((tool, i) => (
                    <div key={i} className="row mb-2 align-items-end">
                      <div className="col">
                        <label className="form-label small">Tool/Equipment</label>
                        <select
                          className="form-select"
                          value={tool.name || ""}
                          onChange={(e) => updateField("ttools", i, "name", e.target.value)}
                        >
                          <option value="">Select Tool</option>
                          {toolNames.map((toolName, idx) => (
                            <option key={idx} value={toolName}>{toolName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <label className="form-label small">Quantity</label>
                        <input
                          placeholder="Qty"
                          type="number"
                          className="form-control"
                          value={tool.quantity || ""}
                          onChange={(e) => updateField("ttools", i, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label small">Status</label>
                        <select
                          className="form-select"
                          value={tool.status || ""}
                          onChange={(e) => updateField("ttools", i, "status", e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="✅ Available">✅ Available</option>
                          <option value="🔧 In Use">🔧 In Use</option>
                          <option value="🔴 Maintenance">🔴 Maintenance</option>
                          <option value="⚠️ Damaged">⚠️ Damaged</option>
                          <option value="📦 Ordered">📦 Ordered</option>
                          <option value="🚫 Out of Stock">🚫 Out of Stock</option>
                        </select>
                      </div>
                      <div className="col-auto">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeField("ttools", i)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm mb-3"
                    onClick={() => addField("ttools", { name: "", quantity: 0, status: "" })}
                  >
                    ➕ Add Tool
                  </button>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="form-label fw-bold">📝 Notes</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Add any additional notes, safety observations, or important details..."
                    value={form.tnotes || ""}
                    onChange={(e) => setForm({ ...form, tnotes: e.target.value })}
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate("/timelines")}
                  >
                    ← Back to Timeline
                  </button>
                  <button type="submit" className="btn btn-warning btn-lg">
                    ✏️ Update Timeline Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}