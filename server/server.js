var app = require("http").createServer(handler),
io = require("socket.io").listen(app),
fs = require("fs"),
url = require("url"),
SerialPort = require("serialport").SerialPort,

sp = new SerialPort("COM36", {
    baudRate: 115200
}),
arduinoMessage = "",
readFile = function (pathname, res) {
    if (pathname === "/")
        pathname = 'client.html';

    fs.readFile("../client/" + pathname, function(err, data) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end("Error loading client.html");
        }

        res.writeHead(200);
        res.end(data);
    });
},

sendMessage = function(buffer, socket) {
    arduinoMessage += buffer.toString();

    if (arduinoMessage.indexOf("\r") >= 0) {
        socket.volatile.emit("notification", arduinoMessage);

        arduinoMessage = "";
    }
};

io.sockets.on("connection", function (socket) {
    console.log("socket connected");

    sp.on("data", function(data) {
        sendMessage(data, socket);
    });

    socket.on("lightStatus", function(lightStatus) {
        sp.write(lightStatus + '\r', function() {
            console.log("the light should be: " + lightStatus);
        });
    });
});

sp.on("close", function(err) {
    console.log("Port closed!");
});

sp.on("error", function(err) {
    console.error("error", err);
})

sp.on("open", function() {
    console.log("Port opened!");
});

app.listen(8000);

function handler(req,res) {
    readFile(url.parse(req.url).pathname, res);
}