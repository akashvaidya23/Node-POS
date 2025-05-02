const { Router } = require("express");
const { Index, Store } = require("../controllers/cityController");
const { checkAuth, adminOnly } = require("../middlewares");

const cityRouter = Router();

cityRouter.get("/", checkAuth, adminOnly, Index)
    .post("", checkAuth, adminOnly, Store);

module.exports = { cityRouter }