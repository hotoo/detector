# detector

---

[![NPM version](https://badge.fury.io/js/detector.png)](http://badge.fury.io/js/detector)
[![spm package](http://spmjs.io/badge/detector)](http://spmjs.io/package/detector)
[![Build Status](https://secure.travis-ci.org/hotoo/detector.png?branch=master)](https://travis-ci.org/hotoo/detector)
[![Coverage Status](https://coveralls.io/repos/hotoo/detector/badge.png?branch=master)](https://coveralls.io/r/hotoo/detector)



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

* 这个版本遵循 CommonJS 规范，同时兼容基于 Node 环境和 Web 浏览器环境运行。
* 有些场景只需要简单识别特定的信息，可以参考
  [识别特定浏览器最佳实践](https://github.com/hotoo/detector/issues/18)
  而无需使用 detector。

## 安装

via npm:

全局安装 (`-g`) 时，可以在终端使用 `detector` 命令。

```
npm install detector [-g]
```


via spm@3.x:

```
spm install detector
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
* `blackberry`: 黑莓 (Blackberry) 手机。
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

##### NODE ONLY

* `noain`: [诺亚信](http://www.noain.com.cn/)
* `huawei-honor`: [华为荣耀](http://www.honor.cn/)
* `lephone`: [乐 Phone](http://www.lephonemall.com/)
* `asus`: [华硕](https://www.asus.com.cn/Phones/)
* `alcatel`
* `一加`
* `蓝米`
* `E 派`
* `hike`
* `qmi`
* ~~`友信达`: [友信达](http://www.iunistar.com/)~~
* `优米`
* `嘉源`
* `intki`
* `星语`
* `欧奇`
* `海派`
* `广信`: [广信](http://www.szkingsun.com/)
* ~~`nibiru`: [nibiru](http://www.nbru.cn/)~~
* `神州`
* `青橙`
* `海信`
* `金立`
* `eton`
* `bohp`
* `小杨树`
* `语信`
* `nubia`
* `爱讯达`
* `寰宇通`
* `mofut`
* `infocus`
* `大唐`
* `邦华`
* `天迈`
* `大显`
* `博瑞`
* `lingwin`
* `iusai`
* `波导`
* `德赛`
* `蓝魔`
* `美图`
* `opsson`
* `benwee`
* `hosin`
* `smartisan`: [锤子](http://www.smartisan.com/), Smartisan.
* `ephone`
* `佰事讯`
* `newman`
* `konka`
* `haier`
* `moto`
* `tcl`
* `天语`
* `doov`
* `天时达`


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
* `blackberry`: Blackberry 操作系统。
* `yunos`: 阿里云系统。

##### NODE ONLY

* `meego`: Meego.
* `smartisan`: 锤子，Smartisan.


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
* `maxthon`: 傲游浏览器 (Maxthon)。
* `sogou`: 搜狗浏览器 (Sogou)。
* `theworld`: 世界之窗浏览器 (TheWorld)。
* `green`: GreenBrowser.
* `qq`: QQ 浏览器。
* `tt`: TencentTraveler.
* `liebao`: 猎豹浏览器。
* `tao`: 淘宝浏览器。
* `coolnovo`: 枫树浏览器。
* `saayaa`: 闪游浏览器。
* `uc`: UC 浏览器。
* `mi`: 小米浏览器。
* `baidu`: 百度浏览器。
* `nokia`: 诺基亚浏览器。
* `blackberry`: 黑莓默认浏览器，版本号与系统版本相同。
* `webview`: iOS 系统的提供的 WebView。
* `yandex`: Yandex YaBrowser.
* `micromessenger` 微信
* `ali-ap`: 支付宝手机客户端。
* `ali-ap-pd`: 支付宝平板客户端。
* `ali-am`: 支付宝商户客户端。
* `ali-tb`: 淘宝手机客户端。
* `ali-tb-pd`: 淘宝平板客户端。
* `ali-tm`: 天猫手机客户端。
* `ali-tm-pd`: 天猫平板客户端。

##### NODE ONLY

* `googlebot`: [Googlebot](wiki/googlebot.md) 网络爬虫。
* `baiduspider`: [Baiduspider](wiki/baiduspider.md) ，百度无线、网页搜索
* `baiduspider-image`: 百度图片搜索
* `baiduspider-video`: 百度视频搜索
* `baiduspider-news`: 百度新闻搜索
* `baiduspider-favo`: 百度收藏搜索
* `baiduspider-cpro`: 百度联盟
* `baiduspider-ads`: 百度商务搜索
* `baiduboxapp`: 百度手机搜索客户端
* `bingbot`: [Bingbot](wiki/bingbot.md) 网络爬虫。
* `msnbot`: [MSNBot](wiki/msnbot.md)
* `nuhkbot`: [Nuhkbot](wiki/nuhkbot.md)
* `alexabot`: [Alexabot](wiki/alexabot.md).
* `curl`: curl.
* ~~`slurpbot`: Yahoo! [Slurp](wiki/slurpbot.md)~~


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

* `trident`: Microsoft Trident.
* `blink`: Google Blink.
* `webkit`: Apple Webkit.
* `gecko`: Mozilla Gecko.
* `presto`: Opera Presto.
* `androidwebkit`: Android Webkit.
* `coolpadwebkit`: Coolpad Webkit.
* `u2`: UC 浏览器渲染引擎 v2
* `u3`: UC 浏览器渲染引擎 v3

### {detector} detector.parse(String ua)

根据 userAgent 字符串识别客户端信息的接口。

服务端程序可以使用这个接口识别客户端信息，由于服务端程序的特殊性，可以补充
更完善的检测规则。


----

对于不能识别的信息，统一如下：

* 所有不能识别的名称均归类为 `na`，即 Not Available.
* 所有不能识别的版本号归类为 `-1`。
