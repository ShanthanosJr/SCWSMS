// controllers/timelineController.js
const ProjectTimeline = require('../Model/ProjectTimelineMdl');
const axios = require('axios');

// Function to fetch project details with multiple endpoint attempts
const fetchProjectDetails = async (projectCode) => {
  console.log('🔍 Attempting to fetch project with Code:', projectCode);
  
  // Try different endpoints to find project by code
  const endpoints = [
    `http://localhost:5050/projects/code/${projectCode}`,
    `http://localhost:5050/project/code/${projectCode}`,
    `http://localhost:5050/api/projects/code/${projectCode}`,
    `http://localhost:5050/api/project/code/${projectCode}`
  ];
  
  // If code endpoints don't work, try searching all projects and filter by pcode
  const searchEndpoints = [
    `http://localhost:5050/projects`,
    `http://localhost:5050/project`,
    `http://localhost:5050/api/projects`,
    `http://localhost:5050/api/project`
  ];
  
  // Try specific code endpoints first
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Trying endpoint: ${endpoint}`);
      const response = await axios.get(endpoint);
      console.log('✅ Success! Response data:', response.data);
      
      let projectData = response.data;
      if (response.data.project) {
        projectData = response.data.project;
      }
      
      if (projectData && (projectData.pname || projectData.name)) {
        return {
          pname: projectData.pname || projectData.name,
          powner: projectData.pownername || projectData.powner || projectData.owner,
          pcreatedAt: projectData.pcreatedat || projectData.createdAt || projectData.created_at,
          pstatus: projectData.pstatus || projectData.status,
          plocation: projectData.plocation || projectData.location,
          pnumber: projectData.pnumber || projectData.number,
          pcode: projectData.pcode || projectData.code
        };
      }
    } catch (error) {
      console.log(`❌ Failed: ${endpoint} - ${error.response?.status || error.message}`);
    }
  }
  
  // Try searching all projects and filter by pcode
  for (const endpoint of searchEndpoints) {
    try {
      console.log(`📡 Searching all projects in: ${endpoint}`);
      const response = await axios.get(endpoint);
      console.log('🔍 Got projects list, searching for code:', projectCode);
      
      let projects = response.data;
      if (response.data.projects) {
        projects = response.data.projects;
      }
      
      if (Array.isArray(projects)) {
        const project = projects.find(p => 
          p.pcode === projectCode || 
          p.code === projectCode ||
          p.pnumber === projectCode ||
          p.number === projectCode
        );
        
        if (project) {
          console.log('✅ Found project by code:', project);
          return {
            pname: project.pname || project.name,
            powner: project.pownername || project.powner || project.owner,
            pcreatedAt: project.pcreatedat || project.createdAt || project.created_at,
            pstatus: project.pstatus || project.status,
            plocation: project.plocation || project.location,
            pnumber: project.pnumber || project.number,
            pcode: project.pcode || project.code
          };
        }
      }
    } catch (error) {
      console.log(`❌ Failed to search projects: ${endpoint} - ${error.response?.status || error.message}`);
    }
  }
  
  console.log('🔍 All endpoints failed. Project not found.');
  return null;
};

// Validate if project exists
exports.validateProject = async (req, res) => {
  try {
    const { projectCode } = req.params;
    console.log('🔍 Validating project code:', projectCode);
    
    if (!projectCode || projectCode.trim() === '') {
      return res.status(400).json({ 
        message: "Project code is required",
        valid: false 
      });
    }
    
    const projectDetails = await fetchProjectDetails(projectCode);
    
    if (!projectDetails) {
      console.log('❌ Project validation failed for code:', projectCode);
      return res.status(404).json({ 
        message: "Project not found. Please check if the project exists and the code is correct.",
        valid: false,
        searchedCode: projectCode
      });
    }
    
    console.log('✅ Project validation successful:', projectDetails);
    res.status(200).json({
      valid: true,
      projectDetails
    });
  } catch (error) {
    console.error('💥 Error in validateProject:', error);
    res.status(500).json({ 
      message: "Error validating project", 
      error: error.message 
    });
  }
};

// Get all timelines with optional project filtering
exports.getAllTimelines = async (req, res) => {
  try {
    const { pcode } = req.query;
    let filter = {};

    if (pcode) {
      filter.pcode = pcode;
    }
    
    const timelines = await ProjectTimeline.find(filter).sort({ date: -1 });
    res.status(200).json(timelines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timelines", error });
  }
};

// Get timelines by project
exports.getTimelinesByProject = async (req, res) => {
  try {
    const { projectCode } = req.params;
    const timelines = await ProjectTimeline.find({ pcode: projectCode }).sort({ date: -1 });
    res.status(200).json(timelines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project timelines", error });
  }
};

// Get a timeline by ID
exports.getTimelineById = async (req, res) => {
  try {
    const timeline = await ProjectTimeline.findById(req.params.id);
    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }
    res.status(200).json(timeline);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timeline", error });
  }
};

// Create new timeline
exports.createTimeline = async (req, res) => {
  try {
    const { projectCode } = req.body;
    console.log('🆕 Creating timeline for project code:', projectCode);
    console.log('📝 Full request body:', req.body);

    if (!projectCode) {
      return res.status(400).json({ 
        message: "Project code is required" 
      });
    }

    // Validate project exists
    const projectDetails = await fetchProjectDetails(projectCode);
    if (!projectDetails) {
      console.log('❌ Project not found during timeline creation:', projectCode);
      return res.status(404).json({ 
        message: "Project not found. Please verify the Project Code exists in the database." 
      });
    }
    
    console.log('✅ Project found, creating timeline with details:', projectDetails);
    
    // Prepare timeline data
    const timelineData = {
      ...req.body,
      pcode: projectCode, // Store as pcode in database
      projectDetails: projectDetails,
      workerCount: req.body.tworker?.length || 0,
      tengineerCount: req.body.tengineer?.length || 0,
      architectCount: req.body.tarchitect?.length || 0
    };
    
    // Remove the projectCode field to avoid duplication
    delete timelineData.projectCode;
    
    console.log('💾 Saving timeline data:', timelineData);
    
    const newTimeline = new ProjectTimeline(timelineData);
    const savedTimeline = await newTimeline.save();
    
    console.log('✅ Timeline created successfully:', savedTimeline._id);
    res.status(201).json(savedTimeline);
  } catch (error) {
    console.error('💥 Error creating timeline:', error);
    res.status(500).json({ 
      message: "Error creating timeline", 
      error: error.message,
      details: error.stack 
    });
  }
};

// Update timeline
exports.updateTimeline = async (req, res) => {
  try {
    const { projectCode } = req.body;

    // If projectCode is being changed, validate the new project
    if (projectCode) {
      const projectDetails = await fetchProjectDetails(projectCode);
      if (!projectDetails) {
        return res.status(404).json({ 
          message: "Project not found. Please verify the Project Code." 
        });
      }
      req.body.pcode = projectCode;
      req.body.projectDetails = projectDetails;
      // Remove the projectCode field to avoid duplication
      delete req.body.projectCode;
    }
    
    // Auto calculate counts
    req.body.workerCount = req.body.tworker?.length || 0;
    req.body.tengineerCount = req.body.tengineer?.length || 0;
    req.body.architectCount = req.body.tarchitect?.length || 0;
    
    const updatedTimeline = await ProjectTimeline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTimeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    res.status(200).json(updatedTimeline);
  } catch (error) {
    res.status(500).json({ message: "Error updating timeline", error });
  }
};

// Delete timeline
exports.deleteTimeline = async (req, res) => {
  try {
    const deletedTimeline = await ProjectTimeline.findByIdAndDelete(req.params.id);

    if (!deletedTimeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    res.status(200).json({ message: "Timeline deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting timeline", error });
  }
};

// Get project summary (statistics)
exports.getProjectSummary = async (req, res) => {
  try {
    const { projectCode } = req.params;

    const timelines = await ProjectTimeline.find({ pcode: projectCode });

    if (timelines.length === 0) {
      return res.status(404).json({ message: "No timelines found for this project" });
    }
    
    // Calculate totals
    let totalWorkers = 0;
    let totalEngineers = 0;
    let totalArchitects = 0;
    let totalHours = 0;
    let totalExpenses = 0;
    let totalMaterialCost = 0;
    
    timelines.forEach(timeline => {
      totalWorkers += timeline.workerCount || 0;
      totalEngineers += timeline.tengineerCount || 0;
      totalArchitects += timeline.architectCount || 0;
      
      // Calculate hours
      const workerHours = timeline.tworker?.reduce((sum, w) => sum + (parseInt(w.hoursWorked) || 0), 0) || 0;
      const engineerHours = timeline.tengineer?.reduce((sum, e) => sum + (parseInt(e.hoursWorked) || 0), 0) || 0;
      const architectHours = timeline.tarchitect?.reduce((sum, a) => sum + (parseInt(a.hoursWorked) || 0), 0) || 0;
      totalHours += workerHours + engineerHours + architectHours;
      
      // Calculate costs
      const expenses = timeline.texpenses?.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0) || 0;
      const materials = timeline.tmaterials?.reduce((sum, mat) => sum + (parseFloat(mat.cost) || 0), 0) || 0;
      totalExpenses += expenses;
      totalMaterialCost += materials;
    });
    
    res.status(200).json({
      projectDetails: timelines[0].projectDetails,
      totalTimelines: timelines.length,
      totalWorkers,
      totalEngineers,
      totalArchitects,
      totalHours,
      totalExpenses,
      totalMaterialCost,
      totalCost: totalExpenses + totalMaterialCost,
      dateRange: {
        start: new Date(Math.min(...timelines.map(t => new Date(t.date)))),
        end: new Date(Math.max(...timelines.map(t => new Date(t.date))))
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating project summary", error });
  }
};