import BaseApplication from '../../common/models/Application';

export default class Application extends BaseApplication
{
    public create(params: any, cb: Function): void {
        let query = `
INSERT INTO application
 (media_id, remarks, status, created_at, updated_at)
 VALUES (:mediaId, :remarks, :status, NOW(), NOW())
`;
        let queryParams = {
            mediaId: params.media_id,
            remarks: params.remarks,
            status: Application.STATUS_CREATED
        };

        this.query(query, queryParams, cb);
    }

    public updateStatus(params: any, cb: Function): void {
        let query: string = `
UPDATE application SET
 status = :status, updated_at = NOW()
 WHERE id = :id
`;

        let queryParams: Object = {
            'id':  params.id,
            'status':  params.status
        };

        this.query(query, queryParams, cb);
    }

    public deleteById(id: string, cb: Function): void {
        let query = `
UPDATE application SET status = :status, updated_at = NOW() WHERE id = :id
`;

        let queryParams = {
            id: id,
            status: Application.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }
}
