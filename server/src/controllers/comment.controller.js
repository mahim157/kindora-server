
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// Get all comments of an event (Public)
const getEventComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const db = await connectDB();

    // Check whether the event exists
    const event = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const comments = await db
      .collection("eventComments")
      .find({ eventId: new ObjectId(id) })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// Add a comment (Joined members only)
const addEventComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    if (
      typeof text !== "string" ||
      !text.trim() ||
      text.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Comment must contain 1 to 1000 characters.",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to comment.",
      });
    }

    const db = await connectDB();

    const eventId = new ObjectId(id);

    const event = await db.collection("events").findOne({
      _id: eventId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Verify that the user has joined this event
    const membership = await db.collection("eventJoins").findOne({
      eventId,
      userId: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You must join this event before commenting.",
      });
    }

    const comment = {
      eventId,
      text: text.trim(),
      userId: req.user.id,
      userName: req.user.name || "Community Member",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("eventComments")
      .insertOne(comment);

    res.status(201).json({
      success: true,
      message: "Comment added successfully!",
      data: {
        _id: result.insertedId,
        ...comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete own comment
const deleteEventComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;

    if (
      !ObjectId.isValid(id) ||
      !ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid event or comment ID.",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Please log in to delete a comment.",
      });
    }

    const db = await connectDB();

    const result = await db.collection("eventComments").deleteOne({
      _id: new ObjectId(commentId),
      eventId: new ObjectId(id),
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or you cannot delete this comment.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEventComments,
  addEventComment,
  deleteEventComment,
};
