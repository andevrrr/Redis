const express = require('express');
const mongoose = require("mongoose");
const redis = require('redis');
require("dotenv").config();

const Book = require('./models/book');

const client = redis.createClient();

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));

const app = express();
app.use(express.urlencoded({ extended: true }));

const MONGO_DB_URI = process.env.MONGO_DB_URL;
const def_exp = 60;

app.get('/books', async (req, res) => {

        const data = await client.get("books");

        if (data !== null){
            return res.json(JSON.parse(data));
        } else {
            const books = await Book.find();
            client.setEx("books", def_exp, JSON.stringify(books))
            res.json(books);
        }

});

app.get('/books/:id', async (req, res) => {
    const id = req.params.id;

    const book = await Book.findById(id);

    res.json(book);

    // Handle the response here...
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
