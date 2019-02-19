var express = require('express');
var User = require('../models/User');
var DatabaseError = require('../errors/DatabaseError');

var router = express.Router();

module.exports = router.get('/:displayName', async (req, res, next) => {
    let user;

    try {
        user = await User.findOne({ where: { displayName: req.params.displayName }});
    } catch (e) {
        return next(new DatabaseError(e));
    }

    res.status(200).send({ user });
});
