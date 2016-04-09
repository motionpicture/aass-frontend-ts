import BaseController from './BaseController';
import EventModel from '../models/EventModel';

export default class AuthController extends BaseController
{
    login(req, res, next)
    {
        if (req.method == "POST") {
            var message = '';

            if (req.body.user_id && req.body.password) {
                var model = new EventModel(req);
                req.logger.debug('logining... user_id:' , req.body.user_id);
                model.getLoginUser(req.body.user_id, req.body.password, function(err, rows, fields)
                {
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

    logout(req, res, next)
    {
        req.user.logout();
        res.redirect('/');
    }
}
