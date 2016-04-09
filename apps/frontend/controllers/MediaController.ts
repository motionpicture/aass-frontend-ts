import BaseController from './BaseController';
import MediaModel from '../models/MediaModel';
import path = require('path');
import fs = require('fs')

export default class MediaController extends BaseController
{
    list(req, res, next)
    {
        var model = new MediaModel(req);
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

    create(req, res, next)
    {
        if (req.method == "POST") {
            var isSuccess = false;
            var messages = [];
            var params = req.body;
            params.id = '';
            params.event_id = req.user.getId();

            try {
                var model = new MediaModel(req);
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

    createAsset(req, res, next) {
        var isSuccess = false;
        var messages = [];
        var params = {};

        var uniqid = require('uniqid');
        var filename = req.user.getUserId() + uniqid();

        // アセット作成	
        req.mediaService.setToken(function (err) {
            if (err) throw err;

            req.logger.debug('creating asset... name:' + filename);
            req.mediaService.createAsset({
                Name: filename
            }, function (error, response) {
                if (error) throw error;
                req.logger.debug('createAsset result...');

                var data = JSON.parse(response.body);
                if (!data.error) {
                    var asset = data.d;
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

    appendFile(req, res, next)
    {
        var isSuccess = false;
        var messages = [];
        var params = req.body;
        var file = req.files[0];
        req.logger.debug('content size:' + file.buffer.length);

        var end = false;
        var counter = 0;
        var body = '';
        var container = params.container;
        var blob = params.filename + '.' + params.extension;
        var content = file.buffer;
        var blockSize = 4194304;
        var blockIdCount = Math.ceil(content.length / blockSize);
        var createdBlockIds = [];
        var blockId;

        while (!end) {
            var readPos = blockSize * counter;
            var endPos = readPos + blockSize;
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

    commitFile(req, res, next)
    {
        var isSuccess = false;
        var messages = [];
        var params = req.body;
        req.logger.debug(params);

        var container = params.container;
        var blob = params.filename + '.' + params.extension;
        var blockList = [];
        for (var i = 0; i < params.blockCount; i++) {
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

    generateBlockId(blockCount)
    {
        var strPadLeft = String(blockCount);
        while (strPadLeft.length < 6) {
            strPadLeft = '0' + strPadLeft;
        }

        return new Buffer('block-' + strPadLeft).toString('base64');
    }

    edit(req, res, next)
    {
    }

    delete(req, res, next)
    {
        var isSuccess = false;
        var messages = [];

        req.logger.debug('deleting media... id:', req.params.id);

        try {
            var model = new MediaModel(req);
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

    download(req, res, next)
    {
    }

    apply(req, res, next)
    {
    }
}
