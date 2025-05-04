const fs = require('fs');
const { options } = require('../constant');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.LocalsecretKey;

const logUsers = (fileName) => {
    return (req, resp, next) => {
        let payload;        
        const log = `Request url is ${req.url} and the method is ${req.method} and payload is ${JSON.stringify(payload)} sent on ${Date.now()} \n`
        fs.appendFile("./pos.log", log, (err, resp) => {
            if (!err) {
                next();
            } else {
                return res.json({ message: `Error in writing log ${err}` });
            }
        });
    }
}

const checkAuth = async (req, resp, next) => {
    const accessToken = req.cookies.accessToken;
    try {
        if (!accessToken) {
            return resp.status(401).json({
                success: false,
                message: "Kindly login to visit this url"
            });
        }
        const decoded_token = await jwt.verify(accessToken, secretKey);
        if (!decoded_token) {
            return resp.status(401).json({
                success: false,
                message: "Invalid token provided"
            });
        }
        req.body.user_id = decoded_token._id;
        req.body.user_role = decoded_token.role;
        next();
    } catch (error) {
        console.log("Error in authenticating user ", error);
        // if (error.name === 'TokenExpiredError') {
        //     const decodedUser = jwt.decode(accessToken);
        //     resp.clearCookie("accessToken", options);
        //     const newToken = jwt.sign({ user: decodedUser.user }, secretKey, { expiresIn: '5m' });
        //     resp.cookie('accessToken', newToken, options);
        //     console.log("decodedUser " , decoded_token);
        //     req.body.user_id = decodedUser.user._id;
        //     req.body.user_role = decodedUser.user.role;
        //     return next();
        // }
        return resp.status(400).json({
            success: false,
            message: "Unauthorized request"
        });
    }
}

const adminOnly = (req, resp, next) => {
    const userRole = req.body.user_role;
    if (!userRole || !['admin', 'superAdmin'].includes(userRole)) {
        return resp.status(403).json({
            success: false,
            message: "You are not allowed to access this page"
        });
    }
    next();
}

module.exports = { logUsers, checkAuth, adminOnly };