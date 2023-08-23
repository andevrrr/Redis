const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();

const Book = require('./models/book');

const app = express();
app.use(express.urlencoded({ extended: true }))


const MONGO_DB_URI = process.env.MONGO_DB_URL;

app.get('/books', async (req, res) => {
    const book = await Book.find();

    return res.send(book);
})

app.get('/books/:id', async (req, res) => {
    const id = req.params.id;

    const book = await Book.findById(id);

    return res.send(book);
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