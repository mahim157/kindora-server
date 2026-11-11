
const express = require("express");

const {
  getUpcomingEvents,
  getRecentEvents,
  getEventById,
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  joinEvent,
  getJoinedEvents,
} = require("../controllers/event.controller");

const {
  getEventComments,
  addEventComment,
  deleteEventComment,
} = require("../controllers/comment.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/recent", getRecentEvents);
router.get("/", getUpcomingEvents);

// Comment routes
router.get("/:id/comments", getEventComments);
router.post("/:id/comments", authenticate, addEventComment);
router.delete(
  "/:id/comments/:commentId",
  authenticate,
  deleteEventComment
);

// Protected event routes
router.get("/mine", authenticate, getMyEvents);
router.get("/joined", authenticate, getJoinedEvents);

router.post("/", authenticate, createEvent);
router.post("/:id/join", authenticate, joinEvent);

router.patch("/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

// Public event details
router.get("/:id", getEventById);

module.exports = router;
