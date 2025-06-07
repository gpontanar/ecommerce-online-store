const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const cartController = require('./cart');
const { errorHandler } = require('../auth');
const auth = require('../auth');


module.exports.checkout = (req, res) => {

  const userId = req.user.id;  

  // Step 1: Find the user's cart
  Cart.findOne({ userId: userId })
    .then(cart => {
      if (!cart) {
        // If no cart is found, send a message to the client
        return res.status(404).send({ message: "Cart not found" });
      }

      // Step 2: Check if the cart has items in the cartItems array
      if (cart.cartItems.length === 0) {
        // If no items in cart, send an error message
        return res.status(400).send({ error: "No Items to Checkout" });
      }

      // Step 3: Create a new Order document
      const order = new Order({
          userId: userId,
          productsOrdered: cart.cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        totalPrice: cart.totalPrice,
      });

      // Step 4: Save the order to the database
      return order.save()
        .then(savedOrder => {
          // Step 5: Clear the user's cart after order creation
          cart.cartItems = [];  // Empty the cartItems array
          cart.totalPrice = 0;  // Reset the total price to 0

          // Save the updated cart (empty cart)
          return cart.save();
        })
        .then(() => {
          // Step 6: Send success message to the client
          return res.status(200).send({ message: "Ordered Successfully" });
        })
        .catch(error => {
          // Catch any error during order saving or cart clearing
          return res.status(500).send({ error: "Error while processing the order", details: error.message });
        });
    })
    .catch(error => {
      // Catch any error while finding the cart
      return res.status(500).send({ error: "Error finding the cart", details: error.message });
    });
};

// Retrieve all orders (For Admin only)
module.exports.getAllOrders = (req, res) => {
  if (!req.user.isAdmin) {
      return res.status(403).send({
          error: "Permission Denied, Only Admin user can retrieve all orders."
      });
  }

  Order.find({})
      .then(orders => res.status(200).send({ orders }))
      .catch(error => errorHandler(error, req, res));
};

// Retrieve authenticated user's orders
module.exports.getUserOrders = (req, res) => {
  const userId = req.user.id;

  Order.find({ userId: userId })
      .then(orders => {
          if (orders.length === 0) {
              return res.status(404).send({ message: "No orders found for the user." });
          }
          res.status(200).send({ orders });
      })
      .catch(error => errorHandler(error, req, res));
};