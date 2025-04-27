const express = require("express");
const userRouter = express.Router();
const { HandleGetAllUsers, handelGetUserById, handleUpdateUserByID, handleDeleteUserById, HandleCreateNewUser, handleLogin, handleLogout, handleAdminCreate } = require("../controllers/userController");

userRouter.route("/").get(HandleGetAllUsers).post(HandleCreateNewUser);

userRouter.route("/:id").get(handelGetUserById)
    .delete(handleDeleteUserById)
    .put(handleUpdateUserByID);

userRouter.post("/login", handleLogin);
userRouter.post("/logout", handleLogout);
userRouter.get("/superAdmin/create", handleAdminCreate);

module.exports = { userRouter };