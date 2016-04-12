import express = require('express');
import AuthController from '../controllers/AuthController';
import MediaController from '../controllers/MediaController';

let router = express.Router();
let authController = new AuthController();
let mediaController = new MediaController();

router.get('/', function(req, res, next) {
    res.redirect('/medias');
});

router.get('/login', (req, res, next) => {authController.login(req, res, next)});
router.post('/login', (req, res, next) => {authController.login(req, res, next)});
router.post('/logout', (req, res, next) => {authController.logout(req, res, next)});

router.get('/medias', (req, res, next) => {mediaController.list(req, res, next)});
router.get('/media/new', (req, res, next) => {mediaController.create(req, res, next)});
router.post('/media/create', (req, res, next) => {mediaController.create(req, res, next)});
router.post('/media/createAsset', (req, res, next) => {mediaController.createAsset(req, res, next)});
router.post('/media/appendFile', (req, res, next) => {mediaController.appendFile(req, res, next)});
router.post('/media/commitFile', (req, res, next) => {mediaController.commitFile(req, res, next)});
router.get('/media/:id/edit', (req, res, next) => {mediaController.edit(req, res, next)});
router.get('/media/:id/download', (req, res, next) => {mediaController.download(req, res, next)});
router.post('/media/:id/delete', (req, res, next) => {mediaController.delete(req, res, next)});
router.post('/media/:id/apply', (req, res, next) => {mediaController.apply(req, res, next)});

export = router;
