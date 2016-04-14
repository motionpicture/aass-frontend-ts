import Base from './Base';

class Event extends Base {
    public create(): any {
        let fields = this.forms.fields;
        let validators = this.forms.validators;
        let widgets = this.forms.widgets;

        let form = this.forms.create(
            {
                email: fields.email({
                    label: '申請者メールアドレス',
                    required: validators.required('申請者メールアドレスが未入力です'),
                    validators: [
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
                    hideError: true
                }),
                held_to: fields.string({
                    label: '上映日時',
                    widget: widgets.hidden(),
                    required: validators.required('上映日時が未入力です'),
                    validators: [
                    ],
                    id: '',
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
console.log(form.fields.held_from);
        form.fields.held_from.bind('2016-04-14 12:00:00');

        return form;
    }
}

export default new Event().create();