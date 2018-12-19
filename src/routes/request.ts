var express = require('express');
var sequelize = require('../lib/sequelize');
// @ts-ignore
var Request = require('../models/Request');
var User = require('../models/User');
var auth = require('../lib/auth');
var DatabaseError = require('../errors/DatabaseError');
var AuthorizationError = require('../errors/AuthorizationError');

var router = express.Router();

router.get('/:displayName', async (req, res, next) => {
    let requests;

    try {
        // @ts-ignore
        requests = await Request.findAll({ where: { userId: req.params.displayName }});
    } catch (e) {
        return next(new DatabaseError(e));
    }

    res.status(200).send({requests});
});

router.post('/', async (req, res, next) => {
    let token, requests = req.body.requests;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    try {
        await User.findOrCreate({ where: { userId: token.uid }});

        requests.forEach(async (r, index) => {
            // @ts-ignore
            let request = await Request.findOrCreate({
                where: {
                    index: index,
                    userId: token.uid
                },
                defaults: {
                    title: r.title,
                    description: r.description,
                    active: r.active,
                    price: r.price,
                    index: index,
                    userId: token.uid
                }
            });

            if (!request[1]) {
                request[0].update({
                    title: r.title,
                    description: r.description,
                    active: r.active,
                    price: r.price
                })
            }
        });
    } catch(e) {
        return next(new DatabaseError(e));
    }

    res.status(204).send();
});

module.exports = router;
