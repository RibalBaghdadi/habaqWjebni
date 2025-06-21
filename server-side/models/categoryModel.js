const mongoose = require('mongoose');

// Category Schema
const categorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
});

// Category Model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;