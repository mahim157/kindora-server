
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 10000,
  retryReads: true,
  retryWrites: true,
});

let databaseConnection;

async function connectDB() {
  if (databaseConnection) {
    return databaseConnection;
  }

  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    databaseConnection = client.db("kindora");

    console.log("MongoDB connected successfully!");

    return databaseConnection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = connectDB;

