import BaseEvent from '../../common/models/Event';
import Media from './Media';
import Application from './Application';

export default class Event extends BaseEvent {
    public getAll(cb): void {
        let query = `
SELECT
    e.*, a.*
 FROM event AS e
 LEFT JOIN (
     SELECT
         a2.id AS application_id, a2.media_id, a2.status AS application_status, a2.event_id AS application_event_id
         , a2.remarks AS application_remarks
         , m.title AS media_title, m.description AS media_description, m.uploaded_by AS media_uploaded_by
         , m.url_thumbnail AS media_url_thumbnail, m.url_mp4 AS media_url_mp4, m.url_streaming AS media_url_streaming
         , m.status AS media_status, m.job_end_at AS media_job_end_at
         , m.created_at AS media_created_at, m.updated_at AS media_updated_at
     FROM application AS a2 LEFT JOIN media AS m ON m.id = a2.media_id
     WHERE m.status <> :mediaStatus AND a2.status <> :applicationStatus AND a2.status <> :applicationStatus2
 ) a ON a.application_event_id = e.id
 GROUP BY e.id
 ORDER BY held_from DESC
`;

        let queryParams = {
            mediaStatus: Media.STATUS_DELETED,
            applicationStatus: Application.STATUS_DELETED,
            applicationStatus2: Application.STATUS_RESET
        };

        this.query(query, queryParams, cb);
    }

    public getById(id, cb): void {
        let query = `
SELECT
    e.*, a.*
 FROM event AS e
 LEFT JOIN (
     SELECT
         a2.id AS application_id, a2.media_id, a2.status AS application_status, a2.event_id AS application_event_id
         , a2.remarks AS application_remarks, a2.media_id AS application_media_id
         , m.title AS media_title, m.description AS media_description, m.uploaded_by AS media_uploaded_by
         , m.url_thumbnail AS media_url_thumbnail, m.url_mp4 AS media_url_mp4, m.url_streaming AS media_url_streaming
         , m.status AS media_status, m.job_end_at AS media_job_end_at
         , m.created_at AS media_created_at, m.updated_at AS media_updated_at
     FROM application AS a2 LEFT JOIN media AS m ON m.id = a2.media_id
     WHERE m.status <> :mediaStatus AND a2.status <> :applicationStatus AND a2.status <> :applicationStatus2
 ) a ON a.application_event_id = e.id
 WHERE e.id = :id
 LIMIT 1
`;


        
        let queryParams = {
            id: id,
            mediaStatus: Media.STATUS_DELETED,
            applicationStatus: Application.STATUS_DELETED,
            applicationStatus2: Application.STATUS_RESET
        };

        this.query(query, queryParams, cb);
    }

    public getByUserId(userId, cb): void {
        let query = `
SELECT * FROM event WHERE user_id = :userId
`;

        let queryParams = {
            userId: userId
        };

        this.query(query, queryParams, cb);
    }

    public create(params, cb): void {
        let query: string = `
INSERT INTO event
 (user_id, email, password, held_from, held_to, place, remarks, created_at, updated_at) VALUES
 (:user_id, :email, :password, :held_from, :held_to, :place, :remarks, NOW(), NOW())
`;

        let queryParams: Object = {
            'user_id':  params.user_id,
            'email':  params.email,
            'password':  params.password,
            'held_from':  params.held_from,
            'held_to':  params.held_to,
            'place':  params.place,
            'remarks':  params.remarks
        };

        this.query(query, queryParams, cb);
    }

    public update(params, cb): void {
        let query: string = `
UPDATE event SET
 user_id = :userId, email = :email, password = :password, held_from = :heldFrom, held_to = :heldTo,
 place = :place, remarks = :remarks, updated_at = NOW()
 WHERE id = :id
`;

        let queryParams: Object = {
            'id':  params.id,
            'userId':  params.user_id,
            'email':  params.email,
            'password':  params.password,
            'heldFrom':  params.held_from,
            'heldTo':  params.held_to,
            'place':  params.place,
            'remarks':  params.remarks
        };

        this.query(query, queryParams, cb);
    }
}