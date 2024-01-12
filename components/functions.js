const bcrypt = require("bcrypt");
const {User} = require("../models");
const {conf} = require('../config/app_config');
const db = require('../models');
const queryInterface = db.sequelize.getQueryInterface();

function generateToken(userId, role, tokenLength = 128) {
    let words = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@.-+*&^%{}[]:|=()';
    let timeWords = '$#@.-+*&^%';
    let token = userId + '\'' + role + '\'';
    let time = Date.now().toString();
    for(let i = 0; i < time.length; i++){
        token += timeWords[parseInt(time[i])];
    }
    for(let i = 0; i < tokenLength - time.length; i++){
        token += words[Math.floor(Math.random() * words.length)];
    }
    let hashedToken = bcrypt.hashSync(token, 8);
    return [token, hashedToken];
}

async function loginUser(userId, req, res, role = 'user') {
    let tokens = generateToken(userId, role);
    // req.session.tokens = {...(req.session.tokens ?? {}), [role]: tokens[0]};
    res.cookie(conf.cookie_token_prefix + conf.cookie_token_delimiter + role, tokens[0], {maxAge: 2 * 60 * 60 * 1000, httpOnly: true});
    await saveToken(userId, role, tokens[1]);
}

async function getUserByToken(token) {
    let userId = token ? token.split(conf.cookie_token_delimiter)[0] : null;
    let userSessions = await queryInterface.select(null,'sessions', {where: {user_id: userId}});
    for (const ses of userSessions) {
        if(bcrypt.compareSync(token, ses.token)){
            return await User.findOne({where:{id: userId}});
        }
    }
    // if(userId && userId in global.usersTokens && Array.isArray(global.usersTokens[userId])){
    //     for(let i = 0; i < global.usersTokens[userId].length; i++){
    //         if(bcrypt.compareSync(token, global.usersTokens[userId][i])){
    //             return await User.findOne({where:{id: userId}});
    //         }
    //     }
    // }
    return null;
}

async function saveToken(userId, role, token){
    await queryInterface.bulkInsert('sessions', [
        {
            user_id: userId,
            role: role,
            token: token,
            created_at: new Date(),
            updated_at: new Date()
        }
    ], {});
    // if(userId in global.usersTokens && Array.isArray(global.usersTokens[userId])){
    //     global.usersTokens[userId].push(token);
    // }else{
    //     global.usersTokens[userId] = [token];
    // }
}
async function logoutUser(userId, role, req, res){
    if('_t_ses\'' + role in req.cookies){
        let userSessions = await queryInterface.select(null,'sessions', {where: {user_id: userId, role: role}});
        for (const ses of userSessions) {
            if(bcrypt.compareSync(req.cookies['_t_ses\'' + role], ses.token)){
                await queryInterface.bulkDelete('sessions', {id: ses.id}, {});
                res.cookie('_t_ses\'' + role, '', {maxAge: -1});
            }
        }
        // console.log(userSessions);
    }
    // await queryInterface.bulkDelete('sessions', null, {where: {user_id: userId, role: role}});
    // res.cookie('_t_ses\'' + role, '', {maxAge: -1});
}

module.exports = {generateToken, loginUser, getUserByToken, logoutUser};