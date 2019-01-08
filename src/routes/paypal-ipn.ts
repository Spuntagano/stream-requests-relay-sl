var express = require('express');
var nodeFetch = require('node-fetch');
var { CensorSensor } = require('censor-sensor');
// @ts-ignore
var DatabaseError = require('../errors/DatabaseError');
var ApiError = require('../errors/ApiError');
var RequestError = require('../errors/RequestError');
var Transaction = require('../models/Transaction');
var Setting = require('../models/Setting');
var notify = require('../lib/notify');

var router = express.Router();

var censor = new CensorSensor();
censor.enableTier(1);

router.post('/', async (req, res, next) => {
    let params = Object.keys(req.body).map((key) => {
        return `${key}=${req.body[key]}`;
    }).join('&');

    let verificationBody = `cmd=_notify-validate&${params}`;

    let settings, response, custom;
    try {
        response = await nodeFetch(process.env.PAYPAL_IPN_URL, {
            method: 'POST',
            body: verificationBody
        });
        if (!response.ok) throw(response);
    } catch(e) {
        return next(new ApiError(e));
    }

    try {
        custom = JSON.parse(req.body.custom);
    } catch (e) {
        return next(new RequestError(e, 'Invalid request: custom field must be valid json'));
    }

    try {
        settings = await Setting.findOne({ where: { userId: custom.userId }});
    } catch (e) {
        return next(new DatabaseError(e));
    }

    const body = (await response.text());

    // Check the response body for validation results.
    if (body === "VERIFIED") {
        console.log(`Verified IPN: IPN message for Transaction ID: ${req.body.txn_id} is verified.`);
        const transaction = {
            title: req.body.item_name,
            message: censor.cleanProfanity(custom.message),
            displayName: custom.displayName,
            transactionId: req.body.txn_id,
            price: req.body.amount,
            userId: custom.userId
        };

        const requestReceived = {
            transaction,
            settings
        };

        Transaction.create(transaction);
        notify(requestReceived, custom.userId);

    } else if (body === "INVALID") {
        console.error(`Invalid IPN: IPN message for Transaction ID: ${req.body.txn_id} is invalid.`);
    } else {
        console.error("Unexpected reponse body.");
    }

    res.status(204).send();
});

module.exports = router;