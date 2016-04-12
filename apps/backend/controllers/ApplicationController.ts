import BaseController from './BaseController';
// import MediaModel from '../models/MediaModel';

export default class ApplicationController extends BaseController
{
    public list(req: any, res: any, next: any): void {
        res.render('applicaiton/index', {});
    }
}