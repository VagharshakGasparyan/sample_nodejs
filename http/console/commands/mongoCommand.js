const {DB} = require("../../../components/db");
const bcrypt = require("bcrypt");
const moment = require("moment/moment");
const {UUID} = require('bson');
const {MongoClient} = require('mongodb');
// MongoClient.connect("mongodb://localhost:2701/test_db", (err, db)=>{}).then();
const uri = "mongodb://username:password@localhost:27017/exampleDatabase";
// const client = new MongoClient('mongodb://localhost:27017');
const client = new MongoClient('mongodb://localhost:27017');
//await client.close();
const mdb = client.db('test_db');


class MongoCommand {
    constructor(args = []) {
        this.args = args;
    }

    static command = "mongo";

    sleep(t) {
        return new Promise((resolve)=>{
            setTimeout(resolve, t);
        });
    }

    async handle() {
        //\OSPanel\userdata\config/MongoDB-6.0-Win10.conf    replication.replSetName: "rs0"
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
            // let users = mdb.collection('users');
            // await users.insertMany([
            //     {name:"Valod", surname:"Valabekyan"},
            //     {name:"Aram", surname:"Aramyan"}
            // ]);
            // let createdDB = await mdb.createCollection("addresses");
            let list = await mdb.listCollections({}, {nameOnly: true}).toArray();
            console.log(list);
            // const result = await mdb.collection("categories").insertOne({});
            // let ans = await users.find({name:{$in:['John', 'Zakoko']}}).toArray();
            // let ans = await users.updateOne({name: "John"}, {$rename:{"likes":"tmbrd"}});
            // console.log(ans);
        } catch (e) {
            console.log('===============================ERROR================================');
            console.log(e);
        }finally {
            console.log("fff");
        }
        const session = client.startSession();
        try {
            session.startTransaction();
            let users = mdb.collection('users');
            await users.insertMany([
                {name: "Valod", surname: "Valabekyan"},
                {name: "Aram", surname: "Aramyan"}
            ], {session});
            await session.commitTransaction();
        } catch (e) {
            await session.abortTransaction();
            console.log("error ka, error", e);
        } finally {
            await session.endSession();
            console.log("finally ka, finally");
        }

        console.log("handle end");
    }
}

module.exports = MongoCommand;