// This file holds the code for sending and recieving messages to and from the server via websocket.

const serverIP = "192.168.1.100";
var toSend = "";
var waitingToSend = null;
var networkDelay = '?';

let socket = new WebSocket("ws://" + serverIP + ":81");

function sendData(sendDataType, sendData) {
    if (socket.readyState == 1) {
        socket.send(sendDataType.slice(0,1) + sendData.toString());
    } else {
        if (waitingToSend == null) {
            waitingToSend = window.setInterval("sendWaitingData()", 100);
        }
        toSend += ("socket.send(" + sendDataType.slice(0,1) + sendData + ");");
    }
}

function sendWaitingData() {
    if (socket.readyState == 1) {
        window.clearInterval(waitingToSend);
        waitingToSend = null;
        eval(toSend);
        toSend = "";
    }
}

socket.onmessage = function(event) {
    var incomingData = "" + event.data;
    var dataType = incomingData.substring(0, 1);
    var dataData = incomingData.substring(1, incomingData.length);

    if (dataType == "G") {
        chatMessages = eval(dataData);
        room.enter();
    }

    if (dataType == "V") {
        if (dataData == "N") {
            document.getElementById("Password Input").style.color = "red";
            document.getElementById("Password Input").style.borderColor = "red";
        } else {
            roomNumber = parseInt(dataData);
            sendData('G', roomNumber);
        }
    }

    if (dataType == "S") {
        networkDelay = ((new Date()).getTime().toString()) - parseInt(dataData);
        console.log("Network Delay: " + networkDelay.toString() + " ms");
    }

    if (dataType == "N") {
        if (dataData == "N") {
            document.getElementById("New Room Name Input").style.color = "red";
            document.getElementById("New Room Name Input").style.borderColor = "red";
            document.getElementById("New Room Name Input").value = "Name Already Taken :(";
        } else {
            roomNumber = parseInt(dataData);
            sendData('G', roomNumber);
        }
    }


    if (dataType == "M") {
        if (document.documentElement.style.cursor == "progress") {
            document.documentElement.style.cursor = "pointer";
        }
        chatMessages.unshift(dataData);
        room.enter();


    }
}

socket.onerror = function(err) {
    document.body.style.color = "white";
    document.body.style.backgroundImage = "linear-gradient(#e10, #e10)";
    document.body.style.backgroundColor = "red";
    document.body.style.textAlign = "center";
    document.body.innerHTML = "<h1>Error</h1><h2>An error occured in the server.<br><br><b>Error Info:</b><br>" + (err.message).toString() + "</h2>";
}

socket.onclose = location.reload();