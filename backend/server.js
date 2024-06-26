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

app.use('/api/v1/Auth/seller', require('./routes/Auth/seller'));
app.use('/api/v1/Auth/user', require("./routes/Auth/user"));
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/user', require("./routes/gen/userGenRoutes"));
app.use('/api/v1/seller', require('./routes/gen/sellerGenRoutes'));
app.use('/api/v1/wishlist', require('./routes/wishlistRoutes'));  

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at https://localhost:${process.env.PORT}`);
    });
});

mongoose.connection.on('error', (err, next) => {
    next(err);
});