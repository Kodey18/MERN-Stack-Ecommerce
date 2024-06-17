const Router = require("express").Router();
const productController = require('../controllers/productController');
const verifyToken = require("../middlewares/verifyToken");
const roleCheck = require("../middlewares/role");

Router.get('/', productController.getAllProducts);
Router.get('/:productID', productController.getSingleProduct);
Router.post('/create', verifyToken, roleCheck("seller"), productController.createProduct);
Router.put('/update/:productID', verifyToken, roleCheck("seller"), productController.updateProduct);
Router.delete('/delete/:productID', verifyToken, roleCheck('seller'), productController.deleteProduct);
Router.post('/reveiw', verifyToken, productController.productReview);
Router.get('/reveiw/:productId', productController.getReveiws);
Router.delete('/reveiw/:productId', verifyToken, productController.deleteReview);

module.exports = Router;