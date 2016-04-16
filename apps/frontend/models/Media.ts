import BaseMedia from '../../common/models/Media';
import Constants from '../../common/modules/Constants';

export default class Media extends BaseMedia
{
    public getListByEventId(eventId: string, cb: Function): void {
        let query = `
SELECT * FROM media WHERE event_id = :eventId AND status <> :status
`;

        let queryParams = {
            eventId: eventId,
            status: Constants.MEDIA_STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }

    public create(params: any, cb: Function): void {
        let query = `
INSERT INTO media
 (event_id, title, description, uploaded_by, status, filename, size, extension, playtime_string, playtime_seconds, asset_id, created_at, updated_at)
 VALUES (:eventId, :title, :description, :uploadedBy, :status, :filename, :size, :extension, :playtimeString, :playtimeSeconds, :assetId, NOW(), NOW())
`;
        let queryParams = {
            eventId: params.event_id,
            title: params.title,
            description: params.description,
            uploadedBy: params.uploaded_by,
            status: Constants.MEDIA_STATUS_ASSET_CREATED,
            filename: params.filename,
            size: params.size,
            extension: params.extension,
            playtimeString: null,
            playtimeSeconds: null,
            assetId: params.asset_id
        };

        this.query(query, queryParams, cb);
    }

    public update(params: any, cb: Function): void {
        let query: string = `
UPDATE media SET
 title = :title, description = :description, uploaded_by = :uploadedBy, updated_at = NOW()
 WHERE id = :id
`;

        let queryParams: Object = {
            'id':  params.id,
            'title':  params.title,
            'description':  params.description,
            'uploadedBy':  params.uploaded_by
        };

        this.query(query, queryParams, cb);
    }

    public deleteById(id: string, cb: Function): void {
        let query = `
UPDATE media SET status = :status, deleted_at = NOW(), updated_at = NOW() WHERE id = :id
`;

        let queryParams = {
            id: id,
            status: Constants.MEDIA_STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }
}
