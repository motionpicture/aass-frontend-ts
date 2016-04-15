import log4js = require('log4js');

export default class Base
{
    protected logger;

    constructor() {
        this.logger = log4js.getLogger('system');
    }
}