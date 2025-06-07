 const mongoose = require('mongoose');

// [SECTION] Blueprint/Schema
const cartSchema = new mongoose.Schema({
	userId: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User', 
		required: true, 
		unique: true 
	},
	cartItems: [
		{
			productId: {
				type: String,
				required: [true, 'Product ID is Required']
			},
			quantity: {
				type: Number,
				required: [true, 'Quantity is Required']
			},
			subtotal: {
				type: Number,
				required: [true, 'Subtotal Price is Required']
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, 'totalPrice is Required']
	},
	orderedOn: {
		type: Date,
		default: Date.now
	}
});

// [SECTION] Model
module.exports = mongoose.model('Cart', cartSchema); 