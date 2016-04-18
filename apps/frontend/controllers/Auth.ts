import Base from './Base';
import EventModel from '../models/Event';
import LoginForm from '../forms/Login';

export default class Auth extends Base {
    public login(req: any, res: any, next: any): void {
        let form = LoginForm;

        if (req.method == "POST") {
            form.handle(req, {
                success: (form) => {
                    // there is a request and the form is valid
                    // form.data contains the submitted data
                    let model = new EventModel();
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
        req.user.logout();

        res.json({
            isSuccess: true,
            messages: []
        });
    }
}
