const mongoose = require('mongoose');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
// monkey toJSON
const originToJSON = mongoose.Document.prototype.toJSON;
mongoose.Document.prototype.toJSON = function (...args) {
  const obj = originToJSON.call(this, ...args);
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
  }
  return obj;
};

// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  // 初始化管理员
  async initAdmin() {
    const Admin = this.app.model.Admin;
    const count = await Admin.countDocuments();
    if (!count) {
      this.app.config.admin.loginPwd = md5(this.app.config.admin.loginPwd);
      await Admin.create(this.app.config.admin);
      console.log('管理员初始化成功');
    }
  }

  // 初始化全局设置
  async initSetting() {
    const Setting = this.app.model.Setting;
    const count = await Setting.countDocuments();
    if (!count) {
      await Setting.create({
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
      });
      console.log('全局设置初始化成功');
    }
  }

  // 初始化关于我信息
  async initAbout() {
    const About = this.app.model.About;
    const count = await About.countDocuments();
    if (!count) {
      await About.create({
        url: '',
      });
      console.log('关于我信息初始化成功');
    }
  }

  mkUpload() {
    const fs = require('fs');
    const path = require('path');
    try {
      fs.mkdirSync(path.resolve(__dirname, './app/public/upload'));
    } catch {
      // do nothing
    }
  }

  initAvatars() {
    const allows = ['.png', '.gif', '.jpg', '.png', '.webp', '.bmp', '.svg'];
    const files = fs
      .readdirSync(path.resolve(__dirname, './app/public/avatar'))
      .filter((name) => allows.includes(path.extname(name).toLowerCase()))
      .map((name) => `${this.app.config.static.prefix}avatar/${name}`);
    this.app.config.avatars = files;
  }

  willReady() {
    // 初始化管理员
    this.initAdmin();

    // 初始化全局设置
    this.initSetting();

    // 初始化上传目录
    this.mkUpload();

    // 初始化关于我信息
    this.initAbout();

    // 初始化头像数据
    this.initAvatars();
  }
}

module.exports = AppBootHook;
