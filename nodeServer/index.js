const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Create an Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",  // Allow all origins (for development)
        methods: ["GET", "POST"]
    }
});

// Store active users
const users = {};

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('new-user-joined', (name) => {
        // console.log("New user joined:", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        if (users[socket.id]) {
            socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('user-left', users[socket.id]);
            // console.log(`${users[socket.id]} disconnected`);
            delete users[socket.id]; // Remove user from list
        }
    });
});

// Start server on port 8000
server.listen(8000, () => {
    //  console.log('Socket.io server is running on port 8000');
});
