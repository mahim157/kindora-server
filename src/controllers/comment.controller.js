
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// Get all comments for an event (Public)
const getEventComments = async (req, res) => {
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

    const comments = await db
      .collection("eventComments")
      .find({ eventId: new ObjectId(id) })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load comments.",
    });
  }
};

// Add comment (Only joined members)
const addEventComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (typeof text !== "string" || !text.trim() || text.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be between 1 and 1000 characters.",
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

    const membership = await db.collection("eventJoins").findOne({
      eventId,
      userId,
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
      userId,
      userName: req.user.name || "Community Member",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("eventComments").insertOne(comment);

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: {
        _id: result.insertedId,
        ...comment,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment.",
    });
  }
};

// Delete own comment
const deleteEventComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user?.id;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event or comment ID.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const db = await connectDB();

    const result = await db.collection("eventComments").deleteOne({
      _id: new ObjectId(commentId),
      eventId: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or you are not allowed to delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment.",
    });
  }
};

module.exports = {
  getEventComments,
  addEventComment,
  deleteEventComment,
};

