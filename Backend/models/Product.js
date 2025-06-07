//[Section] Activity
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    //  productId: {
    //      type: String,
    //      required: [true, 'Product ID is Required']
    //  },
    name: {
        type: String,
        required: [true, 'Product Name is Required']
    },
    description: {
        type: String,
        required: [true, 'Product Description is Required']
    },
    price: {
        type: Number,
        required: [true, 'Price is Required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
