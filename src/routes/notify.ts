var express = require('express');
var auth = require('../lib/auth');
var notify = require('../lib/notify');
var AuthorizationError = require('../errors/AuthorizationError');

var router = express.Router();

router.post('/', async (req, res, next) => {
    let token;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    notify(req.body.requestReceived, token.uid);

    res.status(204).send();
});

module.exports = router;
