const { FinancialDashboard, SALARY_CONFIG } = require('../Model/FinancialDashboardMdl');
const Project = require('../Model/ProjectModel');
const ProjectTimeline = require('../Model/ProjectTimelineMdl');

// Add PDFKit for PDF generation
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Helper function to generate unique dashboard ID
const generateDashboardId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `FDASH-${timestamp}-${randomStr}`.toUpperCase();
};

// Calculate labor costs based on roles and hours
const calculateLaborCosts = (workers, engineers, architects, projectManagers) => {
  let totalLaborCost = 0;
  const laborBreakdown = [];

  // Calculate worker costs
  workers.forEach(worker => {
    if (worker && worker.role && worker.hoursWorked) {
      const roleConfig = SALARY_CONFIG.WORKER_ROLES[worker.role];
      if (roleConfig) {
        const cost = parseFloat(worker.hoursWorked) * roleConfig.hourlyRate;
        totalLaborCost += cost;
        laborBreakdown.push({
          type: 'Worker',
          name: worker.name || 'Unknown',
          role: worker.role,
          hours: parseFloat(worker.hoursWorked),
          rate: roleConfig.hourlyRate,
          cost: cost
        });
      } else {
        // Use default rate if role not found
        const defaultRate = 15; // Default worker rate
        const cost = parseFloat(worker.hoursWorked) * defaultRate;
        totalLaborCost += cost;
        laborBreakdown.push({
          type: 'Worker',
          name: worker.name || 'Unknown',
          role: worker.role,
          hours: parseFloat(worker.hoursWorked),
          rate: defaultRate,
          cost: cost
        });
      }
    }
  });

  // Calculate engineer costs
  engineers.forEach(engineer => {
    if (engineer && engineer.specialty && engineer.hoursWorked) {
      const roleConfig = SALARY_CONFIG.ENGINEER_SPECIALTIES[engineer.specialty];
      if (roleConfig) {
        const cost = parseFloat(engineer.hoursWorked) * roleConfig.hourlyRate;
        totalLaborCost += cost;
        laborBreakdown.push({
          type: 'Engineer',
          name: engineer.name || 'Unknown',
          role: engineer.specialty,
          hours: parseFloat(engineer.hoursWorked),
          rate: roleConfig.hourlyRate,
          cost: cost
        });
      } else {
        // Use default rate if specialty not found
        const defaultRate = 70; // Default engineer rate
        const cost = parseFloat(engineer.hoursWorked) * defaultRate;
        totalLaborCost += cost;
        laborBreakdown.push({
          type: 'Engineer',
          name: engineer.name || 'Unknown',
          role: engineer.specialty,
          hours: parseFloat(engineer.hoursWorked),
          rate: defaultRate,
          cost: cost
        });
      }
    }
  });

  // Calculate architect costs
  architects.forEach(architect => {
    if (architect && architect.specialty && architect.hoursWorked) {
      const roleConfig = SALARY_CONFIG.ARCHITECT_SPECIALTIES[architect.specialty];
      if (roleConfig) {
        const cost = parseFloat(architect.hoursWorked) * roleConfig.hourlyRate;
        totalLaborCost += cost;
        laborBreakdown.push({
          type: 'Architect',
          name: architect.name || 'Unknown',
          role: architect.specialty,
          hours: parseFloat(architect.hoursWorked),
          rate: roleConfig.hourlyRate,
          cost: cost
        });
      } else {
        // Use default rate if specialty not found
        const defaultRate = 75; // Default architect rate
        const cost = parseFloat(architect.hoursWorked) * defaultRate;
        totalLaborCost += cost;
        laborBreakdown.push({
          type: 'Architect',
          name: architect.name || 'Unknown',
          role: architect.specialty,
          hours: parseFloat(architect.hoursWorked),
          rate: defaultRate,
          cost: cost
        });
      }
    }
  });

  // Calculate project manager costs (estimated 8 hours per day)
  projectManagers.forEach(pm => {
    if (pm && pm.name) {
      const avgPMRate = 85; // Average PM hourly rate
      const estimatedHours = 8; // Standard working day
      const cost = estimatedHours * avgPMRate;
      totalLaborCost += cost;
      laborBreakdown.push({
        type: 'Project Manager',
        name: pm.name,
        role: 'Project Manager',
        hours: estimatedHours,
        rate: avgPMRate,
        cost: cost
      });
    }
  });

  return { totalLaborCost, laborBreakdown };
};

// Calculate material costs
const calculateMaterialCosts = (materials) => {
  let totalMaterialCost = 0;
  const materialBreakdown = [];

  console.log('🧱 Processing materials:', materials);
  
  materials.forEach(material => {
    if (material && material.name && material.quantity) {
      const materialConfig = SALARY_CONFIG.MATERIAL_COSTS[material.name];
      if (materialConfig) {
        const quantity = parseFloat(material.quantity);
        const cost = quantity * materialConfig.costPerUnit;
        totalMaterialCost += cost;
        materialBreakdown.push({
          name: material.name,
          quantity: quantity,
          unit: material.unit || materialConfig.unit,
          unitCost: materialConfig.costPerUnit,
          totalCost: cost,
          category: materialConfig.category
        });
        console.log(`  Material ${material.name}: ${quantity} ${material.unit || materialConfig.unit} * $${materialConfig.costPerUnit}/${material.unit || materialConfig.unit} = $${cost}`);
      } else if (material.cost) {
        // Use provided cost if no predefined cost available
        const cost = parseFloat(material.cost);
        const quantity = parseFloat(material.quantity || 1);
        totalMaterialCost += cost;
        materialBreakdown.push({
          name: material.name,
          quantity: quantity,
          unit: material.unit || 'unit',
          unitCost: quantity > 0 ? cost / quantity : 0,
          totalCost: cost,
          category: 'Custom'
        });
        console.log(`  Material ${material.name}: $${cost} (provided cost)`);
      } else {
        // Use default cost if no configuration and no cost provided
        const defaultCostPerUnit = 10; // Default material cost
        const quantity = parseFloat(material.quantity);
        const cost = quantity * defaultCostPerUnit;
        totalMaterialCost += cost;
        materialBreakdown.push({
          name: material.name,
          quantity: quantity,
          unit: material.unit || 'unit',
          unitCost: defaultCostPerUnit,
          totalCost: cost,
          category: 'Default'
        });
        console.log(`  Material ${material.name}: ${quantity} units * $${defaultCostPerUnit}/unit = $${cost} (default rate)`);
      }
    }
  });

  console.log(`  Total material cost: $${totalMaterialCost}`);
  return { totalMaterialCost, materialBreakdown };
};

// Calculate tool costs
const calculateToolCosts = (tools) => {
  let totalToolCost = 0;
  const toolBreakdown = [];

  tools.forEach(tool => {
    if (tool && tool.name && tool.quantity) {
      const toolConfig = SALARY_CONFIG.TOOL_COSTS[tool.name];
      if (toolConfig) {
        // Calculate cost based on rental period or default to 1 day
        const rentalDays = tool.rentalDays ? parseFloat(tool.rentalDays) : 1;
        const cost = parseFloat(tool.quantity) * toolConfig.rentalPerDay * rentalDays;
        totalToolCost += cost;
        toolBreakdown.push({
          name: tool.name,
          quantity: parseFloat(tool.quantity),
          rentalDays: rentalDays,
          dailyRate: toolConfig.rentalPerDay,
          totalCost: cost,
          category: toolConfig.category,
          status: tool.status
        });
      } else {
        // Use default rental rate if tool not found
        const defaultRentalRate = 20; // Default tool rental rate per day
        const rentalDays = tool.rentalDays ? parseFloat(tool.rentalDays) : 1;
        const cost = parseFloat(tool.quantity) * defaultRentalRate * rentalDays;
        totalToolCost += cost;
        toolBreakdown.push({
          name: tool.name,
          quantity: parseFloat(tool.quantity),
          rentalDays: rentalDays,
          dailyRate: defaultRentalRate,
          totalCost: cost,
          category: 'Default',
          status: tool.status
        });
      }
    }
  });

  return { totalToolCost, toolBreakdown };
};

// Calculate project-specific costs based on type and priority
const calculateProjectCosts = (project) => {
  let projectCost = 0;
  let projectMultiplier = 1.0;

  // Apply project type multiplier
  const typeConfig = SALARY_CONFIG.PROJECT_TYPES[project.ptype];
  if (typeConfig) {
    projectCost += typeConfig.baseCost;
    projectMultiplier *= typeConfig.multiplier;
  }

  // Apply project priority multiplier
  const priorityConfig = SALARY_CONFIG.PROJECT_PRIORITIES[project.ppriority];
  if (priorityConfig) {
    projectCost += priorityConfig.urgencyFee;
    projectMultiplier *= priorityConfig.multiplier;
  }

  return { projectCost, projectMultiplier };
};

// Get all financial dashboards
const getAllDashboards = async (req, res) => {
  try {
    const dashboards = await FinancialDashboard.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: `Found ${dashboards.length} financial dashboards`,
      count: dashboards.length,
      data: dashboards
    });
  } catch (error) {
    console.error('Error fetching financial dashboards:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching financial dashboards',
      error: error.message
    });
  }
};

// Get single financial dashboard by ID
const getDashboardById = async (req, res) => {
  try {
    // First try to find by MongoDB _id
    // We need to handle the case where req.params.id is not a valid ObjectId
    let dashboard = null;
    
    // Check if the ID looks like a MongoDB ObjectId (24-character hex string)
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      dashboard = await FinancialDashboard.findById(req.params.id);
    }
    
    // If not found or not a valid ObjectId, try to find by dashboardId field
    if (!dashboard) {
      dashboard = await FinancialDashboard.findOne({ dashboardId: req.params.id });
    }
    
    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Financial dashboard not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Financial dashboard retrieved successfully',
      data: dashboard
    });
  } catch (error) {
    console.error('Error fetching financial dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching financial dashboard',
      error: error.message
    });
  }
};

// Calculate comprehensive financial dashboard
const calculateFinancialDashboard = async (req, res) => {
  try {
    const { dashboardName, selectedProjects, dateFrom, dateTo, calculationType } = req.body;

    console.log('🔢 Starting financial calculations...');
    console.log('📊 Selected projects:', selectedProjects);
    console.log('📅 Date range:', { dateFrom, dateTo });
    console.log('🧮 Calculation type:', calculationType);

    // Get all projects if none specified
    let projectQuery = {};
    if (selectedProjects && selectedProjects.length > 0) {
      projectQuery = { pcode: { $in: selectedProjects } };
    }

    const projects = await Project.find(projectQuery);
    console.log(`📋 Found ${projects.length} projects for calculation`);

    // Get timeline data
    let timelineQuery = {};
    if (selectedProjects && selectedProjects.length > 0) {
      timelineQuery.pcode = { $in: selectedProjects };
    }
    if (dateFrom || dateTo) {
      timelineQuery.date = {};
      if (dateFrom) timelineQuery.date.$gte = new Date(dateFrom);
      if (dateTo) timelineQuery.date.$lte = new Date(dateTo);
    }

    const timelines = await ProjectTimeline.find(timelineQuery);
    console.log(`📈 Found ${timelines.length} timeline entries for calculation`);

    // Initialize calculation variables
    let totalProjectCost = 0;
    let totalLaborCost = 0;
    let totalMaterialCost = 0;
    let totalToolCost = 0;
    let totalExpenses = 0;
    const projectBreakdown = [];
    const laborAnalytics = {
      totalWorkers: 0,
      totalEngineers: 0,
      totalArchitects: 0,
      totalProjectManagers: 0,
      totalLaborHours: 0,
      laborByRole: []
    };
    const materialAnalytics = { totalMaterials: 0, materialsByType: [] };
    const toolAnalytics = { totalTools: 0, toolsByType: [] };

    // Process each project
    for (const project of projects) {
      console.log(`💼 Processing project: ${project.pcode} - ${project.pname}`);

      // Calculate base project costs
      const { projectCost, projectMultiplier } = calculateProjectCosts(project);

      // Get timelines for this project
      const projectTimelines = timelines.filter(t => t.pcode === project.pcode);
      console.log(`📊 Found ${projectTimelines.length} timelines for project ${project.pcode}`);

      let projectLaborCost = 0;
      let projectMaterialCost = 0;
      let projectToolCost = 0;
      let projectExpenses = 0;
      let projectWorkerCount = 0;
      let projectEngineerCount = 0;
      let projectArchitectCount = 0;
      let projectPMCount = 0;
      const timelineDetails = [];

      // Process each timeline entry for this project
      for (const timeline of projectTimelines) {
        console.log(`📅 Processing timeline for ${timeline.date}`);
        
        // Log the data we're working with
        console.log('👷 Workers:', timeline.tworker);
        console.log('👨‍🔧 Engineers:', timeline.tengineer);
        console.log('👨‍🎨 Architects:', timeline.tarchitect);
        console.log('🧱 Materials:', timeline.tmaterials);
        console.log('🛠️ Tools:', timeline.ttools);
        console.log('💰 Expenses:', timeline.texpenses);

        // Calculate costs for this timeline entry
        const { totalLaborCost: timelineLaborCost, laborBreakdown } = calculateLaborCosts(
          timeline.tworker || [],
          timeline.tengineer || [],
          timeline.tarchitect || [],
          timeline.tprojectManager || []
        );

        const { totalMaterialCost: timelineMaterialCost, materialBreakdown } = calculateMaterialCosts(
          timeline.tmaterials || []
        );

        const { totalToolCost: timelineToolCost, toolBreakdown } = calculateToolCosts(
          timeline.ttools || []
        );

        // Debug logging for cost calculations
        console.log(`🔍 Cost breakdown for timeline ${timeline._id} - Labor: $${timelineLaborCost}, Materials: $${timelineMaterialCost}, Tools: $${timelineToolCost}`);
        if (laborBreakdown.length > 0) {
          console.log(`👷 Labor details:`, laborBreakdown);
        }
        if (materialBreakdown.length > 0) {
          console.log(`🧱 Material details:`, materialBreakdown);
        }
        if (toolBreakdown.length > 0) {
          console.log(`🛠️ Tool details:`, toolBreakdown);
        }

        // Calculate expenses
        const timelineExpenses = (timeline.texpenses || []).reduce((sum, exp) => {
          // Handle both amount and cost fields for backward compatibility
          const amount = parseFloat(exp.amount) || parseFloat(exp.cost) || 0;
          return sum + amount;
        }, 0);

        console.log(`💰 Timeline costs - Labor: $${timelineLaborCost}, Materials: $${timelineMaterialCost}, Tools: $${timelineToolCost}, Expenses: $${timelineExpenses}`);

        // Apply project multiplier to all costs
        const adjustedLaborCost = timelineLaborCost * projectMultiplier;
        const adjustedMaterialCost = timelineMaterialCost * projectMultiplier;
        const adjustedToolCost = timelineToolCost * projectMultiplier;
        const adjustedExpenses = timelineExpenses * projectMultiplier;

        projectLaborCost += adjustedLaborCost;
        projectMaterialCost += adjustedMaterialCost;
        projectToolCost += adjustedToolCost;
        projectExpenses += adjustedExpenses;

        // Count resources
        projectWorkerCount += (timeline.tworker || []).length;
        projectEngineerCount += (timeline.tengineer || []).length;
        projectArchitectCount += (timeline.tarchitect || []).length;
        projectPMCount += (timeline.tprojectManager || []).length;

        // Store timeline details
        timelineDetails.push({
          date: timeline.date,
          dailyCost: adjustedLaborCost + adjustedMaterialCost + adjustedToolCost + adjustedExpenses,
          workers: (timeline.tworker || []).length,
          engineers: (timeline.tengineer || []).length,
          architects: (timeline.tarchitect || []).length,
          materials: adjustedMaterialCost,
          tools: adjustedToolCost,
          expenses: adjustedExpenses
        });

        // Update analytics
        laborAnalytics.totalWorkers += (timeline.tworker || []).length;
        laborAnalytics.totalEngineers += (timeline.tengineer || []).length;
        laborAnalytics.totalArchitects += (timeline.tarchitect || []).length;
        laborAnalytics.totalProjectManagers += (timeline.tprojectManager || []).length;

        // Count labor hours and aggregate by role
        laborBreakdown.forEach(labor => {
          laborAnalytics.totalLaborHours += labor.hours || 0;
          
          // Find existing role entry or create new one
          const existingRole = laborAnalytics.laborByRole.find(item => item.role === labor.role);
          if (existingRole) {
            existingRole.count += 1;
            existingRole.totalHours += labor.hours || 0;
            existingRole.totalCost += labor.cost || 0;
            existingRole.averageRate = existingRole.totalHours > 0 ? existingRole.totalCost / existingRole.totalHours : 0;
          } else {
            laborAnalytics.laborByRole.push({
              role: labor.role,
              count: 1,
              totalHours: labor.hours || 0,
              totalCost: labor.cost || 0,
              averageRate: labor.rate || 0
            });
          }
        });

        // Aggregate materials by type
        materialBreakdown.forEach(material => {
          materialAnalytics.totalMaterials += 1;
          
          // Find existing material entry or create new one
          const existingMaterial = materialAnalytics.materialsByType.find(item => item.name === material.name);
          if (existingMaterial) {
            existingMaterial.totalQuantity += material.quantity || 0;
            existingMaterial.totalCost += material.totalCost || 0;
            existingMaterial.averageCost = existingMaterial.totalQuantity > 0 ? existingMaterial.totalCost / existingMaterial.totalQuantity : 0;
          } else {
            materialAnalytics.materialsByType.push({
              name: material.name,
              totalQuantity: material.quantity || 0,
              totalCost: material.totalCost || 0,
              averageCost: material.unitCost || 0,
              unit: material.unit || 'unit'
            });
          }
        });

        // Aggregate tools by type
        toolBreakdown.forEach(tool => {
          toolAnalytics.totalTools += 1;
          
          // Find existing tool entry or create new one
          const existingTool = toolAnalytics.toolsByType.find(item => item.name === tool.name);
          if (existingTool) {
            existingTool.totalQuantity += tool.quantity || 0;
            existingTool.totalCost += tool.totalCost || 0;
            existingTool.averageCost = existingTool.totalQuantity > 0 ? existingTool.totalCost / existingTool.totalQuantity : 0;
          } else {
            toolAnalytics.toolsByType.push({
              name: tool.name,
              totalQuantity: tool.quantity || 0,
              totalCost: tool.totalCost || 0,
              averageCost: tool.dailyRate || 0,
              status: tool.status || 'Unknown'
            });
          }
        });
      }

      // Calculate total project cost
      const totalProjectCostForThisProject = projectCost + projectLaborCost + projectMaterialCost + projectToolCost + projectExpenses;

      console.log(`📊 Project ${project.pcode} total cost: $${totalProjectCostForThisProject} (Base: $${projectCost}, Labor: $${projectLaborCost}, Materials: $${projectMaterialCost}, Tools: $${projectToolCost}, Expenses: $${projectExpenses})`);

      // Add to project breakdown
      projectBreakdown.push({
        projectCode: project.pcode,
        projectName: project.pname,
        projectType: project.ptype,
        projectPriority: project.ppriority,
        totalCost: totalProjectCostForThisProject,
        baseCost: projectCost,
        laborCost: projectLaborCost,
        materialCost: projectMaterialCost,
        toolCost: projectToolCost,
        expenses: projectExpenses,
        workerCount: projectWorkerCount,
        engineerCount: projectEngineerCount,
        architectCount: projectArchitectCount,
        pmCount: projectPMCount,
        timeline: timelineDetails
      });

      // Add to totals
      totalProjectCost += totalProjectCostForThisProject;
      totalLaborCost += projectLaborCost;
      totalMaterialCost += projectMaterialCost;
      totalToolCost += projectToolCost;
      totalExpenses += projectExpenses;
    }

    // Calculate financial summary
    const grandTotal = totalProjectCost;
    const averageProjectCost = projects.length > 0 ? grandTotal / projects.length : 0;
    const profitMargin = grandTotal * 0.15; // Assume 15% profit margin
    const roi = grandTotal > 0 ? (profitMargin / grandTotal) * 100 : 0;

    console.log(`💰 Final totals - Grand Total: $${grandTotal}, Labor: $${totalLaborCost}, Materials: $${totalMaterialCost}, Tools: $${totalToolCost}, Expenses: $${totalExpenses}`);

    // Create financial dashboard
    const dashboardData = {
      dashboardId: generateDashboardId(),
      dashboardName: dashboardName || `Financial Analysis - ${new Date().toLocaleDateString()}`,
      calculationDate: new Date(),
      selectedProjects: selectedProjects || [],
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      totalProjectCost,
      totalLaborCost,
      totalMaterialCost,
      totalToolCost,
      totalExpenses,
      projectBreakdown,
      laborAnalytics: {
        totalWorkers: laborAnalytics.totalWorkers || 0,
        totalEngineers: laborAnalytics.totalEngineers || 0,
        totalArchitects: laborAnalytics.totalArchitects || 0,
        totalProjectManagers: laborAnalytics.totalProjectManagers || 0,
        totalLaborHours: laborAnalytics.totalLaborHours || 0,
        averageHourlyRate: laborAnalytics.totalLaborHours > 0 ? totalLaborCost / laborAnalytics.totalLaborHours : 0,
        laborByRole: Array.isArray(laborAnalytics.laborByRole) ? laborAnalytics.laborByRole.map(item => ({ ...item })) : []
      },
      materialAnalytics: {
        totalMaterials: materialAnalytics.totalMaterials || 0,
        materialsByType: Array.isArray(materialAnalytics.materialsByType) ? materialAnalytics.materialsByType.map(item => ({ ...item })) : []
      },
      toolAnalytics: {
        totalTools: toolAnalytics.totalTools || 0,
        toolsByType: Array.isArray(toolAnalytics.toolsByType) ? toolAnalytics.toolsByType.map(item => ({ ...item })) : []
      },
      financialSummary: {
        grandTotal,
        projectCount: projects.length,
        timelineEntries: timelines.length,
        averageProjectCost,
        profitMargin,
        roi
      }
    };

    const dashboard = new FinancialDashboard(dashboardData);
    const savedDashboard = await dashboard.save();

    console.log('✅ Financial dashboard calculation completed');
    console.log(`💰 Grand Total: $${grandTotal.toFixed(2)}`);

    res.status(201).json({
      success: true,
      message: 'Financial dashboard calculated and saved successfully',
      data: savedDashboard
    });

  } catch (error) {
    console.error('❌ Error calculating financial dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating financial dashboard',
      error: error.message
    });
  }
};

// Update financial dashboard
const updateDashboard = async (req, res) => {
  try {
    // First try to find by MongoDB _id
    // We need to handle the case where req.params.id is not a valid ObjectId
    let dashboard = null;
    
    // Check if the ID looks like a MongoDB ObjectId (24-character hex string)
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      dashboard = await FinancialDashboard.findByIdAndUpdate(
        req.params.id,
        { ...req.body, lastUpdated: new Date() },
        { new: true, runValidators: true }
      );
    }
    
    // If not found or not a valid ObjectId, try to find by dashboardId field
    if (!dashboard) {
      dashboard = await FinancialDashboard.findOneAndUpdate(
        { dashboardId: req.params.id },
        { ...req.body, lastUpdated: new Date() },
        { new: true, runValidators: true }
      );
    }

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Financial dashboard not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Financial dashboard updated successfully',
      data: dashboard
    });
  } catch (error) {
    console.error('Error updating financial dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating financial dashboard',
      error: error.message
    });
  }
};

// Delete financial dashboard
const deleteDashboard = async (req, res) => {
  try {
    // First try to find by MongoDB _id
    // We need to handle the case where req.params.id is not a valid ObjectId
    let dashboard = null;
    
    // Check if the ID looks like a MongoDB ObjectId (24-character hex string)
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      dashboard = await FinancialDashboard.findByIdAndDelete(req.params.id);
    }
    
    // If not found or not a valid ObjectId, try to find by dashboardId field
    if (!dashboard) {
      dashboard = await FinancialDashboard.findOneAndDelete({ dashboardId: req.params.id });
    }

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Financial dashboard not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Financial dashboard deleted successfully',
      data: dashboard
    });
  } catch (error) {
    console.error('Error deleting financial dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting financial dashboard',
      error: error.message
    });
  }
};

// Get salary configuration
const getSalaryConfig = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Salary configuration retrieved successfully',
      data: SALARY_CONFIG
    });
  } catch (error) {
    console.error('Error getting salary config:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting salary configuration',
      error: error.message
    });
  }
};

// Get available projects for selection
const getAvailableProjects = async (req, res) => {
  try {
    const projects = await Project.find({}, 'pcode pname ptype ppriority pstatus plocation').sort({ pname: 1 });
    
    res.status(200).json({
      success: true,
      message: `Found ${projects.length} available projects`,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching available projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available projects',
      error: error.message
    });
  }
};

// Export financial dashboard to PDF
const exportDashboard = async (req, res) => {
  try {
    // First try to find by MongoDB _id
    // We need to handle the case where req.params.id is not a valid ObjectId
    let dashboard = null;
    
    // Check if the ID looks like a MongoDB ObjectId (24-character hex string)
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      dashboard = await FinancialDashboard.findById(req.params.id);
    }
    
    // If not found or not a valid ObjectId, try to find by dashboardId field
    if (!dashboard) {
      dashboard = await FinancialDashboard.findOne({ dashboardId: req.params.id });
    }
    
    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Financial dashboard not found'
      });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=financial-dashboard-${dashboard.dashboardId}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add company header
    doc.fontSize(20).fillColor('#283593').text('Workflows Engineering', 50, 50);
    doc.fontSize(12).fillColor('#666').text('Smart Construction Workflow & Safety Management System', 50, 80);
    doc.moveDown();

    // Add a line separator
    doc.moveTo(50, 100).lineTo(550, 100).strokeColor('#D4AF37').stroke();

    // Dashboard title
    doc.fontSize(18).fillColor('#000').text(`Financial Dashboard Report: ${dashboard.dashboardName}`, { align: 'center' });
    doc.moveDown();

    // Dashboard information
    doc.fontSize(14).fillColor('#000').text('Dashboard Information');
    doc.moveDown();

    // Dashboard details
    doc.fontSize(12);
    doc.text(`Dashboard ID: ${dashboard.dashboardId}`);
    doc.text(`Calculation Date: ${new Date(dashboard.calculationDate).toLocaleDateString()}`);
    doc.text(`Projects Analyzed: ${dashboard.financialSummary?.projectCount || 0}`);
    doc.moveDown();

    // Financial Summary
    doc.fontSize(14).fillColor('#000').text('Financial Summary');
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Grand Total: $${(dashboard.financialSummary?.grandTotal || 0).toFixed(2)}`);
    doc.text(`Average Project Cost: $${(dashboard.financialSummary?.averageProjectCost || 0).toFixed(2)}`);
    doc.text(`Profit Margin: $${(dashboard.financialSummary?.profitMargin || 0).toFixed(2)}`);
    doc.text(`ROI: ${(dashboard.financialSummary?.roi || 0).toFixed(2)}%`);
    doc.moveDown();

    // Cost Breakdown
    doc.fontSize(14).fillColor('#000').text('Cost Breakdown');
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Labor Costs: $${(dashboard.totalLaborCost || 0).toFixed(2)}`);
    doc.text(`Material Costs: $${(dashboard.totalMaterialCost || 0).toFixed(2)}`);
    doc.text(`Tool Costs: $${(dashboard.totalToolCost || 0).toFixed(2)}`);
    doc.text(`Expenses: $${(dashboard.totalExpenses || 0).toFixed(2)}`);
    doc.text(`Project Costs: $${(dashboard.totalProjectCost || 0).toFixed(2)}`);
    doc.moveDown();

    // Project Breakdown (if available)
    if (dashboard.projectBreakdown && dashboard.projectBreakdown.length > 0) {
      doc.fontSize(14).fillColor('#000').text('Project Breakdown');
      doc.moveDown();

      dashboard.projectBreakdown.forEach((project, index) => {
        doc.fontSize(12);
        doc.text(`${index + 1}. ${project.projectName || project.projectCode}`);
        doc.fontSize(10);
        doc.text(`   Type: ${project.projectType || 'N/A'}`);
        doc.text(`   Total Cost: $${(project.totalCost || 0).toFixed(2)}`);
        doc.text(`   Labor: $${(project.laborCost || 0).toFixed(2)}`);
        doc.text(`   Materials: $${(project.materialCost || 0).toFixed(2)}`);
        doc.text(`   Tools: $${(project.toolCost || 0).toFixed(2)}`);
        doc.moveDown();
      });
    }

    // Add footer
    const footerText = 'CONFIDENTIAL - Workflows Engineering Financial Dashboard';
    doc.fontSize(10).fillColor('#999');
    doc.text(footerText, 50, 750);

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error exporting financial dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting financial dashboard',
      error: error.message
    });
  }
};

module.exports = {
  getAllDashboards,
  getDashboardById,
  calculateFinancialDashboard,
  updateDashboard,
  deleteDashboard,
  getSalaryConfig,
  getAvailableProjects,
  exportDashboard  // Add export function to exports
};