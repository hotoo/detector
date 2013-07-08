# detector

---

[![Build Status](https://secure.travis-ci.org/aralejs/detector.png?branch=master)](https://travis-ci.org/aralejs/detector)
[![Coverage Status](https://coveralls.io/repos/aralejs/detector/badge.png?branch=master)](https://coveralls.io/r/aralejs/detector)


客户端信息识别模块，用于自动识别用户使用的客户端环境。包括：

1. 硬件设备。
2. 操作系统。
3. 浏览器。
4. 浏览器渲染引擎。

识别到的信息结构如下：

```javascript
detector = {
    device: {
        name: "iphone",
        version: -1,
        fullVersion: "-1",
        [iphone]: -1
    },
    os: {
        name: "ios",
        version: 6.1,
        fullVersion: "6.1",
        [ios]: 6.1
    },
    browser: {
        name: "chrome":
        version: 26.0,
        fullVersion: "26.0.1410.50",
        mode: 26.0,
        fullMode: "26.0.1410.50",
        compatible: false,
        [chrome]: 26.0
    },
    engine: {
        name: "webkit",
        version: 536.26,
        fullVersion: "536.26",
        mode: 523.26,
        fullMode: "523.26",
        compatible: false,
        [webkit]: 536.26
    }
}
```

备注：上面的 `[iphone]`, `[ios]`, `[chrome]`, `[webkit]` 是动态的，根据实际识别
到的信息不同而有所不同。

注：

* 这个是基于浏览器运行的版本，另外还提供了在服务端运行的
  [Node 版本](https://github.com/hotoo/node-detector)。
* 有些场景只需要简单识别特定的信息，可以参考
  [识别特定浏览器最佳实践](https://github.com/aralejs/detector/issues/18)
  而无需使用 detector。

## 安装

```
spm install arale/detector
```


## 使用说明

一般情况下，常见使用范例：

```javascript
// 判断浏览器名
detector.browser.name === "chrome" // true

// 判断浏览器名方法 2.
!!detector.browser.ie // false

// 判断老旧浏览器
if(detector.browser.ie && detector.browser.version < 8){
    alert("你的浏览器太老了。");
}

// 判断 Trident 4(IE8) 以下版本浏览器引擎
if(detector.engine.trident && detector.engine.mode < 4){
    // hack code.
}

// 收集客户端详细信息
detector.browser.name + "/" + detector.browser.fullVersion;
```


## API

### {String} detector.device.name

设备名称。

### {Number} detector.device.version

设备版本号。

### {String} detector.device.fullVersion

设备完整版本号。

### {Number} detector.device[device_name]

直接判断设备名。

可以识别的设备名称为：

* `pc`: Windows PC.
* `mac`: Macintosh PC.
* `iphone`: iPhone.
* `ipad`: iPad.
* `ipod`: iPod.
* `android`: Android.
* `blackberry`: 黑莓(Blackberry)手机。
* `wp`: Windows Phone.
* `mi`: 小米。
* `meizu`: 魅族。
* `nexus`: Nexus.
* `nokia`: Nokia.
* `samsung`: 三星手机。
* `aliyun`: 阿里云手机。
* `huawei`: 华为手机。
* `lenovo`: 联想手机。
* `zte`: 中兴手机。
* `vivo`: 步步高手机。
* `htc`: HTC。
* `oppo`: OPPO 手机。
* `konka`: 康佳手机。
* `sonyericsson`: 索尼爱立信手机。
* `coolpad`: 酷派手机。
* `lg`: LG 手机。


----

### {String} detector.os.name

操作系统名。

### {Number} detector.os.version

操作系统版本号。

### {String} detector.os.fullVersion

操作系统完整版本号。

### {Number} detector.os[os_name]

直接判断操作系统。

可以识别的操作系统包括：

* `windows`: Windows.
* `macosx`: Macintosh.
* `ios`: iOS.
* `android`: Android.
* `chromeos`: Chrome OS.
* `linux`: Linux.
* `wp`: Windows Phone.
* `windowsce`: Windows CE, 包括 Windows Mobile, Smartphone, PPC.
* `symbian`: Symbian OS.
* `blackberry`: Blackberry.
* `yunos`: 阿里云系统。
* `meego`: Meego


----

### {String} detector.browser.name

浏览器名。

### {Number} detector.browser.version

浏览器真实版本。兼容模式下浏览器声明自己是某老旧浏览器，但这个属性返回的是
其真正的版本号。

适用于收集统计分析客户端信息。

例如：

IE9 兼容模式声明自己是 IE7，但是 `detector.browser.version` 返回 `9.0`

### {String} detector.browser.fullVersion

浏览器完整的真实版本号。

### {Number} detector.browser.mode

浏览器模式。即浏览器当时使用的模式，IE 兼容模式时，version 和 mode 值不同。

### {String} detector.browser.fullMode

浏览器模式的完整版本号。

### {Number} detector.browser[browser_name]

直接判断浏览器。

可以识别的浏览器为：

* `ie`: Microsoft Internet Explorer.
* `chrome`: Google Chrome.
* `firefox`: Mozilla Firefox.
* `safari`: Apple Safari.
* `opera`: Opera.
* `360`: 包括奇虎 360 安全浏览器和 360 极速浏览器。
* `mx`: 傲游浏览器(Maxthon)。
* `sg`: 搜狗浏览器(Sogou)。
* `tw`: 世界之窗浏览器(TheWorld)。
* `green`: GreenBrowser.
* `qq`: QQ 浏览器。
* `tt`: TencentTraveler.
* `lb`: 猎豹浏览器。
* `tao`: 淘宝浏览器。
* `fs`: 枫树浏览器。
* `sy`: 闪游浏览器。
* `uc`: UC 浏览器。
* `mi`: 小米浏览器。
* `baidu`: 百度浏览器。
* `mi`: 小米浏览器。
* `nokia`: 诺基亚浏览器。
* `webview`: iOS 系统的提供的 WebView。

国产浏览器名称均使用缩写方式，`ie` 由于习俗也使用缩写。


### {Boolean} detector.browser.compatible

浏览器是否处于兼容模式。


----

### {String} detector.engine.name

渲染引擎名（又称排版引擎、浏览器内核）。

### {Number} detector.engine.version

渲染引擎版本号。

### {String} detector.engine.fullVersion

渲染引擎完整版本号。

### {Number} detector.engine.mode

渲染引擎模式，即 IE 浏览器的文档模式。

### {String} detector.engine.fullMode

渲染引擎模式完整版本号。


### {Number} detector.engine[engine_name]

直接判断渲染引擎。

可以识别的渲染引擎为：

* `trident`: Trident.
* `webkit`: Webkit.
* `gecko`: Gecko.
* `presto`: Presto.
* `androidwebkit`: Android Webkit.
* `coolpadwebkit`: Coolpad Webkit.

### {detector} detector.parse(String ua)

根据 userAgent 字符串识别客户端信息的接口。

服务端程序可以使用这个接口识别客户端信息，由于服务端程序的特殊性，可以补充
更完善的检测规则。


----

对于不能识别的信息，统一如下：

* 所有不能识别的名称均归类为 `na`，即 Not Available.
* 所有不能识别的版本号归类为 `-1`。
