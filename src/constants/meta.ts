import pkg from '../../package.json';
const isDev = import.meta.env.DEV;

export const APP_META = {
  name: 'Daily Avatar',
  github: 'https://github.com/Wxh16144/daily-avatar',
  version: pkg.version,
};

export const ASSETS_BASE_URL = isDev
  ? ''
  : `https://unpkg.com/${__PKG_NAME__}@${__PKG_VERSION__}/dist`;
  // : 'http://127.0.0.1:7783/dist'; // 本地调试使用本地服务器
