import BaseModel from './BaseModel';

export default class EventModel extends BaseModel
{
    public getLoginUser(userId: string, password: string, cb: Function): void {
        var query = 'SELECT * FROM event WHERE user_id = :userId AND password = :password LIMIT 1';
        this.req.logger.debug(query);
        var queryParams = {
            userId: userId,
            password: password
        };

        this.query(query, queryParams, cb);
    }
}
