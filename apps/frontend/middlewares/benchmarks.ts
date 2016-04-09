export default (req, res, next) => {
    var startMemory = process.memoryUsage();
    var startTime = process.hrtime();

    req.on('end', () => {
        var endMemory = process.memoryUsage();
        var memoryUsage = endMemory.rss - startMemory.rss;
        var diff = process.hrtime(startTime);
        req.logger.info(
            'benchmark took %d seconds and %d nanoseconds. memoryUsage:%d (%d - %d)'
            , diff[0], diff[1], memoryUsage, startMemory.rss, endMemory.rss
        );
    });

    next();
};
