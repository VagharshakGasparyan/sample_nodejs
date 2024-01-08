const bcrypt = require("bcrypt");
const {User} = require("../models");

function generateToken(userId, tokenLength = 64) {
    let words = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let timeWords = '$#@.-+*&^%';
    let token = userId + '_';
    let time = Date.now().toString();
    for(let i = 0; i < time.length; i++){
        token += timeWords.charAt(parseInt(time.charAt(i)));
    }
    for(let i = 0; i < tokenLength - time.length; i++){
        token += words.charAt(Math.random() * words.length);
    }
    let hashedToken = bcrypt.hashSync(token, 8);
    return [token, hashedToken];
}

function loginUser(userId, req, res) {
    let tokens = generateToken(userId);
    req.session.token = tokens[0];
    if(userId in global.usersTokens && Array.isArray(global.usersTokens.userId)){
        global.usersTokens[userId].push(tokens[1]);
    }else{
        global.usersTokens[userId] = [tokens[1]];
    }
}

async function getUserByToken(token) {
    let userId = token ? token.split('_')[0] : null;
    if(userId && userId in global.usersTokens && Array.isArray(global.usersTokens[userId])){
        for(let i = 0; i < global.usersTokens[userId].length; i++){
            if(bcrypt.compareSync(token, global.usersTokens[userId][i])){
                return await User.findOne({where:{id: userId}});
            }
        }
    }
    return null;
}

module.exports = {generateToken, loginUser, getUserByToken};