const {conf} = require("../config/app_config");
const {getWebAuth} = require("../components/functions");
const moment = require("moment/moment");

async function auth(req, res, next) {
    res.locals.$auth = await getWebAuth(req, res);
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
