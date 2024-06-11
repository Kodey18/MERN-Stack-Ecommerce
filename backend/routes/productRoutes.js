const Router = require("express").Router();
const productController = require('../controllers/productController');

Router.get('/', productController.getProducts);
Router.post('/create', productController.createProduct);    

module.exports = Router;