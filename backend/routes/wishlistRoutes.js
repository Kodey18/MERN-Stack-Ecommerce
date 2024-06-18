const Router = require("express").Router();
const wishlistController = require("../controllers/wishlistController");

Router.get('/', wishlistController.getUserWishlistProducts);
Router.post('/', wishlistController.addToWishlist);
Router.delete('/', wishlistController.removeFromWishlist);

module.exports = Router;