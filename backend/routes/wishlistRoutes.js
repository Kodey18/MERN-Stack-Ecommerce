const Router = require("express").Router();
const wishlistController = require("../controllers/wishlistController");
const verifyToken = require("../middlewares/verifyToken");

Router.get('/', verifyToken, wishlistController.getUserWishlistProducts);
Router.post('/', verifyToken, wishlistController.addToWishlist);
Router.delete('/', verifyToken, wishlistController.removeFromWishlist);

module.exports = Router;