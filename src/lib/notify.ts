var express = require('express');
var connections = require('../lib/connections');

module.exports = (requestReceived, userId) => {
    connections.getActiveByChannel(userId).forEach((ws)=> {
        ws.send(JSON.stringify({
            requestReceived,
        }));
    });
};
