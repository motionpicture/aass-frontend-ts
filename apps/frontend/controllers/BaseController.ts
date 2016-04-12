import log4js = require('log4js');

export default class BaseController
{
    protected logger;

    constructor() {
        this.logger = log4js.getLogger('system');
    }
}