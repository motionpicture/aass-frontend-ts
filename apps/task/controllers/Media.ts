import Base from './Base';
import MediaModel from '../models/Media';
import azureMediaService from '../../common/modules/azureMediaService';
import azureFileService from '../../common/modules/azureFileService';
import azureStorage = require('azure-storage');
import conf = require('config');
import datetime = require('node-datetime');
import fs = require('fs');
import util = require('util');

export default class Media extends Base
{
    /**
     * エンコード処理を施す
     */
    public encode(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_ASSET_CREATED, 10, (err, rows) => {
            if (err) throw err;

            this.logger.trace('medias:', rows);
            azureMediaService.setToken((err) => {
                if (err) throw err;

                let i = 0;
                let next = () => {
                    i++;
                    if (i > rows.length) {
                        process.exit(0);
                    }

                    let media = rows[i - 1];
                    this.logger.debug('creating job...media.id:', media.id);
                    let assetId  = media.asset_id;
                    let options = {
                        Name: 'AassJob[' + media.filename + ']',
                        Tasks: this.getTasks(media.filename)
                    };

                    // ジョブ作成
                    azureMediaService.createMultiTaskJob(assetId, options, (error, response) => {
                        this.logger.debug('error:', error);
                        this.logger.debug('response body:', response.body);
                        if (error) throw error;

                        let job = JSON.parse(response.body).d;

                        // メディアにジョブを登録
                        this.logger.trace('job created. job:', job);
                        model.addJob(media.id, job.Id, job.State, (err, result) => {
                            if (err) throw err;

                            this.logger.trace('media added job. id:', media.id, ' / result:', result);
                            next();
                        });
                    });
                }

                next();
            });
        });
    }

    private getTasks(filename): Array<any> {
        let task;
        let tasks = [];

        // thumbnail task
        let config = fs.readFileSync(__dirname + '/../../../config/thumbnailConfig.json').toString();
        task = {
            Configuration: config,
            OutputAssetName: 'AassMediaAsset[' + filename + '][thumbnails]'
        };
        tasks.push(task);

        // single bitrate mp4 task
        task = {
            Configuration: 'H264 Single Bitrate 1080p',
            OutputAssetName: 'AassMediaAsset[' + filename + '][H264SingleBitrate1080p]',
        };
        tasks.push(task);

        // adaptive bitrate mp4 task
        task = {
            Configuration: 'H264 Multiple Bitrate 1080p',
            OutputAssetName: 'AassMediaAsset[' + filename + '][H264MultipleBitrate1080p]',
        };
        tasks.push(task);

        return tasks;
    }

    public getTaskProgress(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JOB_CREATED, 10, (err, rows) => {
            if (err) throw err;

            this.logger.trace('medias:', rows);
            azureMediaService.setToken((err) => {
                if (err) throw err;

                let i = 0;
                let next = () => {
                    i++;
                    if (i > rows.length) {
                        process.exit(0);
                    }

                    let media = rows[i - 1];

                    this.logger.trace('getting job...media.id:', media.id);
                    let assetId  = media.asset_id;
                    let options = {
                        Name: 'AassJob[' + media.filename + ']',
                        Tasks: this.getTasks(media.filename)
                    };

                    azureMediaService.getJobTasks(media.job_id, (error, response) => {
                        if (error) throw error;

                        let tasks = JSON.parse(response.body).d.results;
                        this.logger.trace('job task1 progress:', tasks[0].Progress);
                        this.logger.trace('job task2 progress:', tasks[1].Progress);
                        this.logger.trace('job task3 progress:', tasks[2].Progress);

                        let progresses = {
                            thumbnail: Math.floor(tasks[0].Progress),
                            mp4: Math.floor(tasks[1].Progress),
                            streaming: Math.floor(tasks[2].Progress)
                        };

                        this.logger.trace('updating tasks progress... id:', media.id);
                        model.updateTaskProgress(media.id, progresses, (err, result) => {
                            if (err) throw err;

                            this.logger.trace('tasks progress updated. id:', media.id, ' / result:', result);
                            next();
                        });
                    });
                }

                next();
            });
        });
    }

    public checkJob(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JOB_CREATED, 10, (err, rows) => {
            if (err) throw err;

            this.logger.trace('medias:', rows);
            azureMediaService.setToken((err) => {
                if (err) throw err;

                let i = 0;
                let next = () => {
                    i++;
                    if (i > rows.length) {
                        process.exit(0);
                    }

                    let media = rows[i - 1];

                    this.logger.trace('getting job state...media.id:', media.id);
                    azureMediaService.getJobStatus(media.job_id, (error, response) => {
                        if (error) throw error;

                        let job = JSON.parse(response.body).d;
                        this.logger.trace('job exists. job:', job);

                        // ジョブのステータスを更新
                        if (media.job_state != job.State) {
                            let state: number = job.State;
                            this.logger.trace('job state change. new state:', state);

                            // ジョブが完了の場合、URL発行プロセス
                            if (state == azureMediaService.JOB_STATE_FINISHED) {
                                // ジョブに関する情報更新と、URL更新
                                this.logger.trace('changing status to STATUS_JOB_FINISHED... id:', media.id);
                                model.updateJobState(media.id, state, MediaModel.STATUS_JOB_FINISHED, (err, result) => {
                                    if (err) throw err;
                                    this.logger.trace('status changed. id:', media.id, ' / result:', result);
                                    next();
                                });
                            } else if (state == azureMediaService.JOB_STATE_ERROR || state == azureMediaService.JOB_STATE_CANCELED) {
                                this.logger.trace("changing status to STATUS_ERROR... id:", media.id);
                                model.updateJobState(media.id, state, MediaModel.STATUS_ERROR, (err, result) => {
                                    next();
                                });
                            } else {
                                model.updateJobState(media.id, state, MediaModel.STATUS_JOB_CREATED, (err, result) => {
                                    next();
                                });
                            }
                        } else {
                            next();
                        }
                    });
                }

                next();
            });
        });
    }

    public publish(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JOB_FINISHED, 10, (err, rows) => {
            if (err) throw err;

            this.logger.trace('medias count:', rows.length);
            azureMediaService.setToken((err) => {
                if (err) throw err;

                let i = 0;
                let next = () => {
                    i++;
                    if (i > rows.length) {
                        process.exit(0);
                    }

                    let media = rows[i - 1];
                    // ジョブが完了の場合、URL発行プロセス
                    if (media.job_state == azureMediaService.JOB_STATE_FINISHED) {
                        azureMediaService.getJobOutputMediaAssets(media.job_id, (error, response) => {
                            if (error) throw error;

                            let outputMediaAssets = JSON.parse(response.body).d.results;
                            this.logger.trace('outputMediaAssets:', outputMediaAssets);

                            if (outputMediaAssets.length > 0) {
                                let urls: any = {};

                                this.createUrlOrigin(media.asset_id, media.filename, media.extension, (error, url) => {
                                    if (error) throw error;

                                    urls.origin = url;

                                    this.createUrlThumbnail(outputMediaAssets[0].Id, media.filename, (error, url) => {
                                        if (error) throw error;

                                        urls.thumbnail = url;

                                        this.createUrlMp4(outputMediaAssets[1].Id, media.filename, (error, url) => {
                                            if (error) throw error;

                                            urls.mp4 = url;

                                            this.createUrl(outputMediaAssets[2].Id, media.filename, (error, url) => {
                                                if (error) throw error;

                                                urls.streaming = url;

                                                // URL更新
                                                this.logger.trace('urls created. urls:', urls);
                                                this.logger.trace('publishing... id:', media.id);
                                                model.publish(media.id, urls, (err, result) => {
                                                    if (err) throw err;

                                                    this.logger.trace('published. id:', media.id, ' / result:', result);
                                                    // TODO URL通知
                                                    // if (!is_null(url)) {
                                                    //     this->sendEmail(media);
                                                    // }

                                                    next();
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                }

                next();
            });
        });
    }

    private createUrlOrigin(assetId, filename, extension, cb): void {
        // 読み取りアクセス許可を持つAccessPolicyの作成
        azureMediaService.createAccessPolicy({
            Name: 'OriginPolicy',
            DurationInMinutes: 25920000,
            Permissions: azureMediaService.ACCESS_POLICY_PERMISSIONS_READ
        }, (error, response) => {
            if (error) throw error;

            let accessPolicy = JSON.parse(response.body).d;
            this.logger.trace('accessPolicy:', accessPolicy);

            // 元ファイル用のURL作成
            let d = new Date();
            d.setMinutes(d.getMinutes() - 5);
            let startTime = d.toISOString();
            azureMediaService.createLocator({
                AccessPolicyId: accessPolicy.Id,
                AssetId: assetId,
                StartTime: startTime,
                Type: azureMediaService.LOCATOR_TYPE_SAS,
                Name: 'OriginLocator_' + assetId
            }, (error, response) => {
                if (error) throw error;

                let locator = JSON.parse(response.body).d;
                this.logger.trace('locator:', locator);

                // URLを生成
                let url = util.format(
                    '%s/%s.%s%s',
                    locator.BaseUri,
                    filename,
                    extension,
                    locator.ContentAccessComponent
                );
                this.logger.trace('origin url created. url:', url);

                cb(null, url);
            });
        });
    }

    private createUrlThumbnail(assetId, filename, cb): void {
        // 読み取りアクセス許可を持つAccessPolicyの作成
        azureMediaService.createAccessPolicy({
            Name: 'ThumbnailPolicy',
            DurationInMinutes: 25920000,
            Permissions: azureMediaService.ACCESS_POLICY_PERMISSIONS_READ
        }, (error, response) => {
            if (error) throw error;

            let accessPolicy = JSON.parse(response.body).d;
            this.logger.trace('accessPolicy:', accessPolicy);

            // サムネイル用のURL作成
            let d = new Date();
            d.setMinutes(d.getMinutes() - 5);
            let startTime = d.toISOString();
            azureMediaService.createLocator({
                AccessPolicyId: accessPolicy.Id,
                AssetId: assetId,
                StartTime: startTime,
                Type: azureMediaService.LOCATOR_TYPE_SAS,
                Name: 'ThumbnailLocator_' + assetId
            }, (error, response) => {
                if (error) throw error;

                let locator = JSON.parse(response.body).d;
                this.logger.trace('locator:', locator);

                // URLを生成
                let url = util.format(
                    '%s/%s_000001.jpg%s',
                    locator.BaseUri,
                    filename,
                    locator.ContentAccessComponent
                );
                this.logger.trace('thumbnail url created. url:', url);

                cb(null, url);
            });
        });
    }

    private createUrlMp4(assetId, filename, cb): void {
        // 読み取りアクセス許可を持つAccessPolicyの作成
        azureMediaService.createAccessPolicy({
            Name: 'MP4Policy',
            DurationInMinutes: 25920000,
            Permissions: azureMediaService.ACCESS_POLICY_PERMISSIONS_READ
        }, (error, response) => {
            if (error) throw error;

            let accessPolicy = JSON.parse(response.body).d;
            this.logger.trace('accessPolicy:', accessPolicy);

            // サムネイル用のURL作成
            let d = new Date();
            d.setMinutes(d.getMinutes() - 5);
            let startTime = d.toISOString();
            azureMediaService.createLocator({
                AccessPolicyId: accessPolicy.Id,
                AssetId: assetId,
                StartTime: startTime,
                Type: azureMediaService.LOCATOR_TYPE_SAS,
                Name: 'MP4Locator_' + assetId
            }, (error, response) => {
                if (error) throw error;

                let locator = JSON.parse(response.body).d;
                this.logger.trace('locator:', locator);

                // URLを生成
                let url = util.format(
                    '%s/%s_1920x1080_6750.mp4%s',
                    locator.BaseUri,
                    filename,
                    locator.ContentAccessComponent
                );
                this.logger.trace('mp4 url created. url:', url);

                cb(null, url);
            });
        });
    }

    // http://msdn.microsoft.com/ja-jp/library/jj889436.aspx
    private createUrl(assetId, filename, cb): void {
        // 読み取りアクセス許可を持つAccessPolicyの作成
        azureMediaService.createAccessPolicy({
            Name: 'StreamingPolicy',
            DurationInMinutes: 25920000,
            Permissions: azureMediaService.ACCESS_POLICY_PERMISSIONS_READ
        }, (error, response) => {
            if (error) throw error;

            let accessPolicy = JSON.parse(response.body).d;
            this.logger.trace('accessPolicy:', accessPolicy);

            let d = new Date();
            d.setMinutes(d.getMinutes() - 5);
            let startTime = d.toISOString();
            azureMediaService.createLocator({
                AccessPolicyId: accessPolicy.Id,
                AssetId: assetId,
                StartTime: startTime,
                Type: azureMediaService.LOCATOR_TYPE_ON_DEMAND_ORIGIN,
                Name: 'StreamingLocator_' + assetId
            }, (error, response) => {
                if (error) throw error;

                let locator = JSON.parse(response.body).d;
                this.logger.trace('locator:', locator);

                // URLを生成
                let url = util.format(
                    '%s/%s.ism/Manifest',
                    locator.Path,
                    filename
                );
                this.logger.trace('streaming url created. url:', url);

                cb(null, url);
            });
        });
    }

    public checkJpeg2000Encode(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JPEG2000_READY, 10, (err, rows) => {
            if (err) throw err;

            let i = 0;
            let next = () => {
                i++;
                if (i > rows.length) {
                    process.exit(0);
                }

                let media = rows[i - 1];
                let share = MediaModel.AZURE_FILE_SHARE_NAME_JPEG2000_ENCODED;

                // Fileへコピー
                azureFileService.doesFileExist(share, '', media.filename + '.jpeg2000', {}, (error, result, response) => {
                    if (error) throw error;

                    this.logger.trace('doesFileExist result:', result);

                    // TODO
                    if (result.exists) {
                        this.logger.trace('changing status to encoded... id:', media.id);
                        model.updateStatus(media.id, MediaModel.STATUS_JPEG2000_ENCODED, (err, result) => {
                            if (err) throw err;

                            this.logger.trace('status changed to STATUS_JPEG2000_ENCODED. id:', media.id);
                            next();
                        });
                    } else {
                        this.logger.trace('not encoded yet. id:', media.id);
                        next();
                    }
                });
            }

            next();
        });
    }

    public delete(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_DELETED, 10, (err, rows) => {
            if (err) throw err;

            azureMediaService.setToken((err) => {
                if (err) throw err;

                let i = 0;
                let next = () => {
                    i++;
                    if (i > rows.length) {
                        process.exit(0);
                    }

                    let media = rows[i - 1];
                    this.logger.trace('deleting asset... asset_id:', media.asset_id);
                    azureMediaService.removeAsset(media.asset_id, (error, response) => {
                        if (error) throw error;

                        this.logger.trace('removeAsset response body:', response.body);

                        this.logger.trace('deleting media... id:', media.id);
                        model.delete(media.id, (err, result) => {
                            if (err) throw err;

                            this.logger.trace('media deleted. id:', media.id);

                            next();
                        });
                    });
                }

                next();
            });
        });
    }

    public jpeg2000ManualEncode(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JPEG2000_READY, 10, (err, rows) => {
            if (err) throw err;

            let i = 0;
            let next = () => {
                i++;
                if (i > rows.length) {
                    process.exit(0);
                }

                let media = rows[i - 1];
                let share = MediaModel.AZURE_FILE_SHARE_NAME_JPEG2000_ENCODED;

                // 手動でjpeg2000ファイル作成(開発用)
                azureFileService.createFile(share, '', media.filename + '.jpeg2000', 0, {}, (error, result, response) => {
                    if (error) throw error;

                    this.logger.trace('createFileFromLocalFile result:', result);
                    next();
                });
            }

            next();
        });
    }
}
