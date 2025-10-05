const mongoose = require('mongoose');

// Financial Dashboard Schema for storing calculations and financial data
const financialDashboardSchema = new mongoose.Schema({
  // Basic Information
  dashboardId: {
    type: String,
    required: true,
    unique: true
  },
  dashboardName: {
    type: String,
    required: true
  },
  calculationDate: {
    type: Date,
    default: Date.now
  },
  
  // Project Filters
  selectedProjects: [{
    type: String // Project codes
  }],
  
  // Date Range Filters
  dateFrom: {
    type: Date
  },
  dateTo: {
    type: Date
  },
  
  // Calculated Financial Data
  totalProjectCost: {
    type: Number,
    default: 0
  },
  totalLaborCost: {
    type: Number,
    default: 0
  },
  totalMaterialCost: {
    type: Number,
    default: 0
  },
  totalToolCost: {
    type: Number,
    default: 0
  },
  totalExpenses: {
    type: Number,
    default: 0
  },
  
  // Detailed Breakdowns
  projectBreakdown: [{
    projectCode: String,
    projectName: String,
    projectType: String,
    projectPriority: String,
    totalCost: Number,
    laborCost: Number,
    materialCost: Number,
    toolCost: Number,
    expenses: Number,
    workerCount: Number,
    engineerCount: Number,
    architectCount: Number,
    pmCount: Number,
    timeline: [{
      date: Date,
      dailyCost: Number,
      workers: Number,
      engineers: Number,
      architects: Number,
      materials: Number,
      tools: Number,
      expenses: Number
    }]
  }],
  
  // Labor Analytics
  laborAnalytics: {
    totalWorkers: { type: Number, default: 0 },
    totalEngineers: { type: Number, default: 0 },
    totalArchitects: { type: Number, default: 0 },
    totalProjectManagers: { type: Number, default: 0 },
    totalLaborHours: { type: Number, default: 0 },
    averageHourlyRate: { type: Number, default: 0 },
    laborByRole: [{
      role: String,
      count: Number,
      totalHours: Number,
      totalCost: Number,
      averageRate: Number
    }]
  },
  
  // Material Analytics
  materialAnalytics: {
    totalMaterials: { type: Number, default: 0 },
    materialsByType: [{
      name: String,
      totalQuantity: Number,
      totalCost: Number,
      averageCost: Number,
      unit: String
    }]
  },
  
  // Tool Analytics
  toolAnalytics: {
    totalTools: { type: Number, default: 0 },
    toolsByType: [{
      name: String,
      totalQuantity: Number,
      totalCost: Number,
      averageCost: Number,
      status: String
    }]
  },
  
  // Financial Summary
  financialSummary: {
    grandTotal: { type: Number, default: 0 },
    projectCount: { type: Number, default: 0 },
    timelineEntries: { type: Number, default: 0 },
    averageProjectCost: { type: Number, default: 0 },
    profitMargin: { type: Number, default: 0 },
    roi: { type: Number, default: 0 }
  },
  
  // Status and Metadata
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Draft'],
    default: 'Active'
  },
  createdBy: {
    type: String,
    default: 'System'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-defined Salary and Cost Configuration
const SALARY_CONFIG = {
  // Project Type Multipliers
  PROJECT_TYPES: {
    'Residential Construction': { multiplier: 1.0, baseCost: 5000 },
    'Commercial Construction': { multiplier: 1.3, baseCost: 8000 },
    'Industrial Construction': { multiplier: 1.5, baseCost: 12000 },
    'Infrastructure Development': { multiplier: 1.7, baseCost: 15000 },
    'Renovation & Remodeling': { multiplier: 0.8, baseCost: 3000 },
    'Landscape Construction': { multiplier: 0.9, baseCost: 4000 },
    'Road Construction': { multiplier: 1.4, baseCost: 10000 },
    'Bridge Construction': { multiplier: 2.0, baseCost: 25000 },
    'Tunnel Construction': { multiplier: 2.5, baseCost: 35000 },
    'High-rise Building': { multiplier: 1.8, baseCost: 18000 },
    'Hospital Construction': { multiplier: 1.6, baseCost: 14000 },
    'School Construction': { multiplier: 1.2, baseCost: 7000 },
    'Airport Construction': { multiplier: 2.2, baseCost: 30000 },
    'Railway Construction': { multiplier: 1.9, baseCost: 20000 },
    'Water Treatment Plant': { multiplier: 1.7, baseCost: 16000 }
  },
  
  // Project Priority Multipliers
  PROJECT_PRIORITIES: {
    'Low': { multiplier: 0.9, urgencyFee: 0 },
    'Medium': { multiplier: 1.0, urgencyFee: 500 },
    'High': { multiplier: 1.2, urgencyFee: 1500 },
    'Critical': { multiplier: 1.5, urgencyFee: 3000 },
    'Emergency': { multiplier: 2.0, urgencyFee: 5000 }
  },
  
  // Worker Role Salaries (per hour)
  WORKER_ROLES: {
    'General Laborer': { hourlyRate: 15, overtimeRate: 22.5, skillLevel: 1 },
    'Carpenter': { hourlyRate: 25, overtimeRate: 37.5, skillLevel: 3 },
    'Mason/Bricklayer': { hourlyRate: 28, overtimeRate: 42, skillLevel: 3 },
    'Electrician': { hourlyRate: 35, overtimeRate: 52.5, skillLevel: 4 },
    'Plumber': { hourlyRate: 32, overtimeRate: 48, skillLevel: 4 },
    'Painter': { hourlyRate: 20, overtimeRate: 30, skillLevel: 2 },
    'Crane Operator': { hourlyRate: 45, overtimeRate: 67.5, skillLevel: 5 },
    'Heavy Equipment Operator': { hourlyRate: 40, overtimeRate: 60, skillLevel: 4 },
    'Welder': { hourlyRate: 30, overtimeRate: 45, skillLevel: 3 },
    'Roofer': { hourlyRate: 24, overtimeRate: 36, skillLevel: 3 },
    'Framer': { hourlyRate: 26, overtimeRate: 39, skillLevel: 3 },
    'HVAC Technician': { hourlyRate: 33, overtimeRate: 49.5, skillLevel: 4 },
    'Safety Inspector': { hourlyRate: 38, overtimeRate: 57, skillLevel: 4 },
    'Site Supervisor': { hourlyRate: 42, overtimeRate: 63, skillLevel: 5 },
    'Traffic Controller': { hourlyRate: 18, overtimeRate: 27, skillLevel: 2 },
    'Concrete Worker': { hourlyRate: 22, overtimeRate: 33, skillLevel: 2 },
    'Glazier': { hourlyRate: 29, overtimeRate: 43.5, skillLevel: 3 },
    'Power Line Technician': { hourlyRate: 48, overtimeRate: 72, skillLevel: 5 },
    'Maintenance Worker': { hourlyRate: 19, overtimeRate: 28.5, skillLevel: 2 },
    'Landscaper': { hourlyRate: 17, overtimeRate: 25.5, skillLevel: 2 }
  },
  
  // Engineer Specialty Salaries (per hour)
  ENGINEER_SPECIALTIES: {
    'Structural Engineering': { hourlyRate: 75, overtimeRate: 112.5, experience: 'Senior' },
    'Civil Engineering': { hourlyRate: 70, overtimeRate: 105, experience: 'Senior' },
    'Electrical Engineering': { hourlyRate: 68, overtimeRate: 102, experience: 'Senior' },
    'Mechanical Engineering': { hourlyRate: 65, overtimeRate: 97.5, experience: 'Senior' },
    'Environmental Engineering': { hourlyRate: 72, overtimeRate: 108, experience: 'Senior' },
    'Transportation Engineering': { hourlyRate: 74, overtimeRate: 111, experience: 'Senior' },
    'Geotechnical Engineering': { hourlyRate: 78, overtimeRate: 117, experience: 'Expert' },
    'Industrial Engineering': { hourlyRate: 66, overtimeRate: 99, experience: 'Senior' },
    'Fire Protection Engineering': { hourlyRate: 80, overtimeRate: 120, experience: 'Expert' },
    'Construction Technology': { hourlyRate: 62, overtimeRate: 93, experience: 'Mid' },
    'Project Engineering': { hourlyRate: 69, overtimeRate: 103.5, experience: 'Senior' },
    'Systems Engineering': { hourlyRate: 77, overtimeRate: 115.5, experience: 'Expert' },
    'HVAC Engineering': { hourlyRate: 64, overtimeRate: 96, experience: 'Senior' },
    'Lighting Design': { hourlyRate: 58, overtimeRate: 87, experience: 'Mid' },
    'Acoustical Engineering': { hourlyRate: 71, overtimeRate: 106.5, experience: 'Senior' },
    'Forensic Engineering': { hourlyRate: 85, overtimeRate: 127.5, experience: 'Expert' }
  },
  
  // Architect Specialty Salaries (per hour)
  ARCHITECT_SPECIALTIES: {
    'Commercial Architecture': { hourlyRate: 82, overtimeRate: 123, experience: 'Senior' },
    'Residential Architecture': { hourlyRate: 75, overtimeRate: 112.5, experience: 'Senior' },
    'Industrial Architecture': { hourlyRate: 78, overtimeRate: 117, experience: 'Senior' },
    'Landscape Architecture': { hourlyRate: 65, overtimeRate: 97.5, experience: 'Mid' },
    'Historic Preservation': { hourlyRate: 88, overtimeRate: 132, experience: 'Expert' },
    'Universal Design': { hourlyRate: 72, overtimeRate: 108, experience: 'Senior' },
    'Sustainable Design': { hourlyRate: 80, overtimeRate: 120, experience: 'Expert' },
    'Healthcare Architecture': { hourlyRate: 90, overtimeRate: 135, experience: 'Expert' },
    'Educational Architecture': { hourlyRate: 76, overtimeRate: 114, experience: 'Senior' },
    'Hospitality Architecture': { hourlyRate: 84, overtimeRate: 126, experience: 'Expert' },
    'Retail Architecture': { hourlyRate: 70, overtimeRate: 105, experience: 'Senior' },
    'Cultural Architecture': { hourlyRate: 86, overtimeRate: 129, experience: 'Expert' },
    'High-rise Design': { hourlyRate: 95, overtimeRate: 142.5, experience: 'Expert' },
    'Modern/Contemporary': { hourlyRate: 73, overtimeRate: 109.5, experience: 'Senior' },
    'CAD/BIM Specialist': { hourlyRate: 55, overtimeRate: 82.5, experience: 'Mid' },
    'Interior Architecture': { hourlyRate: 68, overtimeRate: 102, experience: 'Senior' }
  },
  
  // Material Costs (per unit)
  MATERIAL_COSTS: {
    'Concrete Blocks': { costPerUnit: 2.50, unit: 'block', category: 'Masonry' },
    'Lumber/Wood': { costPerUnit: 3.75, unit: 'board ft', category: 'Structural' },
    'Steel Beams': { costPerUnit: 125.00, unit: 'ton', category: 'Structural' },
    'Bricks': { costPerUnit: 0.85, unit: 'brick', category: 'Masonry' },
    'Cement': { costPerUnit: 12.50, unit: 'bag', category: 'Concrete' },
    'Gravel/Aggregate': { costPerUnit: 45.00, unit: 'ton', category: 'Concrete' },
    'Rebar': { costPerUnit: 0.75, unit: 'lb', category: 'Reinforcement' },
    'Glass Panels': { costPerUnit: 8.50, unit: 'sq ft', category: 'Glazing' },
    'Insulation': { costPerUnit: 1.25, unit: 'sq ft', category: 'Thermal' },
    'Roofing Materials': { costPerUnit: 4.20, unit: 'sq ft', category: 'Roofing' },
    'Doors': { costPerUnit: 285.00, unit: 'unit', category: 'Openings' },
    'Windows': { costPerUnit: 450.00, unit: 'unit', category: 'Openings' },
    'Electrical Wire': { costPerUnit: 2.15, unit: 'ft', category: 'Electrical' },
    'PVC Pipes': { costPerUnit: 3.80, unit: 'ft', category: 'Plumbing' },
    'Plumbing Fixtures': { costPerUnit: 325.00, unit: 'unit', category: 'Plumbing' },
    'Paint': { costPerUnit: 35.00, unit: 'gallon', category: 'Finishing' },
    'Nails/Screws': { costPerUnit: 0.08, unit: 'piece', category: 'Fasteners' },
    'Drywall': { costPerUnit: 1.15, unit: 'sq ft', category: 'Interior' },
    'Scaffolding': { costPerUnit: 15.00, unit: 'day', category: 'Safety' },
    'Safety Barriers': { costPerUnit: 25.00, unit: 'ft', category: 'Safety' },
    'Lighting Fixtures': { costPerUnit: 125.00, unit: 'unit', category: 'Electrical' },
    'Electrical Panels': { costPerUnit: 850.00, unit: 'unit', category: 'Electrical' },
    'HVAC Components': { costPerUnit: 1250.00, unit: 'unit', category: 'HVAC' },
    'Flooring Materials': { costPerUnit: 6.50, unit: 'sq ft', category: 'Flooring' },
    'Mortar': { costPerUnit: 8.75, unit: 'bag', category: 'Masonry' },
    'Hardware/Fasteners': { costPerUnit: 0.15, unit: 'piece', category: 'Fasteners' }
  },
  
  // Tool Costs (rental per day + purchase price)
  TOOL_COSTS: {
    'Hammer': { rentalPerDay: 5.00, purchasePrice: 25.00, category: 'Hand Tools' },
    'Circular Saw': { rentalPerDay: 15.00, purchasePrice: 150.00, category: 'Power Tools' },
    'Wrench Set': { rentalPerDay: 8.00, purchasePrice: 45.00, category: 'Hand Tools' },
    'Screwdriver Set': { rentalPerDay: 6.00, purchasePrice: 30.00, category: 'Hand Tools' },
    'Measuring Tape': { rentalPerDay: 3.00, purchasePrice: 15.00, category: 'Measuring' },
    'Level': { rentalPerDay: 7.00, purchasePrice: 35.00, category: 'Measuring' },
    'Power Drill': { rentalPerDay: 12.00, purchasePrice: 85.00, category: 'Power Tools' },
    'Angle Grinder': { rentalPerDay: 18.00, purchasePrice: 120.00, category: 'Power Tools' },
    'Excavator': { rentalPerDay: 350.00, purchasePrice: 125000.00, category: 'Heavy Equipment' },
    'Dump Truck': { rentalPerDay: 280.00, purchasePrice: 85000.00, category: 'Heavy Equipment' },
    'Crane': { rentalPerDay: 1200.00, purchasePrice: 500000.00, category: 'Heavy Equipment' },
    'Bulldozer': { rentalPerDay: 450.00, purchasePrice: 180000.00, category: 'Heavy Equipment' },
    'Welding Machine': { rentalPerDay: 45.00, purchasePrice: 850.00, category: 'Specialized' },
    'Plasma Cutter': { rentalPerDay: 65.00, purchasePrice: 1200.00, category: 'Specialized' },
    'Ladder': { rentalPerDay: 10.00, purchasePrice: 120.00, category: 'Access' },
    'Scaffolding System': { rentalPerDay: 25.00, purchasePrice: 850.00, category: 'Access' },
    'Air Compressor': { rentalPerDay: 35.00, purchasePrice: 650.00, category: 'Pneumatic' },
    'Jackhammer': { rentalPerDay: 55.00, purchasePrice: 750.00, category: 'Demolition' },
    'Concrete Mixer': { rentalPerDay: 40.00, purchasePrice: 2500.00, category: 'Concrete' },
    'Surveying Equipment': { rentalPerDay: 85.00, purchasePrice: 5500.00, category: 'Surveying' },
    'Safety Harness': { rentalPerDay: 8.00, purchasePrice: 125.00, category: 'Safety' },
    'Hard Hat': { rentalPerDay: 2.00, purchasePrice: 25.00, category: 'Safety' },
    'Safety Glasses': { rentalPerDay: 1.50, purchasePrice: 15.00, category: 'Safety' },
    'Work Gloves': { rentalPerDay: 2.50, purchasePrice: 18.00, category: 'Safety' },
    'Steel Toe Boots': { rentalPerDay: 4.00, purchasePrice: 85.00, category: 'Safety' },
    'Traffic Cones': { rentalPerDay: 1.00, purchasePrice: 12.00, category: 'Traffic Control' },
    'Clipboard/Tablet': { rentalPerDay: 15.00, purchasePrice: 350.00, category: 'Administrative' },
    'Construction Apps': { rentalPerDay: 5.00, purchasePrice: 120.00, category: 'Software' },
    'Inspection Tools': { rentalPerDay: 25.00, purchasePrice: 450.00, category: 'Quality Control' },
    'Generator': { rentalPerDay: 75.00, purchasePrice: 2800.00, category: 'Power' }
  }
};

// Export the model and configuration
module.exports = {
  FinancialDashboard: mongoose.model('FinancialDashboard', financialDashboardSchema),
  SALARY_CONFIG
};