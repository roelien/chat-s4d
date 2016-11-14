var express = require("express"),
    app = express(),
    port = process.env.PORT ||8080,
    server = require("http").createServer(app),
    io = require("socket.io").listen(app.listen(port));


app.get("/", function (req, res) {
    res.sendfile(__dirname + "/index.html");
});

io.sockets.on("connection", function (socket) {
    
    socket.emit('news', { hello: 'world'});
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
console.log("Your game is working on *" + port);

