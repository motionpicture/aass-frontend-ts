import Router = require('named-routes');

import Application from '../controllers/Application';
import Auth from '../controllers/Auth';
import Event from '../controllers/Event';
import Media from '../controllers/Media';

export default function router(app: any) {
    var router = new Router(null);
    router.extendExpress(app);
    router.registerAppHelpers(app);

    let application = new Application();
    let auth = new Auth();
    let event = new Event();
    let media = new Media();

    app.get('/admin', 'home', function(req, res, next) {
        res.redirect('/admin/events');
    });

    app.all('/admin/login', 'login', (req, res, next) => {auth.login(req, res, next)});
    app.post('/admin/logout', 'logout', (req, res, next) => {auth.logout(req, res, next)});

    app.post('/admin/application/:id/accept', 'application.accept', (req, res, next) => {application.accept(req, res, next)});
    app.post('/admin/application/:id/reject', 'application.reject', (req, res, next) => {application.reject(req, res, next)});

    app.get('/admin/events', 'events', (req, res, next) => {event.list(req, res, next)});
    app.all('/admin/event/new', 'event.create', (req, res, next) => {event.create(req, res, next)});
    app.all('/admin/event/validate', 'event.validate', (req, res, next) => {event.validate(req, res, next)});
    app.all('/admin/event/:id/edit', 'event.update', (req, res, next) => {event.update(req, res, next)});
    app.get('/admin/event/:id/medias', 'event.medias', (req, res, next) => {event.medias(req, res, next)});

    app.get('/admin/media/:id/download', 'media.download', (req, res, next) => {media.download(req, res, next)});
    app.post('/admin/media/:id/encode2jpeg2000', 'media.encode2jpeg2000', (req, res, next) => {media.encode2jpeg2000(req, res, next)});
}