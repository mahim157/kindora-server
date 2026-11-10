
require("dotenv").config();

const connectDB = require("./config/db");

async function testDatabase() {
  try {
    const db = await connectDB();
    const collection = db.collection("connection_tests");

    // Test database write
    const result = await collection.insertOne({
      message: "Kindora database write test",
      createdAt: new Date(),
    });

    console.log("Write test successful:", result.insertedId);

    // Test database read
    const savedData = await collection.findOne({
      _id: result.insertedId,
    });

    console.log("Read test successful:", savedData);

    // Remove test document
    await collection.deleteOne({ _id: result.insertedId });

    console.log("Database test completed successfully!");
  } catch (error) {
    console.error("Database test failed:", error.message);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

testDatabase();
