var express = require('express');
var auth = require('../lib/auth');
var Transaction = require('../models/Transaction');
var DatabaseError = require('../errors/DatabaseError');
var AuthorizationError = require('../errors/AuthorizationError');

var router = express.Router();

router.get('/', async (req, res, next) => {
    let token, transactions;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    try {
        transactions = await Transaction.findAll({
            where: {userId: token.uid}, limit: 20, order: [['createdAt', 'DESC']]
        });
    } catch (e) {
        return next(new DatabaseError(e));
    }

    res.status(200).send({transactions})
});

module.exports = router;
