const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let connectedUsers = 0;

io.on("connection", (socket) => {
  // console.log(`User ${socket.id} connected`);
  connectedUsers++;

  // Emit updated user count to all clients
  io.emit("userCount", connectedUsers);

  socket.on("play", () => {
    io.emit("play");
  });
  socket.on("pause", () => {
    io.emit("pause");
  });
  socket.on("seek", (data) => {
    io.emit("seek", data);
  });
  socket.on("changeUrl", (data) => {
    console.log("Received changeUrl event", data);
    io.emit("changeUrl", data);
  });
  socket.on("disconnect", () => {
    // console.log(`User $socket.id} disconnected`);
    connectedUsers--;

    // Emit updated user count o all clients
    io.emit("userCount", connectedUsers);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
