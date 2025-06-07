const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { errorHandler } = require('../auth');
const auth = require('../auth');


module.exports.getCart = (req, res) => {
    //  const userId = req.user;  // req.user is the id set in auth.js -> EDITED
    const userId = req.user.id;

    Cart.findOne({ userId: userId })
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ message: "Cart not found" });
            }
            res.status(200).send({ cart: cart });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.addToCart = (req, res) => {

  // Correctly access the userId from req.user
  // const userId = req.user;  // req.user is the id set in auth.js -> EDITED
  const userId = req.user.id;

  const { productId, quantity, subtotal } = req.body;

  // Find the cart for the user by userId
  Cart.findOne({ userId: userId })
    .then(cart => {
      if (!cart) {
        // If no cart is found, create a new cart
        const newCart = new Cart({
          userId,
          cartItems: [{ productId, quantity, subtotal }],
          totalPrice: subtotal,
        });

        return newCart.save().then(savedCart => {
          return res.status(201).send({
            message: 'Cart created successfully',
            updatedCart: savedCart,
          });
        });
      } else {
        // If cart exists, check if product is already in the cartItems
        const existingProduct = cart.cartItems.find(item => item.productId.toString() === productId);

        if (existingProduct) {
          // If product already exists, update the quantity and subtotal
          existingProduct.quantity += quantity;
          existingProduct.subtotal += subtotal;

          // Recalculate total price
          cart.totalPrice += subtotal;

          return cart.save().then(updatedCart => {
            return res.status(200).json({
              message: 'Item quantity updated successfully',
              updatedCart: updatedCart,
            });
          });
        } else {
          // If product does not exist, add it to the cartItems
          cart.cartItems.push({ productId, quantity, subtotal });
          cart.totalPrice += subtotal;

          return cart.save().then(updatedCart => {
            return res.status(200).send({
              message: 'Item added to cart successfully',
              updatedCart: updatedCart,
            });
          });
        }
      }
    })
    .catch(error => {
      // Catch any errors and return a response
      return res.status(500).send({
        message: 'Error processing the cart',
        error: error.message,
      });
    });
};


module.exports.updateCart = (req, res) => {
  // const userId = req.user;  // req.user is the id set in auth.js -> EDITED
  const userId = req.user.id; 
  const { productId, newQuantity } = req.body; 

  // **Fetch product details** (you may need to adjust this depending on your schema)
  Product.findById(productId).then(product => {
    if (!product) {
      return res.status(404).send({
        message: 'Product not found.',
      });
    }

    // Find the cart for the user by userId
    Cart.findOne({ userId: userId })
      .then(cart => {
        if (!cart) {
          return res.status(404).send({
            message: 'Cart not found for the user.',
          });
        }

        // Check if the cart contains the productId
        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
          return res.status(404).send({
            message: 'Item not found in cart.',
          });
        }

        // **Update the quantity and subtotal for the existing item**
        const item = cart.cartItems[itemIndex];

        // Ensure that `newQuantity` is valid
        if (isNaN(newQuantity) || newQuantity <= 0) {
          return res.status(400).send({
            message: 'Invalid quantity.',
          });
        }

        item.quantity = newQuantity;

        // **Calculate the new subtotal based on the product's price and newQuantity**
        item.subtotal = newQuantity * product.price;

        // **Ensure that subtotal is valid**
        if (isNaN(item.subtotal) || item.subtotal <= 0) {
          return res.status(400).send({
            message: 'Invalid subtotal.',
          });
        }

        // Update the totalPrice of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        cart.save()
          .then(updatedCart => {
            return res.status(200).send({
              message: 'Item quantity updated successfully',
              updatedCart: updatedCart,
            });
          })
          .catch(error => {
            return res.status(500).send({
              message: 'Error saving the cart.',
              error: error.message,
            });
          });
      })
      .catch(error => {
        return res.status(500).send({
          message: 'Error finding the cart.',
          error: error.message,
        });
      });
  }).catch(error => {
    return res.status(500).send({
      message: 'Error fetching product details.',
      error: error.message,
    });
  });
};


module.exports.removeFromCart = (req, res) => {
  // const userId = req.user;  // req.user is the id set in auth.js -> EDITED
  const userId = req.user.id;

  const productId = req.params.productId; // Get the productId from the URL parameter

  // Find the cart for the user by userId
  Cart.findOne({ userId: userId })
    .then(cart => {
      if (!cart) {
        return res.status(404).send({
          message: 'Cart not found.',
        });
      }

      // Find the index of the product to be removed
      const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

      if (itemIndex === -1) {
        return res.status(404).send({
          message: 'Item not found in cart.',
        });
      }

      // Remove the product from cartItems
      cart.cartItems.splice(itemIndex, 1);

      // Recalculate the total price of the cart after removing the item
      cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

      // Save the updated cart
      cart.save()
        .then(updatedCart => {
          return res.status(200).send({
            message: 'Item removed from cart successfully',
            updatedCart: updatedCart,
          });
        })
        .catch(error => {
          return res.status(500).send({
            message: 'Error saving the updated cart.',
            error: error.message,
          });
        });
    })
    .catch(error => {
      return res.status(500).send({
        message: 'Error finding the cart.',
        error: error.message,
      });
    });
};


module.exports.clearCart = (req, res) => {
  // const userId = req.user;  // req.user is the id set in auth.js -> EDITED
  const userId = req.user.id; 

  // Find the cart for the user by userId
  Cart.findOne({ userId: userId })
    .then(cart => {
      if (!cart) {
        return res.status(404).send({
          message: 'Cart not found.',
        });
      }

      // Check if there are any items in the cart
      if (cart.cartItems.length === 0) {
        return res.status(400).send({
          message: 'Cart is already empty.',
        });
      }

      // Clear all items from the cart
      cart.cartItems = [];

      // Set the totalPrice to 0 after clearing the cart
      cart.totalPrice = 0;

      // Save the updated cart
      cart.save()
        .then(updatedCart => {
          return res.status(200).send({
            message: 'Cart cleared successfully.',
            updatedCart: updatedCart,
          });
        })
        .catch(error => {
          return res.status(500).send({
            message: 'Error saving the cleared cart.',
            error: error.message,
          });
        });
    })
    .catch(error => {
      return res.status(500).send({
        message: 'Error finding the cart.',
        error: error.message,
      });
    });
};



