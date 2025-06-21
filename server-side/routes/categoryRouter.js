const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

// Routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryByID);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Export the router
module.exports = router;