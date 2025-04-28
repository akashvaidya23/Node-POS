const { Brand } = require("../models/brand");

const store = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
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

module.exports = {
    store
};