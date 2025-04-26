const express = require("express");
const { store } = require("../controllers/brandController");
const brandRouter = express.Router();

brandRouter.post("/", store);

module.exports = {
    brandRouter
}