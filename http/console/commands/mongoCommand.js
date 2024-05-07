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
        // console.log(this.args);
        console.log('mongo command');
        let users = mdb.collection('users');
        try {
            await mdb.createCollection("posts", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: [ "title", "body" ],
                        properties: {
                            title: {
                                bsonType: "string",
                                description: "Title of post - Required."
                            },
                            body: {
                                bsonType: "string",
                                description: "Body of post - Required."
                            },
                            category: {
                                bsonType: "string",
                                description: "Category of post - Optional."
                            },
                            likes: {
                                bsonType: "int",
                                description: "Post like count. Must be an integer - Optional."
                            },
                            tags: {
                                bsonType: ["string"],
                                description: "Must be an array of strings - Optional."
                            },
                            date: {
                                bsonType: "date",
                                description: "Must be a date - Optional."
                            }
                        }
                    }
                }
            });
            // let a = await users.insertOne({
            //     name: "Pablo1",
            //     surname: "Picasso1"
            // });
            // console.log('a=', a);
            // let l = await mdb.collection("posts1");
            // console.log(mdb);
            // let ans = await mdb.createCollection("posts", {capped: true});
            // console.log(ans);
        }catch (e) {
            console.log('===============================ERROR================================');
            console.log(e);
        }




    }
}

module.exports = MongoCommand;