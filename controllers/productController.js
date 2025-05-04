const { default: mongoose } = require("mongoose");
const { Brand } = require("../models/brand");
const { Category } = require("../models/category");
const { Product } = require("../models/product");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    secure: true,
    cloud_name: "daltnzpio",
    api_key: "554636846645196",
    api_secret: "fP3Dx3GNiQlNoJGCsNUYhV0zJoY",
});
const fs = require("fs");
const { uploadFile } = require("../utils/common");

// Get all the products
const Index = async (req, resp) => {
    let { page, per_page } = req.query;
    page = page ? page : 1;
    per_page = per_page ? per_page : 10;
    try {
        const limit = parseInt(per_page);
        const skip = (parseInt(page) - 1) * per_page;
        const products = await Product.find({})
            .limit(limit)
            .skip(skip)
            .populate(['category', 'brand', 'created_by']);
        const productsCount = await Product.find({}).countDocuments();
        return resp.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
            productsCount
        });
    } catch (error) {
        console.log("Error in fetching products ", error);
        return resp.json({
            success: false,
            message: "Error in fetching products"
        })
    }
};

// Store the product
const Store = async (req, resp) => {
    const session = await mongoose.startSession();
    const filePath = req?.file?.path;
    try {
        session.startTransaction();
        const { name, sku, category, brand, description, purchase_price, gst, gst_type, user_id } = req.body;
        const errors = [];
        if (!name) {
            errors.push({ name: "Name can not be null" });
        }
        if (!sku) {
            errors.push({ sku: "Sku can not be null" });
        }
        if (sku) {
            const product = await Product.findOne({ sku });
            if (product) {
                errors.push({ skuExists: `SKU ${sku} already exists` });
            }
        }
        if (!brand) {
            errors.push({ brand: "Brand can not be null" });
        } else {
            const checkBrand = await Brand.findById(brand);
            if (!checkBrand) {
                errors.push({ brandNotFound: `Brand with id ${brand} does not exist` });
            }
        }
        if (!category) {
            errors.push({ category: "Category can not be null" });
        } else {
            const checkCategory = await Category.findById(category);
            if (!checkCategory) {
                errors.push({ categoryNotFound: `Category with id ${category} does not exist` });
            }
        }
        const gsts = [0.00, 5.00, 10.00, 12.00, 18.00, 28.00];
        if (!gsts.includes(parseFloat(gst))) {
            errors.push({ GSTError: "GST does not exists" });
        }
        if (errors.length > 0) {
            return resp.status(400).json({
                success: false,
                message: "Something went wrong",
                errors
            });
        }
        const tax_amount = parseFloat(purchase_price * gst / 100);
        const selling_price = parseFloat(purchase_price) + tax_amount;
        let uploadImageResp;
        if (filePath) {
            uploadImageResp = await uploadFile(filePath, "POS/products");
        }
        const newProduct = await Product.create({ name, sku, category, brand, description, purchase_price, gst, gst_type, selling_price, created_by: user_id, image_url: uploadImageResp?.url });
        await session.commitTransaction();
        session.endSession();
        if (newProduct) {
            return resp.status(200).json({
                success: true,
                message: "Product created successfully",
                newProduct
            });
        }
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in creating product ", error);
        fs.appendFile('error.log', `${new Date().toISOString()} - Error in creating product: ${error?.message}\n`, (err) => {
            if (err) {
                console.error("Failed to write error to log file", err);
            }
        });
        return resp.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Find product by ID
const Show = async (req, resp) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id });
        if (product) {
            return resp.status(200).json({
                success: true,
                message: "Product fetched successfully",
                product
            });
        } else {
            return resp.status(500).json({
                success: true,
                message: "Product with given id not found"
            });
        }
    } catch (error) {
        console.log("Error in fetching product ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in fetching product by id"
        });
    }
}

// Delete product by ID
const Delete = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const id = req.params.id;
        const product = await Product.findById({ _id: id });
        console.log(product);
        if (product) {
            const result = await product.deleteOne();
            await session.commitTransaction();
            session.endSession();
            if (result) {
                return resp.status(200).json({
                    success: true,
                    message: "Product deleted successfully"
                });
            } else {
                return resp.status(500).json({
                    success: false,
                    message: "Error in deleting product"
                });
            }
        } else {
            return resp.status(400).json({
                success: false,
                message: "Product with given id not found"
            })
        }
    } catch (error) {
        session.abortTransaction();
        console.log("Error in deleting product " + error);
        return resp.status(500).json({
            success: false,
            message: "Error in deleting product"
        });
    }
}

const ImportProducts = async (req, resp) => { }

module.exports = { Store, Index, Show, Delete, ImportProducts };