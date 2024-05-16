import mongoose from "mongoose";

async function connectDB() {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL, { dbName: 'chatapp' });
    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to database: ${error.message}`);
  }
}

connectDB()

export default connectDB;
