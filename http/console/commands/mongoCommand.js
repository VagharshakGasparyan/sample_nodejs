const {DB} = require("../../../components/db");
const bcrypt = require("bcrypt");
const moment = require("moment/moment");
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
const mdb = client.db('test_db');

class MongoCommand {
    constructor(args = []) {
        this.args = args;
    }
    static command = "mongo";
    async handle()
    {
        let users = mdb.collection('users');
        // await users.createIndex({name: "text"});
        try {
            // let ans = await users.find({$text: {$search: "%pablo%"}}).project({_id: 0, name: 1, surname: 1});
            let ans = await users.find({name: {$regex: 'pablo', $options: 'i'}}).project({_id: 0, name: 1, surname: 1});
            for await (const doc of ans) {
                console.log(doc);
            }
            // let ans1 = await users.findOne({}, {projection: {_id: 0, name: 1, surname: 1}});
            // console.log(ans);
            // console.log(ans1);
        }catch (e) {
            console.log('===============================ERROR================================');
            console.log(e);
        }




    }
}

module.exports = MongoCommand;