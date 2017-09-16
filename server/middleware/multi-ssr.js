import fs from 'fs';
import { join }from 'path';
import send from 'koa-send';
import mount from 'koa-mount';
import compose from 'koa-compose';
import env from 'detect-env';

import ssr from './vue-server-render';


function searchAvailableApp(rootdir) {
  return fs.readdirSync(rootdir)
    .map(filename => ({ filename, stat: fs.statSync(join(rootdir, filename)) }))
    .filter(file => file.stat.isDirectory())
}


function ssrServe(rootdir, appNames) {
  const appPaths = appNames.map(file => `/${file.filename}`);

  const middlewares = appPaths
    .map(path => ssr({
      template: fs.readFileSync(join(rootdir, path, 'template.html'), 'utf8'),
      bundle: join(rootdir, path, 'vue-ssr-bundle.json'),
      manifest: JSON.parse(fs.readFileSync(join(rootdir, path, 'vue-ssr-manifest.json'), 'utf8')),
    }))
    .map((middleware, i)=> mount(appPaths[i], middleware))

  // if (index) {
  //   const middleware = ssr({
  //     template: fs.readFileSync(join(rootdir, index, 'template.html'), 'utf8'),
  //     bundle: join(rootdir, index, 'vue-ssr-bundle.json'),
  //     manifest: JSON.parse(fs.readFileSync(join(rootdir, index, 'vue-ssr-manifest.json'), 'utf8')),
  //   });
  //
  //   middlewares.push(mount('/', middleware));
  // }

  return compose(middlewares);
}

function staticServe(rootdir, appNames) {
  const appPaths = appNames.map(file => `/${file.filename}`);

  const createServe = (path) => {
    return async (ctx, next) => {
      let done = false;

      if (ctx.method === 'HEAD' || ctx.method === 'GET') {
        try {
          done = await send(ctx, ctx.path, { root: join(rootdir, path) });
        } catch (err) {
          if (err.status !== 404) {
            err.expose = !env.isProd;
            throw err
          }
        }
      }

      if (!done) await next();
    };
  };

  const middlewares = appPaths
    .map(createServe)
    .map((middleware, i) => mount(appPaths[i], middleware))

  // if (index) {
  //   const middleware = createServe(index);
  //   middlewares.push(mount('/', middleware));
  // }

  return compose(middlewares);
}

export default function ({ rootdir }) {
  const availableApps = searchAvailableApp(rootdir);
  const ssrMiddleware = ssrServe(rootdir, availableApps);
  const staticMiddleware = staticServe(rootdir, availableApps);

  return compose([
    staticMiddleware,
    ssrMiddleware,
  ]);
};
