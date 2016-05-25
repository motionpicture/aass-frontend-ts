declare module "node-ams-sdk" {

    interface IAzureMediaService {
        (config: any): void;
        setToken(cb: Function): void;
        listMediaProcessors(cb: Function): void;
        getAsset(assetId: string, query?: Object, cb?: Function): void;
        listAssets(query?: Object, cb?: Function): void;
        createAsset(data?: Object, cb?: Function): void;
        updateAsset(assetId: string, data?: Object, cb?: Function): void;
        removeAsset(assetId: string, cb: Function): void;
        getAssetMetadata(assetId: string, cb: Function): void;
        listAssetFiles(assetId: string, cb: Function): void;
        getFile(fileId: string, cb: Function): void;
        listFiles(cb: Function): void;
        listLocators(cb: Function): void;
        getLocator(locatorId: string, cb: Function): void;
        listAssetLocators(assetId: string, cb: Function): void;
        createLocator(data: Object, cb: Function): void;
        updateLocator(locatorId: string, data: Object, cb: Function): void;
        removeLocator(locatorId: string, cb: Function): void;
        listAccessPolicies(cb: Function): void;
        getAccessPolicy(accessPolicyId: string, cb: Function): void;
        listAssetAccessPolicies(assetId: string, cb: Function): void;
        createAccessPolicy(data, cb: Function): void;
        removeAccessPolicy(accessPolicyId: string, cb: Function): void;
        _buildTaskXML(options: Object, inc: number): string;
        createEncodingJob(assetId: string, options, cb: Function): void;
        createMultiTaskJob(assetId: string, options, cb: Function): void;
        getJob(jobId: string, cb: Function): void;
        getJobStatus(jobId: string, cb: Function): void;
        getJobTasks(jobId: string, cb: Function): void;
        getTaskOutput(taskId: string, cb: Function): void;
        getNotificationEndpoint(endpointI: string, cb: Function): void;
        listNotificationEndpoints(cb: Function): void;
        createNotificationEndpoint(data: Object, cb: Function): void;
        updateNotificationEndpoint(endpointId: string, data: Object, cb: Function): void;
        removeNotificationEndpoint(endpointId: string, cb: Function): void;
    }

    var ams: IAzureMediaService;
    export = ams;
}