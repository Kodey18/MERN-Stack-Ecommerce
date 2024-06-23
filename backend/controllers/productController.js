const async_handler = require("express-async-handler");
const Product = require("../schema/productModel");
const ErrorResponse = require("../utils/errorResponse");
const ApiFeatures = require("../utils/apiFeatures");
const { response } = require("express");

/* 
Desc : get all products
method : GET
route : '/api/v1/products/'
*/
const getAllProducts = async_handler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .paginate();
    try{
        const allProducts = await apiFeatures.query;

        if(allProducts){
            return res.status(201).json({
                success : true,
                allProducts
            });
        }
    }catch(err){
        next(err);
    }
});

/* 
Desc : get single product
method : GET
route : '/api/v1/products/:productID'
*/
const getSingleProduct = async_handler( async(req, res, next) => {
    const productID = req.params.productID;
    try{
        const product = await Product.findById(productID);

        if(!product){
            return next(new ErrorResponse("Product not found",401));
        }

        return res.status(200).json({
            success: true,
            product,
        });
    }catch(err){
        next(err);
    }
});

/* 
Desc : create a product
method : POST
route : '/api/v1/products/create'
*/
const createProduct = async_handler( async(req, res, next) => {
    const {name, description, price, images, category} = req.body
    try{
        const product = await Product.create({
            name,
            description,
            price,
            images,
            category,
            seller: req.user._id,
        });

        if(product){
            return res.status(201).json({
                success : true,
                product,
            });
        }
    }catch(err){
        // console.log("error creating a product : ",err);
        next(err);
    }
});

/* 
Desc : update a product
method : PUT
route : '/api/v1/products/update/:productId'
*/
const updateProduct = async_handler( async(req, res) => {
    const productId = req.params.productID;
    const {name, description, price, stock, images, category} = req.body;

    try{
        const product = await Product.findById(productId);

        if(!product){
            // return res.status(404).json({
            //     success: false,
            //     message: 'Product not found'
            // });
            return next(new ErrorResponse('Product not found',404));
        }

        // Check if the authenticated user is the seller of the product
        if (product.seller.toString() !== req.user.objId.toString()) {
            // return res.status(403).json({
            //     success: false,
            //     message: 'Unauthorized to update this product'
            // });
            return next(new ErrorResponse('Unauthorized to update this product', 403));
        }

        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.images = images || product.images;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        await product.save();

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });

    }catch(err){
        console.error('Error updating product:', err);
        next(err);
    }
});

/* 
Desc : Delete a product
method : DELETE
route : '/api/v1/products/DELETE/:productId'
*/
const deleteProduct = async_handler( async(req, res, next) => {
    const productId = req.params.productID;

    try{
        const product = await Product.findById(productId);

        if(!product){
            // return res.status(404).json({
            //     success: false,
            //     message: 'Product not found'
            // });
            return next(new ErrorResponse('Product not found',401));
        }

        // Check if the authenticated user is the seller of the product
        if (product.seller.toString() !== req.user.objId.toString()) {
            // return res.status(403).json({
            //     success: false,
            //     message: 'Unauthorized to delete this product'
            // });
            return next(new ErrorResponse('Unauthorized to delete this product', 403));
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    }catch(err){
        console.error('Error deleting product:', err);  
        next(err);
    }
});

/* 
Desc: Create or update product reveiw
route: /api/v1/products/rveiw
method: post
*/
const productReview = async_handler( async(req, res, next) => {
    try{
        const {rating, comment, productId} = req.body;

        const reveiw = {
            user: req.user._id,
            name : req.user.name,
            ratings: Number(rating),
            comment: comment,
        }

        const product = await Product.findById(productId);

        if(!product){
            return next(new ErrorResponse("Product not found.", 401));
        }

        if(product.seller.toString() === req.user._id.toString()){
            return next(new ErrorResponse('You cannot review your own product', 401));
        }

        const isReveiwed = product.reveiws.find(reveiw => reveiw.user.toString() === req.user._id.toString());

        if(isReveiwed){
            product.reveiws.forEach((reveiw) => {
                if(reveiw.user.toString() === req.user._id.toString()){
                    reveiw.ratings = rating;
                    reveiw.comment = comment;
                }
            })
        }else{
            product.reveiws.push(reveiw);
            product.noOfReveiws = product.reveiws.length;
        }
        let ttlRatings = 0;

        product.reveiws.forEach((rev) => {
            ttlRatings = ttlRatings + rev.ratings;
        });

        product.noOfRatings = ttlRatings / product.reveiws.length;

        await product.save({validateBeforeSave: false});

        return res.status(200).json({
            success: true,
            product,
        });
    }catch(err){
        next(err);
    }
});

/*
Desc : get all reveiws of the product
route : /api/v1/products/reveiws
mehtod : GET
*/
const getReveiws = async_handler( async(req, res, next) => {
    const productId = req.params.productId;
    try{
        const product = await Product.findById(productId).populate('reveiws');

        if(!product){
            return next(new ErrorResponse("Product not found", 404));
        }

        let reveiws = product.reveiws;
        const userReveiwIndex = reveiws.findIndex(reveiw => reveiw.user.toString() === req.user._id.toString())

        // here if no such reveiw is found then it will userReveiwIndex will have -1.
        if(userReveiwIndex !== -1){
            // Move the user's review to the beginning
            const userReveiw = reveiws.splice(userReveiwIndex, 1)[0];
            reveiws = [userReveiw, ...reveiws];
        }

        return res.status(201).json({
            success: true,
            reveiws,
        });

    }catch(err){
        next(err);
    }
});

/*
Desc : Delete a product reveiw
route : /api/v1/products/reveiw/:productId
method delete
*/
const deleteReview = async_handler(async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.user._id;  // Assuming req.user contains the logged-in user's info

    try {
        const product = await Product.findById(productId).populate('reviews');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const userReveiwIndex = product.reveiws.findIndex(reveiw => reveiw.user.toString() === userId.toString());

        if(userReveiwIndex === -1){
            return next(new ErrorResponse("Reveiw not found.", 404));
        }

        product.reveiws.splice(userReveiwIndex, 1);

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Reveiw deleted successfully",
        });
    } catch (err) {
        next(err);
    }
});


module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct,
    productReview,
    getReveiws,
    deleteReview,
}