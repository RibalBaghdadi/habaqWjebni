const Product = require('../models/productModel');

async function getProducts(req,res) {
    try {
        const products = await Product.find().populate('category');
        if(!products || products.length === 0) {
            return res.status(404).json({message: 'No products found'});
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

async function getProductByID(req,res) {
    try {
        const id = req.params.id;
        const product = await Product.findById(id).populate('category');
        if(!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

async function createProduct(req, res) {
    try {
        const { name, price, description, image, category } = req.body;
        
        // Basic validation
        if (!name || !price || !description || !image || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newProduct = new Product({ name, price, description, image, category });
        await newProduct.save();
        
        // Populate category before sending response
        const populatedProduct = await Product.findById(newProduct._id).populate('category');
        
        res.status(201).json(populatedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function updateProduct(req,res) {
    try {
        const id = req.params.id;
        const { name, price, description, image, category } = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { name, price, description, image, category }, 
            { new: true }
        ).populate('category');
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function deleteProduct(req, res) {
    try {
        const id = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
};