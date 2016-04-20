let program = require('commander');
let fs = require('fs-extra');
import Media from './controllers/Media';

let media = new Media();




import log4js = require('log4js');
let env = process.env.NODE_ENV || 'dev';
let logDefaultConfiguration: any = {
    appenders: [
        {
            type: 'console'
        }
    ],
    levels: {
    },
    replaceConsole: true
};




program
    .version('0.0.1')

program
    .command('media <method>')
    .description('メディアに対する処理')
    .action((method) => {
        let logDir = __dirname + '/../../logs/' + env + '/task/' + 'Media' + method.charAt(0).toUpperCase() + method.slice(1);
        fs.mkdirsSync(logDir);
        logDefaultConfiguration.appenders.push({
            category: 'system',
            type: 'dateFile',
            filename: logDir + '/system.log',
            pattern: '-yyyy-MM-dd',
            backups: 3
        });
        logDefaultConfiguration.levels.system = "ALL";
        log4js.configure(logDefaultConfiguration);

        media[method]();
    });

// program
//   .command('*')
//   .action(function(env){
//     console.log('deploying "%s"', env);
//   });

program.parse(process.argv);