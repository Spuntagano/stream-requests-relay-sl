var { CensorSensor } = require('censor-sensor');
var Transaction = require('../models/Transaction');
var Setting = require('../models/Setting');
// @ts-ignore
var Request = require('../models/Request');
var notify = require('./notify');

module.exports = async (ipnContent) => {
    let custom, settings, request, trans;
    let censor = new CensorSensor();
    censor.enableTier(1);

    try {
        custom = JSON.parse(ipnContent.custom);
    } catch (e) {
        console.error('Invalid IPN request: custom field must be valid json');
        console.error(e)
    }

    try {
        settings = await Setting.findOne({ where: { userId: custom.userId }});
    } catch (e) {
        console.error('Invalid IPN request: Database error');
        console.error(e)
    }

    try {
        // @ts-ignore
        request = await Request.findOne({ where: { userId: custom.userId, index: custom.index }});
    } catch (e) {
        console.error('Invalid IPN request: Database error');
        console.error(e)
    }

    try {
        trans = await Transaction.findOne({ where: { transactionId: ipnContent.transactionId }});
    } catch (e) {
        console.error('Invalid IPN request: Database error');
        console.error(e)
    }

    if (trans) {
        return;
    }

    if (ipnContent.notify_version) {
        if (request.price !== ipnContent.amount ||
            request.title !== ipnContent.title ||
            settings.paypalEmail !== ipnContent.receiver_email ||
            ipnContent.mc_currency !== 'USD') {
            console.error('Invalid IPN request: Incorrect information received');
            return;
        }
    }

    let message = custom.message.substring(0, 150);
    let displayName = custom.displayName;
    if (settings.profanityFilter) {
        message = censor.cleanProfanity(message);
        displayName = censor.cleanProfanity(displayName);
    }

    const transaction = {
        title: ipnContent.item_name,
        message: message,
        displayName: displayName,
        transactionId: ipnContent.txn_id,
        price: ipnContent.amount,
        userId: custom.userId
    };

    const requestReceived = {
        transaction,
        settings
    };

    Transaction.create(transaction);
    notify(requestReceived, custom.userId);
};