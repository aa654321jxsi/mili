import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import server from './server';
import ssr from './middleware/multi-ssr';


const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';


server
  .use(ssr({
    rootdir: path.resolve(__dirname, '../client'),
    index: 'example',
  }))
  .listen(PORT, HOST);

console.log(chalk.green(`🌏  Server Start at ${HOST}:${PORT}`));

