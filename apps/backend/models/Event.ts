import BaseEvent from '../../common/models/Event';
import Media from './Media';
import Application from './Application';

export default class Event extends BaseEvent {
    public getAll(cb): void {
        let query = `
SELECT
    e.id, e.user_id, e.place, e.email, e.held_from, e.held_to
    , a.media_id AS media_id, a.media_title AS media_title, a.media_uploaded_by AS media_uploaded_by
    , a.media_url_thumbnail AS media_url_thumbnail, a.media_url_mp4 AS media_url_mp4, a.media_url_streaming AS media_url_streaming
    , a.media_status AS media_status, a.media_job_end_at AS media_job_end_at
    , a.id AS application_id, a.status AS application_status
 FROM event AS e
 LEFT JOIN (
     SELECT
         a2.id, a2.media_id, a2.status
         , m.event_id, m.title AS media_title, m.uploaded_by AS media_uploaded_by
         , m.url_thumbnail AS media_url_thumbnail, m.url_mp4 AS media_url_mp4, m.url_streaming AS media_url_streaming
         , m.status AS media_status, m.job_end_at AS media_job_end_at
     FROM application AS a2 LEFT JOIN media AS m ON m.id = a2.media_id
     WHERE m.status <> :mediaStatus AND a2.status <> :applicationStatus
 ) a ON a.event_id = e.id
 GROUP BY e.id
 ORDER BY held_from DESC
`;
        let queryParams = {
            mediaStatus: Media.STATUS_DELETED,
            applicationStatus: Application.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }

    public getById(id, cb): void {
        let query = `
SELECT * FROM event WHERE id = :id LIMIT 1
`;
        let queryParams = {
            id: id
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

    public isDuplicateByEmail(id, email, cb): void {
        let query = `
SELECT id FROM event WHERE email = :email AND id <> :id
`;
        let queryParams = {
            email: email,
            id: id
        };

        this.query(query, queryParams, cb);
    }

    public updateFromArray(params, cb): void {
        let query: string = '';
        let queryParams: Object = {};

        if (params.id) {
            query = `
UPDATE event SET
 user_id = :userId, email = :email, password = :password, held_from = :heldFrom, held_to = :heldTo,
 place = :place, remarks = :remarks, updated_at = NOW()
 WHERE id = :id
`;
            queryParams = {
                'id':  params.id,
                'userId':  params.user_id,
                'email':  params.email,
                'password':  params.password,
                'heldFrom':  params.held_from,
                'heldTo':  params.held_to,
                'place':  params.place,
                'remarks':  params.remarks
            };

        } else {
            query = `
INSERT INTO event
 (user_id, email, password, held_from, held_to, place, remarks, created_at, updated_at) VALUES
 (:user_id, :email, :password, :held_from, :held_to, :place, :remarks, NOW(), NOW())
`;
            queryParams = {
                'user_id':  params.user_id,
                'email':  params.email,
                'password':  params.password,
                'held_from':  params.held_from,
                'held_to':  params.held_to,
                'place':  params.place,
                'remarks':  params.remarks
            };
        }

        this.query(query, queryParams, cb);
    }
}