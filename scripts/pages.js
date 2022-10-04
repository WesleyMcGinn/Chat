// This file contains the code for changing pages.

function page(page_number) {
    if (page_number == 1 || page_number == "home") {
        document.getElementById("Heading").innerHTML = "Chat";
        document.getElementById("Tab").innerHTML = "Chat";
        document.getElementById("Home").style.display = '';
        document.getElementById("New").style.display = 'none';
        document.getElementById("Chat").style.display = 'none';
    }
    if (page_number == 2 || page_number == "new") {
        document.getElementById("Heading").innerHTML = "Create New Chat Room";
        document.getElementById("Tab").innerHTML = "New Chat Room";
        document.getElementById("Home").style.display = 'none';
        document.getElementById("New").style.display = '';
        document.getElementById("Chat").style.display = 'none';
    }
    if (page_number == 3 || page_number == "chat") {
        document.getElementById("Heading").innerHTML = "Chat Room: <i>" + document.getElementById("Room Input").value + "</i>";
        document.getElementById("Tab").innerHTML = "Chat Room: " + document.getElementById("Room Input").value;
        document.getElementById("Home").style.display = 'none';
        document.getElementById("New").style.display = 'none';
        document.getElementById("Chat").style.display = '';
    }
}

