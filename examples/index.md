# Example

---

You're using:

<pre id="detector-info"></pre>

* If detected information incorrect, <a id="issues"
  href="https://github.com/hotoo/detector/issues/new"
  target="_blank"><strong>Please put new issue for feedback</strong></a>.
* If you without Github account, <a id="email" href="mailto:hotoo.cn@gmail.com"
  target="_blank"><strong>Please send Email to us</strong></a>.
* if click Email link can't send Email, Please copy this page's information,
  and send email to `hotoo.cn@gmail.com`.

Thank you!

<pre id="ua"></pre>

<script type='text/spm'>
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

var $ = require('jquery');
var detector = require('detector');


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
detectedInfo.push("* Hardware Device: "+detector.device.name+" "+detector.device.fullVersion);
var osAlias = OS_ALIAS[detector.os.name+"/"+(detector.os.fullVersion.split(".").slice(0,2).join("."))] || "N/A";
detectedInfo.push("* Operation System: "+detector.os.name+" "+detector.os.fullVersion + " ("+osAlias+")");
detectedInfo.push("* Browser："+detector.browser.name+" "+detector.browser.fullVersion+
    (detector.browser.compatible ? "(" + String(detector.browser.fullMode) + " compatible）" : ""));
detectedInfo.push("* Rendering Engine: " + detector.engine.name + " " + detector.engine.fullVersion +
    (detector.engine.compatible ? "(" + String(detector.engine.fullMode) + " compatible）" : ""));

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
  "| Field | Value |",
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
  "detector version: " + detector_version + "<br /><br/>" +
  a.join("<br />");

document.getElementById("email").setAttribute("href",
  "mailto:hotoo.cn@gmail.com?subject=" +
    encodeURIComponent("detector: detected information") +
  "&body="+
  encodeURIComponent(
    "Help us for fix incorrect detected information: \n\n"+
    "> Note: You just need to fix the part of incorrect information.\n\n"+
    detectedInfo.join("\n")+
    "\n\n=========================\n"+
    "REFERENCE INFORMATION BY AUTO DETECTED (DO'NT MODIFY):\n\n" +
    "detector version: " + detector_version + "\n\n" +
    a.join("\n")
  ));

document.getElementById("issues").href = "https://github.com/hotoo/detector/issues/new" +
    "?title=detector%20 detected information"+
    "&body=" +
      encodeURIComponent(
        "Help us for fix incorrect detected information:\n\n"+
        "> Note: You just need to fix the part of incorrect information.\n\n"+
        detectedInfo.join("\n") +
        "\n"+
        "\n=========================\n"+
        "REFERENCE INFORMATION BY AUTO DETECTED (DO'NT MODIFY):\n\n"+
        "detector version: " + detector_version + "\n\n" +
        detectedInfo.join("\n")+
        "\n\n"+
        a.join("\n")
      );
</script>

Scan QR code for vist this page.

![QR code](code.png)
