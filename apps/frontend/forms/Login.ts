import Base from './Base';

class Login extends Base {
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
                auto_login: fields.boolean({
                    label: '利用規約に同意の上ログイン',
                    widget: widgets.checkbox(),
                    required: false,
                    validators: [
                    ],
                    id: 'autoLogin',
                    hideError: true
                })
            },
            this.options
        );

        return form;
    }
}

export default new Login().create();