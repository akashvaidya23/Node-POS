const { Router } = require("express");
const { Index, Store } = require("../controllers/countryController");
const { checkAuth, adminOnly } = require("../middlewares");

const countryRouter = Router();

countryRouter.get("/", checkAuth, adminOnly, Index)
    .post("/", checkAuth, adminOnly, Store);

module.exports = { countryRouter };