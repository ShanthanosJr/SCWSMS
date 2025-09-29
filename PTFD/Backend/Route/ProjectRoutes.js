const express = require("express");
const router = express.Router();

// Instert Model
const Project = require("../Model/ProjectModel");
// Import Controllers
const projectControllers = require("../Controllers/ProjectControllers");

router.get("/", projectControllers.getAllProjects); 
router.post("/", projectControllers.insertProject);
router.get("/:id", projectControllers.getProjectById);
router.put("/:id", projectControllers.updateProject);
router.delete("/:id", projectControllers.deleteProject);

// export
module.exports = router;