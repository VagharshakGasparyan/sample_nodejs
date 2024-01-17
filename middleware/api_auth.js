const {conf} = require("../config/app_config");
const {getUserByToken} = require("../components/functions");
const moment = require("moment/moment");

async function api_auth(req, res, next) {
    let bw = 'Bearer ';
    res.locals.$api_auth = {};
    let bearer_token = req.headers.authorization;
    bearer_token = bearer_token && bearer_token.startsWith(bw) ? bearer_token.slice(bw.length) : null;
    let [role, userId, auth] = await getUserByToken(bearer_token, req, res);
    if(userId && role && auth){
        res.locals.$api_auth[role] = auth;
    }
    next();
}
module.exports = api_auth;
