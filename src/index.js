
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const eventRoutes = require("./routes/event.routes");

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Common middleware
app.use(express.json());
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Kindora API!",
  });
});

// MongoDB health check
app.get("/api/health", async (req, res) => {
  try {
    const db = await connectDB();

    await db.command({ ping: 1 });

    res.status(200).json({
      success: true,
      message: "Kindora API and MongoDB are connected!",
      database: "kindora",
    });
  } catch (error) {
    console.error("Health check failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Event routes
app.use("/api/events", eventRoutes);

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : "Internal server error",
  });
});

module.exports = app;
