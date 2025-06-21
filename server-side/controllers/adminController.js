const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

async function registerAdmin(req, res) {
    try {
        const {username, email, password} = req.body;
        const existingUsername = await Admin.findOne({username})
        if(!username || !password || !email) {
            return res.status(400).json({message: 'All fields are required'});
        }
        if(!validator.isEmail(email)) {
            return res.status(400).json({message: 'Invalid email format'});
        }
        if(!validator.isLength(password, {min: 8})) {
            return res.status(400).json({message: 'Password must be at least 8 characters long'});
        }

        if(existingUsername) {
            return res.status(400).json({message: 'Admin already exists'});
        }

        const existingEmail = await Admin.findOne({email});
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = new Admin({username, password: hashedPassword, email});

        await newAdmin.save();
        const token = jwt.sign({id: newAdmin._id}, process.env.JWT_SECRET, {expiresIn: '1h'})

        
        res.status(201).json({message: 'Admin registered successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function loginAdmin(req, res) {
    try {
        const {email, password} = req.body;
        const admin = await Admin.findOne({email});
        if(!email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }
        if(!validator.isEmail(email)) {
            return res.status(400).json({message: 'Invalid email format'});
        }
        if(!admin) {
            return res.status(404).json({message: 'Admin not found'});
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign({id: admin._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        admin.token = token
        await admin.save();
        res.status(200).json({message: 'Login successful', token});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports = {
    registerAdmin,
    loginAdmin
};