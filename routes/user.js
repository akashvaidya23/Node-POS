const express = require("express");
const userRouter = express.Router();
const { HandleGetAllUsers, handelGetUserById, handleUpdateUserByID, handleDeleteUserById, HandleCreateNewUser, handleLogin, handleLogout, handleAdminCreate } = require("../controllers/userController");
const { checkAuth, adminOnly } = require("../middlewares");

userRouter.route("/").get(checkAuth, adminOnly, HandleGetAllUsers).post(checkAuth, adminOnly, HandleCreateNewUser);

userRouter.route("/:id").get(checkAuth, adminOnly, handelGetUserById)
    .delete(checkAuth, adminOnly, handleDeleteUserById)
    .put(checkAuth, adminOnly, handleUpdateUserByID);

userRouter.post("/login", handleLogin);
userRouter.post("/logout", checkAuth, handleLogout);
userRouter.get("/superAdmin/create", handleAdminCreate);

module.exports = { userRouter };