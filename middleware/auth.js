const {conf} = require("../config/app_config");
const {getUserByToken} = require("../components/functions");
const moment = require("moment/moment");

async function auth(req, res, next) {
    //res.on events: 'close', 'drain', 'error', 'finish', 'pipe', 'unpipe'
    // res.on('close', function(){
    //   console.log('res.locals=', res.locals.products);
    // });
    //----------auth user-begin------------------------------
    // console.log(req.cookies);
    res.locals.$auth = {};
    // console.log('global.usersTokens=', global.usersTokens);
    try {
        for(let key in req.cookies){
            if(key.startsWith(conf.cookie.prefix + conf.cookie.delimiter)){
                let role = req.cookies[key].split(conf.cookie.delimiter)[1];
                let auth = await getUserByToken(req.cookies[key]);
                if(auth && role){
                    res.locals.$auth[role] = auth;
                    if(conf.cookie.re_save){
                        res.cookie(key, req.cookies[key], {maxAge: conf.cookie.maxAge, httpOnly: true});
                    }
                }else{
                    res.cookie(key, '', {maxAge: -1});
                }
            }
        }
    } catch (e) {
        log.error(moment().format('yyyy_MM_DD-HH:mm:ss') + '\n' + e.stack + '\n\n');
    }
    //----------auth user-end--------------------------------

    //----------old values-----------------------------------
    res.locals.$old = req.session.old || {};
    req.session.old = req.body || {};
    //----------previous url---------------------------------
    res.locals.$prevUrl = req.session.prevUrl || '';
    req.session.prevUrl = req.url || '';
    //----------errors---------------------------------------
    res.locals.$errors = req.session.errors || {};
    req.session.errors = {};

    res.locals.$fullUrl = {
        protocol: req.protocol,
        host: req.get('host'),
        path: req.path,
        query: req.query,
        url: req.url,
    };
    let backURL = req.header('Referer') || req.url || '/';
    res.redirectBack = () => {
        return res.redirect(backURL);
    };
    next();
}
module.exports = auth;
