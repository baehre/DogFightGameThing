var UUID = require("node-uuid")
var express = require("express");
var app = express();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 8080;
// var game = require("./public/shared/game.js")

server.listen(port, function () {
  console.log("Server listening at port %d", port);
});

// Routing
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function (socket) {
  socket.id = UUID();
  console.log("User connected - id: " + socket.id);
  socket.emit("connected", {"id": socket.id});

  socket.on("disconnect", function() {
    console.log("SOCKET: " + socket.id);
  });
});