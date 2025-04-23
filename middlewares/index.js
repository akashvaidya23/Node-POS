const fs = require('fs');

const logUsers = (fileName) => {
    return (req, resp, next) => {
        const log = `Request url is ${req.url} and the method is ${req.method} and payload is ${JSON.stringify(req.body)} sent on ${Date.now()} \n`
        fs.appendFile("./pos.log", log, (err, resp) => {
            if(!err){
                next();
            } else {
                return res.json({message: `Error in writing log ${err}`});
            }
        });
    }
}

module.exports = { logUsers };