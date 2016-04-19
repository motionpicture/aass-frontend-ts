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
        applicationModel.deleteById(req.params.id, (err, result) => {
            if (err) throw err;

            res.json({
                isSuccess: true,
                messages: []
            });
        });
    }
}