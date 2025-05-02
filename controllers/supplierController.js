const { default: mongoose } = require("mongoose");
const { Supplier } = require("../models/supplier");

const Index = () => {

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