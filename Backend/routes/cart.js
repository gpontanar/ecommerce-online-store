const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const auth = require('../auth');
const { verify } = require("../auth");

// Route for getting/retrieving a cart
router.get('/get-cart', verify, cartController.getCart);

// Route for adding products into a cart
router.post('/add-to-cart', verify, cartController.addToCart);

// Route for getting active products
router.patch('/update-cart-quantity', verify, cartController.updateCart);

// Route for removing products from cart
router.patch('/:productId/remove-from-cart', verify, cartController.removeFromCart);

// Route for clearing a cart
router.put('/clear-cart', verify, cartController.clearCart);

module.exports = router;