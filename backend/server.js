require("dotenv").config();

const express = require("express");

// An express app is created.
const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server is running at https://localhost:${process.env.PORT}`);
});