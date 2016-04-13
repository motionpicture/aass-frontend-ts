import BaseApplication from '../../common/models/Application';

export default class Application extends BaseApplication
{
    public updateStatus(id, status, cb)
    {
        let query = 'UPDATE application SET status = :status, updated_at = NOW() WHERE id = :id';
        let queryParams = {
            id: id,
            status: status
        };

        this.query(query, queryParams, cb);
    }

    public deleteById(id, cb)
    {
        let query = 'UPDATE application SET status = :status, updated_at = NOW() WHERE id = :id';
        let queryParams = {
            id: id,
            status: Application.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }
}