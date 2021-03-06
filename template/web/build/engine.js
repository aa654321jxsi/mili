const fs = require('fs');
const { resolve, join } = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');
const requireFromString = require('require-from-string');
require('source-map-support').install();


require('babel-polyfill');
require('babel-register')({
  presets: [
    ['env', {
      targets: { node: 'current' },
      useBuiltIns: true,
    }],
  ],
  plugins: [
    'transform-object-rest-spread',
    'add-module-exports',
  ],
});

// Compatible with MemoryFileSystem
const readFile = (fs, file) => {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch (err) {
    log.error('read file', `filename: ${file}`, err);
  }
}

const Server = require('./server');

// init compiler
const { ssrFilename, manifestFilename } = require('../build.config');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const server = new Server(PORT, HOST);


/**
 * NOTE devConfig used to make template
 *      and make webpack dev middleware
 */
const devConfig = require('./webpack.config.client');
const devCompiler = webpack(devConfig);
server.devCompiler = devCompiler;

/**
 * NOTE Webpack hook event to write html file template
 *      due to server render
 */
devCompiler.plugin('done', stats => {
  const info = stats.toJson();

  info.errors.forEach(err => console.log(chalk.red.bold(err)));
  info.warnings.forEach(warn => console.log(chalk.yellow(warn)));
  if (info.errors.length) return;

  server.manifest = JSON.parse(readFile(
    devCompiler.outputFileSystem,
    resolve(devConfig.output.path, manifestFilename),
  ));

  server.template = readFile(
    devCompiler.outputFileSystem,
    resolve(devConfig.output.path, 'template.html'),
  );
});


/**
 * NOTE ssrConfig used to make vue ssr bundle json file.
 *      It is must after devConfig because replay file template
 */
const ssrConfig = require('./webpack.config.ssr');
const ssrCompiler = webpack(ssrConfig);

const ssrMfs = new MemoryFileSystem();
ssrCompiler.outputFileSystem = ssrMfs;

// NOTE read bundle generated by vue-ssr-webpack-plugin
ssrCompiler.watch({}, (err, stats) => {
  if (err) throw err;

  const info = stats.toJson();

  info.errors.forEach(err => console.log(chalk.red.bold(err)));
  info.warnings.forEach(warn => console.log(chalk.yellow(warn)));
  if (info.errors.length) return;


  server.bundle = JSON.parse(readFile(
    ssrMfs,
    join(ssrConfig.output.path, ssrFilename),
  ));
});

const serverConfig = require('./webpack.config.server');
const serverCompiler = webpack(serverConfig);

const serverMfs = new MemoryFileSystem();
serverCompiler.outputFileSystem = serverMfs;


/**
 * if koa(inclode it's middleware) coudle be closed
 * serverCompiler can use watch module,
 * and will not rely on pm2 in the development environment
 */
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;

  const info = stats.toJson();
  const chunkName = info.assetsByChunkName.main;

  info.errors.forEach(err => console.log(chalk.red.bold(err)));
  info.warnings.forEach(warn => console.log(chalk.yellow(warn)));
  if (info.errors.length) return;

  const code = readFile(
    serverMfs,
    resolve(serverConfig.output.path, chunkName),
  );

  koaServer = requireFromString(code, chunkName).default;
  console.log(chalk.green('🍻  Server-side code is compiled'));

  server.update(koaServer);
});

console.log(chalk.green('⌛️  Wait for the server-side code to compile...'));
