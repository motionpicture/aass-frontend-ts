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
     * 
     * @throws \Exception
     */
    public downloadAction(req: any, res: any, next: any): void {
        /*
        try {
            $mediaModel = new MediaModel;
            $media = $mediaModel->getById($this->dispatcher->getParam('id'));

            // 特定のAssetに対して、同時に5つを超える一意のLocatorを関連付けることはできない
            // 万が一SASロケーターがあれば削除
            $oldLocators = $this->mediaService->getAssetLocators($media['asset_id']);
            foreach ($oldLocators as $oldLocator) {
                if ($oldLocator->getType() == Locator::TYPE_SAS) {
                    // 期限切れであれば削除
                    $expiration = strtotime('+9 hours', $oldLocator->getExpirationDateTime()->getTimestamp());
                    if ($expiration < strtotime('now')) {
                        $this->mediaService->deleteLocator($oldLocator);
                        $this->logger->addDebug('SAS locator has been deleted. locator: '. print_r($oldLocator, true));
                    }
                }
            }

            // 読み取りアクセス許可を持つAccessPolicyの作成
            $accessPolicy = new AccessPolicy('DownloadPolicy');
            $accessPolicy->setDurationInMinutes(10); // 10分間有効
            $accessPolicy->setPermissions(AccessPolicy::PERMISSIONS_READ);
            $accessPolicy = $this->mediaService->createAccessPolicy($accessPolicy);

            // アセットを取得
            $asset = $this->mediaService->getAsset($media['asset_id']);
            $this->logger->addDebug('asset:' . print_r($asset, true));

            // ダウンロードURLの作成
            $locator = new Locator(
                $asset,
                $accessPolicy,
                Locator::TYPE_SAS
            );
            $locator->setName('DownloadLocator_' . $asset->getId());
            $locator->setStartTime(new \DateTime('now -5 minutes'));
            $locator = $this->mediaService->createLocator($locator);
            $this->logger->addDebug(print_r($locator, true));

            $fileName = "{$media['filename']}.{$media['extension']}";
            $path = "{$locator->getBaseUri()}/{$fileName}{$locator->getContentAccessComponent()}";
            $this->logger->addInfo("path:{$path}");
            header('Content-Disposition: attachment; filename="' . $fileName . '"');
            header('Content-Type: application/octet-stream');
            if (!readfile($path)) {
                throw(new \Exception("Cannot read the file({$path})"));
            }

            // ロケーター削除
            $this->mediaService->deleteLocator($locator);

            return false;
        } catch (\Exception $e) {
            $this->logger->addError("download throw exception. message:{$e}");
            throw $e;
        }

        throw new \Exception('予期せぬエラー');
        */
    }
}