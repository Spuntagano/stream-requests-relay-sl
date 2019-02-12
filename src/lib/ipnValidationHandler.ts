var transactionHandler = require('./transactionHandler');

module.exports = async (err, ipnContent) => {
    if (err) {
        transactionHandler(ipnContent);
    } else {
        transactionHandler(ipnContent);
    }
};