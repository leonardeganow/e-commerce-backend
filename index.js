import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import expressBasicAuth from "express-basic-auth";
import { uri } from "./src/constants/index.js";
import { UserRouter } from "./src/routes/UserRoute.js";
const app = express();
const port = 4000;

app.use(express.json());

//allowing basic auth
app.use(
  expressBasicAuth({
    users: {
      [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD,
    },
    challenge: true,
  })
);
app.use("/user", UserRouter);

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
