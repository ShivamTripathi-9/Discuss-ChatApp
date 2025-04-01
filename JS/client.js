const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Ask for user's name when they join
const name = prompt("Enter your name");
socket.emit('new-user-joined', name);

// Function to append messages to the chat
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
};

// Handle message submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Listen for new users joining
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
});

// Listen for incoming messages
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});



// left the user
socket.on('user-left', (name) => {
  append(`${name}: left the chat`, 'left');
});
