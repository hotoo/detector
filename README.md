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
        version: {"-1"},
        [iphone]: {"-1"}
    },
    os: {
        name: "ios",
        version: {"6.1"},
        [ios]: {"6.1"}
    },
    browser: {
        name: "chrome":
        version: {"26.0.1410.50"},
        mode: {"26.0.1410.50"},
        compatible: false,
        [chrome]: {"26.0.1410.50"}
    },
    engine: {
        name: "webkit",
        version: {"536.26"},
        mode: {"523.26"},
        compatible: false,
        [webkit]: {"536.26"}
    }
}
```

备注：

1. 上面的 `[iphone]`, `[ios]`, `[chrome]`, `[webkit]` 是动态的，根据实际识别
    到的信息不同而有所不同。
1. `{"-1"}` 等版本信息是一个特殊的 [versioning](https://github.com/hotoo/versioning)
    对象，可以用来直接跟数值进行算术表达式比较，
    也可以使用 `eq`, `gt`, `gte`, `lt`, `lte` 方法进行比较。


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
if(detector.engine.trident && detector.engine.mode.lt(4)){
    // hack code.
}
```


## API

### {String} detector.device.name

设备名称。

### {versioning} detector.device.version

设备版本。

### {versioning} detector.device[device_name]

直接判断设备名。

可以识别的设备名称为：

* `pc`: Windows PC.
* `mac`: Macintosh PC.
* `iphone`: iPhone.
* `ipad`: iPad.
* `ipod`: iPod.
* `android`: Android.
* `nokia`: Nokia.
* `blackberry`: Blackberry.


----

### {String} detector.os.name

操作系统名。

### {versioning} detector.os.version

操作系统版本。

### {versioning} detector.os[os_name]

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


----

### {String} detector.browser.name

浏览器名。

### {versioning} detector.browser.version

浏览器真实版本。兼容模式下浏览器声明自己是某老旧浏览器，但这个属性返回的是
其真正的版本号。

适用于收集统计分析客户端信息。

例如：

IE9 兼容模式声明自己是 IE7，但是 `detector.browser.version` 返回 `9.0`

### {versioning} detector.browser.mode

浏览器模式。即浏览器当时使用的模式，IE 兼容模式时，version 和 mode 值不同。

### {versioning} detector.browser[browser_name]

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

国产浏览器名称均使用缩写方式，`ie` 由于习俗也使用缩写。


### {Boolean} detector.browser.compatible

浏览器是否处于兼容模式。


----

### {String} detector.engine.name

渲染引擎名（又称排版引擎、浏览器内核）。

### {versioning} detector.engine.version

渲染引擎版本。

### {versioning} detector.engine.mode

渲染引擎模式，即 IE 浏览器的文档模式。


### {versioning} detector.engine[engine_name]

直接判断渲染引擎。

可以识别的渲染引擎为：

* `trident`: Trident.
* `webkit`: Webkit.
* `gecko`: Gecko.
* `presto`: Presto.

----

对于不能识别的信息，统一如下：

* 所有不能识别的信息均归类为 `na`，即 Not Available.
* 所有不能识别的版本号归类为 `-1`。

## 参考

* [Detector Wiki](https://github.com/aralejs/detector/wiki)
