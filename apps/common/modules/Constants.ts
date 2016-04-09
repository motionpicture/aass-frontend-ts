export default class Constants
{
    static AUTH_SESSION_NAME = 'AassFrontendAuth';

    static MEDIA_STATUS_ASSET_CREATED = 1; // アセット作成済み(ジョブ待ち)
    static MEDIA_STATUS_JOB_CREATED = 2; // ジョブ作成済み(mp4エンコード中)
    static MEDIA_STATUS_JOB_FINISHED = 3; // ジョブ完了
    static MEDIA_STATUS_JPEG2000_READY = 4; // JPEG2000エンコード待ち
    static MEDIA_STATUS_JPEG2000_ENCODED = 5; // JPEG2000エンコード済み
    static MEDIA_STATUS_ERROR = 8; // エンコード失敗
    static MEDIA_STATUS_DELETED = 9; // 削除済み
};
