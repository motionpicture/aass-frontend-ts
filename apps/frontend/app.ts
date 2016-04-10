import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import multer = require('multer');
import logger from './middlewares/logger';
import benchmarks from './middlewares/benchmarks';
import session from './middlewares/session';
import user from './middlewares/user';
import db from './middlewares/db';
import blobService from './middlewares/blobService';
import mediaService from './middlewares/mediaService';
import routes = require('./routes/index');

var app = express();

app.use(logger);
app.use(benchmarks); // ベンチマーク的な
app.use(session);
app.use(user);
app.use(db);
app.use(blobService);
app.use(mediaService);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../../public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// for parsing multipart/form-data
var storage = multer.memoryStorage()
app.use(multer({ storage: storage }).any());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../../public')));

// ルーティング
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers
app.use(function(err: any, req, res, next) {
    res.status(err['status'] || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

export = app;
