const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Admin registration route
router.post('/register', adminController.registerAdmin);
// Admin login route
router.post('/login', adminController.loginAdmin);


module.exports = router;