cd %DEPLOYMENT_SOURCE%
npm install
typings install
cd ./public
npm install
typings install
cd ../
tsc -p ./
tsc -p ./public/
