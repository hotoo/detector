
# 傲游云浏览器(Maxthon)


Windows 7, Maxthon 4.0.5.4000

    Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.5.4000 Chrome/26.0.1410.43 Safari/537.1

```javascript
window.external = {
    AddFavorite: function (url, title) ,
    AddSearchProvider: function (url, name) ,
    GetPN: function () ,
    IsSearchProviderInstalled: function (url) ,
    addFavorite: function (url, title) ,
    get max_version: function () ,
    get menuArguments: function () ,
    get mxProductName: function () ,
    get mxProductType: function () ,
    get mxVersion: function () ,
    mxCall: function (command, url) ,
    mxGetRuntime: function () ,
    searchText: function (text, useMultiSearch) ,
    set max_version: undefined
    set menuArguments: undefined
    set mxProductName: undefined
    set mxProductType: undefined
    set mxVersion: undefined
}
```

----

```javascript
external.max_version;   // "4.0.5.4000"
external.mxVersion;     // "4.0.5.4000"
external.GetPN();       // "max4"
external.menuArguments; // Window
external.mxProductName; // "傲游云浏览器"
external.mxProductType; // "zh-cn"
```

## 参考阅读

* [傲游官网](http://www.maxthon.cn/)
