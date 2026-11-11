

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
const allowedOrigins = [
  "http://localhost:3000",
  "https://kindora-client-git-main-mahim12.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

const vercelPreviewOrigin =
  /^https:\/\/kindora-client-[a-z0-9]+-mahim12\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        vercelPreviewOrigin.test(origin)
      ) {
        return callback(null, true);
      }

      console.error("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Common middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Kindora API!",
  });
});

// API health check
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : "Internal server error",
  });
});

module.exports = app;
