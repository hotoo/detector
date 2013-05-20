
# detector.js

----

冒顿 (2013-05-17)

## Why

1. 代码兼容性支持
2. 客户端信息收集 & 分析
2. 提醒用户升级浏览器


## What

detector.js 是一个用于识别客户端环境信息的独立模块。客户端信息包括：

* 硬件设备。
* 操作系统。
* 浏览器。
* 浏览器渲染引擎。

[简介&API](https://github.com/aralejs/detector)

## How

### 客户端识别：UA 检测 v.s. 特性检测

* 特性检测
    * jQuery 1.9+
    * Mootools 1.2
* UA 检测
    * jQuery 1.8-
    * Mootools 1.3
    * YUI
    * Kissy
    * detector

```js
if (window.opera) Browser.Engine = {
    name: presto,
    version: (document.getElementsByClassName) ? 950 : 925};
else if (window.ActiveXObject) Browser.Engine = {
    name: trident,
    version: (window.XMLHttpRequest) ? 5 : 4};
else if (!navigator.taintEnabled) Browser.Engine = {
    name: webkit,
    version: (Browser.Features.xpath) ? 420 : 419};
else if (document.getBoxObjectFor != null) Browser.Engine = {
    name: gecko,
    version: (document.getElementsByClassName) ? 19 : 18};

Browser.Engine[Browser.Engine.name] =
Browser.Engine[Browser.Engine.name Browser.Engine.version] = true;
```



### jQuery

* [jQuery.browser](http://api.jquery.com/jQuery.browser/)
* [jQuery.browser@github](https://github.com/jquery/jquery/blob/1.8-stable/src/deprecated.js)
* 自从 v1.9 移除了浏览器检测部分，建议使用特性检测。
* [jQuery.migrate](https://github.com/jquery/jquery-migrate)

#### 简介

* 简单，只用于兼容性支持，只支持有限的几种浏览器。
    * 对于 IE 兼容模式无需理会。
* 只用 userAgent 进行检测。
* 不支持 IE11

### YUI

* [UA Class](http://yuilibrary.com/yui/docs/api/classes/UA.html)
* [yui-ua](https://github.com/yui/yui3/blob/master/src/yui/js/yui-ua.js)

#### 简介

* 逻辑 & 规则混合在一起
* 处理版本号： 1.2.3.4 -> 1.234

### Kissy

主要代码和设计思路来自 YUI UA Class。

* [ua@docs](http://docs.kissyui.com/docs/html/api/core/ua/)
* [ua@github](https://github.com/kissyteam/kissy/blob/1.3.0/src/seed/src/ua.js)

### mootools

* [Browser](http://mootools.net/docs/core/Browser/Browser)
* [Browser@github](https://github.com/mootools/mootools-core/blob/master/Source/Browser/Browser.js)
* 提供了强大的特性检测 `Browser.Feature`
* Mootools 1.3 开始废弃了 `Browser.Engine`

### light.client.info

* 规则与逻辑很清晰
* 规则使用 Object 的方式定义，无法保证顺序。
* 依赖 light

### detector.js

* [detector](http://aralejs.org/detector/)
* [detector@github](https://github.com/aralejs/detector)
* 符合国情，支持国货：硬件设备、浏览器外壳。


## 兼容性代码：特性检测 v.s. 客户端检测

* 兼容性代码应尽量使用准确的特性检测

    ```js
    if(document.addEventListener){
      //...
    }

    if("placeholder" in document.createElement("input")){
      // ...
    }
    ```
* 客户端统计建议使用客户端检测。
* [jQuery.support](http://api.jquery.com/jQuery.support/)
* [jQuery.support@github](https://github.com/jquery/jquery/blob/master/src/support.js)
