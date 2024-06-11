const async_handler = require("express-async-handler");

/* 
Desc : get all products
method : GET
route : '/api/v1/products/'
*/
const getProducts = async_handler(async (req, res) => {
    console.log("Requrest is made.");
    return res.status(201).json({
        products : "product object array here.",
    });
    // res.send("products");
});

module.exports = {
    getProducts,
}