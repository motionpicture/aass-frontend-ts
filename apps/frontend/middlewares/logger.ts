import log4js = require('log4js');

let env = process.env.NODE_ENV || 'dev';

log4js.configure({
    "appenders": [
        {
            "category": "system",
            "type": "dateFile",
            "filename": __dirname + "/../../../logs/" + env + "/frontend/system.log",
            "pattern": "-yyyy-MM-dd",
            "backups": 3
        },
        {
            "type": "console"
        }
    ],
    "levels": {
        "system": "ALL"
    }
});

export default function (req, res, next) {
    if (req.logger) next();

    // システムロガーをリクエストオブジェクトに
    req.logger = log4js.getLogger('system');

    next();
};
