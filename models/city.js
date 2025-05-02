const { default: mongoose } = require("mongoose");

const cityModel = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    country: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country"
    },
    state: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    }
}, {
    timestamps: true
});

const City = mongoose.model("City", cityModel);

module.exports = { City };