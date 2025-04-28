const express = require("express");
const { Store, Index, Drop, Update } = require("../controllers/categoryController");
const { adminOnly, checkAuth } = require("../middlewares");
const categoryRouter = express.Router();

categoryRouter.post("/", checkAuth, adminOnly, Store).
    get("/", checkAuth, adminOnly, Index).
    delete("/:id", checkAuth, adminOnly, Drop).
    patch("/:id", checkAuth, adminOnly, Update);

module.exports = { categoryRouter };