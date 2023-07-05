const { MongoClient } = require("mongodb");

// make connectionString for mongoDB Atlas 

const connectionString = process.env.ATLAS_URI || "";

const dbName = "userdata";

async function connectToDatabase() {
  console.log("Connecting to MongoDB...");
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    console.log("Connected to MongoDB successfully");
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

module.exports = connectToDatabase;