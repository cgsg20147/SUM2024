(function (ws, http, node_path, node_process, express) {
    'use strict';

    const app = express();
    app.use(express.static("client"));
    const server = http.createServer(app);
    const wss = new ws.WebSocketServer({server});
    wss.on("connection", (ws) => {
        console.log("Open connection");
        wss.send("Hello");
    });

    const host = "localhost";
    const port = 4747;

    server.listen(port, host, () => {
        console.log(`Server started on ${host}:${port}`);
    });

})(ws, http, null, null, express);
