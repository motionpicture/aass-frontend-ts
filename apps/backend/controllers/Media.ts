import Base from './Base';
import MediaModel from '../models/Media';

export default class Media extends Base {
    public encode2jpeg2000(req: any, res: any, next: any): void {
        let model = new MediaModel();
        model.getById(req.params.id, (err, rows) => {
            if (err) throw err;

            let media = rows[0];
            let source = media.url_mp4;
            let share = MediaModel.AZURE_FILE_SHARE_NAME_JPEG2000_ENCODED;

            // Fileへコピー
            req.fileService.startCopyFile(source, share, '', media.filename + '.mp4', {}, (error, result, response) => {
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
            let filename = media.filename + '.mp4';

            // let request = require('request');
            // request({ uri: media.url_mp4, encoding: null }, function (error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         res.attachment(filename);
            //         res.set('Content-Type', 'application/octet-stream');
            //         res.send(body);
            //     } else {
            //         next(error);
            //     }
            // });

            res.attachment(filename);
            res.set('Content-Type', 'application/octet-stream');

            let https = require('https');
            https.get(media.url_mp4, (response) => {
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