const async_handler = require("express-async-handler");
const Product = require("../schema/productModal");
const ErrorResponse = require("../utils/errorResponse");
const ApiFeatures = require("../utils/apiFeatures");

/* 
Desc : get all products
method : GET
route : '/api/v1/products/'
*/
const getProducts = async_handler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
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
            seller: req.user.objId,
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
        // return res.status(500).json({
        //     success: false,
        //     message: 'Internal Server Error'
        // });
        return next(err);
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
            return next(new ErrorResponse('Product not found',404));
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
        // return res.status(500).json({
        //     success: false,
        //     message: 'Internal Server Error'
        // });
        return next(err);
    }
})

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
}