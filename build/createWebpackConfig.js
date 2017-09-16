import webpack from 'webpack';
import { join, resolve } from 'path';
import merge from 'webpack-merge';
import clientConfig from './webpack.config.client.js';
import clientDevConfig from './webpack.config.client.dev.js';
import ssrConfig from './webpack.config.ssr.js';
import CopyWebpackPlugin from 'copy-webpack-plugin';


export const createClientConfig = (appName) => {
  const entry = appName;

  return merge(clientConfig, {
    entry: {
      bundle: [`./client/${join(entry, 'entry-client')}`],
    },
    output: {
      path: resolve(__dirname, '../dist/client', entry),
      publicPath: `/${entry}`,
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: `./client/${join(entry, 'template.html')}`,
        to: 'template.html',
      }]),
      new webpack.DefinePlugin({
        'process.env.APP_NAME': JSON.stringify(appName),
      }),
    ],
  });
};

export const createClientDevConfig = (entry) => {
  return merge(clientDevConfig, {
    entry: {
      bundle: [`./client/${join(entry, 'entry-client')}`],
    },
    output: {
      path: resolve(__dirname, '../dist/client', entry),
    },
  });
};


export const createSSRConfig = (appName) => {
  const entry = appName;
  return merge(ssrConfig, {
    entry: `./client/${join(entry, 'entry-ssr')}`,
    output: {
      path: resolve(__dirname, '../dist/client', entry),
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.APP_NAME': JSON.stringify(appName),
      }),
    ],
  });
};

