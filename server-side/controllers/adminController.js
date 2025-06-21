const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

async function registerAdmin(req, res) {
    try {
        const {username, email, password} = req.body;
        
        // Validation
        if(!username || !password || !email) {
            return res.status(400).json({message: 'All fields are required'});
        }
        
        if(!validator.isEmail(email)) {
            return res.status(400).json({message: 'Invalid email format'});
        }
        
        if(!validator.isLength(password, {min: 8})) {
            return res.status(400).json({message: 'Password must be at least 8 characters long'});
        }

        // Check if admin already exists (username)
        const existingUsername = await Admin.findOne({username});
        if(existingUsername) {
            return res.status(400).json({message: 'Username already exists'});
        }

        // Check if admin already exists (email)
        const existingEmail = await Admin.findOne({email});
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new admin
        const newAdmin = new Admin({
            username, 
            password: hashedPassword, 
            email
        });

        await newAdmin.save();

        // Generate JWT token (optional for registration)
        const token = jwt.sign(
            {id: newAdmin._id}, 
            process.env.JWT_SECRET || 'your-default-secret-key', 
            {expiresIn: '1h'}
        );

        // Don't save token to database for registration
        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
}

async function loginAdmin(req, res) {
    try {
        const {email, password} = req.body;
        
        // Validation
        if(!email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }
        
        if(!validator.isEmail(email)) {
            return res.status(400).json({message: 'Invalid email format'});
        }

        // Find admin by email
        const admin = await Admin.findOne({email});
        if(!admin) {
            return res.status(404).json({message: 'Admin not found'});
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        // Generate JWT token
        const token = jwt.sign(
            {id: admin._id}, 
            process.env.JWT_SECRET || 'your-default-secret-key', 
            {expiresIn: '1h'}
        );

        // Update admin with token (optional)
        admin.token = token;
        await admin.save();

        res.status(200).json({
            message: 'Login successful', 
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
}

module.exports = {
    registerAdmin,
    loginAdmin
};