export default {
  pages: ['pages/index/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '断食计时器',
    navigationBarTextStyle: 'black',
  },
  // 隐私声明
  requiredPrivateInfos: ['getLocation', 'chooseAddress'],
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口',
    },
  },
  style: 'v2',
  lazyCodeLoading: 'requiredComponents',
  sitemapLocation: 'sitemap.json',
};
