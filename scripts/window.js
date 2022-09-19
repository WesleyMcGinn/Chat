// This file holds simple functions for operating the Chat interface.

// Global Variables:
var chatMessages;
var roomNumber;
var username = '';
var baseLink;

// URL Parameter Object:
var urlParameters = {
    link : location.href,
    get : function(variable_name) {
        if (this.link.search(variable_name + "=") >= 0) {
            this.preparedValue = '';
            for (i = this.link.search(variable_name + "=") + variable_name.length + 1; i < this.link.length; i++) {
                if (this.link[i] == '&' || this.link[i] == '/' || this.link[i] == '?') {
                    i = this.link.length;
                } else {
                    this.preparedValue += this.link[i];
                }
            }
            return this.preparedValue;
        } else {
            return null;
        }
    },
    has : function(variable_name) {
        if (this.link.search(variable_name + "=") >= 0) {
            return true;
        } else {
            return false;
        }
    }
}

// Blank Refresher:
function refreshBlank(element) {
    element.style.color = "#00f";
    element.style.borderColor = "#017";
    element.value = '';
}

// Name Updater:
function updateName(element) {
    username = element.value;
    document.getElementById("Name Input 1").value = username;
    document.getElementById("Name Input 2").value = username;
    if (element.id == "Name Input 1") {
        document.getElementById("Enter Name In Room").style.display = 'none';
    }
}

// Setup (Runs when client enters site):
function setup() {

    // Get Baselink (Link without parameters):
    if (location.href.indexOf('?') < 0) {
        baseLink = location.href;
    } else {
        baseLink = location.href.substring(0,location.href.indexOf('?'));
    }

    // Enter Parameter Data:
    if (urlParameters.has('r')) {
        document.getElementById("Room Input").value = urlParameters.get('r').toUpperCase();
    }
    if (urlParameters.has('p')) {
        document.getElementById("Password Input").value = urlParameters.get('p').toUpperCase();
    }
    if (urlParameters.has('n')) {
        document.getElementById("Name Input 1").value = urlParameters.get('n');
        updateName(document.getElementById("Name Input 1"));
    }

    // Join Room:
    if (urlParameters.has('r')) {

    }

}

// Teardown (Runs when client leaves site)
function teardown() {

}