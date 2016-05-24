import BaseApplication from '../../common/models/Application';

export default class Application extends BaseApplication
{
    public create(params: any, cb: Function): void {
        let query = `
INSERT INTO application
 (event_id, media_id, remarks, status, created_at, updated_at)
 VALUES (:eventId, :mediaId, :remarks, :status, NOW(), NOW())
`;
        let queryParams = {
            eventId: params.event_id,
            mediaId: params.media_id,
            remarks: params.remarks,
            status: Application.STATUS_CREATED
        };

        this.query(query, queryParams, cb);
    }

    public recreate(id: string, mediaId: string, remarks: string, cb: Function): void {
        let query = `
UPDATE application 
SET 
status = :status, remarks = :remarks, updated_at = NOW(), reject_reason = ''
, media_id = :mediaId
WHERE id = :id
`;

        let queryParams = {
            id: id,
            remarks: remarks,
            status: Application.STATUS_CREATED,
            mediaId: mediaId
        };

        this.query(query, queryParams, cb);
    }
}
