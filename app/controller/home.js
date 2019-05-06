'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';

    const url = `http://www.baidu.com/s?rtt=1&bsst=1&cl=2&tn=news&rsv_dl=ns_pc&word=%E8%87%AA%E7%94%B1%E8%81%8C%E4%B8%9A`;
    const result = await this.ctx.curl(url);
    let richHtml = result.data.toString();

    richHtml = richHtml.split('\n').join('');
    richHtml = richHtml.split('        ').join(' ');

    let regex = /(?<=<h3 class="c-title">)(.*?)(?=<\/h3>)/g;
    let res = richHtml.match(regex);
    res = res.map(el => {
      if(!el) {
        return null;
      }
      let regexUrl = /(?<=<a href=")(.*?)(?="\s+data-click=")/g;
      let resUrl = el.match(regexUrl);
      console.log('resUrl:' + resUrl);
      if(!resUrl || !resUrl.length) {
        return null;
      }
      let regexName = /(?<=target="_blank"\s*>)(.*?)(?=<\/a>)/g
      let resName = el.match(regexName);
      console.log('resName:' + resName);
      if(!resName || !resName.length) {
        return null;
      }
      resName = resName[0].trim();
      resName = resName.replace('<em>', '');
      resName = resName.replace('</em>', '');

      return {
        name: resName,
        url: resUrl[0]
      };
    });
    console.log(res.filter(el => el));

    // console.log(richHtml);
  }
}

module.exports = HomeController;
