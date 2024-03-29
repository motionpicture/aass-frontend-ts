import Base from './Base';
import moment = require('moment');

class Event extends Base {
    public create(): any {
        let fields = this.forms.fields;
        let validators = this.forms.validators;
        let widgets = this.forms.widgets;

        let widgetPassword = widgets.password();
        widgetPassword.formatValue = function (value) {
            return (value || value === 0) ? value : null;
        };

        let form = this.forms.create(
            {
                id: fields.string({
                    label: 'ID',
                    widget: widgets.hidden(),
                    required: false,
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
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
                password: fields.string({
                    label: 'パスワード',
                    widget: widgetPassword,
                    required: validators.required('パスワードが未入力です'),
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                password_confirm: fields.string({
                    label: 'パスワード再入力',
                    widget: widgetPassword,
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
                    value: moment().format('YYYY-MM-DD HH:00'),
                    hideError: true
                }),
                held_to: fields.string({
                    label: '上映日時',
                    widget: widgets.hidden(),
                    required: validators.required('上映日時が未入力です'),
                    validators: [
                    ],
                    id: '',
                    value: moment().add(2, 'hour').format('YYYY-MM-DD HH:00'), // 2 hour in the future
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
                remarks: fields.string({
                    label: '備考',
                    widget: widgets.textarea(),
                    validators: [
                    ],
                    id: '',
                    hideError: true
                })
            },
            this.options
        );

        return form;
    }
}

export default new Event().create();