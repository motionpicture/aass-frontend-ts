import Router = require('named-routes');

import Auth from '../controllers/Auth';
import Media from '../controllers/Media';

export default function router(app: any) {
    var router = new Router(null);
    router.extendExpress(app);
    router.registerAppHelpers(app);

    let auth = new Auth();
    let media = new Media();

    app.get('/', 'home', function(req, res, next) {
        res.redirect('/medias');
    });

    app.all('/login', 'login', (req, res, next) => {auth.login(req, res, next)});
    app.post('/logout', 'logout', (req, res, next) => {auth.logout(req, res, next)});

    app.get('/medias', 'medias', (req, res, next) => {media.list(req, res, next)});
    app.all('/media/new', 'media.create', (req, res, next) => {media.create(req, res, next)});
    app.post('/media/createAsset', 'media.createAsset', (req, res, next) => {media.createAsset(req, res, next)});
    app.post('/media/appendFile', 'media.appendFile', (req, res, next) => {media.appendFile(req, res, next)});
    app.post('/media/commitFile', 'media.commitFile', (req, res, next) => {media.commitFile(req, res, next)});
    app.all('/media/:id/edit', 'media.update', (req, res, next) => {media.update(req, res, next)});
    app.get('/media/:id/download', 'media.download', (req, res, next) => {media.download(req, res, next)});
    app.post('/media/:id/delete', 'media.delete', (req, res, next) => {media.delete(req, res, next)});
    app.post('/media/:id/apply', 'media.apply', (req, res, next) => {media.apply(req, res, next)});
}