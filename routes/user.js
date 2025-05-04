const express = require("express");
const userRouter = express.Router();
const { HandleGetAllUsers, handelGetUserById, handleUpdateUserByID, handleDeleteUserById, HandleCreateNewUser, handleLogin, handleLogout, handleAdminCreate } = require("../controllers/userController");
const { checkAuth, adminOnly } = require("../middlewares");

const multer = require('multer');
const upload = multer({dest: "./uploads"});

const userImageUpload = upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'profile_photo',
        maxCount: 1
    }
]);

userRouter.route("/").get(checkAuth, adminOnly, HandleGetAllUsers)
    .post(userImageUpload, HandleCreateNewUser);

userRouter.route("/:id").get(checkAuth, adminOnly, handelGetUserById)
    .delete(checkAuth, adminOnly, handleDeleteUserById)
    .put(checkAuth, adminOnly, handleUpdateUserByID);

userRouter.post("/login", handleLogin);
userRouter.post("/logout", handleLogout);
userRouter.get("/superAdmin/create", handleAdminCreate);

module.exports = { userRouter };