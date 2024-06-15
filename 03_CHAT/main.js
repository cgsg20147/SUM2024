import { WebSocketServer } from "ws";
import http from "node:http"
import path from "node:path"
import process from "node:process";
import express from "express";
import fs from "node:fs/promises";
import * as parser from "./parser.js"
export {fs};

const app = express();
app.use(express.static("client"));
const server = http.createServer(app);
const wss = new WebSocketServer({server});
let chats, i = 0;
wss.on("connection", (ws) => {    
    ws.on("message", (msg) => {
        if (JSON.parse(msg.toString()).msg == "sysload") {
            chats = parser.processRaw();
            for (let j = 0; j < chats.length; j++)
                for (let k = 0; k < chats[j].messages.length; k++)
                    ws.send(JSON.stringify(chats[j].messages[k]));
        }
        else {
            let data = JSON.parse(msg.toString());
            parser.write(data.msg, data.from, data.to);
            for (let client of wss.clients) {
                if (client != ws)
                    client.send(msg.toString());
            }
        }
    });
});

const host = "localhost"
const port = 4747;

server.listen(port, host, () => {
    console.log(`Server started on ${host}:${port}`);    
    parser.LoadChats();
});
