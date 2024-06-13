import { WebSocketServer } from "ws";
import http from "node:http"
import path from "node:path"
import process from "node:process";
import express from "express";

const app = express();
app.use(express.static("client"));
const server = http.createServer(app);
const wss = new WebSocketServer({server});
wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
    })
});

const host = "localhost"
const port = 4747;

server.listen(port, host, () => {
    console.log(`Server started on ${host}:${port}`);    
});
wss.on("message", (ws) => {

})
