const { Router } = require("express");
const { Index, Store } = require("../controllers/stateController");
const { checkAuth, adminOnly } = require("../middlewares");

const stateRouter = Router();

stateRouter.get("/", checkAuth, adminOnly, Index)
    .post("/", checkAuth, adminOnly, Store)

module.exports = { stateRouter };