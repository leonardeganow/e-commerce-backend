import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressBasicAuth from "express-basic-auth";
import { uri } from "./src/constants/index.js";
import { AuthRouter } from "./src/routes/UserRoute.js";
import { ProductRouter } from "./src/routes/ProductRoute.js";
import bodyParser from "body-parser";
const app = express();
const port = 4000;


// Set limit for JSON payload
app.use(express.json({ limit: '10mb' })); // Set the limit to 10MB

// Set limit for URL-encoded form data (if you need to handle form submissions)
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
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
