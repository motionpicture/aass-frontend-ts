let program = require('commander');
import Media from './controllers/Media';

let media = new Media();






import log4js = require('log4js');
let env = process.env.NODE_ENV || 'dev';
log4js.configure({
    "appenders": [
        {
            "category": "system",
            "type": "dateFile",
            "filename": __dirname + "/../../logs/" + env + "/task/system.log",
            "pattern": "-yyyy-MM-dd",
            "backups": 3
        },
        {
            "type": "console"
        }
    ],
    "levels": {
        "access": "ALL",
        "system": "ALL"
    },
    "replaceConsole": true
});





program
  .version('0.0.1')

program
  .command('media <method>')
  .description('メディアに対する処理')
  .action((method) => {media[method]()});

// program
//   .command('*')
//   .action(function(env){
//     console.log('deploying "%s"', env);
//   });

program.parse(process.argv);