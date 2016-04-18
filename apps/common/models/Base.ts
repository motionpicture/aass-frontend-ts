import db from '../modules/DB';

export default class Base {
    constructor() {
    }

    protected query(query: string, queryParams: Object, cb: Function): void {
        db.getConnection((err, connection) => {
            if (err) {
                return cb(err, null, null);
            }

            connection.query(query, queryParams, (err, rows, fields) => {
                connection.release();
                cb(err, rows, fields);
            });
        });
    }
}