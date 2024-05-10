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
            // await users.updateOne(
            //     { name: 'Zako' },
            //     { $set: { name: 'Zeozako' } }
            // );
            // await users.updateMany({}, { $set: { likes: 1 } });
            console.log(await users.countDocuments({name: undefined}));
            // await users.updateOne({name: 'Zakoko'}, { $set: { likes: 1 } }, { upsert: true });
            // console.log(await users.findOne({ name: 'Pabloho' }));
            // console.log(await users.find({ name: 'Pablo' }).toArray());
            // for(let i = 0; i < 10; i++){
            //     await users.insertOne({name: "Pablo" + i, surname: "Picasso" + i});
            // }

            // await users.insertMany([
            //     {name:"John", surname:"Doe"},
            //     {name:"Zako", surname:"Zuko"}
            // ]);
        //     // let ans = await users.find({$text: {$search: "%pablo%"}}).project({_id: 0, name: 1, surname: 1});
        //     let ans = await users.find({name: {$regex: 'pablo', $options: 'i'}}).project({_id: 0, name: 1, surname: 1});
        //     for await (const doc of ans) {
        //         console.log(doc);
        //     }
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