import BaseModel from './BaseModel';

export default class EventModel extends BaseModel
{
    public getLoginUser(userId: string, password: string, cb: Function): void {
        let query = 'SELECT * FROM event WHERE user_id = :userId AND password = :password LIMIT 1';
        let queryParams = {
            userId: userId,
            password: password
        };

        this.query(query, queryParams, cb);
    }
}
