require("dotenv").config();

const express = require("express");
const cookie_parser = require("cookie-parser");
const connectDB = require("./config/mongoDB");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");

// An express app is created.
const app = express();

//connecting to DB
connectDB();

app.use(express.json());
app.use(cookie_parser());

app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/seller', require('./routes/Auth/seller'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at https://localhost:${process.env.PORT}`);
    });
});

mongoose.connection.on('error', (err) => {
    // console.log(`error : ${err}`);
    next(err);
});