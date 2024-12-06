import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressBasicAuth from "express-basic-auth";
import { uri } from "./src/constants/index.js";
import { AuthRouter } from "./src/routes/UserRoute.js";
import { ProductRouter } from "./src/routes/ProductRoute.js";
const app = express();
const port = 4000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    credentials: true, // If you need to send cookies or authentication tokens
  })
);


app.use("/auth", AuthRouter);
app.use("/product", ProductRouter);
app.get("/", (req, res) => {
  res.send("Welcome to leo's e-commerce api");
});

const startServer = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: "shoebox",
    });
    app.listen(port, () => console.log("Server started and db connected!"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
