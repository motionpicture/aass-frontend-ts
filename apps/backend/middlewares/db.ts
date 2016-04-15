let mysql = require('mysql');
let conf = require('config');

let db = mysql.createPool({
    connectionLimit: 10,
    host: conf.get('db_host'),
    user: conf.get('db_username'),
    password: conf.get('db_password'),
    database: conf.get('db_dbname'),
    timezone : 'local', // The timezone used to store local dates.
    queryFormat: function (query, values) { // https://github.com/felixge/node-mysql#custom-format
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    },
    dateStrings: true // Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript Date objects.
});

export default function (req, res, next) {
    if (req.db) next();

    req.db = db;

    next();
};
