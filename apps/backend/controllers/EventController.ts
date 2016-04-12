import BaseController from './BaseController';
// import MediaModel from '../models/MediaModel';

export default class EventController extends BaseController
{
    public list(req: any, res: any, next: any): void {
        res.render('event/index', {});
    }

    public create(req: any, res: any, next: any): void {
        res.render('event/new', {});
    }

    public edit(req: any, res: any, next: any): void {
        res.render('event/edit', {});
    }

    public medias(req: any, res: any, next: any): void {
        res.render('event/medias', {});
    }

}