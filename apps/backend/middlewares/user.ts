import AdminModel from '../models/Admin';

export default (req, res, next) => {
    if (req.user) next();

    let user = new User(req.session);
    req.user = user;
    res.locals.req = req;

    
    
    let loginRedirect = ()=> {
        if (!user.isAuthenticated()) {
            res.redirect('/admin/login');
            return;
        }
        next();
    }

    if (req.originalUrl != '/admin/login') {
        let model = new AdminModel();
        let cookie = req.cookies['auto_login_b'];
        if (cookie) {
            model.getAdminUser(cookie, (err, rows, fields)=> {
                if (rows.length > 0) {
                    req.user.login(rows[0]);
                }
                loginRedirect();
            });
        } else {
            loginRedirect();
        }
    } else {
        next();
    }
    
    
};

class User {
    private authSessionName = 'AassBackendAuth';

    constructor(private session: any) {
    }

    isAuthenticated(): boolean {
        return (this.session.hasOwnProperty(this.authSessionName));
    }

    login(params): void {
        this.session[this.authSessionName] = params;
    }

    logout(): void {
        delete this.session[this.authSessionName];
    }

    getId(): string {
        return (this.session.hasOwnProperty(this.authSessionName)) ? this.session[this.authSessionName].id : null;
    }

    getUserId(): string {
        return (this.session.hasOwnProperty(this.authSessionName)) ? this.session[this.authSessionName].user_id : null;
    }
}
