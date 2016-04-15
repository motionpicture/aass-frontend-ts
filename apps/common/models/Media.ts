import Base from './Base';

export default class Media extends Base {
    public id;
    public event_id;
    public title; // 動画名
    public description; // 動画概要
    public uploaded_by; // 動画登録者名
    public status; // 状態
    public size; // サイズ
    public extension; // ファイル拡張子
    public playtime_string; // 再生時間
    public playtime_seconds; // 再生時間
    public url_thumbnail; // サムネイルURL
    public url_mp4; // MP4URL
    public url_streaming; // ストリーミングURL
    public asset_id; // アセットID
    public job_id; // ジョブID
    public job_state; // ジョブ進捗
    public job_start_at; // ジョブ開始日時
    public job_end_at; // ジョブ終了日時
    public deleted_at; // 削除日時

    static STATUS_ASSET_CREATED = 1; // アセット作成済み(ジョブ待ち)
    static STATUS_JOB_CREATED = 2; // ジョブ作成済み(mp4エンコード中)
    static STATUS_JOB_FINISHED = 3; // ジョブ完了
    static STATUS_JPEG2000_READY = 4; // JPEG2000エンコード待ち
    static STATUS_JPEG2000_ENCODED = 5; // JPEG2000エンコード済み
    static STATUS_ERROR = 8; // エンコード失敗
    static STATUS_DELETED = 9; // 削除済み

    static AZURE_FILE_SHARE_NAME_JPEG2000_READY = 'mp4';
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

    public getListByEventId(eventId, cb): void {
        let query = 'SELECT * FROM media WHERE event_id = :eventId AND status <> :status';
        let queryParams = {
            eventId: eventId,
            status: Media.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }

    public getById(id, cb): void {
        let query = `
SELECT * FROM media WHERE id = :id AND status <> :status
`;
        let queryParams = {
            id: id,
            status: Media.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }

    public delete(id, cb): void {
        let query = 'DELETE FROM media WHERE id = :id';
        let queryParams = {
            id: id
        };

        this.query(query, queryParams, cb);
    }

    public static getFilePath4Jpeg2000Ready(filename): String {
        return Media.AZURE_FILE_SHARE_NAME_JPEG2000_READY + '/' + filename + '.mp4';
    }

    public static getFilePath4Jpeg2000Encoded(filename): String {
        return Media.AZURE_FILE_SHARE_NAME_JPEG2000_ENCODED + '/' + filename + '.jpeg2000';
    }
}