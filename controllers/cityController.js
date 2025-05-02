const { City } = require("../models/city");
const { Country } = require("../models/country");
const { State } = require("../models/state");

const Index = async (req, resp) => {
    try {
        const cities = await City.find({}).populate(['country', 'state']);
        return resp.status(200).json({
            success: true,
            message: "Cities fetched successfully",
            cities
        });
    } catch (error) {
        console.log("Error in creating state ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in fetching cities",
            error: error?.message
        })
    }
}

const Store = async (req, resp) => {
    try {
        const { name, country, state } = req.body;
        if (!name || !country || !state) {
            return resp.status(400).json({
                success: false,
                message: "Name, country and state are required fields"
            });
        }
        const checkCountry = await Country.find({ _id: country }).countDocuments();
        if (checkCountry == 0) {
            return resp.status(400).json({
                success: false,
                message: `The country with id ${country} does not exist`
            });
        }
        const checkState = await State.find({ country }).countDocuments();
        if (checkState == 0) {
            return resp.status(400).json({
                success: false,
                message: `The state with id ${state} does not exist`
            });
        }
        const newCity = await City.create({ name, country, state });
        return resp.status(200).json({
            success: true,
            message: "City created successfully",
            newCity
        });
    } catch (error) {
        console.log("Error in creating state ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in creating city",
            error: error?.message
        })
    }
}

module.exports = { Index, Store }