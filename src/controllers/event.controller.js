
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// Helper: Check event ownership
const getOwnerQuery = (user) => ({
  $or: [
    ...(user.id ? [{ creatorId: user.id }] : []),
    ...(user.email ? [{ creatorEmail: user.email }] : []),
  ],
});

// Get all upcoming events
const getUpcomingEvents = async (req, res, next) => {
  try {
    const db = await connectDB();

    const events = await db
      .collection("events")
      .find({ eventDate: { $gt: new Date() } })
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
      .find({ eventDate: { $gt: new Date() } })
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
        message: "Invalid event ID.",
      });
    }

    const db = await connectDB();

    const event = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
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

// Create a new event (Protected)
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      image,
      location,
      eventDate,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof type !== "string" ||
      !type.trim() ||
      typeof location !== "string" ||
      !location.trim() ||
      !eventDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const parsedDate = new Date(eventDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date.",
      });
    }

    if (parsedDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Event date must be in the future.",
      });
    }

    if (!req.user?.id || !req.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user information is missing.",
      });
    }

    const db = await connectDB();

    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      type: type.trim(),
      image: typeof image === "string" ? image.trim() : "",
      location: location.trim(),
      eventDate: parsedDate,
      creatorEmail: req.user.email,
      creatorId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("events").insertOne(newEvent);

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      data: {
        _id: result.insertedId,
        ...newEvent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get events created by the logged-in user (Protected)
const getMyEvents = async (req, res, next) => {
  try {
    const db = await connectDB();

    const events = await db
      .collection("events")
      .find(getOwnerQuery(req.user))
      .sort({ createdAt: -1 })
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

// Update own event (Protected)
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const {
      title,
      description,
      type,
      image,
      location,
      eventDate,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof type !== "string" ||
      !type.trim() ||
      typeof location !== "string" ||
      !location.trim() ||
      !eventDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const parsedDate = new Date(eventDate);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid future event date.",
      });
    }

    const db = await connectDB();

    const result = await db.collection("events").updateOne(
      {
        _id: new ObjectId(id),
        ...getOwnerQuery(req.user),
      },
      {
        $set: {
          title: title.trim(),
          description: description.trim(),
          type: type.trim(),
          image: typeof image === "string" ? image.trim() : "",
          location: location.trim(),
          eventDate: parsedDate,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not authorized to update it.",
      });
    }

    const updatedEvent = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully!",
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// Delete own event (Protected)
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const db = await connectDB();

    const result = await db.collection("events").deleteOne({
      _id: new ObjectId(id),
      ...getOwnerQuery(req.user),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found or you are not authorized to delete it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUpcomingEvents,
  getRecentEvents,
  getEventById,
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
};
