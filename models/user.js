const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    }, 
    middle_name:{
        type: String
    },
    last_name:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String
    },
    gender: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = {User};