const chatDataDirectory = "C:/Users/admin/Desktop/Server/chatData0.dat";
const backupDataDirectory = "C:/Users/admin/Desktop/Server/backup";
const reportLevel = 4;

const fs = require('fs');
const http = require('http');
const ws = require('ws');
const ws_server = new ws.Server({noServer: true});
var clients = new Set();
var people = 0;
var chatData;
const defaultChatData = [['TESTROOM', 'PASSWORD', [], ["<div style='padding: 7px; background-color: #072dc780; border-radius: 12px'>Welcome to the testroom!  This is where programming for Chat is tested.</div>"]]];
const redirectPages = ['', '/', '/index.html', '/chat', 'chat.html'];
const restrictedData = ['.', ',', '{', '}', '?', '/', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']'];

// Retrieve chat data from file:
fs.readFile(chatDataDirectory, function (err, data) {
    if (err) {
        console.log("Error:  The file for chat room storage was not found.");
        console.log("        It will be created when the websocket recieves input.");
        chatData = defaultChatData;
    } else {
        chatData = eval(data);
    }
});

var adminPassword;fs.readFile("C:/Users/admin/adminData/pw.dat",function(err,data){if(err){console.log("Error in locating admin key");}else{adminPassword=data;}});

// HTML Server:
http.createServer((req, res) => {
    var requestedFile = req.url;
    if (redirectPages.includes(requestedFile.toLowerCase())) {
        requestedFile = '/page.html';
    }
    if (requestedFile.includes('server') || requestedFile.includes('no_send-')) {
        requestedFile = '/page.html';
    }
    fs.readFile("C:/Users/admin/Desktop/Github Stuff/Chat/" + requestedFile, function (err, data) {
        if (err) {
            fs.readFile("C:/Users/admin/Desktop/Github Stuff/Chat/page.html", function (err2, data2) {
                if (err2) {
                    console.log("ERROR 404: page.html not found!");
                    res.writeHead(404);
                    res.write("<h1>404</h1><h2>Page not found.</h2><h1>):</h1>");
                } else {
                    res.writeHead(200);
                    res.write(data2);
                }
            });
            res.end();
        } else {
            res.writeHead(200);
            res.write(data);
            res.end();
        }
    });
}).listen(80);

// Websocket Server:
http.createServer((req, res) => {
    ws_server.handleUpgrade(req, req.socket, Buffer.alloc(0), websocketHandler);
}).listen(81);

// Websocket Programming:
function websocketHandler(ws) {

    clients.add(ws);
    people++;
    console.log("Current Users + : " + people.toString());

    ws.on('message', function (message) {

        var incomingData = "" + message;
        var dataType = incomingData.substring(0, 1);
        var dataData = incomingData.substring(1, incomingData.length);

        if (reportLevel >= 4 && restrictedData.includes(dataType)) {
            console.log('"' + dataType + '" <- "' + dataData.toString() + '"  -  ' + (new Date()).toString().slice(0,24));
        } else {
            if (reportLevel >= 3) {
                console.log('"' + dataType + '" <- ' + (dataData.length).toString() + ' bytes  -  ' + (new Date()).toString().slice(0,24));
            } else {
                if (reportLevel >= 2) {
                    console.log('"' + dataType + '" <- ' + (dataData.length).toString() + ' bytes');
                } else {
                    if (reportLevel >= 1) {
                        console.log(dataType);
                    }
                }
            }
        }

        if (dataType == "G") { // Get Message List
            ws.send("G" + JSON.stringify(chatData[parseInt(dataData)]));
        }

        if (dataType == "V") { // Validate Room Name and Password
            var validated = "N";
            for (i = 0; i < chatData.length; i++) {
                if (chatData[i][0] + "--u:p--" + chatData[i][1] == dataData) {
                    validated = i;
                    break;
                }
            }
            ws.send("V" + validated);
        }

        if (dataType == "S") { // Test Network Speed
            ws.send("S" + (new Date()).getTime().toString());
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
                console.log("  Time: " + (new Date()).toString());
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
                console.log("  Time: " + (new Date()).toString());
                console.log("  Incorrect Password Used: " + datadata);
                console.log("  Attempted to: Clear all data");
                console.log("  Danger Level: 2 (Considerably Dangerous)");
            } else {
                var roomsToBeErased = chatData.length - 1;
                saveData(true);
                chatData = defaultChatData;
                saveData();
                console.log("ALL CHAT DATA CLEARED:");
                console.log("  Time: " + (new Date()).toString());
                console.log("  Rooms Deleted: " + roomsToBeErased);
                console.log("  Backup Saved: true");
            }
        }

        if (dataType == "}") { // Change admin password
            dataData = eval(dataData);
            if (dataData[0] != adminPassword) {
                ws.send("}!!");
                console.log("HACKER DETECTED!");
                console.log("  Time: " + (new Date()).toString())
                console.log("  Incorrect Password Used: " + datadata[0]);
                console.log("  Attempted to: Reset Admin Password to: " + dataData[1]);
                console.log("  Danger Level: 3 (High Risk)");
            } else {
                adminPassword = dataData[1]; dataData = null;
                fs.writeFile("C:/Users/admin/adminData/pw.dat",adminPassword,function(err,file){if(err){throw err;}});
                console.log("ADMIN PASSWORD RESET:");
                console.log("  Time: " + (new Date()).toString());
            }
        }

        if (dataType == "!") { // Broadcast Important Message
            dataData = eval(dataData);
            if (dataData[0] != adminPassword) {
                ws.send("!!!");
                console.log("HACKER DETECTED!");
                console.log("  Time: " + (new Date()).toString())
                console.log("  Incorrect Password Used: " + datadata[0]);
                console.log("  Attempted to: Broadcast this message to all Chat users: " + dataData[1]);
                console.log("  Danger Level: 2 (Considerably Dangerous)");
            } else {
                for(let client of clients) { client.send(dataData[1]); }
            }
        }

    });

    ws.on('close', function() {
        clients.delete(ws);
        people--;
        console.log("Current Users - : " + people);
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
        fs.writeFile(backupDataDirectory + generateColor() + ".dat", JSON.stringify(chatData2), function(err, file) {
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