import ams = require('node-ams-sdk');
import conf = require('config');

let mediaService = new ams({
    client_id: conf.get<string>('media_service_account_name'),
    client_secret: conf.get<string> ('media_service_account_key'),
    // Provides standard capabilities for on-demand encoding. See http://aka.ms/mestandard for more details
    // Media Encoder Standard
    MediaProcessorId: "nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56"
});

export default mediaService;