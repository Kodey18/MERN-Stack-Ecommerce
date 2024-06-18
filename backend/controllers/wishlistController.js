const async_handler = require("express-async-handler");
const WishList = require("../schema/wishlistSchema");
const Product = require("../schema/productModel");
const errorResponse = require("../utils/errorResponse");

/*
Desc: add product to wishlist.
route: /api/v1/wishlist
method: POST
*/
const addToWishlist = async_handler( async( req, res, next) => {
    const ownerId = req.user._id;
    const ownerType = req.user.role;
    const {productId} = req.body;
    console.log(`ownerId : ${ownerId}, ownerType : ${ownerType}`);

    try{
        let userWishlist = await WishList.findOne({
            'owner.id' : ownerId,
            'owner.type' : ownerType,
        });

        if(!userWishlist){
            userWishlist = new WishList({
                owner: {
                    id: ownerId,
                    type: ownerType,
                },
                products: [productId],
            });
        }else{
            if(!userWishlist.products.includes(productId)){
                userWishlist.products.push(productId);
            }
        }

        await userWishlist.save();

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully.",
            userWishlist
        })
    }catch(err){
        next(err);
    }
});

/*
Desc: remove a product from wishlist
route: /api/v1/wishlist
method: DELETE
*/
const removeFromWishlist = async_handler( async(req, res, next) => {
    const ownerId = req.user._id;
    const ownerType = req.user.role;
    const {productId} = req.body; // this product has to be removed.

    try{
        let userWishlist = await WishList.findOne({
            'owner.id' : ownerId,
            'owner.type' : ownerType,
        });

        if(userWishlist){
            const productIndex = userWishlist.products.indexOf(productId);
            if(productIndex !== -1){
                userWishlist.products.splice(productIndex, 1);
            } 

            await userWishlist.save();

            return res.status(201).json({
                success: true,
                message: "Product removed from wishlist successfully.",
                userWishlist
            });
        }
    }catch(err){
        next(err);
    }
});

/*
Desc: get user wishlsit
route: /api/v1/wishlist/
method : GET
*/
const getUserWishlist = async_handler(async( req, res, next) => {
    const ownerId = req.user._id;
    const ownerType = req.user.role;

    try{
        let userWishlist = await WishList.findOne({
            'owner.id' : ownerId,
            'owner.type' : ownerType,
        });

        if(!userWishlist){
            return next(new errorResponse("Wishlist not found", 404));
        }

        return res.status(201).json({
            success: true,
            userWishlist,
        });
    }catch(err){}
});

/**
Desc: get user wishlist products.
route: /api/v1/wishlist/products
method: GET
*/
const getUserWishlistProducts = async_handler( async(req, res, next) => {
    const ownerId = req.user._id;
    const ownerType = req.user.role;

    try{
        const userWishlist = await WishList.findOne({
            'owner.id' : ownerId,
            'owner.type' : ownerType,
        });

        if(userWishlist && userWishlist.products.length > 0){
            const productDetails = await Product.find({
                '_id': { $in: userWishlist.products }
            });

            if(!productDetails || !productDetails.length > 0){
                return next(new errorResponse("Error fetching products of wishlist", 404));
            }

            return res.status(201).json({
                success: true,
                productDetails,
            });
        }else {
            return next(new errorResponse("user wishlist not found", 404));
        }
    }catch(err){
        next(err);
    }
});

module.exports = {
    getUserWishlistProducts,
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
};