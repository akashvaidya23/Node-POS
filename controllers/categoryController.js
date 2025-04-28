const { Category } = require("../models/category");

const Index = async (req, resp) => {
    const { page, per_page } = req.query;
    try {
        const limit = parseInt(per_page);
        const skip = (parseInt(page) - 1) * per_page;
        const categories = await Category.find({})
            .limit(limit)
            .skip(skip);
        return resp.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            "categories": categories
        })
    } catch (error) {
        console.log("Error in fetching category list ", error);
        return resp.status(500).json({
            success: true,
            message: "Error in fetching Categories"
        });
    }
}

const Store = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        const { name, parent_id, is_child } = req.body;
        if (!name || is_child == null) {
            return resp.status(400).json({
                success: false,
                message: "Kindly fill all the required fields"
            });
        }
        const res = await Category.create({ name, parent_id, is_child });
        await session.commitTransaction();
        session.endSession();
        return resp.status(200).json({
            success: true,
            message: "Category created successfully",
            res,
        });
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in creating category ", error?.message);
        return resp.status(500).json({
            success: false,
            message: "Error in creating category"
        });
    }
}

const Drop = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        const id = req.params.id;
        if (!id) {
            return resp.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }
        const response = await Category.findByIdAndDelete(id);
        await session.commitTransaction();
        session.endSession();
        return resp.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in deleting category ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in deleting category"
        });
    }
}

const Update = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        const id = req.params.id;
        if(!id) {
            return resp.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }
        const { name, parent_id, is_child } = req.body;
        if (!name || is_child == null) {
            return resp.status(400).json({
                success: false,
                message: "Kindly fill all the required fields"
            });
        }
        const response = await Category.findByIdAndUpdate(id, { name, parent_id, is_child }, { new: true });
        console.log(response);
        await session.commitTransaction();
        session.endSession();
        return resp.status(200).json({
            success: true,
            message: "Category updated successfully",
            response
        });
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in updating category ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in updating category"
        });
    }
}

module.exports = { Store, Index, Drop, Update };