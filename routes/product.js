const express = require("express");
const { Store, Index, Show, Delete } = require("../controllers/productController");
const { checkAuth } = require("../middlewares");

const productRouter = express.Router();

productRouter.post("/", checkAuth, Store).get("/", checkAuth, Index).get("/:id", checkAuth, Show).delete("/:id", checkAuth, Delete);

module.exports = { productRouter }