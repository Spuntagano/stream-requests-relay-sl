var { CensorSensor } = require('censor-sensor');
var Transaction = require('../models/Transaction');
var Setting = require('../models/Setting');
var notify = require('./notify');

module.exports = async (ipnContent) => {
    console.log(ipnContent);

    if (process.env.PAYPAL_MODE !== 'developement') {
        return;
    }

    let custom, settings;
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

    const transaction = {
        title: ipnContent.item_name,
        message: censor.cleanProfanity(custom.message),
        displayName: custom.displayName,
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