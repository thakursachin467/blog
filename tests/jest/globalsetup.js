require('babel-register');
require('@babel/polyfill/noConflict')
const server = require('../../server').default;
module.exports = async () => {
  global.httpServerInstance = await server.start({ port: 4000 });
}