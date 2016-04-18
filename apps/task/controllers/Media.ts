import Base from './Base';
import MediaModel from '../models/Media';
import AzureMediaService from '../../common/modules/mediaService';
import azureStorage = require('azure-storage');
import conf = require('config');
import datetime = require('node-datetime');
import fs = require('fs');
import util = require('util');
// import path = require('path');

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
            if (rows.length > 0) {
                rows.forEach((media) => {
                    AzureMediaService.setToken((err) => {
                        if (err) throw err;

                        this.logger.debug('creating job...');
                        let assetId  = media.asset_id;
                        let options = {
                            Name: 'AassJob[' + media.filename + ']',
                            Tasks: this.getTasks(media.filename)
                        };

                        // ジョブ作成
                        AzureMediaService.createMultiTaskJob(assetId, options, (error, response) => {
                            this.logger.debug('error:', error);
                            this.logger.debug('response body:', response.body);
                            if (error) throw error;

                            let job = JSON.parse(response.body).d;

                            // メディアにジョブを登録
                            this.logger.trace('job created. job:', job);
                            model.addJob(media.id, job.Id, job.State, (err, result) => {
                                if (err) throw err;

                                this.logger.trace('media added job. id:', media.id, ' / result:', result);
                            });

                            process.exit(0);
                        });
                    });
                });
            } else {
                process.exit(0);
            }
        });
    }

    private getTasks(filename): Array<any> {
        let task;
        let tasks = [];

        // thumbnail task
        let config = fs.readFileSync(__dirname + '/../../../config/thumbnailConfig.json').toString();
        this.logger.debug('thumbnailConfig:', config);
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

    public checkJob(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JOB_CREATED, 1, (err, rows) => {
            if (err) throw err;
            
            this.logger.trace('medias:', rows);
            if (rows.length > 0) {
                rows.forEach((media) => {
                    
                    AzureMediaService.setToken((err) => {
                        if (err) throw err;

                        this.logger.trace('getting job...');
                        let assetId  = media.asset_id;
                        let options = {
                            Name: 'AassJob[' + media.filename + ']',
                            Tasks: this.getTasks(media.filename)
                        };

                        AzureMediaService.getJobStatus(media.job_id, (error, response) => {
                            if (error) throw error;

                            let job = JSON.parse(response.body).d;
                            this.logger.trace('job exists. job:', job);

                            // ジョブのステータスを更新
                            if (media.job_state != job.State) {
                                let state: number = job.State;
                                this.logger.trace('job state change. new state:', state);

                                // ジョブが完了の場合、URL発行プロセス
                                if (state == AzureMediaService.JOB_STATE_FINISHED) {
                                    AzureMediaService.getJobOutputMediaAssets(media.job_id, (error, response) => {
                                    // AzureMediaService.getJobTasks(media.job_id, (error, response) => {
                                        if (error) throw error;

                                        let outputMediaAssets = JSON.parse(response.body).d.results;
                                        this.logger.trace('outputMediaAssets:', outputMediaAssets);

                                        if (outputMediaAssets.length > 0) {
                                            let urls: any = {};

                                            this.createUrlThumbnail(outputMediaAssets[0].Id, media.filename, (error, url) => {
                                                if (error) throw error;

                                                urls.thumbnail = url;
    
                                                this.createUrlMp4(outputMediaAssets[1].Id, media.filename, (error, url) => {
                                                    if (error) throw error;

                                                    urls.mp4 = url;

                                                    this.createUrl(outputMediaAssets[2].Id, media.filename, (error, url) => {
                                                        if (error) throw error;

                                                        urls.streaming = url;

                                                        this.logger.trace('urls created. urls:', urls);

                                                        // ジョブに関する情報更新と、URL更新
                                                        this.logger.trace('changing status to STATUS_JOB_FINISHED... id:', media.id);
                                                        model.updateJobState(media.id, state, MediaModel.STATUS_JOB_FINISHED, urls, (err, result) => {
                                                            if (err) throw err;

                                                            this.logger.trace('status changed. id:', media.id, ' / result:', result);
                                                            // TODO URL通知
                                                            // if (!is_null(url)) {
                                                            //     this->sendEmail(media);
                                                            // }

                                                            process.exit(0);
                                                        });
                                                    });
                                                });
                                                
                                            });
                                        }
                                    });
                                } else if (state == AzureMediaService.JOB_STATE_ERROR || state == AzureMediaService.JOB_STATE_CANCELED) {
                                    this.logger.trace("changing status to STATUS_ERROR... id:", media.id);
                                    model.updateJobState(media.id, state, MediaModel.STATUS_ERROR, {}, (err, result) => {
                                        process.exit(0);
                                    });
                                } else {
                                    this.logger.trace("changing state_job to {state}... id:", media.id);
                                    model.updateJobState(media.id, state, MediaModel.STATUS_JOB_CREATED, {}, (err, result) => {
                                        process.exit(0);
                                    });
                                }
                            }
                        });
                    });
                });
            } else {
                process.exit(0);
            }
        });
    }

    private createUrlThumbnail(assetId, filename, cb): void {
        // 読み取りアクセス許可を持つAccessPolicyの作成
        AzureMediaService.createAccessPolicy({
            Name: 'ThumbnailPolicy',
            DurationInMinutes: 25920000,
            Permissions: AzureMediaService.ACCESS_POLICY_PERMISSIONS_READ
        }, (error, response) => {
            if (error) throw error;

            let accessPolicy = JSON.parse(response.body).d;
            this.logger.trace('accessPolicy:', accessPolicy);

            // サムネイル用のURL作成
            let d = new Date();
            d.setMinutes(d.getMinutes() - 5);
            let startTime = d.toISOString();
            AzureMediaService.createLocator({
                AccessPolicyId: accessPolicy.Id,
                AssetId: assetId,
                StartTime: startTime,
                Type: AzureMediaService.LOCATOR_TYPE_SAS,
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
        AzureMediaService.createAccessPolicy({
            Name: 'MP4Policy',
            DurationInMinutes: 25920000,
            Permissions: AzureMediaService.ACCESS_POLICY_PERMISSIONS_READ
        }, (error, response) => {
            if (error) throw error;

            let accessPolicy = JSON.parse(response.body).d;
            this.logger.trace('accessPolicy:', accessPolicy);

            // サムネイル用のURL作成
            let d = new Date();
            d.setMinutes(d.getMinutes() - 5);
            let startTime = d.toISOString();
            AzureMediaService.createLocator({
                AccessPolicyId: accessPolicy.Id,
                AssetId: assetId,
                StartTime: startTime,
                Type: AzureMediaService.LOCATOR_TYPE_SAS,
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
        AzureMediaService.createAccessPolicy({
            Name: 'StreamingPolicy',
            DurationInMinutes: 25920000,
            Permissions: AzureMediaService.ACCESS_POLICY_PERMISSIONS_READ
        }, (error, response) => {
            if (error) throw error;

            let accessPolicy = JSON.parse(response.body).d;
            this.logger.trace('accessPolicy:', accessPolicy);

            // サムネイル用のURL作成
            let d = new Date();
            d.setMinutes(d.getMinutes() - 5);
            let startTime = d.toISOString();
            AzureMediaService.createLocator({
                AccessPolicyId: accessPolicy.Id,
                AssetId: assetId,
                StartTime: startTime,
                Type: AzureMediaService.LOCATOR_TYPE_ON_DEMAND_ORIGIN,
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

    // https://msdn.microsoft.com/ja-jp/library/azure/mt427372.aspx
    public copyFile(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JOB_FINISHED, 1, (err, rows) => {
            if (err) throw err;

            if (rows.length > 0) {
                rows.forEach((media) => {
                    let to = MediaModel.getFilePath4Jpeg2000Ready(media.filename);
                    let sourceUrl = media.url_mp4;

                    let fileService = azureStorage.createFileService(
                        conf.get<string>('storage_account_name'),
                        conf.get<string>('storage_account_key')
                    );

                    fileService.startCopyFile(sourceUrl, 'jpeg2000', '', media.filename, {}, (error, result) => {
                        if (error) throw error;
                        
                        this.logger.trace('startCopyFile result:', result);
                    });

                    // this.logger.trace("changing status to copied... id:{media['id']}");
                    // result = mediaModel->updateStatus(media['id'], MediaModel::STATUS_JPEG2000_READY);

                });
                
            }
        });

        // if (!empty(medias)) {
        //     foreach (medias as media) {
        //         result = false;

        //         try {
        //         } catch (\Exception e) {
        //             this->logger->addError("copy failed. message:{e}");
        //         }

        //         if (!result) {
        //             try {
        //                 this.logger.trace("changing status to error... id:{media['id']}");
        //                 mediaModel->updateStatus(media['id'], MediaModel::STATUS_ERROR);
        //             } catch (Exception e) {
        //                 this->logger->addError("updateStatus to error failed. message:{e}");
        //             }
        //         }
        //     }
        // }
    }

    public checkJpeg2000Encode(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JPEG2000_READY, 10, (err, rows) => {
            if (err) throw err;
        });

        // if (!empty(medias)) {
        //     foreach (medias as media) {
        //         try {
        //             properties = this->fileService->getFileProperties(MediaModel::getFilePath4Jpeg2000Encoded(media['filename']));
        //             this->logger->addDebug(var_export(properties, true));

        //             // TODO
        //             if (!is_null(properties)) {
        //                 this.logger.trace("changing status to encoded... id:{media['id']}");
        //             } else {
        //                 this.logger.trace("not encoded yet. id:{media['id']}");
        //             }
        //         } catch (\Exception e) {
        //             this->logger->addError("getFile failed. message:{e}");
        //         }
        //     }
        // }
    }

    public deleteAsset(): void {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_DELETED, 10, (err, rows) => {
            if (err) throw err;

            if (rows.length > 0) {
                rows.forEach((media) => {
                    
                    AzureMediaService.setToken((err) => {
                        if (err) throw err;
                    });
                });
                
            }
        });

        // if (!empty(medias)) {
        //     foreach (medias as media) {
        //         try {
        //             this.logger.trace("deleting asset... asset_id:{media['asset_id']}");
        //             this->AzureMediaService->deleteAsset(media['asset_id']);
        //         } catch (\Exception e) {
        //             this->logger->addError("deleteAsset failed. message:{e}");
        //         }

        //         try {
        //             this.logger.trace("deleting media... id:{media['id']}");
        //             mediaModel->delete(media['id']);
        //         } catch (\Exception e) {
        //             this->logger->addError("delete failed. message:{e}");
        //         }
        //     }
        // }
    }
}
