import log4js = require('log4js');

var env = process.env.NODE_ENV || 'dev';

log4js.configure({
    "appenders": [
        {
            "category": "access",
            "type": "dateFile",
            "filename": __dirname + "/../../../logs/" + env + "/frontend/access.log",
            "pattern": "-yyyy-MM-dd",
            "backups": 3
        },
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
        "access": "ALL",
        "system": "ALL"
    }
});

export default function (req, res, next) {
    if (req.logger) next();

    // システムロガーをリクエストオブジェクトに
    req.logger = log4js.getLogger('system');
    next();

    // アクセスログ出力を返す
    // return log4js.connectLogger(log4js.getLogger('access'), {level: log4js.levels.ALL});
};

// module.exports = {
//     system: log4js.getLogger('system'),
//     error: log4js.getLogger('error'),
//     express: log4js.connectLogger(log4js.getLogger('access'), {level: log4js.levels.ALL})
// };
