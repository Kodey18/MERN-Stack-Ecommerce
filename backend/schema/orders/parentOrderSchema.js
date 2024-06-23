// const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const parentOrderSchema = new mongoose.Schema({
    customer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubOrder',
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    paymentMethod: {
        type: String,
        required: false,
        default: "Cash"
    },
    status: {
        type: String,
        required: true,
        default: 'Processing'
    }
}, {
    timestamps: true
});

const ParentOrder = mongoose.model('ParentOrder', parentOrderSchema);

module.exports = ParentOrder;