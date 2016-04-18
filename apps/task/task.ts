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
//   .option('-C, --chdir <path>', 'change the working directory')
//   .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
//   .option('-T, --no-tests', 'ignore test hook')

program
  .command('media encode')
  .description('サムネイル、mp4、ストリーミング用のジョブを作成')
  .action(() => {media.encode()});

// program
//   .command('media checkJob')
//   .description('ジョブの進捗確認')
//   .action(() => {media.checkJob()});

// program
//   .command('media copyFile')
//   .description('ジョブ完了後のmp4をblobからfileへコピー')
//   .action(() => {media.copyFile()});

// program
//   .command('media checkJpeg2000Encode')
//   .description('jpeg2000エンコード進捗確認')
//   .action(() => {media.checkJpeg2000Encode()});

// program
//   .command('media delete')
//   .description('削除済みメディアの処理')
//   .action(() => {media.delete()});

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

program.parse(process.argv);