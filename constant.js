const secretKey = "SAMPLEPOS";
const url = 'mongodb://127.0.0.1:27017/POS';
PORT = 8001; 
const options = {
    httpOnly: true,
    secure: true,
}

module.exports = {
    secretKey, options, url, PORT
}