require('dotenv').config();
console.log(" env ", process.env.cloud_name);

const fs = require("fs");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    secure: true,
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const uploadFile = async (filePath, folder) => {
    try {
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            folder
        });
        fs.unlinkSync(filePath);
        return response;
    } catch (error) {
        console.log("Error in file upload ", error);
        fs.unlinkSync(filePath);
        return null;
    }
}

module.exports = { uploadFile }