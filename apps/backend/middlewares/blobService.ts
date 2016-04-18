import AzureBlobService from '../../common/modules/azureBlobService';

export default function (req, res, next) {
    if (req.mediaService) next();
    req.mediaService = AzureBlobService;
    next();
};