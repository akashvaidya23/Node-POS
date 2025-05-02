const { default: mongoose } = require("mongoose");

const countrySchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    is_active: {
        type: Boolean,
        required: true,
        default: 1
    }
}, {
    timestamps: true
});

const Country = mongoose.model("Country", countrySchema);

module.exports = { Country };