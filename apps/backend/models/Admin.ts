import BaseAdmin from '../../common/models/Admin';

export default class Admin extends BaseAdmin {
    public getLoginUser(userId, password, cb): void {
        let query = 'SELECT * FROM admin WHERE user_id = :userId AND password = :password';
        let queryParams = {
            userId: userId,
            password: password
        };

        this.query(query, queryParams, cb);
    }
    
    public getAdminUser(id: string, cb: Function): void {
        let query = 'SELECT * FROM admin WHERE id = :id';
        let queryParams = {id: id};

        this.query(query, queryParams, cb);
    }
}