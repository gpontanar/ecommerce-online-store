const mongoose = require('mongoose');
const Product = require('../models/Product');
const auth = require('../auth');
const { errorHandler } = auth;

// [SECTION] - Creating a Product
module.exports.createProduct = (req, res) => {
    console.log('Received request to create product');
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send({ error: "Permission Denied, Only Admin user can create products." });
    }

    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        isActive: true
    });

    return newProduct.save()
        .then(product => res.status(201).send(product))
        .catch(error => errorHandler(error, req, res));
};

// [SECTION] - Getting All The Products
module.exports.getAllProducts = (req, res) => {
    if (!req.user) {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }

    Product.find({})
        .then(products => res.status(200).send(products))
        .catch(error => errorHandler(error, req, res));
};


module.exports.getActiveProducts = (req, res) => {
    return Product.find({ isActive: true })
    .then(products => {
        if (products.length === 0) {
            return res.status(404).send({ error: 'No active products found.' });
        }
        return res.status(200).send(products);
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getProductById = (req, res) => {
    Product.findById(req.params.productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }
            res.status(200).send(product);
        })
        .catch(error => errorHandler(error, req, res));
};

// [SECTION] - Updating a Product
module.exports.updateProduct = (req, res) => {
    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
    };

    Product.findByIdAndUpdate(req.params.productId, updatedProduct, { new: true })
        .then(product => {
            if (product) {
                res.status(200).send({
                    success: true,
                    message: 'Product updated successfully',
                    product: product // Returning the updated product
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: 'Product not found'
                });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

// [SECTION] - Archiving a Product
module.exports.archiveProduct = (req, res) => {
    const updateActiveField = {
        isActive: false
    };

    Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
        .then(product => {
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: 'Product not found'
                });
            }
            if (!product.isActive) {
                return res.status(200).send({
                    success: true,
                    message: 'Product already archived'
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Product archived successfully'
            });
        })
        .catch(error => errorHandler(error, req, res));
};

// [SECTION] - Activating a Product
module.exports.activateProduct = (req, res) => {
    const updateActiveField = {
        isActive: true
    };

    Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
        .then(product => {
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: 'Product not found'
                });
            }
            if (product.isActive) {
                return res.status(200).send({
                    success: true,
                    message: 'Product already activated'
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Product activated successfully'
            });
        })
        .catch(error => errorHandler(error, req, res));
};

// This is for s54 - Search Product by their names
module.exports.searchProductsByName = (req, res) => {
    const name = req.body.name;

    Product.find({ name: new RegExp(name, 'i') })
        .then(products => {
            if (products.length === 0) {
                return res.status(404).send({ message: "Product not found" });
            }
            res.status(200).send(products);
        })
        .catch(error => errorHandler(error, req, res));
};

// This is for s54 - Search Product by their Min and Max Price Range
module.exports.searchProductsByPrice = (req, res) => {
    const minPrice = req.body.minPrice;
    const maxPrice = req.body.maxPrice;

    Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
        .then(products => {
            if (products.length === 0) {
                return res.status(404).send({ message: "No products found in the specified price range" });
            }
            res.status(200).send(products);
        })
        .catch(error => errorHandler(error, req, res));
};