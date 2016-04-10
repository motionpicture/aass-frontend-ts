export default class BaseModel
{
    constructor(protected req: any) {
    }

    protected query(query: string, queryParams: Object, cb: Function): void {
        this.req.db.getConnection(function (err, connection) {
            if (err) {
                cb(err, null, null);
                return;
            }

            connection.query(query, queryParams, function (err, rows, fields) {
                connection.release();
                cb(err, rows, fields);
            });
        });
    }
}
