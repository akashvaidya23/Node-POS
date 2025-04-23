const { default: mongoose } = require("mongoose");

const Product = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    category: {
        // type: 
    }
});