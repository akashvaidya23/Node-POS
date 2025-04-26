const express = require("express");
const userRouter = express.Router();
const { HandleGetAllUsers, handelGetUserById, handleUpdateUserByID, handleDeleteUserById, HandleCreateNewUser, handleLogin, handleLogout } = require("../controllers/userController");

userRouter.route("/").get(HandleGetAllUsers).post(HandleCreateNewUser);

userRouter.route("/:id").get(handelGetUserById)
.delete(handleDeleteUserById)
.put(handleUpdateUserByID);

userRouter.post("/login",handleLogin);
userRouter.post("/logout",handleLogout);

module.exports = { userRouter };