var { CensorSensor } = require('censor-sensor');
var DatabaseError = require('../errors/DatabaseError');
var RequestError = require('../errors/RequestError');
var Transaction = require('../models/Transaction');
var Setting = require('../models/Setting');
var notify = require('./notify');

module.exports = async (err, ipnContent) => {
    console.log(err);
    console.log(ipnContent);

    if (err) {
        console.log('Received invalid IPN');
    } else {
        let custom, settings;
        let censor = new CensorSensor();
        censor.enableTier(1);

        try {
            custom = JSON.parse(ipnContent.custom);
        } catch (e) {
            return new RequestError(e, 'Invalid request: custom field must be valid json');
        }

        try {
            settings = await Setting.findOne({ where: { userId: custom.userId }});
        } catch (e) {
            return new DatabaseError(e);
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
    }
};