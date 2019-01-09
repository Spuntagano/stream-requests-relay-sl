var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ipn = require('express-ipn');
var bodyParser = require('body-parser');

var allowCors = require('./middlewares/allow-cors');
var errorHandler = require('./middlewares/error-handler');
var indexRouter = require('./routes/index');
var requestRouter = require('./routes/request');
var configRouter = require('./routes/setting');
var notifyRouter = require('./routes/notify');
var transactionRouter = require('./routes/transaction');
var userRouter = require('./routes/user');
var paypalIpnMock = require('./routes/paypal-ipn-mock');
var ipnValidationHandler = require('./lib/ipnValidationHandler');
require('./models/relationships');

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCors);

app.use('/', indexRouter);
app.use('/request', requestRouter);
app.use('/setting', configRouter);
app.use('/notify', notifyRouter);
app.use('/transaction', transactionRouter);
app.use('/user', userRouter);

if (process.env.PAYPAL_MODE === 'production') {
    app.use('/paypal-ipn', ipn.validator(ipnValidationHandler, true));
} else if (process.env.PAYPAL_MODE === 'staging') {
    app.use('/paypal-ipn', ipn.validator(ipnValidationHandler));
} else if (process.env.PAYPAL_MODE === 'developement') {
    app.use('/paypal-ipn', paypalIpnMock);
}

app.use(errorHandler);

module.exports = app;
