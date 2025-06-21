const mongoose = require('mongoose');

// Product Schema
const productSchema = mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
});

// Product Model
const Product = mongoose.model('Product', productSchema);

module.exports = Product


