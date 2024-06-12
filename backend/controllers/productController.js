const async_handler = require("express-async-handler");
const Product = require("../schema/productModal");

/* 
Desc : get all products
method : GET
route : '/api/v1/products/'
*/
const getProducts = async_handler(async (req, res) => {
    try{
        const allProducts = await Product.find();

        if(allProducts){
            return res.status(201).json({
                success : true,
                allProducts
            });
        }
    }catch(err){
        console.log("error getting all products : ",err);
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
        console.log("error creating a product : ",err);
    }
});

module.exports = {
    getProducts,
    createProduct,
}