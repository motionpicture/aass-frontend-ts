import Base from './Base';
import MediaModel from '../models/Media';
import mediaService from '../modules/mediaService';
// import path = require('path');
// import fs = require('fs')

export default class Media extends Base
{
    /**
     * エンコード処理を施す
     */
    public encode()
    {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_ASSET_CREATED, 10, (err, rows) => {
            if (err) throw err;

            this.logger.trace('medias:', rows);
            if (rows.length > 0) {
                rows.forEach((media) => {
                    mediaService.setToken((err) => {
                        if (err) throw err;

                        // mediaService.listMediaProcessors((error, response) => {
                        //     this.logger.debug(response);
                        // });

                        this.logger.debug('creating job...');
                        let assetId  = media.asset_id;
                        let options = {
                            Name: 'AassJob[' + media.filename + ']',
                            Tasks: this.getTasks(media.filename)
                        };

                        mediaService.createMultiTaskJob(assetId, options, (error, response) => {
                            this.logger.debug('error:', error);
                            this.logger.debug('response body:', response.body);
                            if (error) throw error;

                            let job = JSON.parse(response.body).d;
                            this.logger.trace('job created. job:', job);
                            // model.addJob(media.id, job.Id, job.State, (err, result) => {
                            //     this.logger.trace("media added job. id:{media['id']}");
                            // });
                        });
                    });
                });
            }
        });

        return;
    }

    private getTasks(filename)
    {
        let task;
        let tasks = [];

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

        // thumbnail task
        task = {
            Configuration: 'Thumbnails',
            OutputAssetName: 'AassMediaAsset[' + filename + '][thumbnails]',
            OutputFileName: 'Test_Thumbnail',
            Value: '00:00:10',
            Type: 'Jpeg',
            Width: 120,
            Height: 120,
        };
        tasks.push(task);
        // taskBody = this->getMediaServicesTaskBody(
        //     'JobInputAsset(0)',
        //     'JobOutputAsset(0)',
        //     Asset::OPTIONS_NONE,
        //     "AassMediaAsset[{filename}][thumbnails]"
        // );
        // task = new Task(taskBody, mediaProcessor->getId(), TaskOptions::NONE);
        // configurationFile  = __DIR__ . '/../../../config/thumbnailConfig.json';
        // task->setConfiguration(file_get_contents(configurationFile));
        // tasks[] = task;

        return tasks;
    }

    public checkJob()
    {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JOB_CREATED, 10, (err, rows) => {
            if (err) throw err;
        });

        // if (!empty(medias)) {
        //     foreach (medias as media) {
        //         job = this->mediaService->getJob(media['job_id']);

        //         // ジョブのステータスを更新
        //         if (!is_null(job) && media['job_state'] != job->getState()) {
        //             state = job->getState();
        //             this.logger.trace("job state change. new state:{state}");
        //             try {
        //                 // ジョブが完了の場合、URL発行プロセス
        //                 if (state == Job::STATE_FINISHED) {
        //                     // ジョブのアウトプットアセットを取得
        //                     assets = this->mediaService->getJobOutputMediaAssets(job->getId());

        //                     urls = [];
        //                     asset = assets[0];
        //                     urls['thumbnail'] = this->createUrlThumbnail(asset->getId(), media['filename']);
        //                     asset = assets[1];
        //                     urls['mp4'] = this->createUrlMp4(asset->getId(), media['filename']);
        //                     asset = assets[2];
        //                     urls['streaming'] = this->createUrl(asset->getId(), media['filename']);

        //                     // ジョブに関する情報更新と、URL更新
        //                     this.logger.trace("changing status to STATUS_JOB_FINISHED... id:{media['id']}");
        //                     mediaModel->updateJobState(media['id'], state, MediaModel::STATUS_JOB_FINISHED, urls);

        //                     // TODO URL通知
        //                     if (!is_null(url)) {
        //                         this->sendEmail(media);
        //                     }
        //                 } else if (state == Job::STATE_ERROR || state == Job::STATE_CANCELED) {
        //                     this.logger.trace("changing status to STATUS_ERROR... id:{media['id']}");
        //                     mediaModel->updateJobState(media['id'], state, MediaModel::STATUS_ERROR);
        //                 } else {
        //                     this.logger.trace("changing state_job to {state}... id:{media['id']}");
        //                     mediaModel->updateJobState(media['id'], state, MediaModel::STATUS_JOB_CREATED);
        //                 }
        //             } catch (\Exception e) {
        //                 this->logger->addError("delivering url for streaming throw exception. message:{e}");
        //             }
        //         }
        //     }
        // }
    }
/*
    private createUrlThumbnail(assetId, filename)
    {
        // 特定のAssetに対して、同時に5つを超える一意のLocatorを関連付けることはできない
        // 万が一OnDemandOriginロケーターがあれば削除
        locators = this->mediaService->getAssetLocators(assetId);
        foreach (locators as locator) {
            if (locator->getType() == Locator::TYPE_SAS) {
                this->mediaService->deleteLocator(locator);
                this.logger.trace("OnDemandOrigin locator has been deleted. locator:". var_export(locator, true));
            }
        }

        // 読み取りアクセス許可を持つAccessPolicyの作成
        accessPolicy = new AccessPolicy('ThumbnailPolicy');
        accessPolicy->setDurationInMinutes(25920000);
        accessPolicy->setPermissions(AccessPolicy::PERMISSIONS_READ);
        accessPolicy = this->mediaService->createAccessPolicy(accessPolicy);

        // サムネイル用のURL作成
        locator = new Locator(assetId, accessPolicy, Locator::TYPE_SAS);
        locator->setName('ThumbnailLocator_' . assetId);
        locator->setStartTime(new \DateTime('now -5 minutes'));
        locator = this->mediaService->createLocator(locator);

        // URLを生成
        url = "{locator->getBaseUri()}/{filename}_000001.jpg{locator->getContentAccessComponent()}";
        this.logger.trace("thumbnail url created. url:{url}");

        return url;
    }

    private createUrlMp4(assetId, filename)
    {
        // 特定のAssetに対して、同時に5つを超える一意のLocatorを関連付けることはできない
        // 万が一OnDemandOriginロケーターがあれば削除
        locators = this->mediaService->getAssetLocators(assetId);
        foreach (locators as locator) {
            if (locator->getType() == Locator::TYPE_SAS) {
                this->mediaService->deleteLocator(locator);
                this.logger.trace("OnDemandOrigin locator has been deleted. locator:". var_export(locator, true));
            }
        }

        // 読み取りアクセス許可を持つAccessPolicyの作成
        accessPolicy = new AccessPolicy('MP4Policy');
        accessPolicy->setDurationInMinutes(25920000);
        accessPolicy->setPermissions(AccessPolicy::PERMISSIONS_READ);
        accessPolicy = this->mediaService->createAccessPolicy(accessPolicy);

        // サムネイル用のURL作成
        locator = new Locator(assetId, accessPolicy, Locator::TYPE_SAS);
        locator->setName('MP4Locator_' . assetId);
        locator->setStartTime(new \DateTime('now -5 minutes'));
        locator = this->mediaService->createLocator(locator);

        // URLを生成
        url = "{locator->getBaseUri()}/{filename}_1920x1080_6750.mp4{locator->getContentAccessComponent()}";
        this.logger.trace("mp4 url created. url:{url}");

        return url;
    }

    // http://msdn.microsoft.com/ja-jp/library/jj889436.aspx
    private createUrl(assetId, filename)
    {
        // 特定のAssetに対して、同時に5つを超える一意のLocatorを関連付けることはできない
        // 万が一OnDemandOriginロケーターがあれば削除
        locators = this->mediaService->getAssetLocators(assetId);
        foreach (locators as locator) {
            if (locator->getType() == Locator::TYPE_ON_DEMAND_ORIGIN) {
                this->mediaService->deleteLocator(locator);
                this.logger.trace("OnDemandOrigin locator has been deleted. locator:". var_export(locator, true));
            }
        }

        // 読み取りアクセス許可を持つAccessPolicyの作成
        accessPolicy = new AccessPolicy('StreamingPolicy');
        accessPolicy->setDurationInMinutes(25920000);
        accessPolicy->setPermissions(AccessPolicy::PERMISSIONS_READ);
        accessPolicy = this->mediaService->createAccessPolicy(accessPolicy);

        // コンテンツストリーミング用の配信元URLの作成
        locator = new Locator(assetId, accessPolicy, Locator::TYPE_ON_DEMAND_ORIGIN);
        locator->setName('StreamingLocator_' . assetId);
        locator->setStartTime(new \DateTime('now -5 minutes'));
        locator = this->mediaService->createLocator(locator);

        // URLを生成
        url = "{locator->getPath()}{filename}.ism/Manifest";
        this.logger.trace("streaming url created. url:{url}");

        return url;
    }
*/
    // https://msdn.microsoft.com/ja-jp/library/azure/mt427372.aspx
    public copyFile()
    {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_JOB_FINISHED, 10, (err, rows) => {
            if (err) throw err;
        });

        // if (!empty(medias)) {
        //     foreach (medias as media) {
        //         result = false;

        //         try {
        //             to = MediaModel::getFilePath4Jpeg2000Ready(media['filename']);
        //             sourceUrl = media['url_mp4'];

        //             this->fileService->copyFile(sourceUrl, to);

        //             this.logger.trace("changing status to copied... id:{media['id']}");
        //             result = mediaModel->updateStatus(media['id'], MediaModel::STATUS_JPEG2000_READY);
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

    public checkJpeg2000Encode()
    {
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

    public deleteAsset()
    {
        let model = new MediaModel();
        model.getListByStatus(MediaModel.STATUS_DELETED, 10, (err, rows) => {
            if (err) throw err;
        });

        // if (!empty(medias)) {
        //     foreach (medias as media) {
        //         try {
        //             this.logger.trace("deleting asset... asset_id:{media['asset_id']}");
        //             this->mediaService->deleteAsset(media['asset_id']);
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
