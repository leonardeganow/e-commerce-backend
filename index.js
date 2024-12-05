import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { uri } from "./src/constants/index.js";
const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to leo's e-commerce api");
});

const startServer = async () => {
  try {
    await mongoose.connect(uri);
    app.listen(port, () => console.log("Server started"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
