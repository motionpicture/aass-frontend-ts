import Constants from '../../common/modules/Constants';

export default (req, res, next) => {
    if (req.user) next();

    var user = new User();
    user.initialize(req.session);
    req.user = user;
    res.locals.user = user;

    if (req.originalUrl != '/login') {
        if (!user.isAuthenticated()) {
            res.redirect('/login');
            return;
        }
    }

    next();
};

class User {
    private session;
    private authSessionName;

    constructor() {
        this.session = null;
        this.authSessionName = Constants.AUTH_SESSION_NAME;
    }

    initialize(session): void {
        this.session = session;
    }

    isAuthenticated(): string {
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
