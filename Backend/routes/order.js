const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const auth = require('../auth');
const { verify, verifyAdmin } = require("../auth");

// POST /orders/checkout route
router.post('/checkout', verify, orderController.checkout);

// Route for retrieving all orders (Admin only)
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);

// Route for retrieving authenticated user's orders
router.get('/my-orders', verify, orderController.getUserOrders);

module.exports = router;