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
  if (/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(path)) {
    url = path;
  } else {
    url = "http://zh.cppreference.com/" + path;
  }

  var deviceAgent = ctx.req.headers["user-agent"].toLowerCase();
  var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
  // 如果不是移动设备，请你直接访问官网
  if (!agentID) {
    ctx.redirect(url);
    return;
  }

  var options = {
    uri: url,
    transform: body => cheerio.load(body)
  };

  try {
    let $ = await rp(options);
    $("head").prepend('<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>');
    $("head").prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">');
    $("head").append('<script src="/init.js"></script>'); // 因为页面还要不断去load css，所以等加载完毕之后才用我写的css去覆盖

    $("a").each(function(i) {
      // windows平台开发，Linux 平台部署
      this.href = (os.platform() == "linux" ? "http://cpp.luchenqun.com/" : "http://127.0.0.1:3001/") + this.href;
    });

    $("img").each(function(i) {
      if (!/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(this.src)) {
        $(this).attr("src", "http://zh.cppreference.com" + $(this).attr("src"));
      }
    });

    // 特殊处理容器库的表格
    if (path == "w/cpp/container") {
      $("#mw-content-text")
        .children()
        .last()
        .css("overflow", "scroll");

      $("#mw-content-text")
        .children()
        .last()
        .css("display", "");
    }

    // 删除第一个头部部分信息
    $("#p-search").remove();
    $("#cpp-head-personal").remove();
    $("#cpp-head-first H5 a").text("cpp.luchenqun.com");
    $('#cpp-head-search').css('height', '100%');
    $('#cpp-head-search').css('padding-top', '4px')
    $('#cpp-head-search').append('<a style="padding-right:20px; height:100%;" href="'+ url +'" target="_blank"">原网页</a>');
    $('#cpp-head-search').append('<a style="height:100%;" href="https://github.com/luchenqun/mobile-cppreference" target="_blank"">代码</a>');

    // 删除第二个头部信息
    $("#cpp-head-second-base").remove();

    // 删除尾部部分信息
    $('#t-info').after($(".interwiki-en")); // 跳转到英语保留
    $("#footer-icons").remove();
    $("#t-upload").remove();
    $("#t-print").remove();
    $("#cpp-languages").remove();
    $('#n-help').after('<li id="n-bookmark"><a href="http://m.mybookmark.cn/" target="_blank"">我的书签</a></li>');
    $('#footer-places').after('<ul><li id="n-love">&copy;' + new Date().getFullYear() + ' I love this world and YJ</li><ul>');
    
    ctx.body = $.html();
  } catch (error) {
    ctx.body = JSON.stringify(error);
  }
});

app.listen(3001);
