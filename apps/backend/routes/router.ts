/// <reference path="../../../typings/main.d.ts" />

import Router = require('named-routes');

import Application from '../controllers/Application';
import Auth from '../controllers/Auth';
import Event from '../controllers/Event';
import Media from '../controllers/Media';

export default function router(app: any) {
    var router = new Router(null);
    router.extendExpress(app);
    router.registerAppHelpers(app);

    

    app.get('/admin', 'home', function(req, res, next) {
        res.redirect('/admin/events');
    });

    app.all('/admin/login', 'login', (req, res, next) => {(new Auth()).login(req, res, next)});
    app.post('/admin/logout', 'logout', (req, res, next) => {(new Auth()).logout(req, res, next)});

    app.post('/admin/application/:id/accept', 'application.accept', (req, res, next) => {(new Application()).accept(req, res, next)});
    app.post('/admin/application/:id/reject', 'application.reject', (req, res, next) => {(new Application()).reject(req, res, next)});
    app.post('/admin/application/:id/delete', 'application.delete', (req, res, next) => {(new Application()).delete(req, res, next)});
    
    app.get('/admin/events', 'events', (req, res, next) => {(new Event()).list(req, res, next)});
    app.all('/admin/event/new', 'event.create', (req, res, next) => {(new Event()).create(req, res, next)});
    app.all('/admin/event/validate', 'event.validate', (req, res, next) => {(new Event()).validate(req, res, next)});
    app.all('/admin/event/:id/edit', 'event.update', (req, res, next) => {(new Event()).update(req, res, next)});
    app.get('/admin/event/:id/medias', 'event.medias', (req, res, next) => {(new Event()).medias(req, res, next)});
    

    app.get('/admin/media/:id/download', 'media.download', (req, res, next) => {(new Media()).download(req, res, next)});
    app.get('/admin/media/:id/download/jpeg2000', 'media.downloadJpeg2000', (req, res, next) => {(new Media()).downloadJpeg2000(req, res, next)});
    app.post('/admin/media/:id/encode2jpeg2000', 'media.encode2jpeg2000', (req, res, next) => {(new Media()).encode2jpeg2000(req, res, next)});
}