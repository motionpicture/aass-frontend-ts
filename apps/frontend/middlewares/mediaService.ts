import AzureMediaService from '../../common/modules/mediaService';

export default function (req, res, next) {
    if (req.mediaService) next();
    req.mediaService = AzureMediaService;
    next();
};