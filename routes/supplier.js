const { Router } = require("express");
const { Index, Store } = require("../controllers/supplierController");

const supplierRouter = Router();

supplierRouter.get("/", Index)
    .post("/", Store);

module.exports = { supplierRouter }