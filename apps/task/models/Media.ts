import BaseMedia from '../../common/models/Media';
import util = require('util');

export default class Media extends BaseMedia
{
    public getByStatus(status: number, cb: Function): void {
        let query = `
SELECT id, title, status, filename, extension, url_thumbnail, url_mp4, url_streaming, asset_id, job_id, job_state, created_at
 FROM media
 WHERE status = :status
 ORDER BY created_at ASC
`;

        let queryParams = {
            status: status
        };

        this.query(query, queryParams, cb);
    }

    public getListByStatus(status: number, limit: number, cb: Function): void {
        let query = `
SELECT id, title, status, filename, extension, url_thumbnail, url_mp4, url_streaming, asset_id, job_id, job_state, created_at
 FROM media
 WHERE status = :status
 ORDER BY created_at ASC
 LIMIT %s
`;
        query = util.format(query, limit);

        let queryParams = {
            status: status
        };

        this.query(query, queryParams, cb);
    }

    public addJob(id: string, jobId: string, jobState: number, cb: Function): void {
        let query = `
UPDATE media SET
 status = :status, job_id = :jobId, job_state = :jobState, updated_at = NOW()
 WHERE id = :id
`;

        let queryParams = {
            id: id,
            jobId: jobId,
            jobState: jobState,
            status: Media.STATUS_JOB_CREATED
        };

        this.query(query, queryParams, cb);
    }

    public updateJobState(id: string, state: number, status: number, cb: Function): void {
        let query = `
UPDATE media SET
 job_state = :jobState, status = :status, updated_at = NOW()
 WHERE id = :id
`;

        let queryParams = {
            id: id,
            jobState: state,
            status: status
        };

        this.query(query, queryParams, cb);
    }

    public updateTaskProgress(id: string, progresses: any, cb: Function): void {
        let query = `
UPDATE media SET
 task_progress_thumbnail = :taskProgressThumbnail,
 task_progress_mp4 = :taskProgressMP4,
 task_progress_streaming = :taskProgressStreaming,
 updated_at = NOW()
 WHERE id = :id
`;

        let queryParams = {
            id: id,
            taskProgressThumbnail: (progresses.hasOwnProperty('thumbnail')) ? progresses.thumbnail : null,
            taskProgressMP4: (progresses.hasOwnProperty('mp4')) ? progresses.mp4 : null,
            taskProgressStreaming: (progresses.hasOwnProperty('streaming')) ? progresses.streaming : null
        };

        this.query(query, queryParams, cb);
    }

    public publish(id: string, urls: any, cb: Function): void {
        let query = `
UPDATE media SET
 url_origin = :urlOrigin, url_thumbnail = :urlThumbnail, url_mp4 = :urlMp4, url_streaming = :urlStreaming,
 status = :status, updated_at = NOW()
 WHERE id = :id
`;

        let queryParams = {
            id: id,
            urlOrigin: (urls.hasOwnProperty('origin')) ? urls.origin : null,
            urlThumbnail: (urls.hasOwnProperty('thumbnail')) ? urls.thumbnail : null,
            urlMp4: (urls.hasOwnProperty('mp4')) ? urls.mp4 : null,
            urlStreaming: (urls.hasOwnProperty('streaming')) ? urls.streaming : null,
            status: Media.STATUS_PUBLISHED
        };

        this.query(query, queryParams, cb);
    }

    public publishJpeg2000(id: string, url: string, cb: Function): void {
        let query = `
UPDATE media SET
 url_jpeg2000 = :url, status = :status, updated_at = NOW()
 WHERE id = :id
`;

        let queryParams = {
            id: id,
            url: url,
            status: Media.STATUS_JPEG2000_PUBLISHED
        };

        this.query(query, queryParams, cb);
    }
}