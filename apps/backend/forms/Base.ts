import forms = require('forms');

export default class Base {
    protected forms;
    protected options;

    constructor() {
        this.forms = forms;
        this.options = {
            validatePastFirstError: true
        };
    }
}