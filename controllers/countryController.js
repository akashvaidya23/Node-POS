const { default: mongoose } = require("mongoose");
const { Country } = require("../models/country");

const Index = async (req, resp) => {
    try {
        const countries = await Country.find({});
        return resp.status(200).json({
            success: true,
            message: "Countries fetched successfully",
            countries
        });
    } catch (error) {
        console.log("Error in fetching countries ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in fetching countries",
            error: error?.message
        })
    }
};

const Store = async (req, resp) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { name } = req.body;
        if (!name) {
            resp.status(400).json({
                success: false,
                message: 'Country name can not be null',
            });
        }
        const checkCountry = await Country.findOne({ name, is_active: 1 }).countDocuments();
        if (checkCountry) {
            resp.status(400).json({
                success: false,
                message: `Country with name ${name} already exists`,
            });
        }
        const country = await Country.create({ name, is_active: 1 });
        await session.commitTransaction();
        session.endSession();
        if (country) {
            await session.abortTransaction();
            resp.status(200).json({
                success: true,
                message: "Country created successfully",
                country
            });
        }
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in creating country ", error);
        resp.status(500).json({
            success: false,
            message: "Error in creating country",
            error: error?.message
        });
    }
}

module.exports = { Index, Store }