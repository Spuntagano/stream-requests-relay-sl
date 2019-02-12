var express = require('express');
var transactionHandler = require('../lib/transactionHandler');

var router = express.Router();

router.post('/', async (req, res) => {
    transactionHandler(req.body);

    res.status(204).send();
});

module.exports = router;
