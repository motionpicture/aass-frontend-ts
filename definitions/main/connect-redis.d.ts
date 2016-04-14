declare module "connect-redis" {

    var r: c.IConnectRedis;

    namespace c {

        // see https://github.com/lorenwest/node-config/wiki/Using-Config-Utilities
        // interface IUtil {
        //     extendDeep(mergeInto: any, mergeFrom: any, depth?: number): any;
        //     cloneDeep(copyFrom: any, depth?: number): any;
        //     equalsDeep(object1: any, object2: any, dept?: number): boolean;
        //     diffDeep(object1: any, object2: any, depth?: number): any;
        // }

        interface IConnectRedis {
            (session: any): any;
            // get(setting: string): any;
            // has(setting: string): boolean;
            // util: IUtil;
        }
    }

    export = r;
}