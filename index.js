const express = require('express');
const initSocket = require('socket.io');


const app = express();

// Config PORT and Run App
const PORT = 3000
const appName = process.env.APP_NAME
const server = app.listen(PORT, () => console.log(`App ${appName} run on ${PORT}`))

// Middleware static public
app.use(express.static('public'));


// Init Socket
const io = initSocket(server)

io.on('connection', connectionHandle);

let connectionCount = new Set()

function connectionHandle (socket) {
    console.log(socket.id);
    connectionCount.add(socket.id)
    
    io.emit('totalClient', connectionCount.size);

    socket.on('chatMessage', data => {
        console.log(data)
        socket.broadcast.emit('chatMessage', data)
    })

    socket.on('disconnect', () => {
        console.log('One user disconnected: ' + socket.id);
        connectionCount.delete(socket.id)
    });

    socket.on('status', data => {
        socket.broadcast.emit('status', data)
    })
}