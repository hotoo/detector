
var expect = require("expect.js");
var detector = require("../detector");
var global = this;

function isBlinkEngine(){
  return "chrome" in global && "CSS" in global;
}

var UAs = [
  // Windows 10, Edge browser.
  ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10162", {
    device: "pc/-1",
    os: "windows/10.0",
    browser: "edge/12.10162;12.10162;o",
    //      name/version;mode;compatible
    //                        c: compatible; o: origin, not compatible.
    engine: "edgehtml/12.10162;12.10162;o",
  }],
  ["Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko", {
    device: "pc/-1",
    os: "windows/10.0",
    browser: "ie/11.0;11.0;o",
    //      name/version;mode;compatible
    //                        c: compatible; o: origin, not compatible.
    engine: "trident/7.0;7.0;o",
  }],
  // Windows Blue
  ["Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv 11.0) like Gecko", {
    device: "pc/-1",
    os: "windows/6.3",
    browser: "ie/11.0;11.0;o",
    //      name/version;mode;compatible
    //                        c: compatible; o: origin, not compatible.
    engine: "trident/7.0;7.0;o",
  }],
  ["Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko", {
    device: "pc/-1",
    os: "windows/6.3",
    browser: "ie/11.0;11.0;o",
    engine: "trident/7.0;7.0;o",
  }],
  // 兼容模式
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C)", {
    device: "pc/-1",
    os: "windows/6.3",
    browser: "ie/11.0;7.0;c",
    engine: "trident/7.0;3.0;c",
  }],
  ["Mozilla/5.0 (IE 11.0; Windows NT 6.3; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko", {
    device: "pc/-1",
    os: "windows/6.3",
    browser: "ie/11.0;11.0;o",
    engine: "trident/7.0;7.0;o",
  }],
  ["Mozilla/5.0 (IE 7.0; Windows NT 6.3; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko", {
    device: "pc/-1",
    os: "windows/6.3",
    browser: "ie/11.0;7.0;c",
    engine: "trident/7.0;3.0;c",
  }],
  // Windows 7, IE10
  ["Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/10.0;10.0;o",
    engine: "trident/6.0;6.0;o",
  }],
  // Windows 7, IE10(兼 容模式)
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/10.0;7.0;c",
    engine: "trident/6.0;3.0;c",
  }],
  // Windows 7, IE9
  ["Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/9.0;9.0;o",
    engine: "trident/5.0;5.0;o",
  }],
  // Windows 7, IE9(兼 容模式)
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/9.0;7.0;c",
    engine: "trident/5.0;3.0;c",
  }],
  // Windows 7, IE8
  ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/8.0;8.0;o",
    engine: "trident/4.0;4.0;o",
  }],
  // Windows 7, IE8(兼容模式)
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/8.0;7.0;c",
    engine: "trident/4.0;3.0;c",
  }],
  // Windows XP, IE8
  ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)", {
    device: "pc/-1",
    os: "windows/5.1",
    browser: "ie/8.0;8.0;o",
    engine: "trident/4.0;4.0;o",
  }],
  // Windows XP, IE8(兼容模式)
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)", {
    device: "pc/-1",
    os: "windows/5.1",
    browser: "ie/8.0;7.0;c",
    engine: "trident/4.0;3.0;c",
  }],
  // Windows XP, IE7
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727)", {
    device: "pc/-1",
    os: "windows/5.1",
    browser: "ie/7.0;7.0;o",
    engine: "trident/3.0;3.0;o",
  }],
  // Windows XP, IE6
  ["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", {
    device: "pc/-1",
    os: "windows/5.1",
    browser: "ie/6.0;6.0;o",
    engine: "trident/2.0;2.0;o",
  }],

  // Macintosh, Chrome
  ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17", {
    device: "mac/-1",
    os: "macosx/10.7.5",
    browser: "chrome/24.0.1312.56;24.0.1312.56;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.17;537.17;o",
  }],
  ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.99 Safari/537.22", {
    device: "mac/-1",
    os: "macosx/10.8.3",
    browser: "chrome/25.0.1364.99;25.0.1364.99;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.22;537.22;o",
  }],
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "chrome/26.0.1410.43;26.0.1410.43;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.31;537.31;o",
  }],
  // Macintosh Safari.
  ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/536.26.17 (KHTML, like Gecko) Version/6.0.2 Safari/536.26.17", {
    device: "mac/-1",
    os: "macosx/10.7.5",
    browser: "safari/6.0.2;6.0.2;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26.17;536.26.17;o",
  }],
  ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/536.28.10 (KHTML, like Gecko) Version/6.0.3 Safari/536.28.10", {
    device: "mac/-1",
    os: "macosx/10.8.3",
    browser: "safari/6.0.3;6.0.3;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.28.10;536.28.10;o",
  }],
  // Macintosh, Firefox.
  ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:19.0) Gecko/20100101 Firefox/19.0", {
    device: "mac/-1",
    os: "macosx/10.8",
    browser: "firefox/19.0;19.0;o",
    engine: "gecko/19.0.20100101;19.0.20100101;o",
  }],
  // Macintosh Opera.
  ["Opera/9.80 (Macintosh; Intel Mac OS X 10.8.3) Presto/2.12.388 Version/12.15", {
    device: "mac/-1",
    os: "macosx/10.8.3",
    browser: "opera/12.15;12.15;o",
    engine: "presto/2.12.388;2.12.388;o",
  }],
  ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.20 Safari/537.36 OPR/15.0.1147.18 (Edition Next)", {
    device: "mac/-1",
    os: "macosx/10.8.3",
    browser: "opera/15.0.1147.18;15.0.1147.18;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],

  // 360 安全浏览器，急速模式
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1 QIHU 360SE", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "360/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.1;537.1;o",
  }],
  // 360 安全浏览器，兼容模式。XXX: 无法识别真实 360 信息。
  ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/8.0;8.0;o",
    engine: "trident/4.0;4.0;o",
  }],
  // 360 急速浏览器，急速模式
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17 QIHU 360EE", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "360/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.17;537.17;o",
  }],
  // 360 安全浏览器，兼容模式。XXX: 无法识别真实 360 信息。
  ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/8.0;8.0;o",
    engine: "trident/4.0;4.0;o",
  }],
  // TheWorld
  ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; qihu theworld)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "theworld/-1;8.0;o",
    engine: "trident/4.0;4.0;o",
  }],
  // TheWorld 急速版。
  // XXX: IE 内核的浏览器可以通过 IEMode 函数统一处理并修复版本号。
  //      非 IE 内核的改比较难统一处理。
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79 Safari/535.11 QIHU THEWORLD ", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "theworld/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/535.11;535.11;o",
  }],
  // TheWorld 急速版，兼容模式
  ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; QIHU THEWORLD)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "theworld/-1;8.0;o",
    engine: "trident/4.0;4.0;o",
  }],
  // Maxthon
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.5.4000 Chrome/26.0.1410.43 Safari/537.1", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "maxthon/4.0.5.4000;4.0.5.4000;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.1;537.1;o",
  }],
  // QQBrowser
  ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; QQBrowser/7.3.8126.400)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "qq/7.3.8126.400;8.0;o",
    engine: "trident/4.0;4.0;o",
  }],
  ["MQQBrowser/3.7/Mozilla/5.0 (Linux; U; Android 2.3.3; zh-cn; HW-HUAWEI_C8650/C8650V100R001C92B825; 320*480; CTC/2.0) AppleWebKit/533.1 Mobile Safari/533.1", {
    device: "huawei/c8650",
    os: "android/2.3.3",
    browser: "qq/3.7;3.7;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["HUAWEI U8825D Build/HuaweiU8825D) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "huawei/u8825d",
    os: "na/-1",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["HuaweiT8100_TD/1.0 Android/2.2 Release/12.25.2010 Browser/WAP2.0 Profile/MIDP-2.0 Configuration/CLDC-1.1 AppleWebKit/533.1", {
    device: "huawei/t8100",
    os: "android/2.2",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["HUAWEI-HUAWEI-Y-220T/1.0 Linux/2.6.35.7 Android/2.3.5 Release/11.28.2012 Browser/AppleWebKit533.1 (KHTML%2C like Gecko) Mozilla/5.0 Mobile", {
    device: "huawei/y-220t",
    os: "android/2.3.5",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; U8818 Build/HuaweiU8818) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "huawei/u8818",
    os: "android/2.3.6",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["JUC (Linux; U; 4.1.2; zh-cn; Nexus S; 480*800) UCWEB8.7.2.214/145/800", {
    device: "nexus/s",
    os: "linux/-1",
    browser: "uc/8.7.2.214;8.7.2.214;o",
    engine: "na/-1;-1;o",
  }],
  ["Lenovo A356:Mozilla/5.0 (Linux; U;  Android 4.0.4; zh-cn; Lenovo A356/S030) AppleWebKit534.30 (KHTML%2C like Gecko) Version/4.0 Mobile Safari/534.30", {
    device: "lenovo/a356",
    os: "android/4.0.4",
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["Lenovo-A60/S100 Linux/2.6.35.7 Android/2.3.3 Release/04.19.2011 Browser/AppleWebKit533.1 Profile/ Configuration/", {
    device: "lenovo/a60",
    os: "android/2.3.3",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["LENOVO-Lenovo-A288t/1.0 Linux/2.6.35.7 Android/2.3.5 Release/08.16.2012 Browser/AppleWebKit533.1 (KHTML%2C like Gecko) Mozilla/5.0 Mobile", {
    device: "lenovo/a288t",
    os: "android/2.3.5",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["LenovoS899t_TD/1.0 Android/4.0 Release/02.01.2012 Browser/WAP2.0 appleWebkit/534.30; 360browser(securitypay%2Csecurityinstalled); 360(android%2Cuppayplugin); 360 Aphone Browser (4.7.1)", {
    device: "lenovo/s899t",
    os: "android/4.0",
    browser: "360/4.7.1;4.7.1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["ZTE-TU960s_TD/1.0 Linux/2.6.35 Android/2.3 Release/9.25.2011 Browser/AppleWebKit533.1", {
    device: "zte/u960s",
    os: "android/2.3",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["ZTEU880E_TD/1.0 Linux/2.6.35 Android/2.3 Release/12.15.2011 Browser/AppleWebKit533.1", {
    device: "zte/u880e",
    os: "android/2.3",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn;generic-ZTE U930/Phone Build/IMM76D) AppleWebKit534.30(KHTML%2Clike Gecko)Version/4.0 Mobile Safari/534.30 Id/EA71A15E1E65D2518F09B2C659CA09E1 RV/4.0.1;gngouua1.3.0.g chl/anzhi", {
    device: "zte/u930",
    os: "android/4.0.3",
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.2.2; zh-cn; ZTE-T U880 Build/FRG83G) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "zte/u880",
    os: "android/2.2.2",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; ZTE U795 Build/IMM76D) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "zte/u795",
    os: "android/4.0.4",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["ZTEU795+_TD/1.0 Linux/3.0.13 Android/4.0 Release/7.10.2012 Browser/AppleWebKit534.30", {
    device: "zte/u795+",
    os: "android/4.0",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; ZTE-U V881 Build/GINGERBREAD) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "zte/v881",
    os: "android/2.3.5",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; vivo E1 Build/GRJ90) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "vivo/e1",
    os: "android/2.3.5",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["NokiaC7-00/111.040.1511 (Symbian/3; Series60/5.3 Mozilla/5.0; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/525 (KHTML%2C like Gecko) Version/3.0 NokiaBrowser/8.3.1.4", {
    device: "nokia/c7",
    os: "symbian/3",
    browser: "nokia/8.3.1.4;8.3.1.4;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/525;525;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.1.5; zh-cn; HTC_X315e Build/IML74K) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/x315e",
    os: "android/4.1.5",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; HTC T328d Build/IML74K) UC AppleWebKit/530+ (KHTML%2C like Gecko) Mobile Safari/530", {
    device: "htc/t328d",
    os: "android/4.0.3",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/530+;530+;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; HTC-T329d/1.11.1401.1) AndroidWebKit/534.30 (KHTML%2C Like Gecko) Version/4.0 Mobile Safari/534.30", {
    device: "htc/t329d",
    os: "android/4.0.4",
    browser: "android/4.0;4.0;o",
    engine: "androidwebkit/534.30;534.30;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.5; en-es; HTC Incredible S Build/GRJ90) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/incredible s",
    os: "android/2.3.5",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["JUC (Linux; U; 2.3.5; zh-cn; HTC Rhyme S510b; 480*800) UCWEB8.7.4.225/145/800", {
    device: "htc/rhyme s510b",
    os: "linux/-1",
    browser: "uc/8.7.4.225;8.7.4.225;o",
    engine: "na/-1;-1;o",
  }],
  ["UCWEB/2.0 (Linux; U; Adr Android 4.0.8; zh-CN; HTC inspire4G(LTE)) U2/1.0.0 UCBrowser/8.8.3.278 U2/1.0.0 Mobile", {
    device: "htc/inspire4g",
    os: "android/4.0.8",
    browser: "uc/8.8.3.278;8.8.3.278;o",
    engine: "u2/1.0.0;1.0.0;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC Magic Build/FRG83) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/magic",
    os: "android/2.2.1",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; HTC Sensation Z710e Build/IML74K) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/sensation z710e",
    os: "android/4.0.3",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.3; zh-cn; HTC Wildfire S A510e Build/GRI40) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/wildfire s a510e",
    os: "android/2.3.3",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.2.1; en-sg; HTC Wildfire Build/FRG83D) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/wildfire",
    os: "android/2.2.1",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; HTC Desire S Build/GRJ90) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/desire s",
    os: "android/2.3.5",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.2.1; zh-cn; HTC Rezound Build/IML74K) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/rezound",
    os: "android/4.2.1",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; HTC One X Build/IMM76D) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "htc/one x",
    os: "android/4.0.4",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["HTCT329t_TD/1.0 Android/4.0 release/2012 Browser/WAP2.0 Profile/MIDP-2.0 Configuration/CLDC-1.1", {
    device: "htc/t329t",
    os: "android/4.0",
    browser: "na/-1;-1;o",
    engine: "na/-1;-1;o",
  }],
  // TT
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; TencentTraveler 4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "tt/4.0;7.0;c",
    engine: "trident/4.0;3.0;c",
  }],
  //GreenBrowser.
  ["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; GreenBrowser)", {
    device: "pc/-1",
    os: "windows/5.0",
    browser: "green/-1;6.0;o",
    engine: "trident/2.0;2.0;o",
  }],
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; GreenBrowser)", {
    device: "pc/-1",
    os: "windows/5.1",
    browser: "green/-1;7.0;o",
    engine: "trident/3.0;3.0;o",
  }],
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; GreenBrowser)", {
    device: "pc/-1",
    os: "windows/5.1",
    browser: "green/-1;7.0;o",
    engine: "trident/3.0;3.0;o",
  }],
  // 枫树浏览器
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17 CoolNovo/2.0.6.12", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "coolnovo/2.0.6.12;2.0.6.12;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.17;537.17;o",
  }],
  // 枫树浏览器，兼容模式。XXX: 误识别。
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "ie/8.0;7.0;c",
    engine: "trident/4.0;3.0;c",
  }],
  // 闪游浏览器
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SaaYaa)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "saayaa/-1;7.0;c",
    engine: "trident/4.0;3.0;c",
  }],
  // 猎豹浏览器。TODO: 识别非 IE 内核浏览的模式。
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1 LBBROWSER", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "liebao/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.1;537.1;o",
  }],
  // 闪游浏览器，兼容模式
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SaaYaa)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "saayaa/-1;7.0;c",
    engine: "trident/4.0;3.0;c",
  }],
  // 淘宝浏览器
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/3.1 Safari/536.11", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "tao/3.1;3.1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.11;536.11;o",
  }],
  // 百度浏览器
  ["Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BIDUBrowser 2.x)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "baidu/2.x;9.0;o",
    engine: "trident/5.0;5.0;o",
  }],
  // 百度浏览器，兼容模式
  ["Mozilla/5.0 (Windows; U; Windows NT 6.1; zh_CN) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/18.0 BIDUBrowser/2.x Safari/534.7", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "baidu/2.x;2.x;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.7;534.7;o",
  }],
  // 搜狗浏览器
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SE 2.X MetaSr 1.0)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "sogou/2.x;7.0;c",
    engine: "trident/5.0;3.0;c",
  }],
  // 搜狗浏览器，兼容模式
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17 SE 2.X MetaSr 1.0", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "sogou/2.x;2.x;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.17;537.17;o",
  }],


  // iPhone, Chrome.
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) CriOS/26.0.1410.50 Mobile/10B329 Safari/8536.25 (C0106E13-AA1D-4473-A60E-814F80A82BD7)", {
    device: "iphone/-1",
    os: "ios/6.1.3",
    browser: "chrome/26.0.1410.50;26.0.1410.50;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o",
  }],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25", {
    device: "iphone/-1",
    os: "ios/6.1.3",
    browser: "safari/6.0;6.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o",
  }],
  ["UCWEB/2.0 (iOS; U; iPh OS 6_1_2; zh-CN; iPh4%2C1) U2/1.0.0 UCBrowser/9.0.1.284 U2/1.0.0 Mobile", {
    device: "iphone/4",
    os: "ios/6.1.2",
    browser: "uc/9.0.1.284;9.0.1.284;o",
    engine: "u2/1.0.0;1.0.0;o",
  }],
  ["UCWEB/2.0 (iOS; U; iPh OS 5_1_1; zh-CN; iPh3%2C1) U2/1.0.0 UCBrowser/9.0.0.260 U2/1.0.0 Mobile", {
    device: "iphone/3",
    os: "ios/5.1.1",
    browser: "uc/9.0.0.260;9.0.0.260;o",
    engine: "u2/1.0.0;1.0.0;o",
  }],
  // iPad mini.
  ["Mozilla/5.0 (iPad; CPU OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25", {
    device: "ipad/-1",
    os: "ios/6.1.3",
    browser: "safari/6.0;6.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o",
  }],


  // iPad, Safari. XXX: 实际是 Safari，但是没有 Safari 标识。
  ["Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405", {
    device: "ipad/-1",
    os: "ios/3.2.1",
    browser: "webview/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/531.21.10;531.21.10;o",
  }],
  // iPad mini, MIHtool. WebView.
  ["Mozilla/5.0 (iPad; CPU OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329", {
    device: "ipad/-1",
    os: "ios/6.1.3",
    browser: "webview/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o",
  }],
  ["Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML%2C like Gecko) Mobile/9A405", {
    device: "ipad/-1",
    os: "ios/5.0.1",
    browser: "webview/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.46;534.46;o",
  }],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_2 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B146", {
    device: "iphone/-1",
    os: "ios/6.1.2",
    browser: "webview/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o",
  }],
  // Windows Phone, IE9
  ["Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Nokia 620)", {
    device: "nokia/620",
    os: "wp/8.0",
    browser: "ie/10.0;10.0;o",
    engine: "trident/6.0;6.0;o",
  }],
  ["Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG SGH-i917)", {
    device: "samsung/i917",
    os: "wp/7.5",
    browser: "ie/9.0;9.0;o",
    engine: "trident/5.0;5.0;o",
  }],
  // Windows Phone, IE9
  ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; XBLWP7; ZuneWP7)", {
    device: "wp/-1",
    os: "wp/7",
    browser: "ie/7.0;7.0;o",
    engine: "trident/3.0;3.0;o",
  }],
  // Windows CE
  ["Mozilla/5.0 (Windows; U; Windows CE 5.1; rv:1.8.1a3) Gecko/20060610 Minimo/0.016", {
    device: "wp/-1",
    os: "windowsce/5.1",
    browser: "na/-1;-1;o",
    engine: "gecko/1.8.1a3.20060610;1.8.1a3.20060610;o",
  }],
  ["Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; 176x220)", {
    device: "wp/-1",
    os: "windowsce/-1",
    browser: "ie/4.01;4.01;o",
    engine: "trident/0.01;0.01;o",
  }],
  // Nexus 7
  ["Mozilla/5.0 (Linux; Android 4.2.2; Nexus 7 Build/JDQ39) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.169 Safari/537.22", {
    device: "nexus/7",
    os: "android/4.2.2",
    browser: "chrome/25.0.1364.169;25.0.1364.169;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.22;537.22;o",
  }],
  // 小米浏览器
  ["Mozilla/5.0 (Linux; U; Android 4.1.1; zh-cn; MI 2 Build/JRO03L) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 XiaoMi/MiuiBrowser/1.0", {
    device: "mi/2",
    os: "android/4.1.1",
    browser: "mi/1.0;1.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  // 小米手机
  ["Mozilla/5.0 (Linux; U; Android 4.0.1; zh-cn; MI-ONE Plus Build/ITL41D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 ", {
    device: "mi/one plus",
    os: "android/4.0.1",
    // XXX: Android 默认浏览器怎么会是 Safari 浏览器？
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.1.1; zh-cn; M040 Build/JRO03H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30", {
    device: "meizu/040",
    os: "android/4.1.1",
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["meizu/9|Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; M9 Build/GRJ90) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "meizu/9",
    os: "android/2.3.5",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.2.1; zh-cn; M040 Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30", {
    device: "meizu/040",
    os: "android/4.2.1",
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; MEIZU MX Build/GRJ90) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobiile Safari/533.1", {
    device: "meizu/mx",
    os: "android/2.3.5",
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; MX4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36", {
    device: "meizu/x4",
    os: "android/4.4.2",
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; MT15i Build/4.1.B.0.431) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "sonyericsson/15i",
    os: "android/4.0.4",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["CoolPad8190_CMCC_TD/1.0 Linux/3.0.8 Android/4.0 Release/10.15.2012 Browser/AppleWebkit534.3", {
    device: "coolpad/8190",
    os: "android/4.0",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.3;534.3;o",
  }],
  ["CoolPad8060_CMCC_TD/1.0 Linux/2.6.35 Android/2.3 Release/8.30.2012 Browser/AppleWebkit533.1", {
    device: "coolpad/8060",
    os: "android/2.3",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn;YL-Coolpad_7260A/2.3.002.120217.7260+; 480*800; CUCC/3.0) CoolpadWebkit/533.1", {
    device: "coolpad/7260a",
    os: "android/2.3.5",
    browser: "na/-1;-1;o",
    engine: "coolpadwebkit/533.1;533.1;o",
  }],
  ["OPPO_R815T/1.0 Linux/3.4.0 Android/4.2.1  Release/12.24.2012 Browser/AppleWebKit534.30 Mobile Safari/534.30 MBBMS/2.2 System/Android 4.2.1;", {
    device: "oppo/r815t",
    os: "android/4.2.1",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["KONKA-V926/1.0 Linux/2.6.35.7 Android/2.3.5 Release/07.30.2012 Browser/AppleWebKit533.1 (KHTML%2C like Gecko) Mozilla/5.0 Mobile", {
    device: "konka/v926",
    os: "android/2.3.5",
    browser: "na/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],

  // UC
  ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-CN; MI 1SC Build/IMM76D) AppleWebKit/534.31 (KHTML, like Gecko) UCBrowser/8.8.2.274 U3/0.8.0 Mobile Safari/534.31", {
    device: "mi/1sc",
    os: "android/4.0.4",
    browser: "uc/8.8.2.274;8.8.2.274;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["UCWEB/2.0 (Linux; U; Adr 2.3.5; zh-CN; F-03D) U2/1.0.0 UCBrowser/8.8.3.278 U2/1.0.0 Mobile", {
    device: "android/-1",
    os: "android/2.3.5",
    browser: "uc/8.8.3.278;8.8.3.278;o",
    engine: "u2/1.0.0;1.0.0;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; MI-ONE Plus Build/GINGERBREAD) UC AppleWebKit/530+ (KHTML%2C like Gecko) Mobile Safari/530", {
    device: "mi/one plus",
    os: "android/2.3.5",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/530+;530+;o",
  }],
  // SAMSUNG Android Pad, UC HD.
  ["Mozilla/5.0 (Linux; U; Android 3.2; zh-cn; GT-P6800 Build/HTJ85B) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13 UCBrowser/2.3.2.289", {
    device: "samsung/p6800",
    os: "android/3.2",
    browser: "uc/2.3.2.289;2.3.2.289;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.13;534.13;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; SAMSUNG-GT-S7568_TD/1.0 Android/4.0.4 Release/07.15.2012 Browser/AppleWebKit534.30 Build/IMM76D) ApplelWebkit/534.30 (KHTML%2Clike Gecko) Version/4.0 Mobile Safari/534.30", {
    device: "samsung/s7568",
    os: "android/4.0.4",
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; SCH-I779 Build/GINGERBREAD) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "samsung/i779",
    os: "android/2.3.6",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  [{
    "userAgent": "Mozilla/5.0 (Linux; U; Android 3.2; zh-cn; GT-P6800 Build/HTJ85B) UC AppleWebKit/534.31 (KHTML, like Gecko) Mobile Safari/534.31",
    "appVersion": "5.0 (Linux; U; Android 3.2; zh-cn; GT-P6800 Build/HTJ85B) UC AppleWebKit/534.31 (KHTML, like Gecko) Mobile Safari/534.31 UC/8.7.4.225",
    "vendor": "UCWEB",
  }, {
    device: "samsung/p6800",
    os: "android/3.2",
    browser: "uc/8.7.4.225;8.7.4.225;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.2.2; zh-cn; SM-T311 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30", {
    device: "samsung/t311",
    os: "android/4.2.2",
    browser: "android/4.0;4.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  ["Mozilla/5.0 (Linux; Android 4.4.2; zh-cn; SAMSUNG-SM-N9009 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36", {
    device: "samsung/n9009",
    os: "android/4.4.2",
    browser: "chrome/28.0.1500.94;28.0.1500.94;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],
  ["(Linux; Android 4.3; zh-cn; SAMSUNG SM-N9002 Build/JSS15J) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36", {
    device: "samsung/n9002",
    os: "android/4.3",
    browser: "chrome/28.0.1500.94;28.0.1500.94;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; LG-P500 Build/GRI40) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
    device: "lg/p500",
    os: "android/2.3.7",
    browser: "uc/-1;-1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o",
  }],
  [{
    "userAgent": "Mozilla/4.0 (compatible;Android;320x480)",
    "appVersion": "4.0 (compatible;Android;320x480) UC/9.1.1.309",
    "vendor": "UCWEB",
  }, {
    device: "android/-1",
    os: "android/-1",
    browser: "uc/9.1.1.309;9.1.1.309;o",
    engine: "na/-1;-1;o",
  }],

  [{
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12597 Safari/537.36",
    "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12597 Safari/537.36",
    "vendor": "Yandex",
  }, {
    device: "mac/-1",
    os: "macosx/10.9.2",
    browser: "yandex/14.2.1700.12597;14.2.1700.12597;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],
  [{
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) YaBrowser/14.2.1700.0 Mobile/11D167 Safari/9537.53",
    "appVersion": "5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) YaBrowser/14.2.1700.0 Mobile/11D167 Safari/9537.53",
    "vendor": "Apple Computer, Inc.",
  }, {
    device: "iphone/-1",
    os: "ios/7.1",
    browser: "yandex/14.2.1700.0;14.2.1700.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.51.1;537.51.1;o",
  }],
  [{
    "userAgent": "Mozilla/5.0 (Linux; Android 4.1.1; MI 2 Build/JRO03L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12535.00 Mobile Safari/537.36",
    "appVersion": "5.0 (Linux; Android 4.1.1; MI 2 Build/JRO03L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12535.00 Mobile Safari/537.36",
    "vendor": "Yandex",
  }, {
    device: "mi/2",
    os: "android/4.1.1",
    browser: "yandex/14.2.1700.12535.00;14.2.1700.12535.00;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],
  [{
    "userAgent": "Mozilla/5.0 (Linux; Android 4.2.2; MediaPad X1 7.0 Build/HuaweiMediaPad) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12535.01 Safari/537.36",
    "appVersion": "5.0 (Linux; Android 4.2.2; MediaPad X1 7.0 Build/HuaweiMediaPad) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12535.01 Safari/537.36",
    "vendor": "Yandex",
  }, {
    device: "huawei/x1 7.0",
    os: "android/4.2.2",
    browser: "yandex/14.2.1700.12535.01;14.2.1700.12535.01;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],
  [{
    "userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1106.241 YaBrowser/1.5.1106.241 Safari/537.4",
    "appVersion": "5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1106.241 YaBrowser/1.5.1106.241 Safari/537.4",
    "vendor": "Yandex",
  }, {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "yandex/1.5.1106.241;1.5.1106.241;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.4;537.4;o",
  }],

  ["Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 AliApp(AP/2.3.4) AlipayClient/2.3.4",
  {
    device: "iphone/-1",
    os: "ios/7.0",
    browser: "ali-ap/2.3.4;2.3.4;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.51.1;537.51.1;o",
  }],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML,  like Gecko) Mobile/11D201 AlipayClient/8.0.0.0110",
  {
    device: "iphone/-1",
    os: "ios/7.1.1",
    browser: "ali-ap/8.0.0.0110;8.0.0.0110;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.51.2;537.51.2;o",
  }],

  //安卓opera
  ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; MI 3W Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Oupeng/10.0.1.82018 Mobile Safari/537.36",
  {
    device: "mi/3w",
    os: "android/4.4.2",
    browser: "oupeng/10.0.1.82018;10.0.1.82018;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],
  //安卓搜狗
  ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; MI 3W Build/KVT49L) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 SogouMSE,SogouMobileBrowser/3.1.2",
  {
    device: "mi/3w",
    os: "android/4.4.2",
    browser: "sogou/3.1.2;3.1.2;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o",
  }],
  //安卓猎豹极速
  ["Mozilla/5.0 (Linux; Android 4.4.2; MI 3W) AppleWebKit/535.19 (KHTML, like Gecko) Version/4.0 LieBaoFast/2.10.0 Mobile Safari/535.19",
  {
    device: "mi/3w",
    os: "android/4.4.2",
    browser: "liebao/2.10.0;2.10.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/535.19;535.19;o",
  }],
  //百度安卓
  ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; MI 3W Build/KVT49L) AppleWebKit/534.24 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.24 T5/2.0 baidubrowser/5.2.3.0 (Baidu; P1 4.4.2)",
  {
    device: "mi/3w",
    os: "android/4.4.2",
    browser: "baidu/5.2.3.0;5.2.3.0;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.24;534.24;o",
  }],
  //小米3 遨游
  ["Mozilla/5.0 (iPad; CPU OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D201 Safari/9537.53 MxBrowser/4.3.1.2000",
  {
    device: "ipad/-1",
    os: "ios/7.1.1",
    browser: "maxthon/4.3.1.2000;4.3.1.2000;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.51.2;537.51.2;o",
  }],
  // UC桌面浏览器
  ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 UBrowser/2.0.1288.1 Safari/537.36",
  {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "uc/2.0.1288.1;2.0.1288.1;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; MI 3W Build/KVT49L) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 UCBrowser/9.9.2.467 U3/0.8.0 Mobile Safari/533.1",
  {
    device: "mi/3w",
    os: "android/4.4.2",
    browser: "uc/9.9.2.467;9.9.2.467;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o",
  }],
  ["Mozilla/5.0 (iPad; CPU OS 7_1_2 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) BaiduHD/2.6.2 Mobile/10A406 Safari/8536.25",
  {
    device: "ipad/-1",
    os: "ios/7.1.2",
    browser: "baidu/2.6.2;2.6.2;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.46;534.46;o",
  }],

  // Blackberry
  ["Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.1.0.4633 Mobile Safari/537.10+",
  {
    device: "blackberry/-1",
    os: "blackberry/10.1.0.4633",
    browser: "blackberry/10.1.0.4633;10.1.0.4633;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.10+;537.10+;o",
  }],
  ["Mozilla/5.0 (BlackBerry; U; BlackBerry 9810; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.912 Mobile Safari/534.11+",
  {
    device: "blackberry/9810",
    os: "blackberry/7.1.0.912",
    browser: "blackberry/7.1.0.912;7.1.0.912;o",
    engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.11+;534.11+;o",
  }],
  ["BlackBerry9000/5.0.0.93 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/179",
  {
    device: "blackberry/9000",
    os: "blackberry/5.0.0.93",
    browser: "blackberry/5.0.0.93;5.0.0.93;o",
    engine: "na/-1;-1;o",
  }],

  // iPhone 5, 微信。
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.40 (KHTML, like Gecko) Mobile/11A4372q MicroMessenger/4.5", {
    device: "iphone/-1",
    os: "ios/7.0",
    browser: "micromessenger/4.5;4.5;o",
    engine: "webkit/537.40;537.40;o",
  }],
  // 魅族
  ["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; M030 Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 MicroMessenger/4.2.191", {
    device: "meizu/030",
    os: "android/4.0.3",
    browser: "micromessenger/4.2.191;4.2.191;o",
    engine: "webkit/534.30;534.30;o",
  }],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B435 MicroMessenger/6.0.1 NetType/WIFI", {
    device: "iphone/-1",
    os: "ios/8.1.1",
    browser: "micromessenger/6.0.1;6.0.1;o",
    engine: "webkit/600.1.4;600.1.4;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.4.4; zh-cn; M463C Build/KTU84P) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025440 Mobile Safari/533.1 MicroMessenger/6.2.5.50_r0e62591.621 NetType/WIFI Language/zh_CN", {
    device: "meizu/463c",
    os: "android/4.4.4",
    browser: "micromessenger/6.2.5.50;6.2.5.50;o",
    engine: "webkit/533.1;533.1;o",
  }],
  ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; HUAWEI MT7-CL00 Build/HuaweiMT7-CL00) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025440 Mobile Safari/533.1 MicroMessenger/6.2.5.51_rfe7d7c5.621 NetType/WIFI Language/zh_CN", {
    device: "huawei/mt7",
    os: "android/4.4.2",
    browser: "micromessenger/6.2.5.51;6.2.5.51;o",
    engine: "webkit/533.1;533.1;o",
  }],

  // NA
  ["",
  {
    device: "na/-1",
    os: "na/-1",
    browser: "na/-1;-1;o",
    engine: "na/-1;-1;o",
  }],
];

describe("detector", function() {
  function makeTest(ua, detect, info, k, origin_ua){
    it("ua: " + origin_ua + " » detector " + k + ": " + info[k], function() {

      var ext = "";
      if(k === "browser" || k === "engine"){
        ext = ";" + detect[k].fullMode + ";" + (detect[k].compatible ? "c" : "o");
      }

      expect(detect[k].name + "/" + detect[k].fullVersion + ext).to.equal(info[k]);

    });
  }

  var nav, ua, info, detect, type;
  var origin_ua;
  for (var i = 0, l = UAs.length; i < l; i++){
    nav = UAs[i][0];
    type = Object.prototype.toString.call(nav);
    if (type === "[object String]") {
      ua = nav;
      origin_ua = ua;
    } else if (type === "[object Object]") {
      ua = (nav.userAgent || "") + " " + (nav.appVersion || "") + " " + (nav.vendor || "");
      origin_ua = nav.userAgent;
    }else{
      continue;
    }
    info = UAs[i][1];
    detect = detector.parse(ua);
    for (var k in info) {
      if (!info.hasOwnProperty(k)){ continue; }
      makeTest(ua, detect, info, k, origin_ua);
    }
  }
});
