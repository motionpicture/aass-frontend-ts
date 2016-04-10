export default (req, res, next) => {
    let startMemory = process.memoryUsage();
    let startTime = process.hrtime();

    req.on('end', () => {
        let endMemory = process.memoryUsage();
        let memoryUsage = endMemory.rss - startMemory.rss;
        let diff = process.hrtime(startTime);
        req.logger.info(
            'benchmark took %d seconds and %d nanoseconds. memoryUsage:%d (%d - %d)'
            , diff[0], diff[1], memoryUsage, startMemory.rss, endMemory.rss
        );
    });

    next();
};
