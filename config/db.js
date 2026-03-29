const mongoose = require("mongoose");

let connectionPromise;

const connectDB = async () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI);
    await connectionPromise;
    console.log("MongoDB Connected");
    return connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    console.error(`MongoDB Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
