import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

try {
  await mongoose.connect(process.env.databaseUrl);
  console.log("Connection successful");
} catch (error) {
  console.error(`Error: ${error}`);
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  const name = req.body;
  res.json(name);
});

app.listen(process.env.port, () => {
  console.log(`Listening on port ${process.env.port}`);
});
