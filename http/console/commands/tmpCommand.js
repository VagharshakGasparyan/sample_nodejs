const {DB, getConstraint} = require("../../../components/db");
const bcrypt = require("bcrypt");
const moment = require("moment/moment");
const {nodeCommand} = require("../kernel");
const path = require('node:path');
const TeamsResource = require('../../resources/teamsResource');
const {ValidateClass} = require('../../../components/validate');

class TmpCommand {
    constructor(args = []) {
        this.args = args;
    }
    static command = "tmp";
    async handle()
    {
        // let changeColumn = await DB("persons").changeColumn(
        //     DB.column("user_id").bigint().dropForeign('users')
        // );
        // console.log(changeColumn);
        let ans = await getConstraint('products', 'categories');
        console.log(ans);
        // await DB('products').changeColumn(
        //     DB.column('category_id').bigint().unsigned().dropForeign('categories')
        // );
        // await DB('products').changeColumn(
        //     DB.column('category_id').bigint().unsigned().foreign('categories', 'id')
        // );
    }
}

module.exports = TmpCommand;