const role = require("../../middlewares/role");
const verifyToken = require("../../middlewares/verifyToken");
const sellerController = require('../../controllers/generalControllers/sellerController');

const Router = require("express").Router();

Router.put('/', verifyToken, role('Seller'), sellerController.updaetSeller);
Router.put('/password', verifyToken, role('Seller'), sellerController.updatePassword);
Router.delete('/', verifyToken, role('Seller'), sellerController.deleteSeller)

module.exports = Router;