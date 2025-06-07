const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const auth = require('../auth');
const { verify, verifyAdmin } = require("../auth");

// Route for creating a product
router.post('/', verify, verifyAdmin, productController.createProduct);

// Route for getting all products (admin only)
router.get('/all', verify, verifyAdmin, productController.getAllProducts);
// router.get('/all', verify, productController.getAllProducts);

// Route for getting active products
router.get('/active', productController.getActiveProducts);

// Route for getting a product by ID
router.get('/:productId', productController.getProductById);

// [SECTION] Route for updating, archiving, or activating a product
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// [SECTION] Route for archiving a product (combined with the update route)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// [SECTION] Route for activating a product (combined with the update route)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Route for searching products by name
router.post('/search-by-name', productController.searchProductsByName);

// Route for searching products by price
router.post('/search-by-price', productController.searchProductsByPrice);

module.exports = router;