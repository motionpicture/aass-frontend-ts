rem @if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

set SCM_COMMAND_IDLE_TIMEOUT 9999
xcopy /E /Y %DEPLOYMENT_SOURCE% %DEPLOYMENT_TARGET%

cd %DEPLOYMENT_TARGET%

call npm install -g typescript
call npm install -g typings

call npm install
call typings install

cd ./public
call npm install
call typings install

cd ../
call tsc -p ./
call tsc -p ./public/
