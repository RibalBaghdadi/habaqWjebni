const mongoose = require('mongoose');

// admin schema
const adminSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    token: {type: String} 
}, {
    timestamps: true 
});

// admin model
const Admin = mongoose.model('Admin', adminSchema);

// export admin model
module.exports = Admin;