const fs = require('fs');
const http = require('http');
const ws = require('ws');
const ws_server = new ws.Server({noServer: true});
var clients = new Set();
var people = 0;

var chatData;
fs.readFile("C:/Users/admin/Desktop/GitHub Stuff/Chat/chatData.dat", function (err, data) {
    if (err) {
        console.log("Error:  The file for chat room storage was not found.")
    } else {
        chatData = data;
    }
});

http.createServer((req, res) => {
    ws_server.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
}).listen(8081);

http.createServer((req, res) => {
    if (req.url == '' || req.url == '/' || req.url == '/chat') {
        directory = "C:/Users/admin/Desktop/Github Stuff/Chat/index.html";
    } else {
        directory = "C:/Users/admin/Desktop/Github Stuff/Chat" + req.url;
    }
    fs.readFile(directory, function (err, data) {
        if (err) {
            console.log("404 Error for: " + req.url);
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write("<h1>404</h1><h2>The file you have requested does not exist.</h2><h1>:(</h1>");
            return res.end();
        } else {
            res.writeHead(200);
            res.write(data);
            res.end();
        }
    });
}).listen(80);

function onSocketConnect(ws) {
    clients.add(ws);
    people++;
    console.log(people);
    ws.on('message', function (message) {
        chatData = "" + message;
        for (let client of clients) {
            client.send(chatData);
        }
        fs.writeFile('C:/Users/admin/Desktop/GitHub Stuff/Chat/chatData.dat', chatData, function(err, file) {
            if (err) throw err;
            console.log("New data saved to file.");
        });
    });
    ws.on('close', function() {
        clients.delete(ws);
        people--;
        console.log(people);
    });
}