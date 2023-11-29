const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname,"../public/index.html")));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"../public/index.html"));
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});