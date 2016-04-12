import express = require('express');
import AuthController from '../controllers/AuthController';
import EventController from '../controllers/EventController';
import ApplicationController from '../controllers/ApplicationController';

let router = express.Router();
let authController = new AuthController();
let eventController = new EventController();
let applicationController = new ApplicationController();

router.get('/', function(req, res, next) {
    res.redirect('/admin/events');
});

router.get('/login', (req, res, next) => {authController.login(req, res, next)});
router.post('/login', (req, res, next) => {authController.login(req, res, next)});
router.post('/logout', (req, res, next) => {authController.logout(req, res, next)});

router.get('/events', (req, res, next) => {eventController.list(req, res, next)});
router.get('/event/medias', (req, res, next) => {eventController.medias(req, res, next)});
router.get('/event/new', (req, res, next) => {eventController.create(req, res, next)});
router.get('/event/:id/edit', (req, res, next) => {eventController.edit(req, res, next)});

export = router;