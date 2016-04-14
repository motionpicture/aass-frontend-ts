import Base from './Base';
import ApplicationModel from '../models/Application';

export default class Application extends Base {
    public accept(req: any, res: any, next: any): void {
        let isSuccess: boolean = false;
        let message: string = '' ;

        let applicationModel = new ApplicationModel(req);
        applicationModel.updateStatus(req.params.id, ApplicationModel.STATUS_ACCEPTED, (err, rows, fields) => {
            this.logger.debug('err:', err);
            if (err) {
                message = 'エラーメッセージ';
            } else {
                isSuccess = true;
            }

            res.json({
                isSuccess: isSuccess,
                message: message
            });
        });
    }

    public reject(req: any, res: any, next: any): void {
        let isSuccess: boolean = false;
        let message: string = '' ;

        let applicationModel = new ApplicationModel(req);
        applicationModel.updateStatus(req.params.id, ApplicationModel.STATUS_REJECTED, (err, rows, fields) => {
            this.logger.debug('err:', err);
            if (err) {
                message = 'エラーメッセージ';
            } else {
                isSuccess = true;
            }

            res.json({
                isSuccess: isSuccess,
                message: message
            });
        });
    }

    public delete(req: any, res: any, next: any): void {
        let isSuccess: boolean = false;
        let message: string = '' ;

        let applicationModel = new ApplicationModel(req);
        applicationModel.deleteById(req.params.id, (err, rows, fields) => {
            this.logger.debug('err:', err);
            if (err) {
                message = 'エラーメッセージ';
            } else {
                isSuccess = true;
            }

            res.json({
                isSuccess: isSuccess,
                message: message
            });
        });
    }
}