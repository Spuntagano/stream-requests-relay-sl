var transactionHandler = require('./transactionHandler');

module.exports = async (err, ipnContent) => {
    if (err) {
        console.error('Invalid IPN request: Received invalid IPN');
        console.error(err);
    } else {
        transactionHandler(ipnContent);
    }
};