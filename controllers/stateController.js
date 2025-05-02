const { Country } = require("../models/country");
const { State } = require("../models/state");

const Index = async (req, resp) => {
    try {
        const states = await State.find({is_active: true}).populate(["country"])
        return resp.json({
            success: true,
            message: "States fetched successfully",
            states
        });
    } catch (error) {
        console.log("Error in fetching states ", error);
        return resp.json({
            success: false,
            message: "Error in fetching states",
            error: error?.message
        });
    }
};

const Store = async (req, resp) => {
    try {
        const { name, country } = req.body;
        const checkCountry = await Country.findOne({ _id: country, is_active: true }).countDocuments();
        
        if (checkCountry == 0) {
            return resp.status(400).json({
                success: false,
                message: "Country does not exist"
            });
        }

        const result = await State.create({ name, country });
        if (result) {
            return resp.status(200).json({
                success: true,
                message: "State created successfully",
                result
            });
        }
    } catch (error) {
        console.log("Error in creating state ", error);
        return resp.json({
            success: false,
            message: "Error in creating state",
            error: error?.message
        });
    }
}

module.exports = { Index, Store }