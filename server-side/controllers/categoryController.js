const Category = require('../models/categoryModel');

async function getCategories(req, res) {
    try {
        const categories = await Category.find();
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getCategoryByID(req, res) {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function createCategory(req, res) {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateCategory(req, res) {
    try {
        const id = req.params.id;
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteCategory(req, res) {
    try {
        const id = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getCategories,
    getCategoryByID,
    createCategory,
    updateCategory,
    deleteCategory
};