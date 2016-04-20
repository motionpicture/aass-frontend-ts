import Base from './Base';

export default class Media extends Base {
    static STATUS_ASSET_CREATED = 1; // アセット作成済み(ジョブ待ち)
    static STATUS_JOB_CREATED = 2; // ジョブ作成済み(mp4エンコード中)
    static STATUS_JOB_FINISHED = 3; // ジョブ完了
    static STATUS_JPEG2000_READY = 4; // JPEG2000エンコード待ち
    static STATUS_JPEG2000_ENCODED = 5; // JPEG2000エンコード済み
    static STATUS_ERROR = 8; // エンコード失敗
    static STATUS_DELETED = 9; // 削除済み

    static AZURE_FILE_SHARE_NAME_JPEG2000_ENCODED = 'jpeg2000';

    public static status2string(status: Number): String {
        let str: String;

        switch (status) {
            case Media.STATUS_ASSET_CREATED:
                str =  'アップロード完了';
                break;
            case Media.STATUS_JOB_CREATED:
                str =  'ジョブ進行中';
                break;
            case Media.STATUS_JOB_FINISHED:
                str =  'ジョブ完了';
                break;
            case Media.STATUS_JPEG2000_READY:
                str =  'JPEG2000エンコード待ち';
                break;
            case Media.STATUS_JPEG2000_ENCODED:
                str =  'JPEG2000エンコード完了';
                break;
            case Media.STATUS_ERROR:
                str =  'エンコード失敗';
                break;
            case Media.STATUS_DELETED:
                str =  '削除済み';
                break;

            default:
                str =  'ステータス不明';
                break;
        }

        return str;
    }

    public getListByEventId(eventId: string, cb: Function): void {
        let query = `
SELECT m.*,
 a.id AS application_id, a.remarks AS application_remarks, a.reject_reason AS application_reject_reason, a.status AS application_status
 FROM media AS m
 LEFT JOIN application AS a ON m.id = a.media_id
 WHERE m.event_id = :eventId AND m.status <> :status
 ORDER BY m.created_at DESC
`;

        let queryParams = {
            eventId: eventId,
            status: Media.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }

    public getById(id: string, cb: Function): void {
        let query = `
SELECT * FROM media WHERE id = :id AND status <> :status
`;
        let queryParams = {
            id: id,
            status: Media.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }

    public delete(id: string, cb: Function): void {
        let query = 'DELETE FROM media WHERE id = :id';
        let queryParams = {
            id: id
        };

        this.query(query, queryParams, cb);
    }

    public updateStatus(id: string, status: number, cb: Function): void {
        let query = `
UPDATE media SET
 status = :status, updated_at = NOW()
 WHERE id = :id
`;

        let queryParams = {
            id: id,
            status: status
        };

        this.query(query, queryParams, cb);
    }

    public static getFilePath4Jpeg2000Encoded(filename: string): String {
        return Media.AZURE_FILE_SHARE_NAME_JPEG2000_ENCODED + '/' + filename + '.jpeg2000';
    }
}