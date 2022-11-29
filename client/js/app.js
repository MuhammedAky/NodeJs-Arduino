(function() {
    'use strict';

    var socket = io.connect("http://192.168.1.16:8000"),
    $body = $('body'),
    $btn = $('button'),
    $lightStatus = $('span', $btn),
    $txt = $('text'),
    progressbar = $("#progressbar"),
    progressLabel = $(".progress-label"),

    $lightStatus = "off";

    progressbar.progressbar({
        value: false,
        max: 1024,
        change: function () {
            progressLabel.text(progressbar.progressbar("value") + "");
        },
    });

    var toggleLightStatus = function () {
        lightStatus = lightStatus === "off" ? "on" : "off";
        socket.emit("lightStatus", lightStatus);
    },
    onSocketNotification = function (data) {
        if (/on|off/gi.test(data)) {
            $lightStatus.text(data);
        } else {
            $txt.text(data);
            progressbar.progressbar("value", parseInt(data.substring(4)));
        }
    };

    socket.on("notification", onSocketNotification);
    $btn.on("click", toggleLightStatus);

    socket.emit("lightStatus", lightStatus);
}());