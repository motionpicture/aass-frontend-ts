import Base from './Base';

class Media extends Base {
    public create(): any {
        let fields = this.forms.fields;
        let validators = this.forms.validators;
        let widgets = this.forms.widgets;

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
                asset_id: fields.string({
                    label: 'アセットID',
                    widget: widgets.hidden(),
                    required: true,
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                filename: fields.string({
                    label: 'ファイル名',
                    widget: widgets.hidden(),
                    required: true,
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                extension: fields.string({
                    label: '拡張子',
                    widget: widgets.hidden(),
                    required: true,
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                size: fields.string({
                    label: 'サイズ',
                    widget: widgets.hidden(),
                    required: true,
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                title: fields.string({
                    label: '動画名',
                    required: validators.required('動画名が未入力です'),
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                description: fields.string({
                    label: '動画概要',
                    required: validators.required('動画概要が未入力です'),
                    widget: widgets.textarea(),
                    validators: [
                    ],
                    id: '',
                    hideError: true
                }),
                uploaded_by: fields.string({
                    label: '動画登録者名',
                    required: validators.required('動画登録者名が未入力です'),
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

export default new Media().create();