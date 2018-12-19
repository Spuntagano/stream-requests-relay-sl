var express = require('express');
var sequelize = require('../lib/sequelize');
var Setting = require('../models/Setting');
var User = require('../models/User');
var auth = require('../lib/auth');
var DatabaseError = require('../errors/DatabaseError');
var AuthorizationError = require('../errors/AuthorizationError');

var router = express.Router();

module.exports = router.get('/', async (req, res, next) => {
    let token, settings;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    try {
        await User.findOrCreate({ where: { userId: token.uid }, defaults: {
            userId: token.uid
        }});

        settings = await Setting.findOrCreate({ where: { userId: token.uid }, defaults: {
            showImage: true,
            playSound: true,
            sendChat: true
        }});
    } catch (e) {
        return next(new DatabaseError(e));
    }

    res.status(200).send({ settings: settings[0] });
});

router.post('/', async (req, res, next) => {
    let token, setting, settings = req.body.settings;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    try {
        await User.findOrCreate({ where: { userId: token.uid }, defaults: {
            userId: token.uid
        }});

        setting = await Setting.findOrCreate({ where: { userId: token.uid }, defaults: {
            showImage: settings.showImage,
            playSound: settings.playSound,
            sendChat: settings.sendChat,
            userId: token.uid
        }});

        if (!setting[1]) {
            setting[0].update({
                showImage: settings.showImage,
                playSound: settings.playSound,
                sendChat: settings.sendChat
            });
        }
    } catch(e) {
        return next(new DatabaseError(e));
    }

    res.status(204).send();
});
