const { default: mongoose } = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    description: {
        type: String,
    },
    purchase_price: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        enum: [0.00, 5.00, 10.00, 12.00, 18.00, 28.00],
        required: true
    },
    gst_type: {
        type: String,
        enum: ['inclusive', 'exclusive']
    },
    selling_price: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

ProductSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product }