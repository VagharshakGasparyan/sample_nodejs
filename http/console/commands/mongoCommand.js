const {DB} = require("../../../components/db");
const bcrypt = require("bcrypt");
const moment = require("moment/moment");
const { UUID } = require('bson');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
//await client.close();
const mdb = client.db('test_db');


class MongoCommand {
    constructor(args = []) {
        this.args = args;
    }
    static command = "mongo";
    async handle()
    {
        /*
let dbName = mdb.databaseName;
let dbOptions = mdb.options;
await mdb.dropDatabase();//true|false

let collection = await mdb.createCollection("users");
await mdb.listCollections({name: 'users'}, {nameOnly: true}).toArray();//[{name: "users", type: "collection"}, {...}]
await mdb.listCollections({}, {nameOnly: true}).toArray();

await users.insertOne({name:"Pablo", surname:"Picasso"});
await users.insertMany([
    {name:"John", surname:"Doe"},
    {name:"Zako", surname:"Zuko"}
]);

await coll.findOne({ name: 'Pablo' });//{ name: 'Pablo', surname: 'Picasso', ... } | null
[{ name: 'Pablo', surname: 'Picasso', ... }] | [] <≡> await coll.find({ name: 'Pablo' }).toArray();
await users.deleteOne({ title: 'Congo' });


        */
//await users.deleteMany({ title: { $regex: /^Shark.*/ } });
// await mdb.collection('users').deleteMany({ name: { $regex: /^Pablo.*/ } });



        // const result = await mdb.collection("users").insertOne({});
        // await mdb.dropCollection('users');
        // client.close()
        // let createdDB = await mdb.createCollection("users");
        // console.log(createdDB);
        // console.log(mdb.databaseName);
        // await mdb.dropDatabase();
        // console.log(await mdb.listCollections({name: 'users'}, {nameOnly: true}).toArray());
        // console.log(await mdb.collections());
        // console.log(mdb.collection('qwerty'));
        // console.log(mdb.options);
        // console.log(await mdb.listCollections().toArray());
        // console.log(await mdb.collections());
        // console.log(new UUID().toBinary());
        // let users = mdb.collection('users');
        // // await users.createIndex({name: "text"});
        //<≡>
        try {
            let users = mdb.collection('users');
            // let ans = await users.find({name:{$in:['John', 'Zakoko']}}).toArray();
            let ans = await users.updateOne({name: "John"}, {$rename:{"likes":"tmbrd"}});
            console.log(ans);
        }catch (e) {
            console.log('===============================ERROR================================');
            console.log(e);
        }




    }
}

module.exports = MongoCommand;