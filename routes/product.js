const express = require("express");
const { Store, Index, Show, Delete } = require("../controllers/productController");
const { checkAuth, adminOnly } = require("../middlewares");

const productRouter = express.Router();

productRouter.post("/", checkAuth, adminOnly, Store).
    get("/", checkAuth, adminOnly, Index).
    get("/:id", checkAuth, adminOnly, Show).
    delete("/:id", checkAuth, adminOnly, Delete);

module.exports = { productRouter }