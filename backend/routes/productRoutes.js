const Router = require("express").Router();
const productController = require('../controllers/productController');
const verifyToken = require("../middlewares/verifyToken");
const roleCheck = require("../middlewares/role");

Router.get('/', productController.getProducts);
Router.post('/create', verifyToken, roleCheck("seller"), productController.createProduct);    

module.exports = Router;