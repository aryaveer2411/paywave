import mongoose from "mongoose";
import { config } from '../config';
import { DB_NAME } from "../constants";


const connectDB = async () => {
  try {
    const isConnected = await mongoose.connect(
      `${config.MONGODB_URI}/${DB_NAME}`,
    );
      console.log(`DB Connected ${isConnected.connection.host}`)
  } catch (err) {
    console.error("db connection error", err);
    process.exit(1);
  }
};

export { connectDB };
