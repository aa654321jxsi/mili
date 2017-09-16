import { create } from 'detect-env';


export default create()
  .alias({
    ssr: /(server)|(ssr)/,
  })
  .shortcut({
    SSR: envName => envName === 'ssr',
    Client: envName => envName === 'client',
  })
  .envVariable(process.env.VUE_ENV);

