const fs = require("node:fs");
const {conf} = require("../config/app_config");
const {makeDirectoryIfNotExists} = require("./functions");

module.exports = (dirname) => {
    global.__basedir = dirname;
    global.uploadFile = (path, fileName, fileData) => {
        try {
            let fullPath = __basedir + '/public/' + path;
            makeDirectoryIfNotExists(fullPath);
            fs.writeFileSync(fullPath + '/' + fileName, fileData );
            return true;
        }catch (e) {
            console.error(e);
            return false;
        }
    };
}

