const Router = require("express").Router();
const userController = require("../../controllers/authControllers/userAuth");

Router.post('/register', userController.registerUser);
Router.post('/login', userController.loginUser);
Router.post('/password/forgot', userController.forgetPassword); 
Router.get('/logout', userController.logoutUser);

module.exports = Router;