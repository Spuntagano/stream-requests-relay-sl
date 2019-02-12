var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var allowCors = require('./middlewares/allow-cors');
var errorHandler = require('./middlewares/error-handler');
var indexRouter = require('./routes/index');
var requestRouter = require('./routes/request');
var configRouter = require('./routes/setting');
var notifyRouter = require('./routes/notify');
var transactionRouter = require('./routes/transaction');
var userRouter = require('./routes/user');
var paypalIpn = require('./routes/paypal-ipn');
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
app.use('/paypal-ipn', paypalIpn);

app.use(errorHandler);

module.exports = app;
