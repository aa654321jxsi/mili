
<svg width="35px" height="70.25px" style="display: block; margin: 40px auto 0 auto" viewBox="0 0 140 281" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 50.2 (55047) - http://www.bohemiancoding.com/sketch -->
    <title>Group</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-186.000000, -82.000000)" stroke="#333333" stroke-width="14">
            <g id="Group" transform="translate(193.000000, 90.000000)">
                <path d="M61.9957273,0.0165562113 C71.6250162,24.2113055 90.7213926,45.6153299 116.317155,62.1183951 C122.45073,82.6374309 126,106.943685 126,133 C126,206.453872 97.7939392,266 63,266 C28.2060608,266 0,206.453872 0,133 C0,60.2541444 27.6649293,1.14921317 61.9957273,0.0165562113 Z" id="Combined-Shape"></path>
                <path d="M119.893247,75.8045563 C123.808337,93.1300455 126,112.524694 126,133 C126,206.453872 97.7939392,266 63,266 C28.2060608,266 0,206.453872 0,133 C0,60.2541444 27.6649293,1.14921317 61.9957273,0.0165562113 C62.0269039,0.0948910772 62.0581797,0.173196689 62.0895546,0.251472975 C67.3386826,41.3005107 90.9569195,73.0419453 119.893247,75.8045563 Z" id="Combined-Shape"></path>
            </g>
        </g>
    </g>
</svg>


# MILI

[![version](https://img.shields.io/npm/v/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![downloads](https://img.shields.io/npm/dm/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![dependencies](https://img.shields.io/david/Val-istar-Guo/mili.svg)](https://www.npmjs.com/package/mili)


## Install

```bash
// init an website
npx mili init

// init an component
npx mili init -t component
```

## Usage

### mili init [option] [app_name]

initial your project.
if you don't set `app_name`, it will use the name of the current folder.
by default, mili will init an website project， unless you set the `-t` or `--type`


|   option   |                enum                | default | description |
|:----------:|------------------------------------|---------|-------------|
| -t --type  | web, component, pwa, assist-plugin | web     | Which app type to build?


### mili upgrade

upgrade your project

## Technology Stack

- vue
-  - vuex
-  - vue-router
-  - vue-server-renderer
- koa
-  - koa-router
-  - koa-logger
-  - koa-proxy
-  - koa-static
-  - koa-views
- superagent
- chalk
- webpack
- babel
- pm2
