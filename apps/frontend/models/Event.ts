import BaseEvent from '../../common/models/Event';

export default class Event extends BaseEvent
{
    public getLoginUser(userId: string, password: string, cb: Function): void {
        let query = `
SELECT e.* ,
 a.id AS application_id, a.media_id AS application_media_id, a.remarks AS application_remarks, a.status AS application_status
 FROM event AS e
 LEFT JOIN application AS a ON a.event_id = e.id
 WHERE user_id = :userId AND password = :password LIMIT 1
`;
        let queryParams = {
            userId: userId,
            password: password
        };

        this.query(query, queryParams, cb);
    }
    
    public getEventUser(id: string, cb: Function): void {
        let query = 'SELECT * FROM event WHERE id = :id';
        let queryParams = {id: id};

        this.query(query, queryParams, cb);
    }
}
