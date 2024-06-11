const Router = require("express").Router();
const productController = require('../controllers/productController');

Router.get('/', productController.getProducts);

module.exports = Router;