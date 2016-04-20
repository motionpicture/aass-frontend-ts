import Base from './Base';
import ApplicationModel from '../models/Application';

export default class Application extends Base {
    public reset(req: any, res: any, next: any): void {
        let applicationModel = new ApplicationModel();
        applicationModel.updateStatus(req.params.id, ApplicationModel.STATUS_RESET, (err, result) => {
            if (err) throw err;

            res.json({
                isSuccess: true,
                messages: []
            });
        });
    }
}
