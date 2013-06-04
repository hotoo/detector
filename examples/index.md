# 演示文档

---

您正在使用：

<pre id="detector"></pre>

如果识别的不正确，请 <a id="email" href="mailto:hotoo.cn@gmail.com"><strong>点击链接向我们反馈</strong></a> 。

如果点击链接无法发送邮件，可以拷贝这个页面的内容发送邮件或提
[Issues](https://github.com/aralejs/detector/issues) 反馈。

<pre id="ua"></pre>

<script type="text/javascript">/*<![CDATA[*/
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

  seajs.use("detector", function(detector){

    var OS_ALIAS = {
      // 4.0
      "windows/4":  "Windows 95",
      "windows/4.1": "Windows 98",
      "windows/4.9": "Windows ME",
      // 5.0
      "windows/5":  "Windows 2000",
      "windows/5.1":  "Windows XP",
      "windows/5.2":  "Windows Server 2003",
      // 6.0
      "windows/6":  "Windows Vista",
      "windows/6.1":  "Windows 7",
      "windows/6.2":  "Windows 8",
      "windows/6.3":  "Windows Blue",
      // 10.0
      "macosx/10": "Mac OS X Cheetah",
      "macosx/10.1": "Mac OS X Puma",
      "macosx/10.2": "Max OS X Jaguar",
      "macosx/10.3": "Mac OS X Panther",
      "macosx/10.4": "Max OS X Tiger",
      "macosx/10.5": "Max OS X Leopard",
      "macosx/10.6": "Mac OS X Snow Leopard",
      "macosx/10.7": "Mac OS X Lion",
      "macosx/10.8": "Mac OS X Mountain Lion",
      "macosx/10.9": "Mac OS X Cabernet"
    };

    var detectedInfo = [];
    detectedInfo.push("硬件设备(device)："+detector.device.name+" "+detector.device.fullVersion);
    var osAlias = OS_ALIAS[detector.os.name+"/"+detector.os.version] || "N/A";
    detectedInfo.push("操作系统(os)："+detector.os.name+" "+detector.os.fullVersion + " ("+osAlias+")");
    detectedInfo.push("浏览器(browser)："+detector.browser.name+" "+detector.browser.fullVersion+
        (detector.browser.compatible ? "(" + String(detector.browser.fullMode) + " 兼容模式)" : ""));
    detectedInfo.push("渲染引擎(engine)：" + detector.engine.name + " " + detector.engine.fullVersion +
        (detector.engine.compatible ? "(" + String(detector.engine.fullMode) + " 兼容模式)" : ""));

    document.getElementById("detector").innerHTML = detectedInfo.join("<br />");

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
      try{ // IE10 不支持此属性或方法。。。
        a.push("| "+k+" | "+String(info[k])+" |");
      }catch(ex){window.console && console.log("2. "+k+":"+ex.message);}
    }

    document.getElementById("ua").innerHTML = a.join("<br />");
    document.getElementById("email").setAttribute("href",
      "mailto:hotoo.cn@gmail.com?subject="+encodeURIComponent("Detector 反馈")+"&body="+
      encodeURIComponent(
        "请修正我们识别错误的信息：\n\n"+
        detectedInfo.join("\n")+
        "\n\n=========================\n"+
        "自动识别的原始信息如下（请勿修改）：\n"+a.join("\n")));
  });
/*]]>*/</script>

扫描下面的二维码直接访问当前页面。

![二维码](code.png)
