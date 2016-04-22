import Base from './Base';
import MediaModel from '../models/Media';

export default class Media extends Base {
    public encode2jpeg2000(req: any, res: any, next: any): void {
        let model = new MediaModel();
        model.getById(req.params.id, (err, rows) => {
            if (err) throw err;

            let media = rows[0];
            let source = media.url_origin;
            let share = MediaModel.AZURE_FILE_SHARE_NAME_JPEG2000_ENCODED;
            let target = media.filename + '.' + media.extension;

            // Fileへコピー
            req.fileService.startCopyFile(source, share, '', target, {}, (error, result, response) => {
                if (error) throw error;

                this.logger.trace('startCopyFile result:', result);
                this.logger.trace('changing status to copied... id:', media.id);
                model.updateStatus(media.id, MediaModel.STATUS_JPEG2000_READY, (err, result) => {
                    if (err) throw err;

                    this.logger.trace('status changed to STATUS_JPEG2000_READY. id:', media.id);

                    res.json({
                        isSuccess: true,
                        messages: []
                    });
                });
            });
        });
    }

    /**
     * ダウンロード
     */
    public download(req: any, res: any, next: any): void {
        let model = new MediaModel();
        model.getById(req.params.id, (err, rows) => {
            if (err) throw err;

            let media = rows[0];
            let filename = media.filename + '.' + media.extension;
            let uri = media.url_origin;

            res.attachment(filename);
            res.set('Content-Type', 'application/octet-stream');

            let https = require('https');
            https.get(uri, (response) => {
                response.on('data', (chunk) => {
                    res.write(chunk);
                });

                response.on('end', () => {
                    res.end();
                });
            })
            .on('error', (e) => {
                next(e);
            });
        });
    }
}