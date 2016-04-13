import Base from './Base';
import AdminModel from '../models/Admin';

export default class Auth extends Base {
    public login(req: any, res: any, next: any): void {
        let errors: Array<any> = [];

        if (req.method == "POST") {
            req.assert('user_id', 'ユーザーIDを入力してください').notEmpty();
            req.assert('password', 'パスワードを入力してください').notEmpty();

            errors = req.validationErrors();  
            this.logger.debug(errors);

            if (!errors) {
                let model = new AdminModel(req);
                this.logger.debug('logining... user_id:' , req.body.user_id);
                model.getLoginUser(req.body.user_id, req.body.password, (err, rows, fields) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    if (rows.length > 0) {
                        req.user.login(rows[0]);
                        res.redirect('/admin');
                    } else {
                        errors.push({msg: 'ユーザーIDもしくはパスワードが異なります'});
                        res.render('login', {errors: errors});
                    }
                });
            } else {
                res.render('login', {errors: errors});
            }
        } else {
            res.render('login', {errors: errors});
        }
    }

    public logout(req: any, res: any, next: any): void {
        req.user.logout();

        res.json({
            isSuccess: true,
            messages: []
        });
    }
}
