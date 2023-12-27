require('dotenv').config();
require("./models/model");
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 5050;
const mongodb = require("./db");


app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("<h1>Hello World</h1>");
})

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/user"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // socket.on("join_room", (data) => {
  //   socket.join(data);
  // });

  socket.on("send-location", (data) => {
    console.log("backend send.....");
    console.log(data);
    socket.broadcast.emit("receive-location", data);
  });
});

// app.get("*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "./frontend/build/index.html"),
//     function (err) {
//       res.status(500).send(err)
//     }
//   )
// })

// app.listen(PORT, () => {
//   console.log("Server is listening at port no", PORT);
// });

mongodb().then(() => {
  server.listen(PORT, () => {
    console.log("Server is listening at port no", PORT);
  });
});