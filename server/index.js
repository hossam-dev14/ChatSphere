const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket)=>{
    console.log(`User Connected : ${socket.id}`);

    socket.on('sendMessage',(data)=>{
        console.log(data); 
        
        io.emit('receiveMessage',data);
    })

    socket.on('disconnect',()=>{
        console.log(`User Disconnected`);
    })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});