import Base from './Base';
import datetime = require('node-datetime');

class Event extends Base {
    public create(): any {
        let fields = this.forms.fields;
        let validators = this.forms.validators;
        let widgets = this.forms.widgets;

        let dt2hourslater = datetime.create();
        dt2hourslater.offsetInHours(2); // 2 hour in the future

        let form = this.forms.create(
            {
                email: fields.string({
                    label: '申請者メールアドレス',
                    required: validators.required('申請者メールアドレスが未入力です'),
                    validators: [
                        validators.email('申請者メールアドレスが無効です')
                    ],
                    id: '',
                    hideError: true
                }),
                user_id: fields.string({
                    label: 'ユーザーID',
                    required: validators.required('ユーザーIDが未入力です'),
                    validators: [
                        validators.alphanumeric('ユーザーIDは英数字で入力してください')
                    ],
                    id: '',
                    hideError: true
                }),
                password: fields.password({
                    label: 'パスワード',
                    required: validators.required('パスワードが未入力です'),
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                password_confirm: fields.password({
                    label: 'パスワード再入力',
                    required: validators.required('パスワード再入力が未入力です'),
                    validators: [
                        validators.matchField('password', 'パスワードが一致していません')
                    ],
                    id: '',
                    hideError: true
                }),
                held_from: fields.string({
                    label: '上映日時',
                    widget: widgets.hidden(),
                    required: validators.required('上映日時が未入力です'),
                    validators: [
                    ],
                    id: '',
                    value: datetime.create().format('Y-m-d H:00'),
                    hideError: true
                }),
                held_to: fields.string({
                    label: '上映日時',
                    widget: widgets.hidden(),
                    required: validators.required('上映日時が未入力です'),
                    validators: [
                    ],
                    id: '',
                    value: dt2hourslater.format('Y-m-d H:00'),
                    hideError: true
                }),
                place: fields.string({
                    label: '上映場所',
                    required: validators.required('上映場所が未入力です'),
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                remarks: fields.password({
                    label: '',
                    widget: widgets.textarea(),
                    validators: [
                    ],
                    id: '',
                    hideError: true
                })
            },
            this.options
        );

        // form.fields.held_from.bind('2016-04-14 12:00:00');

        return form;
    }
}

export default new Event().create();