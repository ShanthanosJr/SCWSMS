const ProjectReq = require("../Model/ProjectReq");

// Get all project requests
const getAllProjectReqs = async (req, res, next) => {
    let projectReqs;

    try {
        projectReqs = await ProjectReq.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching project requests" });
    }

    if (!projectReqs || projectReqs.length === 0) {
        return res.status(404).json({ message: "No project requests found" });
    }

    return res.status(200).json({ projectReqs });
};

// Get project request by ID
const getProjectReqById = async (req, res, next) => {
    const projectReqId = req.params.id;
    let projectReq;

    try {
        projectReq = await ProjectReq.findById(projectReqId);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching project request" });
    }

    if (!projectReq) {
        return res.status(404).json({ message: "Project request not found" });
    }

    return res.status(200).json({ projectReq });
};

// Create a new project request
const createProjectReq = async (req, res, next) => {
    const { preqname, preqmail, preqnumber, preqdescription } = req.body;

    // Validate required fields
    if (!preqname || !preqmail || !preqnumber || !preqdescription) {
        return res.status(400).json({ 
            message: "Missing required fields: preqname, preqmail, preqnumber, preqdescription" 
        });
    }

    let projectReq;
    try {
        projectReq = new ProjectReq({
            preqname,
            preqmail,
            preqnumber,
            preqdescription
        });

        await projectReq.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error creating project request" });
    }

    return res.status(201).json({ 
        projectReq, 
        message: "Project request created successfully" 
    });
};

// Delete project request by ID
const deleteProjectReq = async (req, res, next) => {
    const projectReqId = req.params.id;
    let projectReq;

    try {
        projectReq = await ProjectReq.findByIdAndDelete(projectReqId);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting project request" });
    }

    if (!projectReq) {
        return res.status(404).json({ message: "Project request not found" });
    }

    return res.status(200).json({ message: "Project request deleted successfully" });
};

exports.getAllProjectReqs = getAllProjectReqs;
exports.getProjectReqById = getProjectReqById;
exports.createProjectReq = createProjectReq;
exports.deleteProjectReq = deleteProjectReq;