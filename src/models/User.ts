var Sequelize = require('sequelize');
var sequelize = require('../lib/sequelize');

module.exports = sequelize.define('user', {
    userId: {
        type: Sequelize.STRING,
    },
    displayName: {
        type: Sequelize.STRING
    }
}, {
    indexes: [{
        unique: true,
        fields: ['userId']
    }, {
        unique: true,
        fields: ['displayName']
    }]
});
