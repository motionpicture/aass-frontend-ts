import BaseApplication from '../../common/models/Application';

export default class Application extends BaseApplication {
    public updateStatus(id: string, status: number, cb: Function): void {
        let query = `
UPDATE application SET status = :status, updated_at = NOW() WHERE id = :id
`;

        let queryParams = {
            id: id,
            status: status
        };

        this.query(query, queryParams, cb);
    }

    public reject(id: string, reason: string, cb: Function): void {
        let query = `
UPDATE application SET reject_reason = :rejectReason, status = :status, updated_at = NOW() WHERE id = :id
`;

        let queryParams = {
            id: id,
            rejectReason: reason,
            status: Application.STATUS_REJECTED
        };

        this.query(query, queryParams, cb);
    }

    public deleteById(id: string, cb: Function): void {
        let query = `
UPDATE application SET status = :status, updated_at = NOW() WHERE id = :id
`;

        let queryParams = {
            id: id,
            status: Application.STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }
}