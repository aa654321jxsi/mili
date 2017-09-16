import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { VueSSRServerPlugin } from 'vue-ssr-webpack-plugin';
import { dependencies } from '../package.json';
import base from './webpack.config.base';
import config from './webpack.config.expand';


function emptyPackage(list) {
  return Object.keys(list).reduce((emptyList, alias) => ({
    ...emptyList,
    [alias]: path.resolve(__dirname, 'empty'),
  }), {});
}

function getExternals() {
  return Object.keys(dependencies).filter(key => (
    !config.nonJsModule.includes(key)
  ));
}

export default merge(base, {
  target: 'node',

  externals: getExternals(),

  output: {
    libraryTarget: 'commonjs2',
  },

  resolve: {
    alias: {
      ...emptyPackage(config.nonIsomorphicModule),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': JSON.stringify('server'),
    }),

    new VueSSRServerPlugin({
      filename: config.ssrFileName,
    }),
  ],
});

