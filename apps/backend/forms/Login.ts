import Base from './Base';

class Login extends Base {
    public create(): any {
        let fields = this.forms.fields;
        let validators = this.forms.validators;

        let form = this.forms.create(
            {
                user_id: fields.string({
                    label: '',
                    required: validators.required('ユーザーIDが未入力です'),
                    validators: [
                        validators.alphanumeric('ユーザーIDは英数字で入力してください')
                    ],
                    id: '',
                    hideError: true
                }),
                password: fields.password({
                    label: '',
                    required: validators.required('パスワードが未入力です'),
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

export default new Login().create();