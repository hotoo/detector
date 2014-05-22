
# CHANGELOG

----

## 2.0.1 (2014-05-13)

* 调整代码结构，层次更简单。
* 优化命令行工具，输出更美观。

## 2.0.0 (2014-05-13)

* Update: 托 spm@3.x 的福，遵循 CommonJS 规范。同一份源码，不同一个世界。
* Add: 增加了多个搜索引擎爬虫识别规则。
* Fixed: 支持 UC 浏览器使用 adr 来标识 Android 设备的规则。
* Delete: g_detector 全局变量。
* Update: 更新或优化多个规则，提升了识别准确率。

## 1.5.0 (2014-05-10)

* Update: 猎豹浏览器 for iPhone 的识别。
* Add: 海豚浏览器识别规则。
* Add: 阿里巴巴系列移动设备客户端的识别。
* Add: UC 浏览器的 u2, u3 渲染引擎。
* Fixed: 修复并增强 UC 浏览器的的一些规则。
* Fixed: vivo 无版本号的识别。

## 1.4.0 (2014-03-27)

* `Add` #11, Yandex browser support.
* `Add` #43, window.detector and window.g_detector.


## 1.3.0 (2013-08-28)

* `Update` #37 同时支持 CMD 和非 CMD 模块。但我们强烈建议使用 CMD。

## 1.2.1 (2013-07-11)

* `Update` #27, 附加 navigator.appVersion 和 navigator.vendor 增强识别信息，
  更好的支持 UC 浏览器这样特殊的场景。

## 1.2.0 (2013-07-04)

`tag:improved` #28, 增强了移动设备的识别。

`tag:fixed` #29, 修复了猎豹浏览器版本号可能为 undefined 的问题。

`tag:fixed` #30, 支持最新最贱的 IE11 浏览器。


## 1.1.3 (2013-06-19)

`tag:fixed` #25, 支持 iOS 的 WebView。

`tag:fixed` #26, 部分 UC 浏览器被识别为 Android 的问题。


## 1.1.2 (2013-06-07)

`tag:fixed` #24, 规避 external 可能出现的异常。


## 1.1.1 (2013-05-31)

`tag:fixed` #17, 修复并增加了 360, theworld, maxthon 等浏览器的识别。

`tag:fixed` #19, 修复了 Opera Next 的识别问题。

`tag:changed` 修改 `detector.detect()` 方法为 `detector.parse()`。


## 1.1.0 (2013-05-10)

`tag:changed` #12, 简化版本号的设计。


## 1.0.1 (2013-05-02)

`tag:new` 新增了多种客户端识别规则。

`tag:fixed` 修复 Windows Phone 识别为 Windows 的问题。


## 1.0.0 (2013-05-01)

`tag:new` 发布第一个可用版本。
