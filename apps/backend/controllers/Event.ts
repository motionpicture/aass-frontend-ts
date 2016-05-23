import Base from './Base';
import ApplicationModel from '../models/Application';
import EventModel from '../models/Event';
import MediaModel from '../models/Media';
import EventForm from '../forms/Event';

export default class Event extends Base {
    public list(req: any, res: any, next: any): void {
        let events: Array<any> = [];

        let eventModel = new EventModel();
        
        eventModel.getAll((err, rows, fields) => {
            this.logger.debug('err:', err);
            this.logger.debug('rows:', rows);

            res.render('event/index', {
                events: rows,
                applicationModel: ApplicationModel
            });
        });
    }

    public validate(req: any, res: any, next: any): void {
        let form = EventForm;

        if (req.method == "POST") {
            let messages: Array<string> = [];

            form.handle(req, {
                success: (form) => {
                    let model = new EventModel();

                    model.getByUserId(req.body.user_id, (err, rows) => {
                        if (err) {
                            return next(err);
                        }

                        if (rows.length > 0) {
                            let event = rows[0];
                            this.logger.debug('event by user_id:', event);

                            // 重複の場合
                            if (event.id != req.body.id) {
                                messages.push('ユーザIDが重複しています');

                                return res.json({
                                    isSuccess: false,
                                    messages: messages
                                });
                            }
                        }

                        return res.json({
                            isSuccess: true,
                            messages: messages
                        });
                    });
                },
                error: (form) => {
                    Object.keys(form.fields).forEach((key) => {
                        let field = form.fields[key];
                        if (field.error) {
                            this.logger.debug(field);
                            messages.push(field.error);
                        }
                    });

                    res.json({
                        isSuccess: false,
                        messages: messages
                    });
                },
                empty: (form) => {
                    this.logger.debug(form.fields);
                    Object.keys(form.fields).forEach((key) => {
                        let field = form.fields[key];
                        if (field.error) {
                            messages.push(field.error);
                        }
                    });

                    res.json({
                        isSuccess: false,
                        messages: messages
                    });
                }
            });
        }
    }

    public create(req: any, res: any, next: any): void {
        let form = EventForm;

        if (req.method == "POST") {
            let messages: Array<string> = [];
            let model = new EventModel();

            this.logger.trace('creating event... user_id:' , req.body.user_id);
            model.create(req.body, (err, result) => {
                this.logger.debug('create event result...', result);
                if (err) {
                    this.logger.error('create event fail. err:', err);
                    messages.push('登録できませんでした');
                    return res.json({
                        isSuccess: false,
                        messages: messages
                    });
                }

                return res.json({
                    isSuccess: true,
                    messages: messages
                });
            });
        } else {
            res.render('event/new', {
                form: form
            });
        }
    }

    public update(req: any, res: any, next: any): void {
        let model = new EventModel();
        let form = EventForm;

        if (req.method == "POST") {
            let messages: Array<string> = [];

            this.logger.trace('updating event... user_id:' , req.body.user_id);
            model.update(req.body, (err, result) => {
                this.logger.debug('update event result...', result);
                if (err) {
                    this.logger.error('update event fail. err:', err);
                    messages.push('更新できませんでした');

                    return res.json({
                        isSuccess: false,
                        messages: messages
                    });
                }

                return res.json({
                    isSuccess: true,
                    messages: messages
                });
            });
        } else {
            model.getById(req.params.id, (err, rows) => {
                let event = rows[0];
                event.password_confirm = event.password;
                form = form.bind(event);

                res.render('event/edit', {
                    form: form
                });
            });
        }
    }

    public medias(req: any, res: any, next: any): void {
        let event: Object;
        let medias: Array<any> = [];

        let applicationModel = new ApplicationModel();
        let eventModel = new EventModel();
        let mediaModel = new MediaModel();

        eventModel.getById(req.params.id, (err, rows, fields) => {
            if (err) return next(err);

            event = rows[0];
            
            mediaModel.getListByEventId(req.params.id, (err, rows, fields) => {
                if (err) return next(err);

                medias = rows;
                console.log(medias)
                res.render('event/medias', {
                    event: event,
                    medias: medias,
                    mediaModel: MediaModel,
                    applicationModel: ApplicationModel
                });
            });
        });
    }
    
    public remove(req: any, res: any, next: any): void {
        res.json({
            isSuccess: true,
            messages: []
        });
    }
    
}