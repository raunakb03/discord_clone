import mongoose from "mongoose";

const connection = {};

export async function connectDb() {
  if (connection.isConnected) {
    console.log("Already connected to the database.");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Using previous connection to the database.");
      return;
    }
    await mongoose.disconnect();
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected to database");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error)
  }
}