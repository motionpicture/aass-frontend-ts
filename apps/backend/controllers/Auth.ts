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
                            form.fields.user_id.error = 'ユーザーIDもしくはパスワードが異なります';
                            res.render('login', {
                                form: form
                            });
                        }
                    });
                },
                error: (form) => {
                    // the data in the request didn't validate,
                    // calling form.toHTML() again will render the error messages
                    res.render('login', {
                        form: form
                    });
                },
                empty: (form) => {
                    // there was no form data in the request
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
        req.user.logout();

        res.json({
            isSuccess: true,
            messages: []
        });
    }
}