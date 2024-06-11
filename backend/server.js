require("dotenv").config();

const express = require("express");
const cookie_parser = require("cookie-parser");

// An express app is created.
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookie_parser());

app.use('/api/v1/products', require('./routes/productRoutes'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running at https://localhost:${process.env.PORT}`);
});