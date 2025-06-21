const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductByID);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Export the router
module.exports = router;