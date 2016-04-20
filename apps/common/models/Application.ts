import Base from './Base';
import Media from './Media';

export default class Application extends Base {
    static STATUS_CREATED = 1; // 申請中
    static STATUS_ACCEPTED = 2; // 承認
    static STATUS_REJECTED = 3; // 否認
    static STATUS_RESET = 4; // 否認後リセット済み
    static STATUS_END = 5; // 上映済み
    static STATUS_DELETED = 9; // 削除済み

    public static status2string(status: Number): String {
        let str: String;

        switch (status) {
            case Application.STATUS_CREATED:
                str = '申請中';
                break;
            case Application.STATUS_ACCEPTED:
                str = '申請承認済み';
                break;
            case Application.STATUS_REJECTED:
                str = '申請否認済み';
                break;
            case Application.STATUS_RESET:
                str = 'リセット済み';
                break;
            case Application.STATUS_END:
                str = '上映済み';
                break;
            case Application.STATUS_DELETED:
                str = '削除済み';
                break;

            default:
                str = 'ステータス不明';
                break;
        }

        return str;
    }

    public updateStatus(id: string, status: number, cb: Function): void {
        let query = `
UPDATE application SET status = :status, updated_at = NOW() WHERE id = :id
`;

        let queryParams = {
            id: id,
            status: status
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

    public getByEventId(eventId, cb): void {
        let query = `
SELECT
 a.*
  FROM application AS a
  LEFT JOIN media AS m ON m.id = a.media_id
  WHERE m.event_id = :eventId
   AND m.status <> :mediaStatus
   AND a.status <> :applicationStatusReset
   AND a.status <> :applicationStatusDelete
`;

        let queryParams = {
            eventId: eventId,
            mediaStatus: Media.STATUS_DELETED,
            applicationStatusReset: Application.STATUS_RESET,
            applicationStatusDelete: Application.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }
}