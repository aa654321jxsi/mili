// packaging multiple application
import fs from 'fs';
import server from './build/webpack.config.server.js';
import {
  createClientConfig,
  createSSRConfig } from './build/createWebpackConfig.js';


const files = fs.readdirSync('./client')
  .map(filename => ({ filename, stat: fs.statSync(`./client/${filename}`) }))
  .filter(file => file.stat.isDirectory())
  .map(file => file.filename)

const clientConfigs = files
  .map(entry => createClientConfig(entry));

const ssrConfigs = files
  .map(entry => createSSRConfig(entry));



// import client from './build/webpack.config.client.js';
// import ssr from './build/webpack.config.ssr.js';


// export default [server, ssr, client];
// export default [ssr, client];
// export default client;
export default [server].concat(clientConfigs, ssrConfigs);
// export default [server, client];

