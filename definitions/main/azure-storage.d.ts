declare module "azure-storage" {
    export function createBlobService(): any;
    export function createBlobService(connectionString: string): any;
    export function createBlobService(storageAccount: string, storageAccessKey: string, host?: string, authenticationProvider?: string): any;

    export function createFileService(): any;
    export function createFileService(connectionString: string): any;
    export function createFileService(storageAccount: string, storageAccessKey: string, host?: string, authenticationProvider?: string): any;
}