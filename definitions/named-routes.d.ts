declare module "named-routes" {

    var n: n.INamedRoutes;

    namespace n {
        interface INamedRoutes {
            (options: Object): void;
            extendExpress(app: any): this;
            registerAppHelpers(app: any): this;
        }
    }

    export = n;
}