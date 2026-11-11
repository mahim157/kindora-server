
const express = require("express");

const {
  getUpcomingEvents,
  getRecentEvents,
  getEventById,
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/recent", getRecentEvents);
router.get("/", getUpcomingEvents);

// Protected routes
router.get("/mine", authenticate, getMyEvents);
router.post("/", authenticate, createEvent);
router.patch("/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

// Public event details
router.get("/:id", getEventById);

module.exports = router;
