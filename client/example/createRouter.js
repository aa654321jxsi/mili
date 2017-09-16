import Vue from 'vue';
import VueRouter from 'vue-router';
import container from 'framework/components/container';
import vueEnv from 'framework/utils/vueEnv';

import routes from './routes';


Vue.use(VueRouter);


export default function () {
  const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
      {
        path: vueEnv.isClient ? `/${process.env.APP_NAME}` : '/',
        component: container,
        children: routes,
      }
    ],
  });

  if (vueEnv.isClient) {
    router.beforeEach((to, from, next) => {

    })
  }

}

