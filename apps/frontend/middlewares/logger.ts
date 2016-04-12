import log4js = require('log4js');

let env = process.env.NODE_ENV || 'dev';

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
    },
    "replaceConsole": true
});

export default log4js.connectLogger(log4js.getLogger('access'), {level: log4js.levels.ALL});
