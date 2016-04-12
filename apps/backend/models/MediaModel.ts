import BaseModel from './BaseModel';
import Constants from '../../common/modules/Constants';

export default class MediaModel extends BaseModel
{
    public getListByEventId(eventId: string, cb: Function): void {
        let query = 'SELECT * FROM media WHERE event_id = :eventId AND status <> :status';
        let queryParams = {
            eventId: eventId,
            status: Constants.MEDIA_STATUS_DELETED
        };

        this.query(query, queryParams, cb);
    }
}
