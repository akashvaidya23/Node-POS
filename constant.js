const secretKey = "SAMPLEPOS";
const url = 'mongodb+srv://akashvaidya23:12345@cluster0.h9xfb0c.mongodb.net';
PORT = 8001; 
const options = {
    httpOnly: true,
    secure: true,
}
const DB_name = 'POS';

module.exports = {
    secretKey, options, url, PORT, DB_name
}