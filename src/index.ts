import dotenv from "dotenv";
import { connectDB } from "./database/index";
import app from "./app";

dotenv.config({
  path: "./env",
});


const port = process.env.PORT;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("err:", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`app is listining on Port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Mongo DB connection failed", error);
  });
