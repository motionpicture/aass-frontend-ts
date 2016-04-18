import ams = require('node-ams-sdk');
import conf = require('config');

// カスタム
ams.prototype.getJobOutputMediaAssets = function ( jobId, cb ) {
  var params = { id : jobId, secondEndpoint: 'OutputMediaAssets' }
  return this.request.get('Jobs', params, cb)
}

ams.prototype.ACCESS_POLICY_PERMISSIONS_NONE = 0; // The access rights the client has when interacting with the Asset. (None)
ams.prototype.ACCESS_POLICY_PERMISSIONS_READ = 1; // The access rights the client has when interacting with the Asset. (Read)
ams.prototype.ACCESS_POLICY_PERMISSIONS_WRITE = 2; // The access rights the client has when interacting with the Asset.
ams.prototype.ACCESS_POLICY_PERMISSIONS_DELETE = 4; // The access rights the client has when interacting with the Asset.
ams.prototype.ACCESS_POLICY_PERMISSIONS_LIST = 8; // The access rights the client has when interacting with the Asset. (List)

ams.prototype.LOCATOR_TYPE_NONE = 0;
ams.prototype.LOCATOR_TYPE_SAS = 1;
ams.prototype.LOCATOR_TYPE_ON_DEMAND_ORIGIN = 2;

ams.prototype.JOB_STATE_QUEUED = 0; // The state of the job "queued"
ams.prototype.JOB_STATE_SCHEDULED = 1; // The state of the job "scheduled"
ams.prototype.JOB_STATE_PROCESSING = 2; // The state of the job "processing"
ams.prototype.JOB_STATE_FINISHED = 3; // The state of the job "finished"
ams.prototype.JOB_STATE_ERROR = 4; // The state of the job "error"
ams.prototype.JOB_STATE_CANCELED = 5; // The state of the job "canceled"
ams.prototype.JOB_STATE_CANCELING = 6; // The state of the job "canceling"

let mediaService = new ams({
    client_id: conf.get<string>('media_service_account_name'),
    client_secret: conf.get<string> ('media_service_account_key'),
    // Provides standard capabilities for on-demand encoding. See http://aka.ms/mestandard for more details
    // Media Encoder Standard
    MediaProcessorId: "nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56"
});

export default mediaService;