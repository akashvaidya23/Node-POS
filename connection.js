const mongoose = require('mongoose');

async function connectMongoDB(url, DB_name) {
    return mongoose.connect(`${url}/${DB_name}`);
}

module.exports = { connectMongoDB };