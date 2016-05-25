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
import AzureBlobService from '../common/modules/azureBlobService';
import AzureFileService from '../common/modules/azureFileService';
import AzureMediaService from '../common/modules/azureMediaService';
import log4js = require('log4js');

let app = express();

app.use(logger);
app.use(benchmarks); // ベンチマーク的な
app.use(session);

app.use(function (req: any, res: any, next: any) {
    req.blobService = AzureBlobService;
    req.fileService = AzureFileService;
    req.mediaService = AzureMediaService;

    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../../public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// for parsing multipart/form-data
let storage = multer.memoryStorage()
app.use(multer({ storage: storage }).any());

app.use(cookieParser());

// static files
app.use(express.static(path.join(__dirname, '/../../public')));

// ユーザー認証
app.use(user);

// moment
app.use((req, res, next) => {
    res.locals.moment = require('moment');
    next();
});

// ルーティング
require('./routes/router').default(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers
app.use(function(err: any, req, res, next) {
    log4js.getLogger('system').error(req._parsedUrl, err);
    res.status(err['status'] || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

export = app;