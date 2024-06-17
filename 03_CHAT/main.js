import { WebSocketServer } from "ws";
import http from "node:http"
import path from "node:path"
import process from "node:process";
import express from "express";
import fs from "node:fs/promises";
import * as parser from "./parser.js"
import { MongoClient, ObjectId } from "mongodb";
import { channel } from "node:diagnostics_channel";
export {fs};

const app = express();
app.use(express.static("client"));
const server = http.createServer(app);
const wss = new WebSocketServer({server});
let chats, collection;
wss.on("connection", (ws) => {    
    ws.on("message", async (msg) => {
        if (JSON.parse(msg.toString()).msg == "sysload") {
            chats = collection.find({});
            for await (let chat of chats)
                for (let k = 0; k < chat.messages.length; k++)
                    ws.send(JSON.stringify(chat.messages[k]));
        }
        else {
            let data = JSON.parse(msg.toString()), q1 = {user1: data.from, user2: data.to}, q2 = {user1: data.to, user2: data.from}, col = await collection.countDocuments(q1);
            if (col == 0) {
                col = await collection.countDocuments(q2);
                if (col == 0)
                    collection.insertOne({user1: data.from, user2: data.to, messages: new Array({msg: data.msg, from: data.from, to: data.to})});
                else {
                    col = collection.find(q2);
                    for await (let mdata of col) {
                        mdata.messages.push({msg: data.msg, from: data.from, to: data.to});
                        collection.replaceOne(q2, mdata);
                    }
                }
            }
            else {
                col = collection.find(q1);
                for await (let mdata of col) {
                    mdata.messages.push({msg: data.msg, from: data.from, to: data.to});
                    collection.replaceOne(q1, mdata);
                }
            }
            for (let client of wss.clients) {
                if (client != ws)
                    client.send(msg.toString());
            }
        }
    });
});

const host = "localhost"
const port = 4747;

async function main() {
    const url = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(url);
    const connection = await client.connect();
    const database = "03_chat";
    const db = connection.db(database);
    collection = db.collection("messages");
    chats = collection.find({});
}

server.listen(port, host, () => {
    console.log(`Server started on ${host}:${port}`);
    main();
});
