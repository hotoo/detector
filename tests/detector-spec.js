define(function(require) {

  var expect = require("expect");
  var detector = require('detector');

  var UAs = [
    // Windows 7, IE10
    ["Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/10.0;10.0;o",
      //      name/version;mode;compatible
      //                        c: compatible; o: origin, not compatible.
      engine: "trident/6.0;6.0;o"
    }],
    // Windows 7, IE10(兼 容模式)
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/10.0;7.0;c",
      engine: "trident/6.0;3.0;c"
    }],
    // Windows 7, IE9
    ["Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/9.0;9.0;o",
      engine: "trident/5.0;5.0;o"
    }],
    // Windows 7, IE9(兼 容模式)
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/9.0;7.0;c",
      engine: "trident/5.0;3.0;c"
    }],
    // Windows 7, IE8
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // Windows 7, IE8(兼容模式)
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0;7.0;c",
      engine: "trident/4.0;3.0;c"
    }],
    // Windows XP, IE8
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "ie/8.0;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // Windows XP, IE8(兼容模式)
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "ie/8.0;7.0;c",
      engine: "trident/4.0;3.0;c"
    }],
    // Windows XP, IE7
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "ie/7.0;7.0;o",
      engine: "trident/3.0;3.0;o"
    }],
    // Windows XP, IE6
    ["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "ie/6.0;6.0;o",
      engine: "trident/2.0;2.0;o"
    }],

    // Macintosh, Chrome
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17", {
      device: "mac/-1",
      os: "macosx/10.7.5",
      browser: "chrome/24.0.1312.56;24.0.1312.56;o",
      engine: "webkit/537.17;537.17;o"
    }],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.99 Safari/537.22", {
      device: "mac/-1",
      os: "macosx/10.8.3",
      browser: "chrome/25.0.1364.99;25.0.1364.99;o",
      engine: "webkit/537.22;537.22;o"
    }],
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "chrome/26.0.1410.43;26.0.1410.43;o",
      engine: "webkit/537.31;537.31;o"
    }],
    // Macintosh Safari.
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/536.26.17 (KHTML, like Gecko) Version/6.0.2 Safari/536.26.17", {
      device: "mac/-1",
      os: "macosx/10.7.5",
      browser: "safari/6.0.2;6.0.2;o",
      engine: "webkit/536.26.17;536.26.17;o"
    }],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/536.28.10 (KHTML, like Gecko) Version/6.0.3 Safari/536.28.10", {
      device: "mac/-1",
      os: "macosx/10.8.3",
      browser: "safari/6.0.3;6.0.3;o",
      engine: "webkit/536.28.10;536.28.10;o"
    }],
    // Macintosh, Firefox.
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:19.0) Gecko/20100101 Firefox/19.0", {
      device: "mac/-1",
      os: "macosx/10.8",
      browser: "firefox/19.0;19.0;o",
      engine: "gecko/20100101;20100101;o"
    }],
    // Macintosh Opera.
    ["Opera/9.80 (Macintosh; Intel Mac OS X 10.8.3) Presto/2.12.388 Version/12.15", {
      device: "mac/-1",
      os: "macosx/10.8.3",
      browser: "opera/12.15;12.15;o",
      engine: "presto/2.12.388;2.12.388;o"
    }],

    // 360 安全浏览器，急速模式
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1 QIHU 360SE", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "360/-1;-1;o",
      engine: "webkit/537.1;537.1;o"
    }],
    // 360 安全浏览器，兼容模式。XXX: 无法识别真实 360 信息。
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // 360 急速浏览器，急速模式
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17 QIHU 360EE", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "360/-1;-1;o",
      engine: "webkit/537.17;537.17;o"
    }],
    // 360 安全浏览器，兼容模式。XXX: 无法识别真实 360 信息。
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // TheWorld
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; qihu theworld)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "tw/-1;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // TheWorld 急速版。
    // XXX: IE 内核的浏览器可以通过 IEMode 函数统一处理并修复版本号。
    //      非 IE 内核的改比较难统一处理。
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79 Safari/535.11 QIHU THEWORLD ", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "tw/-1;-1;o",
      engine: "webkit/535.11;535.11;o"
    }],
    // TheWorld 急速版，兼容模式
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; QIHU THEWORLD)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "tw/-1;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // Maxthon
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.5.4000 Chrome/26.0.1410.43 Safari/537.1", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "mx/4.0.5.4000;4.0.5.4000;o",
      engine: "webkit/537.1;537.1;o"
    }],
    // QQBrowser
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; QQBrowser/7.3.8126.400)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "qq/7.3.8126.400;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // TT
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; TencentTraveler 4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "tt/4.0;7.0;c",
      engine: "trident/4.0;3.0;c"
    }],
    //GreenBrowser.
    ["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.0",
      browser: "green/-1;6.0;o",
      engine: "trident/2.0;2.0;o"
    }],
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "green/-1;7.0;o",
      engine: "trident/3.0;3.0;o"
    }],
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "green/-1;7.0;o",
      engine: "trident/3.0;3.0;o"
    }],
    // 枫树浏览器
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17 CoolNovo/2.0.6.12", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "fs/2.0.6.12;2.0.6.12;o",
      engine: "webkit/537.17;537.17;o"
    }],
    // 枫树浏览器，兼容模式。XXX: 误识别。
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0;7.0;c",
      engine: "trident/4.0;3.0;c"
    }],
    // 闪游浏览器
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SaaYaa)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "sy/-1;7.0;c",
      engine: "trident/4.0;3.0;c"
    }],
    // 猎豹浏览器。TODO: 识别非 IE 内核浏览的模式。
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1 LBBROWSER", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "lb/-1;-1;o",
      engine: "webkit/537.1;537.1;o"
    }],
    // 闪游浏览器，兼容模式
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SaaYaa)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "sy/-1;7.0;c",
      engine: "trident/4.0;3.0;c"
    }],
    // 淘宝浏览器
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/3.1 Safari/536.11", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "tao/3.1;3.1;o",
      engine: "webkit/536.11;536.11;o"
    }],
    // 百度浏览器
    ["Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BIDUBrowser 2.x)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "baidu/2.x;9.0;o",
      engine: "trident/5.0;5.0;o"
    }],
    // 百度浏览器，兼容模式
    ["Mozilla/5.0 (Windows; U; Windows NT 6.1; zh_CN) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/18.0 BIDUBrowser/2.x Safari/534.7", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "baidu/2.x;2.x;o",
      engine: "webkit/534.7;534.7;o"
    }],
    // 搜狗浏览器
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SE 2.X MetaSr 1.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "sg/2.x;7.0;c",
      engine: "trident/5.0;3.0;c"
    }],
    // 搜狗浏览器，兼容模式
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17 SE 2.X MetaSr 1.0", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "sg/2.x;2.x;o",
      engine: "webkit/537.17;537.17;o"
    }],


    // iPhone, Chrome.
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) CriOS/26.0.1410.50 Mobile/10B329 Safari/8536.25 (C0106E13-AA1D-4473-A60E-814F80A82BD7)", {
      device: "iphone/-1",
      os: "ios/6.1.3",
      browser: "chrome/26.0.1410.50;26.0.1410.50;o",
      engine: "webkit/536.26;536.26;o"
    }],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25", {
      device: "iphone/-1",
      os: "ios/6.1.3",
      browser: "safari/6.0;6.0;o",
      engine: "webkit/536.26;536.26;o"
    }],


    // iPad, Safari. XXX: 实际是 Safari，但是没有 Safari 标识。
    ["Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405", {
      device: "ipad/-1",
      os: "ios/3.2.1",
      browser: "na/-1;-1;o",
      engine: "webkit/531.21.10;531.21.10;o"
    }],
    // Windows Phone, IE9
    ["Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Nokia 620)", {
      device: "nokia/620",
      os: "wp/8.0",
      browser: "ie/10.0;10.0;o",
      engine: "trident/6.0;6.0;o"
    }],
    ["Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG SGH-i917)", {
      device: "wp/-1",
      os: "wp/7.5",
      browser: "ie/9.0;9.0;o",
      engine: "trident/5.0;5.0;o"
    }],
    // Windows Phone, IE9
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; XBLWP7; ZuneWP7)", {
      device: "wp/-1",
      os: "wp/7",
      browser: "ie/7.0;7.0;o",
      engine: "trident/3.0;3.0;o"
    }],
    // Windows CE
    ["Mozilla/5.0 (Windows; U; Windows CE 5.1; rv:1.8.1a3) Gecko/20060610 Minimo/0.016", {
      device: "wp/-1",
      os: "windowsce/5.1",
      browser: "na/-1;-1;o",
      engine: "gecko/20060610;20060610;o"
    }],
    ["Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; 176x220)", {
      device: "wp/-1",
      os: "windowsce/-1",
      browser: "ie/4.01;4.01;o",
      engine: "trident/0.01;0.01;o"
    }],
    // Nexus 7
    ["Mozilla/5.0 (Linux; Android 4.2.2; Nexus 7 Build/JDQ39) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.169 Safari/537.22", {
      device: "nexus/7",
      os: "android/4.2.2",
      browser: "chrome/25.0.1364.169;25.0.1364.169;o",
      engine: "webkit/537.22;537.22;o"
    }],
    // 小米浏览器
    ["Mozilla/5.0 (Linux; U; Android 4.1.1; zh-cn; MI 2 Build/JRO03L) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 XiaoMi/MiuiBrowser/1.0", {
      device: "mi/2",
      os: "android/4.1.1",
      browser: "mi/1.0;1.0;o",
      engine: "webkit/534.30;534.30;o"
    }],
    // 小米手机
    ["Mozilla/5.0 (Linux; U; Android 4.0.1; zh-cn; MI-ONE Plus Build/ITL41D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 ", {
      device: "mi/1s",
      os: "android/4.0.1",
      // XXX: Android 默认浏览器怎么会是 Safari 浏览器？
      browser: "safari/4.0;4.0;o",
      engine: "webkit/534.30;534.30;o"
    }],
    // 魅族
    ["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; M030 Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 MicroMessenger/4.2.191", {
      device: "meizu/030",
      os: "android/4.0.3",
      browser: "safari/4.0;4.0;o",
      engine: "webkit/534.30;534.30;o"
    }],

    // UC
    ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-CN; MI 1SC Build/IMM76D) AppleWebKit/534.31 (KHTML, like Gecko) UCBrowser/8.8.2.274 U3/0.8.0 Mobile Safari/534.31", {
      device: "mi/1s",
      os: "android/4.0.4",
      browser: "uc/8.8.2.274;8.8.2.274;o",
      engine: "webkit/534.31;534.31;o"
    }]
  ];

  describe('detector', function() {

    var ua, info, detect;
    for(var i=0,l=UAs.length; i<l; i++){
        ua = UAs[i][0];
        info = UAs[i][1];
        detect = detector.detect(ua);
        for(var k in info){
          if(!info.hasOwnProperty(k)){continue;}
          (function(ua, detect, info, k){
            it('detector '+k+": "+info[k], function() {

              var ext = "";
              if(k === "browser" || k === "engine"){
                ext = ";"+String(detect[k].mode)+";"+(detect[k].compatible?"c":"o");
              }

              expect(detect[k].name+"/"+String(detect[k].version)+ext).to.equal(info[k]);

            });
          })(ua, detect, info, k);
        }
    }
  });

});
