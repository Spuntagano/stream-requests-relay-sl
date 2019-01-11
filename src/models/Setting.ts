var Sequelize = require('sequelize');
var sequelize = require('../lib/sequelize');

module.exports = sequelize.define('setting', {
    showImage: {
        type: Sequelize.BOOLEAN,
    },
    playSound: {
        type: Sequelize.BOOLEAN,
    },
    profanityFilter: {
        type: Sequelize.BOOLEAN,
    },
    paypalEmail: {
        type: Sequelize.STRING
    },
    userId: {
        type: Sequelize.STRING,
        references: {
            model: 'users',
            key: 'userId'
        }
    }
});
