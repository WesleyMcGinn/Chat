// This file holds the code for entering a chat room, leaving a chat room, and more similar functions.

var room = {
    create : function(RoomName, RoomPass) {
        sendData("N", JSON.stringify([RoomName, RoomPass]));
    },
    try : function(RoomName, RoomPass) {
        sendData("V", RoomName + "--u:p--" + RoomPass);
    },
    enter : function() {
        page(3);
        document.getElementById("Messages").innerHTML = chatMessages.join('');
    },
    refresh : function() {
        document.getElementById("Messages").innerHTML = chatMessages.join('');
    },
    exit : function() {
        if (roomNumber != null) {
            sendData("L", roomNumber);
        }
    },
    post : function() {
        sendData("M", JSON.stringify([roomNumber, "<div style='padding: 7px; background-color: " + myColor + "; border-radius: 12px'" + document.getElementById("Write").value + "</div>"]));
        document.getElementById("Write").value = "Type a message here....";
        document.documentElement.style.cursor = "progress";
    },
}
