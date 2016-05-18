import Router = require('named-routes');

import Application from '../controllers/Application';
import Auth from '../controllers/Auth';
import Media from '../controllers/Media';

export default function router(app: any) {
    var router = new Router(null);
    router.extendExpress(app);
    router.registerAppHelpers(app);

    
    app.get('/', 'home', function(req, res, next) {
        res.redirect('/medias');
    });

    app.all('/login', 'login', (req, res, next) => {(new Auth()).login(req, res, next)});
    app.post('/logout', 'logout', (req, res, next) => {(new Auth()).logout(req, res, next)});

    app.get('/medias', 'medias', (req, res, next) => {(new Media()).list(req, res, next)});
    app.all('/media/new', 'media.create', (req, res, next) => {(new Media()).create(req, res, next)});
    app.post('/media/createAsset', 'media.createAsset', (req, res, next) => {(new Media()).createAsset(req, res, next)});
    app.post('/media/appendFile', 'media.appendFile', (req, res, next) => {(new Media()).appendFile(req, res, next)});
    app.post('/media/commitFile', 'media.commitFile', (req, res, next) => {(new Media()).commitFile(req, res, next)});
    app.all('/media/:id/edit', 'media.update', (req, res, next) => {(new Media()).update(req, res, next)});
    app.get('/media/:id/download', 'media.download', (req, res, next) => {(new Media()).download(req, res, next)});
    app.post('/media/:id/delete', 'media.delete', (req, res, next) => {(new Media()).delete(req, res, next)});
    app.post('/media/:id/apply', 'media.apply', (req, res, next) => {(new Media()).apply(req, res, next)});

    app.post('/application/:id/reset', 'application.reset', (req, res, next) => {(new Application()).reset(req, res, next)});
}