import Base from './Base';
import AdminModel from '../models/Admin';
import LoginForm from '../forms/Login';

export default class Auth extends Base {
    public login(req: any, res: any, next: any): void {
        let form = LoginForm;

        if (req.method == "POST") {
            form.handle(req, {
                success: (form) => {
                    // there is a request and the form is valid
                    // form.data contains the submitted data
                    let model = new AdminModel();
                    this.logger.debug('logining... user_id:' , req.body.user_id);
                    model.getLoginUser(req.body.user_id, req.body.password, (err, rows, fields) => {
                        if (err) {
                            next(err);
                            return;
                        }

                        if (rows.length > 0) {
                            if (form.fields.auto_login.data) {
                                res.cookie('auto_login_b', rows[0].id, {
                                    expires: new Date(Date.now() + 1 * 365 * 24 * 60 * 60 * 1000), 
                                    httpOnly:false
                                });
                            }
                            req.user.login(rows[0]);
                            res.redirect('/admin');
                        } else {
                            form.fields.user_id.error = 'ユーザーIDもしくはパスワードが異なります';
                            res.render('login', {
                                form: form
                            });
                        }
                    });
                },
                error: (form) => {
                    res.render('login', {
                        form: form
                    });
                },
                empty: (form) => {
                    res.render('login', {
                        form: form
                    });
                }
            });
        } else {
            res.render('login', {
                form: form
            });
        }
    }

    public logout(req: any, res: any, next: any): void {
        res.clearCookie('auto_login_b');
        req.user.logout();

        res.json({
            isSuccess: true,
            messages: []
        });
    }
}