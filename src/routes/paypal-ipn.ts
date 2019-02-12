var express = require('express');
var ipn = require('paypal-ipn');
var transactionHandler = require('../lib/transactionHandler');
var ipnValidationHandler = require('../lib/ipnValidationHandler');

var router = express.Router();

router.post('/', async (req, res) => {
    if (process.env.PAYPAL_MODE === 'production') {
        ipn.validate(req.body, { allow_sandbox: false }, ipnValidationHandler)
    } else if (process.env.PAYPAL_MODE === 'staging') {
        ipn.validate(req.body, { allow_sandbox: true }, ipnValidationHandler)
    } else if (process.env.PAYPAL_MODE === 'developement') {
        transactionHandler(req.body);
    }

    res.status(204).send();
});

module.exports = router;
