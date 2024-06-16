const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true, "Please enter the product name."]
    },
    description : {
        type: String,
        required : [true, "Please enter the product description."]
    },
    noOfRatings : {
        type: Number,
        default: 0
    },
    price : {
        type: Number,
        required: [true, "Please enter the product price."],
        maxLenght : [8, "Price length cannot exceeds 8 characters."],
    },
    images : [
        {
            public_id: {
                type: String,
                required: true,
            },
            url : {
                type: String,
                required :  true,
            }
        }
    ],
    category : {
        type: String,
        required : [true, "Please enter the product category."],
    },
    stock : {
        type: Number,
        required : [true, "Please enter the product stock."],
        maxLenght : [4, "stock cannot exceeds 4 characters"],
        default: 1,
    },
    noOfReveiws:{
        type: Number,
        default: 0,
    },
    reveiws : [
        {
            user : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            name : {
                type: String,
                required: true,
            },
            ratings : {
                type: Number,
                required: true,
            },
            comment : {
                type: String,
                required: true,
            },
        }
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
},{
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;