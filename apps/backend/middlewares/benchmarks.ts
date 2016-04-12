import log4js = require('log4js');

export default (req, res, next) => {
    let startMemory = process.memoryUsage();
    let startTime = process.hrtime();
    let logger = log4js.getLogger('system');

    req.on('end', () => {
        let endMemory = process.memoryUsage();
        let memoryUsage = endMemory.rss - startMemory.rss;
        let diff = process.hrtime(startTime);
        logger.trace(
            'benchmark took %d seconds and %d nanoseconds. memoryUsage:%d (%d - %d)'
            , diff[0], diff[1], memoryUsage, startMemory.rss, endMemory.rss
        );
    });

    next();
};