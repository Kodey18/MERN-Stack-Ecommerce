const Router = require("express").Router();
const userController = require("../../controllers/generalControllers/userController");
const verifyToken = require("../../middlewares/verifyToken");

Router.get('/:userID',verifyToken, userController.getUserInformation);

module.exports = Router;