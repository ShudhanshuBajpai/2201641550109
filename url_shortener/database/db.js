import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
export const connect = () => {
    mongoose.connect(connectionString)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));
}