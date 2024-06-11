require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.ATLAS_URI);
    }catch(err){
        console.log("error connecting DB : ",err);
    }
}

module.exports = connectDB;