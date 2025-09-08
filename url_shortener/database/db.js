import mongoose from "mongoose";
import dotenv from "dotenv";
import Log from '../middlewares/loggingMiddleware.js';


dotenv.config();

const connectionString = process.env.CONNECTION_STRING;

export const connect = () => {
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log("MongoDB connected");
      Log("backend", "info", "db", "MongoDB connected successfully");
    })
    .catch((err) => {
      console.error(err);
      Log("backend", "fatal", "db", `DB connection failed: ${err.message}`);
    });
};