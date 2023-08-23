const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const MONGO_DB_URI = process.env.MONGO_DB_URL;

app.get('/', (req, res) => {
    res.send("Hello");
})

mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    console.log("Connected to the database successfully!");
    app.listen(3000, () => {
      console.log(`Server is running on -> http://localhost:3000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });