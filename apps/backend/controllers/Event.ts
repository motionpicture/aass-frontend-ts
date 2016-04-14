import Base from './Base';
import ApplicationModel from '../models/Application';
import EventModel from '../models/Event';
import MediaModel from '../models/Media';
import EventForm from '../forms/Event';

export default class Event extends Base {
    public list(req: any, res: any, next: any): void {
        let events: Array<any> = [];

        let eventModel = new EventModel(req);
        eventModel.getAll((err, rows, fields) => {
            this.logger.debug('err:', err);
            this.logger.debug('rows:', rows);

            res.render('event/index', {
                events: rows
            });
        });
    }

    public validate(req: any, res: any, next: any): void {
        let form = EventForm;

        if (req.method == "POST") {
            let messages: Array<string> = [];

            form.handle(req, {
                success: (form) => {
                    let model = new EventModel(req);

                    model.getByUserId(req.body.user_id, (err, rows) => {
                        if (err) {
                            return next(err);
                        }

                        if (rows.length > 0) {
                            messages.push('ユーザIDが重複しています');
                            res.json({
                                isSuccess: false,
                                messages: messages
                            });
                        } else {
                            res.json({
                                isSuccess: true,
                                messages: messages
                            });
                        }
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
        } else {
            res.render('event/new', {
                form: form
            });
        }
    }

    public create(req: any, res: any, next: any): void {
        let form = EventForm;

        if (req.method == "POST") {
            let messages: Array<string> = [];
            let model = new EventModel(req);

            this.logger.trace('creating event... user_id:' , req.body.user_id);
            model.updateFromArray(req.body, (err, result) => {
                this.logger.debug('create event result...', result);
                if (err) {
                    this.logger.error('create event fail. err:', err);
                    messages.push('登録できませんでした');
                    res.json({
                        isSuccess: false,
                        messages: messages
                    });
                } else {
                    res.json({
                        isSuccess: true,
                        messages: messages
                    });
                }
            });
        } else {
            res.render('event/new', {
                form: form
            });
        }
    }

    public edit(req: any, res: any, next: any): void {
        // $messages = [];
        // $defaults = [
        //     'id' => '',
        //     'email' => '',
        //     'user_id' => '',
        //     'password' => '',
        //     'held_from' => date('Y-m-d H:00', strtotime('+24 hours')),
        //     'held_to' => date('Y-m-d H:00', strtotime('+26 hours')),
        //     'place' => '',
        //     'remarks' => '',
        // ];

        // if ($this->dispatcher->getParam('id')) {
        //     try {
        //         $eventModel = new EventModel;
        //         $defaults = array_merge($defaults, $eventModel->getById($this->dispatcher->getParam('id')));
        //         $defaults['held_from'] = date('Y-m-d H:00', strtotime($defaults['held_from']));
        //         $defaults['held_to'] = date('Y-m-d H:00', strtotime($defaults['held_to']));
        //     } catch (\Exception $e) {
        //         $this->logger->addError("getById throw exception. message:{$e}");
        //         throw $e;
        //     }
        // }

        // $this->view->messages = $messages;
        // $this->view->defaults = $defaults;
        res.render('event/edit', {});
    }

    public update(req: any, res: any, next: any): void {
        // $this->response->setHeader('Content-type', 'application/json');

        // $isSaved = false;
        // $messages = [];
        // $defaults = [
        //     'id' => '',
        //     'email' => '',
        //     'user_id' => '',
        //     'password' => '',
        //     'held_from' => '',
        //     'held_to' => '',
        //     'place' => '',
        //     'remarks' => '',
        // ];

        // $eventModel = new EventModel;
        // $this->logger->addDebug(print_r($_POST, true));
        // $defaults = array_merge($defaults, $_POST);

        // // 重複チェック
        // if (!$defaults['email']) {
        //     $messages[] = 'メールアドレスを入力してください';
        // } else {
        //     if ($eventModel->isDuplicateByEmail($defaults['id'], $defaults['email'])) {
        //         $messages[] = 'メールアドレスが重複しています';
        //     }
        // }
        // if (!$defaults['user_id']) {
        //     $messages[] = 'ユーザIDを入力してください';
        // } else {
        //     if ($eventModel->isDuplicateByUserId($defaults['id'], $defaults['user_id'])) {
        //         $messages[] = 'ユーザIDが重複しています';
        //     }
        // }
        // if (!$defaults['password']) {
        //     $messages[] = 'パスワードを入力してください';
        // }
        // if (!$defaults['held_from'] || !$defaults['held_to']) {
        //     $messages[] = '上映日時を正しく入力してください';
        // }
        // if (!$defaults['place']) {
        //     $messages[] = '上映場所を入力してください';
        // }

        // if (empty($messages)) {
        //     try {
        //         $eventModel = new EventModel;
        //         if ($eventModel->updateFromArray($defaults)) {
        //             $isSaved = true;
        //         }
        //     } catch (\Exception $e) {
        //         $this->logger->addDebug(print_r($e, true));
        //         $messages[] = "エラーが発生しました {$e->getMessage()}";
        //     }
        // }

        // echo json_encode([
        //     'isSuccess' => $isSaved,
        //     'messages' => $messages,
        // ]);

        // return false;
    }

    public medias(req: any, res: any, next: any): void {
        let event: Object;
        let medias: Array<any> = [];
        let application: Object;

        let applicationModel = new ApplicationModel(req);
        let eventModel = new EventModel(req);
        let mediaModel = new MediaModel(req);

        eventModel.getById(req.params.id, (err, rows, fields) => {
            this.logger.debug('err:', err);
            this.logger.debug('rows:', rows);
            event = rows[0];

            mediaModel.getListByEventId(req.params.id, (err, rows, fields) => {
                this.logger.debug('err:', err);
                this.logger.debug('rows:', rows);
                    medias = rows;

                applicationModel.getByEventId(req.params.id, (err, rows, fields) => {
                    this.logger.debug('err:', err);
                    this.logger.debug('rows:', rows);
                    application = rows[0];

                    res.render('event/medias', {
                        event: event,
                        medias: rows,
                        application: application
                    });
                });
            });
        });
    }
}