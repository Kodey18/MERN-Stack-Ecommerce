const mongoose = require("mongoose");
const Product = require("../productModel");

const orderItemSchema = new mongoose.Schema({
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    }
}, {
    timestamps: true,
});

const subOrderSchema = new mongoose.Schema({
    parentOrder : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParentOrder',
        required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 100
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        default: 'Processing'
    }   
},{
    timestamps: true,
});

const SubOrder = mongoose.model('SubOrder', subOrderSchema);

module.exports = SubOrder;