import { WebSocketServer } from "ws";
import http from "node:http"
import path from "node:path"
import process from "node:process";
import express from "express";
import fs from "node:fs/promises";
import { MongoClient, ObjectId } from "mongodb";
import { channel } from "node:diagnostics_channel";
import { processmsg } from "./system.js";
export {fs};

const app = express();
app.use(express.static("client"));
const server = http.createServer(app);
const wss = new WebSocketServer({server});
let collection, users = [];
wss.on("connection", (ws) => {    
    ws.on("message", async (msg) => {
        processmsg(wss, ws, JSON.parse(msg.toString()));
    });
});

const host = "localhost"
const port = 4747;

async function main() {
    const url = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(url);
    const connection = await client.connect();
    const database = "evolution";
    const db = connection.db(database);
    collection = db.collection("game");
}

server.listen(port, host, () => {
    console.log(`Server started on ${host}:${port}`);
    main();
});

export {collection};