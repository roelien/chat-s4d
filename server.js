var express = require("express"),
    app = express(),
    port = process.env.PORT ||8080,
    server = require("http").createServer(app),
    io = require("socket.io").listen(app.listen(port));


app.use(express.static(__dirname + '/public'));

io.sockets.on("connection", function (socket) {

    // Sends a message every 1000 milliseconds
    setInterval(function () {
        var d = new Date();
        io.sockets.emit('heartbeat', {hello: 'world!', date: d});
    }, 1000);

    // Sends a message to the chat board
    socket.on("sendMessage", function (data) {
        io.sockets.emit("newMessage", data);
    });

});
