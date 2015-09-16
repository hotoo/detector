# detector

---

[![NPM version][npm-badge]][npm-url]
[![spm version][spm-badge]][spm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

[npm-badge]: https://img.shields.io/npm/v/detector.svg?style=flat
[npm-url]: https://www.npmjs.com/package/detector
[spm-badge]: http://spmjs.io/badge/detector
[spm-url]: http://spmjs.io/package/detector
[travis-badge]: https://travis-ci.org/hotoo/detector.svg?branch=master
[travis-url]: https://travis-ci.org/hotoo/detector
[coveralls-badge]: https://coveralls.io/repos/hotoo/detector/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hotoo/detector

[中文文档](./README-zh_CN.md)

Client information detector, for auto detect user agent, include:

1. Device.
2. Operation System (OS).
3. Browser.
4. Rendering Engine.

Detected information data structure like:

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

**Note**: Above `[iphone]`, `[ios]`, `[chrome]`, `[webkit]` is dynamically from
actual environment, different device, operation system, browser and rendering
engine is different.

Note:

* This version of detector's code is follow CommonJS sepcification, and support
  NodeJS and Web Browser environment at the same time.
* Some times, you just need simple detect a litter information, please reference
  to [#18](https://github.com/hotoo/detector/issues/18), without `detector`.

## Installation

via npm:

Installation to global (with `-g` argument), you can use `detector` command in
terminal.

```
npm install detector [-g]
```


via spm:

```
spm install detector
```


## Usage

Some examples in common use:

```javascript
// Detect browser name.
detector.browser.name === "chrome" // true

// An other example for detect browser name.
!!detector.browser.ie // false

// Detect the old browseres.
if(detector.browser.ie && detector.browser.version < 8){
    alert("You browser is too old.");
}

// Detect rendering engine below Trident 4 (IE8).
if(detector.engine.trident && detector.engine.mode < 4){
    // hack code.
}

// Collect client detail informations.
detector.browser.name + "/" + detector.browser.fullVersion;
```


## API

### {String} detector.device.name

Name of hardware device.

### {Number} detector.device.version

Version of hardware device.

### {String} detector.device.fullVersion

Full version of hardware device.

### {Number} detector.device[device_name]

Detect name of hardware device.

Support hardware devices:

* `pc`: Windows PC.
* `mac`: Macintosh PC.
* `iphone`: iPhone.
* `ipad`: iPad.
* `ipod`: iPod.
* `android`: Android.
* `blackberry`: Blackberry mobile.
* `wp`: Windows Phone.
* `mi`: Xiaomi.
* `meizu`: meizu.
* `nexus`: Nexus.
* `nokia`: Nokia.
* `samsung`: samsung.
* `aliyun`: Aliyun.
* `huawei`: Huawei （华为）
* `lenovo`: lenovo.
* `zte`: ZTE Corporation （中兴）
* `vivo`: vivo （步步高）
* `htc`: HTC.
* `oppo`: OPPO.
* `konka`: konka （康佳）
* `sonyericsson`: sonyericsson （索尼爱立信）
* `coolpad`: coolpad （酷派）
* `lg`: LG.

##### NODE ONLY

Following hardware device support in NodeJS version of `detector`:

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

Name of operation system.

### {Number} detector.os.version

Version of operation system.

### {String} detector.os.fullVersion

Full version of operation system.

### {Number} detector.os[os_name]

Detect name of operation system.

Support operation system list:

* `windows`: Windows.
* `macosx`: Macintosh.
* `ios`: iOS.
* `android`: Android.
* `chromeos`: Chrome OS.
* `linux`: Linux.
* `wp`: Windows Phone.
* `windowsce`: Windows CE, include Windows Mobile, Smartphone, PPC.
* `symbian`: Symbian OS.
* `blackberry`: Blackberry OS.
* `yunos`: Aliyun OS.

##### NODE ONLY

Following operation system support in NodeJS version of `detector`:

* `meego`: Meego.
* `smartisan`: Smartisan.


----

### {String} detector.browser.name

Name of browser.

### {Number} detector.browser.version

Real version of browser.

In compatibility-mode, Internet Explorer declare it is a old browser.
but `detector.browser.version` return the real version of browser.

For example:

IE9 declare it is a IE7 in compatibility-mode, but `detector.browser.version`
return `9.0`.

### {String} detector.browser.fullVersion

Full (real) version of browser.

### {Number} detector.browser.mode

Browser-mode. In Internet Explorer's compatibility-mode, version and mode
is different.

### {String} detector.browser.fullMode

Full mode of browser.

### {Number} detector.browser[browser_name]

Detect name of browser.

Support browser list:

* `edge`: Microsoft Edge browser.
* `ie`: Microsoft Internet Explorer.
* `chrome`: Google Chrome.
* `firefox`: Mozilla Firefox.
* `safari`: Apple Safari.
* `opera`: Opera.
* `360`: Qihu 360 browser.
* `maxthon`: Maxthon.
* `sogou`: Sogou.
* `theworld`: TheWorld.
* `green`: GreenBrowser.
* `qq`: QQ Browser.
* `tt`: TencentTraveler.
* `liebao`: Cheetah Mobile Inc. （猎豹） Browser.
* `tao`: Taobao （淘宝） Browser.
* `coolnovo`: coolnovo （枫树）
* `saayaa`: Saayaa （闪游）
* `uc`: UC Browser.
* `mi`: Build-in browser in Xiaomi （小米）.
* `baidu`: Baidu （百度） browser.
* `nokia`: Build-in Browser in Nokia （诺基亚）
* `blackberry`: 黑莓默认浏览器，版本号与系统版本相同。
* `webview`: iOS WebView.
* `yandex`: Yandex YaBrowser.
* `micromessenger` WeChat （微信）
* `ali-ap`: 支付宝手机钱包。
* `ali-ap-pd`: 支付宝平板客户端。
* `ali-am`: 支付宝商户客户端。
* `ali-tb`: 淘宝手机客户端。
* `ali-tb-pd`: 淘宝平板客户端。
* `ali-tm`: 天猫手机客户端。
* `ali-tm-pd`: 天猫平板客户端。

##### NODE ONLY

* `googlebot`: [Googlebot](wiki/googlebot.md)
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

Judge is browser in compatibility-mode.


----

### {String} detector.engine.name

Name of rendering engine.

### {Number} detector.engine.version

Version of rendering engine.

### {String} detector.engine.fullVersion

Full version of rendering engine.

### {Number} detector.engine.mode

Mode of rendering engine.

### {String} detector.engine.fullMode

Full-mode of rendering engine.


### {Number} detector.engine[engine_name]

Detect name of rendering engine.

Support rendering engine list:

* `edgehtml`: Microsoft Edge browser's rendering engine. (Note: version same browser version now.)
* `trident`: Microsoft Trident.
* `blink`: Google Blink.
* `webkit`: Apple Webkit.
* `gecko`: Mozilla Gecko.
* `presto`: Opera Presto.
* `androidwebkit`: Android Webkit.
* `coolpadwebkit`: Coolpad Webkit.
* `u2`: UC browser rendering engine `v2`.
* `u3`: UC browser rendering engine `v3`.

### {detector} detector.parse(String ua)

Parse user agent string, return a `detector` object.


----

Not Available information:

* Not Available name will be `na`.
* Not Available version will be `-1`.
