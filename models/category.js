const { default: mongoose } = require("mongoose");

const CatogorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parent_id: {
        type: String,
        required: false,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Category"
    },
    is_child : {
        type: Number,
        required: true
    }, 
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", CatogorySchema);

module.exports = { Category };