const cron = require("node-cron");
const {conf} = require("../config/app_config");
const {Op} = require("sequelize");
const fs = require("node:fs");
const path = require("node:path");
const moment = require("moment/moment");

// console.log(__basedir);
//(second (optional) | minute | hour | day of month | month  day of week)
cron.schedule('0 0 * * *', async () => {//running every day at 0:00
    let logDir = 'logs';
    let logExt = '.log';
    let lastDate = new Date(new Date() - 60 * 24 * 3600 * 1000);//last 60 days
    try {
        let logFiles = fs.readdirSync(__basedir + '/' + logDir);
        logFiles.forEach((logFile)=>{
            let logFilePath = __basedir + '/' + logDir + '/' + logFile;
            if(fs.statSync(logFilePath).isFile()){
                let fileName = logFile.endsWith(logExt) ? logFile.slice(0, logFile.length - logExt.length) : '';
                if(fileName){
                    let m = moment(fileName, 'yyyy_MM_DD');
                    if( m < lastDate){
                        fs.unlinkSync(logFilePath);
                    }
                }
            }
        });
    }catch (e) {
        console.error(e);
    }

});