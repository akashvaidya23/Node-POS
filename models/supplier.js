const { default: mongoose } = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    mobile_no: {
        required: true,
        type: String,
        length: 10
    },
    tax_no: {
        type: String
    },
    opening_balance: {
        type: Number
    },
    address_line_1: {
        type: String
    },
    address_line_2: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    locality: {
        type: String
    },
    pincode: {
        type: String
    }
}, {
    timestamps: true
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = { Supplier }