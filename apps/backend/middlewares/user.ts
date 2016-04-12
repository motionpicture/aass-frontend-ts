export default (req, res, next) => {
    if (req.user) next();

    let user = new User(req.session);
    req.user = user;
    res.locals.user = user;

    if (req.originalUrl != '/admin/login') {
        if (!user.isAuthenticated()) {
            res.redirect('/admin/login');
            return;
        }
    }

    next();
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
