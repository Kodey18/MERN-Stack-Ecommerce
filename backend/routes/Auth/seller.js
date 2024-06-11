const Router = require("express").Router();
const sellerAuthController = require('../../controllers/authControllers/sellerAuth');

Router.post('/register', sellerAuthController.registerSeller);
Router.post('/login', sellerAuthController.loginSeller);
Router.get('/logout', sellerAuthController.logoutSeller);

module.exports = Router;