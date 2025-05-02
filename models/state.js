const { default: mongoose } = require("mongoose");

const stateSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
        required: true
    },
    is_active: {
        required: true,
        type: Boolean,
        default: 1
    }
}, {
    timestamps: true
});

const State = mongoose.model("State", stateSchema);

module.exports = { State };