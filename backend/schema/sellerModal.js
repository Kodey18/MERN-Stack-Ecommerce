const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the seller name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter the seller email.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter the seller password.']
    },
    phone : {
        type: String,
        required: [true, "Please enter the phone number."]
    },
    address: {
        type: String,
        required: [true, "Please enter the address,"]
    },
    alternateAddress: {
        type: String,
        required: false,
    },
    city : {
        type : String,
        required: true,
    },
    state : {
        type : String,
        required : true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, {
    timestamps: true
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;