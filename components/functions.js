const bcrypt = require("bcrypt");
const {User} = require("../models");
const {conf} = require('../config/app_config');
const db = require('../models');
const queryInterface = db.sequelize.getQueryInterface();

function generateToken(userId, role, tokenLength = 128) {
    let words = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@.-+*&^%{}[]:|=()@!?<>';
    let token = userId + '\'' + role + '\'';
    let time = Date.now().toString();
    let k = words.length / 10;
    let arr_st = [];
    for (let i = 0; i < 10; i++) {
        arr_st.push(Math.round(i * k));
    }
    arr_st.push(words.length);
    for (let i = 0; i < time.length; i++) {
        let  t = parseInt(time[i]);
        let n = Math.floor(Math.random() * (arr_st[t + 1] - arr_st[t])) + arr_st[t];
        token += words[n];
    }
    for (let i = 0; i < tokenLength - time.length; i++) {
        token += words[Math.floor(Math.random() * words.length)];
    }
    let hashedToken = bcrypt.hashSync(token, 8);
    return [token, hashedToken];
}

async function saveAndGetUserToken(userId, role = 'user') {
    let tokens = generateToken(userId, role);
    await saveToken(userId, role, tokens[1]);
    return tokens[0];
}

async function loginUser(userId, req, res, role = 'user') {
    let tokens = generateToken(userId, role);
    res.cookie(conf.cookie.prefix + conf.cookie.delimiter + role, tokens[0], {
        maxAge: conf.cookie.maxAge,
        httpOnly: true
    });
    await saveToken(userId, role, tokens[1]);
}

async function getUserByToken(token) {
    let [userId, role] = token ? token.split(conf.cookie.delimiter) : [null, null];
    let userSessions = userId && role
        ? await queryInterface.select(null, conf.cookie.ses_table_name, {where: {user_id: userId, role: role}})
        : [];
    for (const ses of userSessions) {
        if (bcrypt.compareSync(token, ses.token)) {
            if (conf.cookie.re_save) {
                await queryInterface.bulkUpdate(conf.cookie.ses_table_name, {updated_at: new Date()}, {
                    token: ses.token,
                    user_id: userId,
                    role: role
                });
            }
            let auth = await User.findOne({where: {id: userId}});
            if(auth){
                return [role, userId, auth];
            }
        }
    }
    return [null, null, null];
}

async function saveToken(userId, role, token) {
    await queryInterface.bulkInsert(conf.cookie.ses_table_name, [
        {
            user_id: userId,
            role: role,
            token: token,
            created_at: new Date(),
            updated_at: new Date()
        }
    ], {});
}

async function logoutUser(userId, role, req, res) {
    let cookie_key = conf.cookie.prefix + conf.cookie.delimiter + role;
    if (cookie_key in req.cookies) {
        let userSessions = await queryInterface.select(null, conf.cookie.ses_table_name, {
            where: {
                user_id: userId,
                role: role
            }
        });
        for (const ses of userSessions) {
            if (bcrypt.compareSync(req.cookies[cookie_key], ses.token)) {
                await queryInterface.bulkDelete(conf.cookie.ses_table_name, {
                    token: ses.token,
                    user_id: userId,
                    role: role
                }, {});
                res.cookie(cookie_key, '', {maxAge: -1});
            }
        }
    }
}
async function apiLogoutUser(userId, role, req, res) {
    let bw = 'Bearer ';
    let bearer_token = req.headers.authorization;
    bearer_token = bearer_token && bearer_token.startsWith(bw) ? bearer_token.slice(bw.length) : null;
    if(bearer_token){
        let userSessions = await queryInterface.select(null, conf.cookie.ses_table_name, {
            where: {
                user_id: userId,
                role: role
            }
        });
        if(userSessions.length > 0){
            if (bcrypt.compareSync(bearer_token, userSessions[0].token)) {
                await queryInterface.bulkDelete(conf.cookie.ses_table_name, {
                    token: userSessions[0].token,
                    user_id: userId,
                    role: role
                }, {});
                return true;
            }
        }
    }
    return false;

}
module.exports = {loginUser, getUserByToken, logoutUser, apiLogoutUser, saveAndGetUserToken};