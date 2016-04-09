export default class BaseModel
{
    protected req: any;

    constructor(request)
    {
        this.req = request;
    }

    query(query, queryParams, cb)
    {
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
