const async_handler = require("express-async-handler");
const Product = require("../schema/productModal");

/* 
Desc : get all products
method : GET
route : '/api/v1/products/'
*/
const getProducts = async_handler(async (req, res) => {
});

/* 
Desc : create a product
method : POST
route : '/api/v1/products/create'
*/
const createProduct = async_handler( async(req, res) => {
    try{
        const product = await Product.create(req.body);

        if(product){
            return res.status(201).json({
                success : true,
                product,
            });
        }
    }catch(err){
        console.log("error creating a product : ",err);
    }
});

module.exports = {
    getProducts,
    createProduct,
}