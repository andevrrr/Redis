const express = require('express');
const mongoose = require("mongoose");
const Redis = require("redis");
require("dotenv").config();

const Book = require('./models/book');

const redisClient = Redis.createClient();

redisClient.on('error', err => {
    console.error('Error connecting to Redis:', err);
  });
  
  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  redisClient.on('end', () => {
    console.log('Disconnected from Redis');
  });

// redisClient.connect()
// .then(result => {
//     console.log("Connected to redis client successfully!");
// })
// .catch(err => console.log(err));

const app = express();
app.use(express.urlencoded({ extended: true }));

const MONGO_DB_URI = process.env.MONGO_DB_URL;
const def_exp = 3600;

app.get('/books', async (req, res) => {
    try {
        // Get cached books from Redis
        redisClient.get('books', async (error, cachedBooks) => {
            if (error) {
                console.error(error);
            }

            if (cachedBooks != null) {
                return res.json(JSON.parse(cachedBooks));
            } else {
                try {
                    const books = await Book.find();
                    redisClient.setex('books', def_exp, JSON.stringify(books)); // Use setex for expiration
                    return res.json(books);
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Error fetching books from MongoDB.' });
                }
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/books/:id', async (req, res) => {
    const id = req.params.id;

    const book = await Book.findById(id);

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
