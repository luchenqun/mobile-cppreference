$(function() {
  var u = navigator.userAgent;
  var device = { //移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
  };

  if (!device.mobile)  return;

  $("body").css("min-width", "100%");
  $("#content").css("max-width", "100%");

  $("table").wrap("<div style='width:100%;overflow:scroll;'></div>");

  // 删除 "运行此代码"
  $(".t-example-live-link").remove();
  $(".mw-geshi").css("width", "100%");
  $("pre").css("width", "100%");
  $(".mw-geshi").css("padding", "0px");
  $("pre").css("padding", "10px");

  // 头部
  $("#cpp-head-first").css("max-width", "100%");
  $("#cpp-head-second").css("max-width", "100%");

  // 尾部
  $("#footer").css("max-width", "100%");
  $("#cpp-footer-base").css("max-width", "100%");
});
