const express = require("express");
const router = express.Router();
const rentalController = require("../Controllers/rentalController");

// Existing routes
router.post("/create", rentalController.createRental);
router.get("/current", rentalController.viewCurrentRentals);
router.get("/overdue", rentalController.viewOverdueRentals);
router.post("/end", rentalController.endRental);

// New route for notes
router.put("/update-notes", rentalController.updateRentalNotes);
// Add this route
router.get("/history", rentalController.viewRentalHistory);
module.exports = router;