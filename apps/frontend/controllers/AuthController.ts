import BaseController from './BaseController';
import EventModel from '../models/EventModel';

export default class AuthController extends BaseController {
    public login(req: any, res: any, next: any): void {
        if (req.method == "POST") {
            let message = '';

            if (req.body.user_id && req.body.password) {
                let model = new EventModel(req);
                this.logger.debug('logining... user_id:' , req.body.user_id);
                model.getLoginUser(req.body.user_id, req.body.password, (err, rows, fields) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    if (rows.length > 0) {
                        req.user.login(rows[0]);
                        res.redirect('/');
                    } else {
                        message = 'IDとパスワードが間違っています';
                        res.render('login', {message: message});
                    }
                });
            } else {
                message = '入力してください';
                res.render('login', {message: message});
            }
        } else {
            res.render('login');
        }
    }

    public logout(req: any, res: any, next: any): void {
        req.user.logout();
        res.redirect('/');
    }
}
