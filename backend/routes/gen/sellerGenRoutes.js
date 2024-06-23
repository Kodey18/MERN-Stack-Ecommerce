const role = require("../../middlewares/role");
const verifyToken = require("../../middlewares/verifyToken");
const sellerController = require('../../controllers/generalControllers/sellerController');

const Router = require("express").Router();

Router.Delete('/', verifyToken, role('Seller'), );

module.exports = Router;