import Mock from "mockjs";
Mock.mock("/api/setting", "get", {
  code: 0,
  msg: "",
  data: {
    avatar: 'https://qishilong.space/static/upload/2023-7-22-21-39-49-620-0eb40.jpeg',
    siteTitle: '学习笔记',
    github: 'https://github.com/qishilong',
    qq: '663253062',
    qqQrCode:
      'https://qishilong.space/static/upload/2023-7-22-21-50-23-579-20845.jpg',
    weixin: 'Sunny_qsl',
    weixinQrCode: 'https://qishilong.space/static/upload/2023-7-22-21-50-26-187-3a7e8.jpg',
    mail: '663253062@qq.com',
    icp: '京ICP备2023002610号',
    githubName: 'qishilong',
    favicon: 'https://qiniucloud.qishilong.space/images/sun.svg',
  },
});
