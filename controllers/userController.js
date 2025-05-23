const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const { options } = require("../constant");
const { default: mongoose } = require("mongoose");
const { uploadFile } = require("../utils/common");
require("dotenv").config();
const secretKey = process.env.LocalsecretKey;

const HandleGetAllUsers = async (req, response, err) => {
    const { page, per_page } = req.query;
    try {
        const limit = parseInt(per_page);
        const skip = (parseInt(page) - 1) * per_page;
        const allUsers = await User.find({})
            .limit(limit)
            .skip(skip);
        const usersCount = await User.find({}).countDocuments();
        return response.json({ status: 200, users: allUsers, usersCount });
    } catch (Exception) {
        return response.json({ status: 500, message: "Something went wrong", error: Exception });
    }
}

const handelGetUserById = async (req, resp) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        return resp.json({ 'status': 200, 'user': user });
    } catch (Exception) {
        return response.json({ status: 500, message: "Something went wrong", Exception });
    }
}

const handleUpdateUserByID = async (req, resp) => {
    try {
        const id = req.params.id;
        let body = req.body;
        const user = await User.findByIdAndUpdate(id, body, { new: true });
        return resp.json({ status: 200, user, message: "User updated successfully" });
    } catch (Exception) {
        return response.json({ status: 500, message: "Something went wrong", Exception });
    }
}

const handleDeleteUserById = async (req, resp) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        return resp.json({ status: 200, message: "User deleted successfully" });
    } catch (Exception) {
        return response.json({ status: 500, message: "Something went wrong", Exception });
    }
}

const HandleCreateNewUser = async (req, resp) => {
    const session = await mongoose.startSession();
    const files = req.files;
    let avatar;
    let profile_photo;
    if (!files) {
        avatar = files.avatar[0].path;
        profile_photo = files.profile_photo[0].path;
    }
    try {
        session.startTransaction();
        const body = req.body;
        console.log("body ", body);
        const checkUser = await User.findOne({ email: body.email });
        console.log("checkUser ", checkUser);
        if (checkUser) {
            return resp.status(400).json({
                success: false,
                message: `User with email already exists`
            });
        }
        if (avatar) {
            const avatarImageResp = await uploadFile(avatar, "POS/customers");
            body.avatar = avatarImageResp.url;
        }
        if (profile_photo) {
            const profilePhotoResp = await uploadFile(profile_photo, "POS/customers");
            body.profile_photo = profilePhotoResp.url;
        }
        body.password = await bcrypt.hash(body.password, saltRounds);
        const result = await User.create(body);
        const createdUser = await User.findById(result._id).select("-password");
        const accessToken = jwt.sign(createdUser.toObject(), secretKey, { expiresIn: '60m' });
        await session.commitTransaction();
        session.endSession();
        return resp.status(200)
            .cookie('accessToken', accessToken, options)
            .json({
                success: true,
                user: createdUser,
                message: 'User created successfully'
            });
    } catch (Exception) {
        await session.abortTransaction();
        console.log(Exception);
        return resp.status(500).json({ success: false, message: "Something went wrong" });
    }
}

const handleLogin = async (req, resp) => {
    try {
        if (req.cookies.accessToken) {
            return resp.status(400).json({
                success: true,
                message: "You are already logged in"
            });
        }
        const email = req.body.email;
        const user_password = req.body.password;
        if (!email || !user_password) {
            return resp.status(400).json({
                success: false,
                message: "Kindly provide email and password"
            });
        }
        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            return resp.status(400).json({
                success: false,
                message: 'User with email not found'
            });
        }
        existingUser = existingUser.toObject();
        const compared_password = await bcrypt.compare(user_password, existingUser.password);
        if (compared_password) {
            delete existingUser.password;
            let accessToken = jwt.sign(existingUser, secretKey, { expiresIn: '60m' });
            return resp.status(200).
                cookie("accessToken", accessToken, options).
                json({
                    success: true,
                    message: "Logged in successfully",
                    user: existingUser
                });
        } else {
            return resp.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }
    } catch (error) {
        console.log("Error in login ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in login"
        });
    }
}

const handleLogout = async (req, resp) => {
    return resp.status(200).
        clearCookie("accessToken", options).
        json({
            status: true,
            message: "User logged out successfully"
        });
}

const handleAdminCreate = async (req, resp) => {
    try {
        const payload = {
            first_name: "Super Admin",
            email: "superAdmin@gmail.com",
            password: await bcrypt.hash("SuperAdmin@123", saltRounds),
            role: "superAdmin"
        };
        // check if superAdmin is already created
        const check = await User.findOne({ role: "superAdmin" });
        console.log(check);
        if (check) {
            return resp.status(400).json({
                success: false,
                message: "Can not create user"
            });
        }
        const result = await User.create(payload);
        if (result) {
            const createdUser = await User.findById(result._id).select("-password");
            return resp.status(200).json({
                success: true,
                message: 'User created successfully',
                createdUser
            });
        }
    } catch (error) {
        console.log(" Error in creating super admin user ", error);
        return resp.status(500).json({
            success: false,
            message: "Error in creating user"
        });
    }
}

module.exports = {
    HandleGetAllUsers, handelGetUserById, handleUpdateUserByID, handleDeleteUserById, HandleCreateNewUser, handleLogin, handleLogout, handleAdminCreate
}