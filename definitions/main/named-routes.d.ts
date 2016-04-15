declare module "named-routes" {

    var n: n.INamedRoutes;

    namespace n {
        interface INamedRoutes {
            (options: Object): void;
        }
    }

    export = n;
}