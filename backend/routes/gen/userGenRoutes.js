const Router = require("express").Router();
const userController = require("../../controllers/generalControllers/userController");
const verifyToken = require("../../middlewares/verifyToken");

Router.get('/profile',verifyToken, userController.getUserInformation);
Router.put('/password/update', verifyToken, userController.updatePassword);

module.exports = Router;