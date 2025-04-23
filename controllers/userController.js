const { User } = require("../models/user")

const HandleGetAllUsers = async (req, response, err) => {
    try {
        const allUsers = await User.find({});
        return response.json({ status: 200, users : allUsers});
    } catch (Exception) {
        return response.json({ status: 500, message : "Something went wrong", error : Exception });
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

const handleDeleteUserById = async(req, resp) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        return resp.json({status: 200, message : "User deleted successfully" });
    } catch (Exception) {
        return response.json({ status: 500, message: "Something went wrong", Exception });
    }
}

const HandleCreateNewUser = async (req, resp) => {
    try {
        const body = req.body;
        const result = await User.create(body);
        return resp.json({status: 200, user : result, message : 'User created successfully'});
    } catch (Exception) {
        console.log(Exception);
        return resp.json({ status: 500, message: "Something went wrong", Exception });
    }
}

module.exports = {
    HandleGetAllUsers, handelGetUserById, handleUpdateUserByID, handleDeleteUserById, HandleCreateNewUser
}
