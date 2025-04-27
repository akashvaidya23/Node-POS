const express = require("express");
const { store } = require("../controllers/brandController");
const { checkAuth, adminOnly } = require("../middlewares");
const brandRouter = express.Router();

brandRouter.post("/", checkAuth, adminOnly, store);

module.exports = {
    brandRouter
}