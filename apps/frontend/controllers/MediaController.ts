import BaseController from './BaseController';
import MediaModel from '../models/MediaModel';
import path = require('path');
import fs = require('fs')

export default class MediaController extends BaseController
{
    public list(req: any, res: any, next: any): void {
        let model = new MediaModel(req);
        model.getListByEventId(req.user.getId(), function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }

            req.logger.info('rows count:' + rows.length);
            res.render('media/index', {
                medias: rows
            });
        });
    }

    public create(req: any, res: any, next: any): void {
        if (req.method == "POST") {
            let isSuccess = false;
            let messages = [];
            let params = req.body;
            params.id = '';
            params.event_id = req.user.getId();

            try {
                let model = new MediaModel(req);
                model.insert(params, function(err, result) {
                    req.logger.debug(result);
                    if (err) {
                        req.logger.error('insert media fail. err:', err);
                        messages.push('動画を登録できませんでした');
                        throw err;
                    } else {
                        isSuccess = true;
                    }

                    res.json({
                        isSuccess: isSuccess,
                        messages: messages
                    });
                });
            } catch (e) {
                req.logger.error('insert media throw exception. e:', e);
                messages.push(e.message);
                res.json({
                    isSuccess: isSuccess,
                    messages: messages
                });
            }
        } else {
            res.render('media/edit');
        }
    }

    public createAsset(req: any, res: any, next: any): void {
        let isSuccess = false;
        let messages = [];
        let params = {};

        let uniqid = require('uniqid');
        let filename = req.user.getUserId() + uniqid();

        // アセット作成	
        req.mediaService.setToken(function (err) {
            if (err) throw err;

            req.logger.debug('creating asset... name:', filename);
            req.mediaService.createAsset({
                Name: filename
            }, function (error, response) {
                if (error) throw error;
                req.logger.debug('createAsset result...');

                let data = JSON.parse(response.body);
                if (!data.error) {
                    let asset = data.d;
                    params = {
                        assetId: asset.Id,
                        container: path.basename(asset.Uri),
                        filename: filename
                    };

                    isSuccess = true;
                    req.logger.debug(params);
                } else {
                    messages.push(data.error.message.value);
                }

                res.json({
                    isSuccess: isSuccess,
                    messages: messages,
                    params: params
                });
            });
        });
    }

    public appendFile(req: any, res: any, next: any): void {
        let isSuccess = false;
        let messages = [];
        let params = req.body;
        let file = req.files[0];
        req.logger.debug('content size:' + file.buffer.length);

        let end = false;
        let counter = 0;
        let body = '';
        let container = params.container;
        let blob = params.filename + '.' + params.extension;
        let content = file.buffer;
        let blockSize = 4194304;
        let blockIdCount = Math.ceil(content.length / blockSize);
        let createdBlockIds = [];
        let blockId;

        while (!end) {
            let readPos = blockSize * counter;
            let endPos = readPos + blockSize;
            if (endPos >= content.length) {
                endPos = content.length;
                end = true;
            }

            body = content.slice(readPos, endPos);
            req.logger.debug('body size:' + body.length);

            blockId = this.generateBlockId(parseInt(params.index) + counter);
            req.logger.debug('blockId:' + blockId);

            // ブロブブロック作成
            req.blobService.createBlockFromText(blockId, container, blob, body, {}, function(error)
            {
                if (error) throw error;
                req.logger.info('createBlockFromText result... blockId:' + blockId);
                req.logger.info(error);
                createdBlockIds.push(blockId);

                if (createdBlockIds.length == blockIdCount) {
                    isSuccess = true;

                    res.json({
                        isSuccess: isSuccess,
                        messages: messages
                    });
                }
            });

            counter++;
        }
    }

    public commitFile(req: any, res: any, next: any): void {
        let isSuccess = false;
        let messages = [];
        let params = req.body;
        req.logger.debug(params);

        let container = params.container;
        let blob = params.filename + '.' + params.extension;
        let blockList = [];
        for (let i = 0; i < params.blockCount; i++) {
            blockList.push(this.generateBlockId(i));
        }

        // コミット
        req.blobService.commitBlocks(container, blob, {LatestBlocks: blockList}, {}, function(error, blocklist, response)
        {
            req.logger.info('commitBlocks result...');
            req.logger.info(error);
            req.logger.info('commitBlocks statusCode:' + response.statusCode);

            if (!error && response.isSuccessful) {
                // アセットメタデータ作成
                req.mediaService.getAssetMetadata(params.asset_id, function(error, response)
                {
                    req.logger.info('getAssetMetadata statusCode:' + response.statusCode);
                    isSuccess = true;

                    res.json({
                        isSuccess: isSuccess,
                        messages: messages
                    });
                });
            }
        });
    }

    private generateBlockId(blockCount: Number): string {
        let strPadLeft = String(blockCount);
        while (strPadLeft.length < 6) {
            strPadLeft = '0' + strPadLeft;
        }

        return new Buffer('block-' + strPadLeft).toString('base64');
    }

    public edit(req: any, res: any, next: any): void {
    }

    public delete(req: any, res: any, next: any): void {
        let isSuccess = false;
        let messages = [];

        req.logger.debug('deleting media... id:', req.params.id);

        try {
            let model = new MediaModel(req);
            model.deleteById(req.params.id, function(err, result) {
                req.logger.debug('delete result...', result);
                if (err) {
                    req.logger.error('delete media fail. err:', err);
                    messages.push('削除できませんでした');
                } else {
                    isSuccess = true;
                }

                res.json({
                    isSuccess: isSuccess,
                    messages: messages
                });
            });
        } catch (e) {
            req.logger.error('delete media throw exception. e:', e);
            messages.push(e.message);
            res.json({
                isSuccess: isSuccess,
                messages: messages
            });
        }
    }

    public download(req: any, res: any, next: any): void {
    }

    public apply(req: any, res: any, next: any): void {
    }
}
