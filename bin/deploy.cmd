set SCM_COMMAND_IDLE_TIMEOUT 9999
xcopy /E /Y %DEPLOYMENT_SOURCE% %DEPLOYMENT_TARGET%
cd %DEPLOYMENT_TARGET%
npm install -g typescript
npm install -g typings
npm install
typings install
cd ./public
npm install
typings install
cd ../
tsc -p ./
tsc -p ./public/
