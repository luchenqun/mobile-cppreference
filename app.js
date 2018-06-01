const Koa = require("koa");
const rp = require("request-promise");
const cheerio = require("cheerio");
const os = require("os");
const path = require("path");

const app = new Koa();

app.use(require("koa-static")("."));
app.use(require("@koa/cors")());

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
    $("head").prepend('<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>');
    $("head").prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">');
    $("head").append('<link href="/style.css" rel="stylesheet">');
    $("head").append('<script src="/init.js"></script>');

    $("a").each(function(i) {
      // windows平台开发，Linux 平台部署
      this.href = (os.platform() == "linux" ? "http://cpp.luchenqun.com/" : "http://127.0.0.1:3001/") + this.href;
    });
    $("img").each(function(i) {
      console.log($(this).attr('src'));
      if (!/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(this.src)) {
        this.src = "http://zh.cppreference.com" + this.src;
      }
    });
    ctx.body = $.html();
  } catch (error) {
    ctx.body = JSON.stringify(error);
  }
});

app.listen(3001);
