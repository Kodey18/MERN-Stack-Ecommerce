const async_handler = require("express-async-handler");
const WishList = require("../schema/wishlistSchema");
const Product = require("../schema/productSchema");

/*
Desc: add product to wishlist.
route: /api/v1/wishlist
method: POST
*/
const addToWishlist = async_handler( async( req, res, next) => {
    const ownerId = req.user._id;
    const ownerType = req.user.role;
    const {productId} = req.body;

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

module.exports = {
    userWishlist,
    removeFromWishlist,
};