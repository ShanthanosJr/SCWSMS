const express = require("express");
const router = express.Router();

// Import Model
const ProjectReq = require("../Model/ProjectReq");
// Import Controllers
const projectReqControllers = require("../Controllers/ProjectReqController");

router.get("/", projectReqControllers.getAllProjectReqs); 
router.post("/", projectReqControllers.createProjectReq);
router.get("/:id", projectReqControllers.getProjectReqById);
router.delete("/:id", projectReqControllers.deleteProjectReq);

// export
module.exports = router;