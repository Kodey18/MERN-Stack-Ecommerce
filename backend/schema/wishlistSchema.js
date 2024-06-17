const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    owner : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'owner.type',
        },
        type: {
            type: String,
            required: true,
            enum: ['User', 'Seller'],
        }
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    ]
},{
    timestamps: true,
});

const WishList = mongoose.model('WishList', wishlistSchema);

module.exports = WishList;