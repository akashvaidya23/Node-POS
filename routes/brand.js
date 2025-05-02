const express = require("express");
const { Store, Index, Update, Delete } = require("../controllers/brandController");
const { checkAuth, adminOnly } = require("../middlewares");
const brandRouter = express.Router();

brandRouter.post("/", checkAuth, adminOnly, Store).
    get("/", checkAuth, adminOnly, Index).
    put("/:id", checkAuth, adminOnly, Update).
    delete("/:id", checkAuth, adminOnly, Delete);

module.exports = {
    brandRouter
}