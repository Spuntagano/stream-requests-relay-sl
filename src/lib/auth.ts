var jwt = require('jsonwebtoken');

module.exports = (authorization) => {
    return new Promise((resolve, reject) => {
        jwt.verify(authorization.split('Bearer ')[1], process.env.SECRET_KEY, {algorithms: 'HS256'}, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};
