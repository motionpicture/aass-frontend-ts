import ams = require('node-ams-sdk');
import conf = require('config');

export default function (req, res, next) {
    if (req.mediaService) next();

    req.mediaService = new ams({
        client_id: conf.get<string>('media_service_account_name'),
        client_secret: conf.get<string> ('media_service_account_key')
    });

    next();
};
