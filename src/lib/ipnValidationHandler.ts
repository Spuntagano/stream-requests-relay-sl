var transactionHandler = require('./transactionHandler');

module.exports = async (err, ipnContent) => {
    if (err) {
        console.error(err);
    } else {
        transactionHandler(ipnContent);
    }
};