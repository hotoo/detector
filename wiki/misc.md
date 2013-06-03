
# 杂项

----

浏览器识别

（参见http://www.iamniu.com/2012/02/25/%e7%bd%91%e7%bb%9c%e5%b9%bf%e5%91%8a%e5%ae%9a%e5%90%91%e6%8a%80%e6%9c%af%e4%bb%8b%e7%bb%8d-%e6%b5%8f%e8%a7%88%e5%99%a8%e5%ae%9a%e5%90%91/）

## 1、IE浏览器（以IE 9.0 为例）

PC端：User-Agent:Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;
移动设备：User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)

由于遨游、世界之窗、360浏览器、腾讯浏览器以及搜狗浏览器、Avant、Green Browser均采用IE的内核，因此IE浏览器判断的标准是”MSIE“字段，MSIE字段后面的数字为版本号，但同时还需要判断不包含”Maxthon“、”The world“、”360SE“、”TencentTraveler“、”SE“、”Avant“等字段（Green Browser没有明显标识）。移动设备还需要判断IEMobile+版本号。

## 2、360浏览器

PC端：User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; InfoPath.2; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; 360SE)
移动设备：暂无

360浏览器的判断标准是"360SE"字段，没有版本表示。

## 3、搜狗浏览器

PC端：User-Agent:Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SE 2.X MetaSr 1.0; SE 2.X MetaSr 1.0; .NET CLR 2.0.50727; SE 2.X MetaSr 1.0)
移动设备：暂无

搜狗浏览器的判断标准是”SE“、”MetaSr“字段，版本号为SE后面的数字。

## 4、Chrome

PC端：Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11
移动设备：User-Agent: Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1

PC端chrome浏览器的判断标准是chrome字段，chrome后面的数字为版本号；移动端的chrome浏览器判断”android“、”linux“、”mobile safari“等字段，version后面的数字为版本号。

## 5、Safari

PC端：User-Agent:Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50
移动设备：User-Agent:Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5

由于Chrome及Nokia’s Series 60 browser也使用WebKit内核，因此Safari浏览器的判断必须是：包含safari字段，同时不包含chrome等信息，确定后”version/“后面的数字即为版本号。在以上条件下包含Mobile字段的即为移动设备上的Safari浏览器。

## 6、腾讯浏览器

PC端：User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; TencentTraveler 4.0; .NET CLR 2.0.50727)
移动设备：User-Agent: MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1

腾讯浏览器的判断标准是”TencentTraveler“或者”QQBrowser“，TencentTraveler或QQBrowser后面的数字为版本号。

## 7、Firefox

PC端：User-Agent:Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1
移动设备：User-Agent: Mozilla/5.0 (Androdi; Linux armv7l; rv:5.0) Gecko/ Firefox/5.0 fennec/5.0

Firefox的判断标准是Firefox字段，firefox后面的数字为版本号。

## 8、The world

PC端：User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; The World)
移动设备：暂无

Theworld浏览器的判断标准是”The world“字段，没有标示版本号。
需要注意的是：The world 2.x版本的User-Agent中没有”The world“的字段。

## 9、遨游

PC端：User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Maxthon 2.0)
移动设备：暂无

遨游浏览器的判断标准是”Maxthon“，Maxthon后面的数字为版本号。

## 10、Opera

PC端：User-Agent:Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11
移动设备：User-Agent: Opera/9.80 (Android 2.3.4; Linux; Opera mobi/adr-1107051709; U; zh-cn) Presto/2.8.149 Version/11.10

opera浏览器的判断标准是opera字段，opera字段后面的数字为版本号。

## 11、UC浏览器

UC Web有多种模式浏览方式，对应的User-Agent为：
UC无
User-Agent: UCWEB7.0.2.37/28/999

UC标准
User-Agent: NOKIA5700/ UCWEB7.0.2.37/28/999

UCOpenwave
User-Agent: Openwave/ UCWEB7.0.2.37/28/999

UC Opera
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; ) Opera/UCWEB7.0.2.37/28/999

UC浏览器的判断标准是”UCWEB“字段，UCWEB后面的数字为版本号。
