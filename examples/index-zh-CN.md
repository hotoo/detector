# 演示文档

---

您正在使用：

<pre id="detector-info"></pre>

* 如果上面识别的信息不正确，<a id="issues"
  href="https://github.com/hotoo/detector/issues/new"
  target="_blank"><strong>请给我们提 Issues 反馈</strong></a>。
* 如果没有 Github 账户，请向我们 <a id="email" href="mailto:hotoo.cn@gmail.com"
  target="_blank"><strong>发送 Email</strong></a>。
* 如果点击链接无法发送 Email，请拷贝这个页面的内容手工发送 Email 给 `hotoo.cn@gmail.com`。

<pre id="ua"></pre>

<div style="display:none;">
````javascript
require('jquery');
require('detector');
````
</div>

<script>
function isObject(obj){
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function expandObject(obj){
  if(!isObject(obj)){return obj;}
  var s = '{';
  for(var k in obj){
    if(obj.hasOwnProperty(k)){
      s += k + ':' + typeof obj[k] + ',';
    }
  }
  s += '}';
  return s;
}

var $ = window['jquery']; // require('jquery');
var detector = window['detector']; // require('detector');

var OS_ALIAS = {
  // Windows.
  "windows/4.0":  "Windows 95",
  "windows/4.1": "Windows 98",
  "windows/4.9": "Windows ME",
  "windows/5.0":  "Windows 2000",
  "windows/5.1":  "Windows XP",
  "windows/5.2":  "Windows Server 2003",
  "windows/6.0":  "Windows Vista",
  "windows/6.1":  "Windows 7",
  "windows/6.2":  "Windows 8",
  "windows/6.3":  "Windows 8.1",
  // Mac OS X.
  "macosx/10.0": "Mac OS X Cheetah",
  "macosx/10.1": "Mac OS X Puma",
  "macosx/10.2": "Mac OS X Jaguar",
  "macosx/10.3": "Mac OS X Panther",
  "macosx/10.4": "Mac OS X Tiger",
  "macosx/10.5": "Mac OS X Leopard",
  "macosx/10.6": "Mac OS X Snow Leopard",
  "macosx/10.7": "Mac OS X Lion",
  "macosx/10.8": "Mac OS X Mountain Lion",
  "macosx/10.9": "Mac OS X Mavericks",
  "macosx/10.10": "Mac OS X Yosemite",
  "macosx/10.11": "Mac OS X El Capitan",
  // iOS.
  "ios/9.0": "iOS 9.0 (Monarch)",
  // Android.
  "android/1.5": "Android Cupcake",
  "android/1.6": "Android Doughnut",
  "android/2.0": "Android Eclair",
  "android/2.1": "Android Eclair",
  "android/2.2": "Android Froyo",
  "android/2.3": "Android Gingerbread",
  "android/3.0": "Android Honeycomb",
  "android/3.1": "Android Honeycomb",
  "android/3.2": "Android Honeycomb",
  "android/4.0": "Android Ice Cream Sandwich",
  "android/4.1": "Android JellyBean",
  "android/4.2": "Android JellyBean",
  "android/4.3": "Android JellyBean",
  "android/4.4": "Android KitKat"
};

var detectedInfo = [];
detectedInfo.push("* 硬件设备："+detector.device.name+" "+detector.device.fullVersion);
var osAlias = OS_ALIAS[detector.os.name+"/"+(detector.os.fullVersion.split(".").slice(0,2).join("."))] || "N/A";
detectedInfo.push("* 操作系统："+detector.os.name+" "+detector.os.fullVersion + " ("+osAlias+")");
detectedInfo.push("* 浏览器："+detector.browser.name+" "+detector.browser.fullVersion+
    (detector.browser.compatible ? "(" + String(detector.browser.fullMode) + " 兼容模式）" : ""));
detectedInfo.push("* 渲染引擎：" + detector.engine.name + " " + detector.engine.fullVersion +
    (detector.engine.compatible ? "(" + String(detector.engine.fullMode) + " 兼容模式）" : ""));

document.getElementById("detector-info").innerHTML = detectedInfo.join("<br />");

var ext;
if(!window.external){
  ext = "undefined";
}if(Object.prototype.toString.call(window.external)==="[object Object]"){
  ext = [];
  try{
    for(var k in window.external){
      ext.push(k+": "+typeof(window.external[k])+
        (window.external.hasOwnProperty(k)?"":"[prototype]"));
    }
  }catch(ex){window.console && console.log("1. "+k+":"+ex.message);}
  ext = "{"+ext.join(", ")+"}";
}else{
  ext = window.external +"["+typeof(window.external)+"]";
}
var info = {
  ua : navigator.userAgent,
  vendor : navigator.vendor,
  vendorSub : navigator.vendorSub,
  platform : navigator.platform,
  external : ext,
  appCodeName : navigator.appCodeName,
  appName : navigator.appName,
  appVersion : navigator.appVersion,
  product : navigator.product,
  productSub : navigator.productSub,
  screenWidth : screen.width,
  screenHeight : screen.height,
  colorDepth : screen.colorDepth,
  documentMode: document.documentMode,
  compatMode: document.compatMode
};

var a = [
  "| 字段 | 值 |",
  "|------|----|"
];
for(var k in info){
  if(!info.hasOwnProperty(k)){continue;}
  try{ // IE10 不支持此属性或方法。
    a.push("| "+k+" | "+String(info[k])+" |");
  }catch(ex){window.console && console.log("2. "+k+":"+ex.message);}
}

var detector_version = $("p.sidebar-version > a").text();

document.getElementById("ua").innerHTML =
  "detector 版本：" + detector_version + "<br /><br/>" +
  a.join("<br />");

document.getElementById("email").setAttribute("href",
  "mailto:hotoo.cn@gmail.com?subject=" +
    encodeURIComponent("Detector 识别信息") +
  "&body="+
  encodeURIComponent(
    "请修正我们识别错误的信息：\n\n"+
    "> 注：只需要修改识别错误的部分即可。\n\n"+
    detectedInfo.join("\n")+
    "\n\n=========================\n"+
    "自动识别的原始信息如下（请勿修改）：\n\n" +
    "detector 版本：" + detector_version + "\n\n" +
    a.join("\n")
  ));

document.getElementById("issues").href = "https://github.com/hotoo/detector/issues/new" +
    "?title=detector%20 识别信息"+
    "&body=" +
      encodeURIComponent(
        "请修正我们识别错误的信息：\n\n"+
        "> 注：只需要修改识别错误的部分即可。\n\n"+
        detectedInfo.join("\n") +
        "\n"+
        "\n=========================\n"+
        "自动识别的原始信息如下（请勿修改）：\n\n"+
        "detector 版本：" + detector_version + "\n\n" +
        detectedInfo.join("\n")+
        "\n\n"+
        a.join("\n")
      );
</script>

扫描下面的二维码直接访问当前页面。

![二维码](code.png)
