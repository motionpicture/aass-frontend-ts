import Base from './Base';
import ApplicationModel from '../models/Application';

export default class Application extends Base {
    public accept(req: any, res: any, next: any): void {
        let message: string = '' ;

        let applicationModel = new ApplicationModel();
        applicationModel.updateStatus(req.params.id, ApplicationModel.STATUS_ACCEPTED, (err, result) => {
            if (err) throw err;

            res.json({
                isSuccess: true,
                messages: []
            });
        });
    }

    public reject(req: any, res: any, next: any): void {
        let message: string = '' ;

        let applicationModel = new ApplicationModel();
        this.logger.debug('rejecting...', req.params.id, req.body.reason);
        applicationModel.reject(req.params.id, req.body.reason, (err, result) => {
            if (err) throw err;

            res.json({
                isSuccess: true,
                messages: []
            });
        });
    }

    public delete(req: any, res: any, next: any): void {
        let message: string = '' ;

        let applicationModel = new ApplicationModel();
        applicationModel.updateStatus(req.params.id, ApplicationModel.STATUS_DELETED, (err, result) => {
            if (err) throw err;

            res.json({
                isSuccess: true,
                messages: []
            });
        });
    }
}