var express = require('express');
var Setting = require('../models/Setting');
var User = require('../models/User');
var auth = require('../lib/auth');
var DatabaseError = require('../errors/DatabaseError');
var AuthorizationError = require('../errors/AuthorizationError');

var router = express.Router();

module.exports = router.get('/:userId', async (req, res, next) => {
    let settings;

    try {
        await User.findOrCreate({ where: { userId: req.params.userId }, defaults: {
            userId: req.params.userId
        }});

        settings = await Setting.findOrCreate({ where: { userId: req.params.userId }, defaults: {
            showImage: true,
            playSound: true,
            paypalEmail: ''
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
        let user = await User.findOrCreate({ where: { userId: token.uid }, defaults: {
            userId: token.uid,
            displayName: req.body.displayName
        }});

        if (!user[1]) {
            user[0].update({
                displayName: req.body.displayName
            });
        }

        setting = await Setting.findOrCreate({ where: { userId: token.uid }, defaults: {
            showImage: settings.showImage,
            playSound: settings.playSound,
            paypalEmail: settings.paypalEmail,
            userId: token.uid
        }});

        if (!setting[1]) {
            setting[0].update({
                showImage: settings.showImage,
                playSound: settings.playSound,
                paypalEmail: settings.paypalEmail
            });
        }
    } catch(e) {
        return next(new DatabaseError(e));
    }

    res.status(204).send();
});
