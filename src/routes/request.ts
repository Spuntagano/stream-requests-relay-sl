var express = require('express');
var Sequelize = require('sequelize');
// @ts-ignore
var Request = require('../models/Request');
var User = require('../models/User');
var auth = require('../lib/auth');
var DatabaseError = require('../errors/DatabaseError');
var AuthorizationError = require('../errors/AuthorizationError');

var router = express.Router();

router.get('/:userId', async (req, res, next) => {
    let requests;

    try {
        // @ts-ignore
        requests = await Request.findAll({ where: { userId: req.params.userId }});
    } catch (e) {
        return next(new DatabaseError(e));
    }

    res.status(200).send({requests});
});

router.post('/', async (req, res, next) => {
    let token, user, requests = req.body.requests;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    try {
        user = await User.findOrCreate({ where: { userId: token.uid }, defaults: {
            userId: token.uid,
            displayName: req.body.displayName
        }});

        if (!user[1]) {
            user[0].update({
                displayName: req.body.displayName
            });
        }

        // @ts-ignore
        await Request.destroy({
            where: {
                index: {
                    [Sequelize.Op.gte]: requests.length
                }
            }
        });

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
                    price: parseFloat(r.price).toFixed(2),
                    index: index,
                    userId: token.uid
                }
            });

            if (!request[1]) {
                request[0].update({
                    title: r.title,
                    description: r.description,
                    active: r.active,
                    price: parseFloat(r.price).toFixed(2),
                })
            }
        });
    } catch(e) {
        return next(new DatabaseError(e));
    }

    res.status(204).send();
});

module.exports = router;
