var mysql = require('mysql');
var conf = require('config');

var db = mysql.createPool({
    connectionLimit: 10,
    host: conf.get('db_host'),
    user: conf.get('db_username'),
    password: conf.get('db_password'),
    database: conf.get('db_dbname'),
    queryFormat: function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    }
});

export default function (req, res, next) {
    if (req.db) next();

    req.db = db;

    next();
};
