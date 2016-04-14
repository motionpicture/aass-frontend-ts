declare module "node-datetime" {

    var dt: dt.INodeDatetime;

    namespace dt {
        interface INodeDatetime {
            create(now?: any, defaultFormat?: any): any;
        }
    }

    export = dt;
}