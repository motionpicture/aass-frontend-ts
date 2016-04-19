import Base from './Base';
import Media from './Media';

export default class Application extends Base {
    static STATUS_CREATED = 1; // 申請中
    static STATUS_ACCEPTED = 2; // 承認
    static STATUS_REJECTED = 3; // 却下
    static STATUS_DELETED = 4; // 削除済み
    static STATUS_END = 5; // 上映済み

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
                str = '申請却下済み';
                break;
            case Application.STATUS_DELETED:
                str = '削除済み';
                break;
            case Application.STATUS_END:
                str = '上映済み';
                break;
        
            default:
                str = 'ステータス不明';
                break;
        }

        return str;
    }

    public getByEventId(eventId, cb): void {
        let query = 'SELECT a.id, a.media_id, a.status FROM application AS a LEFT JOIN media AS m ON m.id = a.media_id WHERE m.event_id = :eventId AND m.status <> :mediaStatus AND a.status <> :applicationStatus';
        let queryParams = {
            eventId: eventId,
            mediaStatus: Media.STATUS_DELETED,
            applicationStatus: Application.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }
}