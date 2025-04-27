const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const { secretKey, options } = require("../constant");

const HandleGetAllUsers = async (req, response, err) => {
    try {
        const allUsers = await User.find({});
        return response.json({ status: 200, users: allUsers });
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
    try {
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
        body.password = await bcrypt.hash(body.password, saltRounds);
        const result = await User.create(body);
        const createdUser = await User.findById(result._id).select("-password");
        // console.log("createdUser ", createdUser.toObject());
        const accessToken = jwt.sign(createdUser.toObject(), secretKey, { expiresIn: '5m' });
        return resp.status(200)
            .cookie('accessToken', accessToken, options)
            .json({
                success: true,
                user: createdUser,
                message: 'User created successfully'
            });
    } catch (Exception) {
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
            const { password, __v, ...user } = existingUser;
            var accessToken = jwt.sign({ user }, secretKey, { expiresIn: '5m' });
            return resp.status(200).
                cookie("accessToken", accessToken, options).
                json({
                    success: true,
                    message: "Logged in successfully",
                    user
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