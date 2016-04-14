declare module "forms" {

    var f: f.IForms;

    namespace f {
        interface IForms {
            // (fields: Array<any>, options: Object): Object;
            widgets: any;
            fields: any;
            render: any;
            validators: any;
            create(fields, options?): Object;
        }
    }

    export = f;
}