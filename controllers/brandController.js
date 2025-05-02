const { default: mongoose } = require("mongoose");
const { Brand } = require("../models/brand");
const { Product } = require("../models/product");

const Index = async (req, resp) => {
    const { page, per_page } = req.query;
    try {
        const limit = parseInt(per_page);
        const skip = (parseInt(page) - 1) * per_page;
        const brands = await Brand.find({})
            .limit(limit)
            .skip(skip);
        return resp.status(200).json({
            success: true,
            message: "Brands fetched successfully",
            brands
        });
    } catch (error) {
        console.log("Error in fetching brands ", error);
        return resp.status(500).json({
            success: true,
            message: "Error in fetching brands"
        });
    }
}

const Store = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { name, description } = req.body;
        if (!name) {
            return resp.status(400).json({
                success: false,
                message: "Kindly provide required details"
            });
        }
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return resp.status(400).json({
                success: false,
                message: `Brand with name ${name} already exists`
            });
        }
        const response = await Brand.create({ name, description });
        await session.commitTransaction();
        session.endSession();
        return resp.status(200).json({
            success: true,
            message: "Brand created successfully",
            response
        });
    } catch (Exception) {
        await session.abortTransaction();
        console.log("Error in creating brand ", Exception);
        return resp.status(500).json({
            success: false,
            message: "Error in creating brand",
        });
    }
};

const Update = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { name, description } = req.body;
        const id = req.params.id;
        const updatedBrand = await Brand.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedBrand) {
            return resp.status(500).json({
                success: false,
                message: "Error in updating brand"
            });
        }
        await session.commitTransaction();
        session.endSession();
        return resp.status(500).json({
            success: true,
            message: "Brand updated successfully",
            updatedBrand
        });
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in updating brand ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in updating brand",
        });
    }
}

const Delete = async (req, resp) => {
    try {
        const id = req.params.id;
        if (!id) {
            return resp.status(400).json({
                success: false,
                message: "Brand id not received"
            });
        }
        const countProducts = Product.find({ brand: id }).countDocuments();
        if (countProducts > 0) {
            return resp.status(400).json({
                success: false,
                message: "Brand can not be deleted as it is associated with products"
            });
        }
        const deletedBrand = await Brand.findByIdAndDelete({ _id: id });
        if (!deletedBrand) {
            return resp.status(400).json({
                success: false,
                message: "Error in deleting brand"
            });
        }
        return resp.status(200).json({
            success: true,
            message: "Brand deleted successfully"
        });
    } catch (error) {
        console.log(" Error in deleting brand ", error);
        return resp.status(400).json({
            success: false,
            message: "Error in deleting brand"
        });
    }
}

module.exports = {
    Index, Store, Update, Delete
};