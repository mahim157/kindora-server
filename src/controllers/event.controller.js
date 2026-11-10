
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// Get all upcoming events
const getUpcomingEvents = async (req, res, next) => {
  try {
    const db = await connectDB();

    const events = await db
      .collection("events")
      .find({
        eventDate: { $gt: new Date() },
      })
      .sort({ eventDate: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// Get latest 6 upcoming events
const getRecentEvents = async (req, res, next) => {
  try {
    const db = await connectDB();

    const events = await db
      .collection("events")
      .find({
        eventDate: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// Get single event details
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const db = await connectDB();

    const event = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUpcomingEvents,
  getRecentEvents,
  getEventById,
};
