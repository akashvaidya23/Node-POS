const { default: mongoose } = require("mongoose");
const { Supplier } = require("../models/supplier");

const Index = async (req, resp) => {
    const page = req.params.page_no;
    const per_page = req.params.per_page;
    try {
        const limit = parseInt(per_page);
        const skip = (parseInt(page) - 1) * per_page;
        const suppliers = await Supplier.find({})
            .skip(skip)
            .limit(limit)
            .populate(['city', 'state', 'country']);
        return resp.status(200).json({
            success: true,
            message: "Suppliers fetched successfully",
            suppliers
        });
    } catch (error) {
        console.log("Error in fetching suppliers ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in fetching suppliers",
            error: error?.message
        });
    }
}

const Store = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { name, email, mobile_no, gst_no, opening_balance, address_line_1, address_line_2, city, state, country, locality, pincode } = req.body;
        if (!name || !email || !mobile_no) {
            return resp.status(400).json({
                success: false,
                message: "Name, email and mobile are the required fields and at least one is missing"
            });
        }
        const supplier = await Supplier.create({ name, email, mobile_no, gst_no, opening_balance, address_line_1, address_line_2, city, state, country, locality, pincode });
        if (supplier) {
            return resp.status(200).json({
                success: true,
                message: "Supplier created successfully",
                supplier
            });
        }
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in creating supplier ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in creating supplier",
            error: error?.message
        });
    }
}

module.exports = { Index, Store }