var express = require('express');
var connections = require('../lib/connections');
var auth = require('../lib/auth');
var AuthorizationError = require('../errors/AuthorizationError');

var router = express.Router();

module.exports = (requestReceived, userId) => {
    connections.getActiveByChannel(userId).forEach((ws)=> {
        ws.send(JSON.stringify({
            requestReceived,
        }));
    });
};
