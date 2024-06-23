const role = require("../../middlewares/role");
const verifyToken = require("../../middlewares/verifyToken");
const sellerController = require('../../controllers/generalControllers/sellerController');

const Router = require("express").Router();

Router.put('/', verifyToken, role('Seller'), );
Router.delete('/', verifyToken, role('Seller'), sellerController.deleteSeller);

module.exports = Router;