const directory = "/home/pi/Chat";
const chatDataDirectory = "/home/pi/Chat/chatData0.dat";
const backupDataDirectory = "/home/pi/Chat/backup";

const fs = require('fs');
const http = require('http');
const ws = require('ws');
const ws_server = new ws.Server({noServer: true});
const defaultChatData = [['TESTROOM', 'PASSWORD', [], ["<div style='padding: 7px; background-color: #072dc780; border-radius: 12px'>Welcome to the testroom!  This is where programming for Chat is tested.</div>"]]];
const redirectPages = ['', '/', '/index.html', '/chat', 'chat.html'];
var clients = new Set();
var chatData;

// Retrieve chat data from file:
fs.readFile(chatDataDirectory, function (err, data) {
    if (err) {
        console.log("Error:  The file for chat room storage was not found.");
        console.log("        It will be created when the websocket recieves input.");
        chatData = defaultChatData;
    } else {
        chatData = eval(data.toString());
        console.log("Retrieved Chat Data: " + chatData);
    }
});

var adminPassword;fs.readFile("/home/pi/pw.dat",function(err,data){if(err){console.log("Error in locating admin key");}else{adminPassword=data;}});

// HTML Server:
http.createServer((req, res) => {
    var requestedFile = req.url;
    if (requestedFile.includes('server')) {
        res.writeHead(423, {'Content-Type': 'text/html'});
        res.end("<h1>ERROR 423</h1><p style='color:red'>If you are trying to hack the Chat server, <b>GIVE UP</b>, you can't.  All data is held ultimately secure for your privacy and the privacy of others.</p>");
    } else if (requestedFile == "/connect") {
        ws_server.handleUpgrade(req, req.socket, Buffer.alloc(0), websocketHandler);
    } else {
        if (redirectPages.includes(requestedFile.toLowerCase())) {
            requestedFile = "/page.html";
        }
        fs.readFile(directory + requestedFile, function (err, data) {
            if (err) {
                fs.readFile(directory + "/page.html", function (err2, data2) {
                    if (err2) {
                        console.log("ERROR 500: page.html not found!");
                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end("<h1>Error 500</h1><h2>The home page could not be found on the server.</h2><h1>:(</h1>");
                    } else {
                        res.writeHead(200);
                        res.end(data2);
                    }
                });
            } else {
                res.writeHead(200);
                res.write(data);
                res.end();
            }
        });
    }
}).listen(8000);


// Websocket Programming:
function websocketHandler(ws) {

    clients.add(ws);
    console.log("Current Users + : " + clients.size.toString());

    ws.on('message', function (message) {

        var incomingData = "" + message;
        var dataType = incomingData.substring(0, 1);
        var dataData = incomingData.substring(1, incomingData.length);

        if (dataType == "G") { // Get Message List
            ws.send("G" + JSON.stringify(chatData[parseInt(dataData)]));
        }

        if (dataType == "V") { // Validate Room Name and Password
            var validated = "N";
            for (i = 0; i < chatData.length; i++) {
                if ((chatData[i][0] + "--u:p--" + chatData[i][1]).toLowerCase() == dataData.toLowerCase()) {
                    validated = i;
                    break;
                }
            }
            ws.send("V" + validated);
        }

        if (dataType == "S") { // Test Network Speed
            ws.send("S" + Date.now().toString());
        }

        if (dataType == "N") { // New Chat Room
            dataData = eval(dataData);
            ws.send("N" + (chatData.push([dataData[0], dataData[1], [], []])).toString());
            saveData();
        }

        if (dataType == "L") { // Leave Chat Room
            chatData.splice(chatData[parseInt(dataData)][2].indexOf(ws), 1)[0].send("L");
        }

        if (dataType == "C") { // Clear Chat Room
            chatData[parseInt(dataData)][3] = [];
            sendToRoom(parseInt(dataData), "Cleared");
            saveData();
        }

        if (dataType == "M") { // Send Message
            dataData = eval(dataData);
            chatData[parseInt(dataData[0])][3].unshift(dataData[1]);
            sendToRoom(parseInt(dataData)[0], "M" + dataData[1]);
            saveData();
        }

        if (dataType == "O") { // Change Color
            dataData = eval(dataData);
            var myColor = generateColor();
            for (i = 0; i < chatData[dataData[0]][3].length; i++) {
                if (chatData[dataData[0]][3][i].includes(dataData[1])) {
                    chatData[dataData[0]][3][i] = chatData[dataData[0]][3][i].replace(dataData[1], myColor);
                }
            }
            sendToRoom(parseInt(dataData[0]), "O" + JSON.stringify(chatData[parseInt(dataData[0])]));
            saveData();
        }

        if (dataType == ".") { // Get all data
            if (dataData != adminPassword) {
                ws.send(".!!");
                console.log("HACKER DETECTED!");
                console.log("  Time: " + Date.call().slice(0,24));
                console.log("  Incorrect Password Used: " + datadata);
                console.log("  Attempted to: Obtain all data");
                console.log("  Danger Level: 1 (Low)");
            } else {
                ws.send("." + JSON.stringify(chatData));
            }
        }

        if (dataType == ",") { // Clear all data
            if (dataData != adminPassword) {
                ws.send(",!!");
                console.log("HACKER DETECTED!");
                console.log("  Time: " + Date.call().slice(0,24));
                console.log("  Incorrect Password Used: " + datadata);
                console.log("  Attempted to: Clear all data");
                console.log("  Danger Level: 2 (Considerably Dangerous)");
            } else {
                var roomsToBeErased = chatData.length - 1;
                saveData(true);
                chatData = defaultChatData;
                saveData();
                console.log("ALL CHAT DATA CLEARED:");
                console.log("  Time: " + Date.call().slice(0,24));
                console.log("  Rooms Deleted: " + roomsToBeErased);
                console.log("  Backup Saved: true");
            }
        }

        if (dataType == "}") { // Change admin password
            dataData = eval(dataData);
            if (dataData[0] != adminPassword) {
                ws.send("}!!");
                console.log("HACKER DETECTED!");
                console.log("  Time: " + Date.call().slice(0,24))
                console.log("  Incorrect Password Used: " + datadata[0]);
                console.log("  Attempted to: Reset Admin Password to: " + dataData[1]);
                console.log("  Danger Level: 3 (High Risk)");
            } else {
                adminPassword = dataData[1]; dataData = null;
                fs.writeFile("/home/pi/pw.dat",adminPassword,function(err,file){if(err){throw err;}});
                console.log("ADMIN PASSWORD RESET:");
                console.log("  Time: " + Date.call().slice(0,24));
            }
        }

        if (dataType == "!") { // Broadcast Important Message
            dataData = eval(dataData);
            if (dataData[0] != adminPassword) {
                ws.send("!!!");
                console.log("HACKER DETECTED!");
                console.log("  Time: " + Date.call().slice(0,24))
                console.log("  Incorrect Password Used: " + datadata[0]);
                console.log("  Attempted to: Broadcast this message to all Chat users: " + dataData[1]);
                console.log("  Danger Level: 2 (Considerably Dangerous)");
            } else {
                for(let client of clients) { client.send("!" + dataData[1]); }
            }
        }

    });

    ws.on('close', function() {
        clients.delete(ws);
        console.log("Current Users - : " + clients.size.toString());
    });

}

function saveData(backup = false) {
    var chatData2 = chatData;
    for (i = 0; i < chatData2.length; i++) {
        chatData2[i][2] = [];
    }
    fs.writeFile(chatDataDirectory, JSON.stringify(chatData2), function(err, file) {
        if (err) { throw err; }
    });
    if (backup == true) {
        fs.writeFile(backupDataDirectory + Date.now().toString(16) + ".dat", JSON.stringify(chatData2), function(err, file) {
            if (err) { throw err; }
        });
    }
}

function sendToRoom(room_number, message_to_room) {
    for (i = 0; i < chatData[room_number][2].length; i++) {
        chatData[room_number][2][i].send(message_to_room);
    }
}

function generateColor() {
    var output = '';
    for (i = 0; i < 6; i++) {
        output += (Math.floor(Math.random()*16).toString(16));
    }
    return "#" + output + "80";
}