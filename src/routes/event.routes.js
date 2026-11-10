
const express = require("express");

const {
  getUpcomingEvents,
  getRecentEvents,
  getEventById,
} = require("../controllers/event.controller");

const router = express.Router();

// GET /api/events/recent
router.get("/recent", getRecentEvents);

// GET /api/events
router.get("/", getUpcomingEvents);

// GET /api/events/:id
router.get("/:id", getEventById);

module.exports = router;
