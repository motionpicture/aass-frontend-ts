//http://azure.github.io/azure-storage-node/index.html
import azure = require('azure');
import conf = require('config');

export default function (req, res, next) {
    if (req.blobService) next();

    req.blobService = azure.createBlobService(
        conf.get<string>('storage_account_name'),
        conf.get<string>('storage_account_key')
    );

    next();
};
