const Koa = require("koa");
const rp = require("request-promise");
const cheerio = require("cheerio");
const os = require("os");

const app = new Koa();

app.use(async ctx => {
  let path = ctx.path.substr(1);
  let url = "http://zh.cppreference.com/w/%E9%A6%96%E9%A1%B5";
  console.log("path =[" + path + "]");
  if (/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(path)) {
    url = path;
  } else {
    url = "http://zh.cppreference.com/" + path;
  }

  var options = {
    uri: url,
    transform: body => cheerio.load(body)
  };

  try {
    let $ = await rp(options);
    $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">');
    $("a").each(function(i) {
      // windows平台开发，Linux 平台部署
      this.href = (os.platform() == "linux" ? "http://cpp.luchenqun.com/" : "http://127.0.0.1:3001/") + this.href;
    });
    ctx.body = $.html();
  } catch (error) {
    ctx.body = JSON.stringify(error);
  }

  if (path == "/") {
  }
});

app.listen(3001);
