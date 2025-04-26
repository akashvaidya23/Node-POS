const express = require("express");
const { Store, Index, Drop, Update } = require("../controllers/categoryController");
const categoryRouter = express.Router();

categoryRouter.post("/", Store).get("/", Index).delete("/:id", Drop).patch("/:id", Update);

module.exports = { categoryRouter };