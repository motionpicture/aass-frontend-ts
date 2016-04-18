//http://azure.github.io/azure-storage-node/index.html
import azure = require('azure-storage');
import conf = require('config');

let azureFileService = azure.createFileService(
    conf.get<string>('storage_account_name'),
    conf.get<string>('storage_account_key')
);

export default azureFileService;