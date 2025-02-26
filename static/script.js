const socket = io.connect('http://localhost:5000');

let currentRoom = '';
let currentName = '';

const newroom = document.getElementById("newroom");
const roomname = document.getElementById("addroomname");
const Username_input = document.getElementById("Username");
const username_space = document.getElementById("Username_space");
const message_input = document.getElementById("message");
const chatBox = document.getElementById("chat");
const roomBox = document.getElementById("room-box");

let room_list_client = [];

// Set Username
function setUsername() {
    currentName = Username_input.value;
    username_space.innerHTML = `Welcome: ${currentName}`;
    console.log(`Username set: ${currentName}`);
}

document.getElementById("setname").addEventListener("click", setUsername);
Username_input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") setUsername();
});

// Create Room
function createRoom() {
    const room = roomname.value.trim();
    if (room && !room_list_client.includes(room)) {
        socket.emit("newroom", room);
        roomname.value = "";
    }
}

newroom.addEventListener("click", createRoom);
roomname.addEventListener("keydown", (e) => {
    if (e.key === "Enter") createRoom();
});

// Join Room
function room_join(room) {
    if (currentRoom) {
        socket.emit("leaveRoom", currentRoom);
    }
    currentRoom = room;
    socket.emit("joinRoom", room);
    console.log(`Joined room: ${room}`);
}

// Update Room List
socket.on("room_list", (room_list) => {
    roomBox.innerHTML = "";
    room_list_client = room_list;
    room_list.forEach((room) => {
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = room;
        button.addEventListener("click", () => room_join(room));
        listItem.appendChild(button);
        roomBox.appendChild(listItem);
    });
});

// Send Message
function sendMessage() {
    const message = message_input.value.trim();
    if (message && currentRoom && currentName) {
        socket.emit("chatMessage", { room: currentRoom, message, username: currentName });
        message_input.value = "";
    }
}

document.getElementById("message").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

document.querySelector("button[onclick='sendMessage()']").addEventListener("click", sendMessage);

// Receive Message
socket.on("message", (msg) => {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = msg;
    chatBox.appendChild(msgDiv);
});

// Request Room List
function refresh() {
    socket.emit("rq_room");
}

document.getElementById("refresh_bt").addEventListener("click", refresh);

refresh();
