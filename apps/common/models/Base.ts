export default class Base {
    constructor(protected req: any) {
    }

    protected query(query: string, queryParams: Object, cb: Function): void {
        this.req.db.getConnection((err, connection) => {
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