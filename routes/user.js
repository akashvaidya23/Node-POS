const express = require("express");
const router = express.Router();
const { HandleGetAllUsers, handelGetUserById, handleUpdateUserByID, handleDeleteUserById, HandleCreateNewUser } = require("../controllers/userController");

router.get("/", HandleGetAllUsers).post("/", HandleCreateNewUser);

router.route("/:id").get(handelGetUserById)
.delete(handleDeleteUserById)
.put(handleUpdateUserByID);

module.exports = router;