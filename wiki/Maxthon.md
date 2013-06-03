
# 傲游云浏览器(Maxthon)


Windows 7, Maxthon 4.0.5.4000

| 字段         | 值                                                                                                                                                                                                                                                                                                             |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ua           | Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.5.4000 Chrome/26.0.1410.43 Safari/537.1                                                                                                                                                                                         |
| vendor       | Maxthon Asia Ltd.                                                                                                                                                                                                                                                                                              |
| vendorSub    |                                                                                                                                                                                                                                                                                                                |
| platform     | Win32                                                                                                                                                                                                                                                                                                          |
| external     | {mxVersion: string, max_version: string, mxProductType: string, mxProductName: string, addFavorite: function, searchText: function, mxGetRuntime: function, mxCall: function, GetPN: function, menuArguments: object, AddFavorite: function, AddSearchProvider: function, IsSearchProviderInstalled: function} |
| appCodeName  | Mozilla                                                                                                                                                                                                                                                                                                        |
| appName      | Netscape                                                                                                                                                                                                                                                                                                       |
| appVersion   | 5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.5.4000 Chrome/26.0.1410.43 Safari/537.1                                                                                                                                                                                                 |
| product      | Gecko                                                                                                                                                                                                                                                                                                          |
| productSub   | 20030107                                                                                                                                                                                                                                                                                                       |
| screenWidth  | 1237                                                                                                                                                                                                                                                                                                           |
| screenHeight | 727                                                                                                                                                                                                                                                                                                            |
| colorDepth   | 32                                                                                                                                                                                                                                                                                                             |
| documentMode | undefined                                                                                                                                                                                                                                                                                                      |
| compatMode   | CSS1Compat                                                                                                                                                                                                                                                                                                     |

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


```javascript
external.max_version;   // "4.0.5.4000"
external.mxVersion;     // "4.0.5.4000"
external.GetPN();       // "max4"
external.menuArguments; // Window
external.mxProductName; // "傲游云浏览器"
external.mxProductType; // "zh-cn"
```

----

Windows 7, Maxthon 3.5.2.1000

| 字段         | 值                                                                                                                                                                   |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ua           | Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Maxthon/3.0) |
| vendor       | undefined                                                                                                                                                            |
| vendorSub    | undefined                                                                                                                                                            |
| platform     | Win32                                                                                                                                                                |
| external     | {}                                                                                                                                                                   |
| appCodeName  | Mozilla                                                                                                                                                              |
| appName      | Microsoft Internet Explorer                                                                                                                                          |
| appVersion   | 4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Maxthon/3.0)         |
| product      | undefined                                                                                                                                                            |
| productSub   | undefined                                                                                                                                                            |
| screenWidth  | 1276                                                                                                                                                                 |
| screenHeight | 727                                                                                                                                                                  |
| colorDepth   | 32                                                                                                                                                                   |
| documentMode | 7                                                                                                                                                                    |
| compatMode   | CSS1Compat                                                                                                                                                           |

----

Windows 7, Maxthon 2.5.18.1000

| 字段         | 值                                                              |
|--------------|-----------------------------------------------------------------|
| ua           | Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0) |
| vendor       | undefined                                                       |
| vendorSub    | undefined                                                       |
| platform     | Win32                                                           |
| external     | {}                                                              |
| appCodeName  | Mozilla                                                         |
| appName      | Microsoft Internet Explorer                                     |
| appVersion   | 5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)         |
| product      | undefined                                                       |
| productSub   | undefined                                                       |
| screenWidth  | 1237                                                            |
| screenHeight | 727                                                             |
| colorDepth   | 24                                                              |
| documentMode | 9                                                               |
| compatMode   | CSS1Compat                                                      |

* IE 单内核。
* `external.max_version` 返回真实版本号，没有 `external.mxVersion`

## 参考阅读

* [傲游官网](http://www.maxthon.cn/)
