var detector = {};
var NA_VERSION = "-1";
var win = this;
var external;
var re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;

function toString(object) {
  return Object.prototype.toString.call(object);
}

function isObject(object) {
  return toString(object) === "[object Object]";
}

function isFunction(object) {
  return toString(object) === "[object Function]";
}

function each(object, factory, argument) {
  for (var i = 0, b, l = object.length; i < l; i++) {
    if (factory.call(object, object[i], i) === false) {
      break;
    }
  }
}

// 硬件设备信息识别表达式。
// 使用数组可以按优先级排序。
var DEVICES = [
  ["nokia",
    function(ua) {
      // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
      // 这种情况下会优先识别出 nokia/-1
      if (ua.indexOf("nokia ") !== -1) {
        return /\bnokia ([0-9]+)?/;
      } else if (ua.indexOf("noain") !== -1) {
        return /\bnoain ([a-z0-9]+)/;
      } else {
        return /\bnokia[_]?([a-z0-9]+)?/;
      }
    }
  ],
  // 三星有 Android 和 WP 设备。
  ["samsung",
    function(ua) {
      if (ua.indexOf("samsung") !== -1) {
        return /\bsamsung(?:\-gt)?[ \-]([a-z0-9\-]+)/;
      } else {
        return /\b(?:gt|s[cpg]h|gm|s[mc]|shv|galaxy)[ \-]([a-z0-9\-]+)/;
      }
    }
  ],

  ["wp",
    function(ua) {
      return ua.indexOf("windows phone ") !== -1 ||
        ua.indexOf("xblwp") !== -1 ||
        ua.indexOf("zunewp") !== -1 ||
        ua.indexOf("windows ce") !== -1;
    }
  ],

  ["pc", "windows"],
  ["ipad", "ipad"],
  // ipod 规则应置于 iphone 之前。
  ["ipod", "ipod"],
  ["iphone", /\biphone\b|\biph(\d)/],
  ["mac", "macintosh"],
  ["mi",
    function(ua) {
      if (/\bmi[ \-]?([a-z0-9 ]+(?= build|\)))/.test(ua)) {
        return /\bmi[ \-]?([a-z0-9 ]+(?= build|\)))/;
      } else if (/\b2014501 build/.test(ua)) {
        return /\b(2014501) build/;
      }
    }
  ],
  ['红米', /\bhm[ \-]?([a-z0-9]+)/],
  ["aliyun", /\baliyunos\b(?:[\-](\d+))?/],
  ["meizu", /\b(?:meizu\/|m|mx)([0-9]+)\b/i],
  ["nexus", /\bnexus ([0-9s.]+)/],
  ["huawei",
    function(ua) {
      var re_mediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
      if (ua.indexOf("huawei-huawei") !== -1) {
        return /\bhuawei\-huawei\-([a-z0-9\-]+)/;
      } else if (re_mediapad.test(ua)) {
        return re_mediapad;
      } else if (/\bhonor/.test(ua)) {
        return /\b(honor)[ ]([a-z0-9]+)-([a-z0-9]+)\b/;
      } else if (/\bh\d+-l\d+/.test(ua)) {
        return /\b(h\d+-l\d+)/;
      } else {
        return /\bhuawei[ _\-]?([a-z0-9]+)/;
      }
    }
  ],
  ["lenovo",
    function(ua) {
      if (ua.indexOf("lenovo-lenovo") !== -1) {
        return /\blenovo\-lenovo[ \-]([a-z0-9]+)/;
      } else if (ua.indexOf("lephone") !== -1) {
        return /\b(lephone)[_\- ]+([a-z0-9]+)/;
      } else {
        return /\blenovo[ \-]?([a-z0-9]+)/;
      }
    }
  ],

  // 中兴
  ["zte",
    function(ua) {
      if (/\bzte\-[tu]/.test(ua)) {
        return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/;
      } else if (/\b(n909|v985)\b/.test(ua)) {
        return /\b(n909|v985)\b/;
      } else {
        return /\bzte[ _\-]?([a-su-z0-9\+]+)/;
      }
    }
  ],
  //杂牌手机
  ['asuv', /\basus_([a-z0-9]+)\b/],
  ['欧博信', /\b(a19)/],
  ['埃立特', /\b(s588)/],
  ['优思', /\b(t350)/],
  ['华凌', /\b(v015c)/],
  ['alcatel', /\balcatel /],
  ['一加', /\ba0001 build/],
  ['蓝米', /\blanmi[_\-]([a-z0-9]+)\b/],

  ['E派',
    function(ua) {
      if (/\bebest[_\- ]([a-z0-9]+)\b/.test(ua)) {
        return /\bebest[_\- ]([a-z0-9]+)\b/;
      } else if (/t314803 build/.test(ua)) {
        return /(t314803)/;
      }
    }
  ],
  ['HIKe', /\bhike[_\- ]([a-z0-9]+)\b/],
  ['qmi', /\bqmi build/],
  ['友信达', /\bq7 build/],
  ['优米', /\bumi[\-]?([a-z0-9]+)/],
  ['嘉源', /\bcayon ([a-z0-9]+)/],
  ['intki', /\bintki[_\- ]([a-z0-9]+)/],
  ['星语', /\bxy[- ]([a-z0-9]+)/],
  ['欧奇', /\boku([a-z0-9]+)/],
  ['海派', /\bhaipai ([a-z0-9 ]+) build/],
  ['广信',
    function(ua) {
      if (/\bef98 build/.test(ua)) {
        return /\bef98 build/;
      }
      return /\bkingsun[_\- ]([a-z0-9]+)\b/;
    }
  ],
  ['nibiru', /\bh1 build/],

  ['神州', /\bhasee ([a-z0-9 ]+) build\b/],
  ['青橙', /\bgo ([a-z0-9\-]+) build\b/],
  ['海信',
    function(ua) {
      if (/\bhs[ \-]+([a-z0-9]+)/.test(ua)) {
        return /\bhs[ \-]+([a-z0-9]+)/;
      } else if (/ (e601m|t980) build/) {
        return / (e601m|t980) build/;
      }
    }
  ],
  ["金立",
    function(ua) {
      if (/\b(?:gn|gionee)[ \-_]?([a-z0-9]+)[ \/]+/.test(ua)) {
        return /\b(?:gn|gionee)[ \-_]?([a-z0-9]+)[ \/]+/;
      } else if (/; a5 build/.test(ua)) {
        return /; (a5) build/;
      } else if (/; e6 build/.test(ua)) {
        return /; (e6) build/;
      }
    }
  ],

  ["eton", /\beton ([a-z0-9]+)/],
  ["bohp", /\bbohp[_\- ]([a-z0-9]+)/],
  ['小杨树', /; (mm110\d) build/],
  ['语信',
    function(ua) {
      if (/\byusun ([a-z0-9]+)/.test(ua)) {
        return /\byusun ([a-z0-9]+)/;
      } else if (/\bla\d-([a-z0-9]+) build/.test(ua)) {
        return /\b(la\d-([a-z0-9]+)) build/;
      } else if (/\bt21 build/.test(ua)) {
        return /\b(t21) build/;
      }
    }
  ],
  ['nubia', /\b(z7|nx\d{3}[a|j]) build/],
  ['爱讯达', /\bik build/],
  ['寰宇通', /\bxy\-a3/],
  ['mofut', /\bmofut ([a-z0-9]+) build/],
  ['InFocus', /\binfocus ([a-z0-9]+) build/],
  ['大唐',
    function(ua) {
      if (/\b(i318)_t3 build/.test(ua)) {
        return /\b(i318)_t3 build/;
      } else if (/\bdatang ([a-z0-9]+)/.test(ua)) {
        return /\bdatang ([a-z0-9]+)/;
      }
    }
  ],
  ['邦华', /\bboway ([a-z0-9]+)/],
  ['天迈', /\bt\-smart ([a-z0-9]+)/],
  ['大显', /\bht7100/],
  ['博瑞', /\bbror ([a-z0-9]+)/],
  ['lingwin',
    function(ua) {
      if (/\blingwin ([a-z0-9]+)/.test(ua)) {
        return /\blingwin ([a-z0-9]+)/;
      }
      return /lingwin /;
    }
  ],
  ['iusai', /\biusai ([a-z0-9]+)/],
  ['波导',
    function(ua) {
      if (/\bbird ([a-z0-9]+)/.test(ua)) {
        return /\bbird ([a-z0-9]+)/;
      } else if (/\bdoeasy ([a-z0-9]+) build/.test(ua)) {
        return /\bdoeasy ([a-z0-9]+) build/;
      }
    }
  ],
  ['德赛', /\bdesay ([a-z0-9]+)/],
  ['蓝魔', /\bramos([a-z0-9]+)/],
  ['美图', /\bmeitu(\d+) build/],
  ['opsson', /\bopsson ([a-z0-9]+)/],
  ['benwee', /\bbenwee ([a-z0-9]+)/],
  ['hosin', /\bhosin ([a-z0-9]+)/],
  ['锤子', /; (sm701) build/],
  ['ephone', /ephone ([a-z0-9]+)/],
  ['佰事讯', /\b(wx9) build/],
  ['newman', /; newman ([a-z0-9]+) build/],
  ['康佳',
    function(ua) {
      if (/ (l823) build/.test(ua)) {
        return / (l823) build/;
      } else if (/\bkonka[_\-]([a-z0-9]+)/.test(ua)) {
        return /\bkonka[_\-]([a-z0-9]+)/;
      }
    }
  ],
  ['haier',
    function(ua) {
      if (/\b(?:haier|ht)[_-]([a-z0-9\-]+)\b/.test(ua)) {
        return /\b(?:haier|ht)[_-]([a-z0-9\-]+)\b/;
      }
    }
  ],
  ['moto',
    function(ua) {
      if (/\bmot[\-]([a-z0-9]+)/.test(ua)) {
        return /\bmot[\-]([a-z0-9]+)/;
      } else if (/ (xt\d{3}) build/.test(ua)) {
        return / (xt\d{3}) build/;
      }
    }
  ],
  // 步步高
  ["vivo", /\bvivo(?: ([a-z0-9]+))?/],
  ['TCL',
    function(ua) {
      if (/\btcl[ \-]([a-z0-9]+)/.test(ua)) {
        return /\btcl[ \-]([a-z0-9]+)/;
      } else if (/\btcl([a-z0-9]+)/.test(ua)) {
        return /\btcl([a-z0-9]+)/;
      }
    }
  ],
  ["htc",
    function(ua) {
      if (/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)) {
        return /\bhtc[ _\-]?([a-z0-9 _]+(?= build))/;
      } else {
        return /\bhtc[ _\-]?([a-z0-9 _]+)/;
      }
    }
  ],
  ['天语',
    function(ua) {
      if (ua.indexOf('k-touch ') !== -1) {
        return /\bk\-touch ([a-z0-9 +]+)(?:build|\))/
      } else if (ua.indexOf('k-touch_') !== -1) {
        return /\bk-touch_(a-z0-9)+/;
      } else if (/k[ \-]touch/.test(ua)) {
        return /k[ \-]touch ([a-z0-9]+)\b/;
      }
    }
  ],


  ["sony",
    function(ua) {
      if (/\b([l|s]t\d{2}[i]{1,2}|[s|l]\d{2}h|m\d{2}c) build/.test(ua)) {
        return /\b([l|s]t\d{2}[i]{1,2}|[s|l]\d{2}h|m\d{2}c)/;
      } else if (/\bmt([a-z0-9]+)/.test(ua)) {
        return /\bmt([a-z0-9]+)/;
      } else if (/ l\d{2}t build/.test(ua)) {
        return / (l\d{2}t) build/;
      } else if (/ c6\d{3} /.test(ua)) {
        return / (c6\d{3}) /;
      } else if (/\bx10([a-z0-9]+) build/.test(ua)) {
        return /\b(x10([a-z0-9]+)) build/;
      }
      return /\bxm\d{2}t/;
    }
  ],
  ["coolpad",
    function(ua) {
      if (/\bcoolpad[_ ]?([a-z0-9]+)/.test(ua)) {
        return /\bcoolpad[_ ]?([a-z0-9]+)/;
      } else if (/ (5910|8190q|8295) build/.test(ua)) {
        return / (5910|8190q|8295) build/;
      }
    }
  ],
  ["lg", /\blg[\-]([a-z0-9]+)/],
  ['doov', /\bdoov[ _]([a-z0-9]+)/],
  ["oppo",
    function(ua) {
      if (/\boppo[_]([a-z0-9]+)/.test(ua)) {
        return /\boppo[_]([a-z0-9]+)/;
      } else if (/\b([xrun]{1}\d{1,4}[ts]?) build/i.test(ua)) {
        return /\b([xrun]{1}\d{1,4}[ts]?)\b/i;
      } else if (/\br\d\sbuild\b/.test(ua)) {
        return /\b(r\d)\sbuild\b/
      } else if (/ t29 build/.test(ua)) {
        return / (t29) build/;
      } else if (/\boppo/.test(ua)) {
        return /\boppo([a-z0-9]+)/;
      }
    }
  ],
  ['天时达',
    function(ua) {
      if (/\bts(\d+)/.test(ua)) {
        return /\bts(\d+)/;
      } else if (/\b(t5688) /.test(ua)) {
        return /\b(t5688) /;
      }
    }
  ],
  ['other', /zh\-cn; ([a-z0-9\_\-\s]+) build\//],
  ["android", /\bandroid\b|\badr\b/],
  ["blackberry", "blackberry"]
];

// 操作系统信息识别表达式
var OS = [
  ["wp",
    function(ua) {
      if (ua.indexOf("windows phone ") !== -1) {
        return /\bwindows phone (?:os )?([0-9.]+)/;
      } else if (ua.indexOf("xblwp") !== -1) {
        return /\bxblwp([0-9.]+)/;
      } else if (ua.indexOf("zunewp") !== -1) {
        return /\bzunewp([0-9.]+)/;
      }
      return "windows phone";
    }
  ],
  ["windows", /\bwindows nt ([0-9.]+)/],
  ["macosx", /\bmac os x ([0-9._]+)/],
  ["ios",
    function(ua) {
      if (/\bcpu(?: iphone)? os /.test(ua)) {
        return /\bcpu(?: iphone)? os ([0-9._]+)/;
      } else if (ua.indexOf("iph os ") !== -1) {
        return /\biph os ([0-9_]+)/;
      } else {
        return /\bios\b/;
      }
    }
  ],
  ["yunos", /\baliyunos ([0-9.]+)/],
  ["android",
    function(ua) {
      if (ua.indexOf("android") >= 0) {
        return /\bandroid[ \/-]?([0-9.x]+)?/;
      } else if (ua.indexOf("adr") >= 0) {
        if (ua.indexOf("mqqbrowser") >= 0) {
          return /\badr[ ]\(linux; u; ([0-9.]+)?/;
        } else {
          return /\badr(?:[ ]([0-9.]+))?/;
        }
      }
      return "android";
      //return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
    }
  ],
  ["chromeos", /\bcros i686 ([0-9.]+)/],
  ["linux", "linux"],
  ["windowsce", /\bwindows ce(?: ([0-9.]+))?/],
  ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/],
  ["blackberry", "blackberry"]
];

// 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
// @param {String} ua, userAgent string.
// @return {Object}
function IEMode(ua) {
  if (!re_msie.test(ua)) {
    return null;
  }

  var m,
    engineMode, engineVersion,
    browserMode, browserVersion,
    compatible = false;

  // IE8 及其以上提供有 Trident 信息，
  // 默认的兼容模式，UA 中 Trident 版本不发生变化。
  if (ua.indexOf("trident/") !== -1) {
    m = /\btrident\/([0-9.]+)/.exec(ua);
    if (m && m.length >= 2) {
      // 真实引擎版本。
      engineVersion = m[1];
      var v_version = m[1].split(".");
      v_version[0] = parseInt(v_version[0], 10) + 4;
      browserVersion = v_version.join(".");
    }
  }

  m = re_msie.exec(ua);
  browserMode = m[1];
  var v_mode = m[1].split(".");
  if ("undefined" === typeof browserVersion) {
    browserVersion = browserMode;
  }
  v_mode[0] = parseInt(v_mode[0], 10) - 4;
  engineMode = v_mode.join(".");
  if ("undefined" === typeof engineVersion) {
    engineVersion = engineMode;
  }

  return {
    browserVersion: browserVersion,
    browserMode: browserMode,
    engineVersion: engineVersion,
    engineMode: engineMode,
    compatible: engineVersion !== engineMode
  };
}

// 针对同源的 TheWorld 和 360 的 external 对象进行检测。
// @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
// @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
function checkTW360External(key) {
  if (!external) {
    return;
  } // return undefined.
  try {
    //        360安装路径：
    //        C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
    var runpath = external.twGetRunPath.toLowerCase();
    // 360SE 3.x ~ 5.x support.
    // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
    // 因此只能用 try/catch 而无法使用特性判断。
    var security = external.twGetSecurityID(win);
    var version = external.twGetVersion(security);

    if (runpath && runpath.indexOf(key) === -1) {
      return false;
    }
    if (version) {
      return {
        version: version
      };
    }
  } catch (ex) {}
}

var ENGINE = [
  ["trident", re_msie],
  //["blink", /blink\/([0-9.+]+)/],
  ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/],
  ["gecko", /\bgecko\/(\d+)/],
  ["presto", /\bpresto\/([0-9.]+)/],
  ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/],
  ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/],
  ["u2", /\bu2\/([0-9.]+)/],
  ["u3", /\bu3\/([0-9.]+)/]
];
var BROWSER = [
  //手机百度
  ['baidusearch',
    function(ua) {
      var back = 0;
      var a;
      if (/ baiduboxapp\//i.test(ua)) {
        if (a = /([\d+.]+)_(?:diordna|enohpi)_/.exec(ua)) {
          a = a[1].split('.');
          back = a.reverse().join('.');
        } else if (a = /baiduboxapp\/([\d+.]+)/.exec(ua)) {
          back = a[1];
        }

        return {
          version: back
        };
      }
      return false;
    }
  ],
  // Sogou.
  ["sogou",
    function(ua) {
      if (ua.indexOf("sogoumobilebrowser") >= 0) {
        return /sogoumobilebrowser\/([0-9.]+)/
      } else if (ua.indexOf("sogoumse") >= 0) {
        return true;
      }
      return / se ([0-9.x]+)/;
    }
  ],
  // TheWorld (世界之窗)
  // 由于裙带关系，TheWorld API 与 360 高度重合。
  // 只能通过 UA 和程序安装路径中的应用程序名来区分。
  // TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
  ["theworld",
    function(ua) {
      var x = checkTW360External("theworld");
      if (typeof x !== "undefined") {
        return x;
      }
      return "theworld";
    }
  ],
  // 360SE, 360EE.
  ["360",
    function(ua) {
      var x = checkTW360External("360se");
      if (typeof x !== "undefined") {
        return x;
      }
      if (ua.indexOf("360 aphone browser") !== -1) {
        return /\b360 aphone browser \(([^\)]+)\)/;
      }
      return /\b360(?:se|ee|chrome|browser)\b/;
    }
  ],
  // Maxthon
  ["maxthon",
    function(ua) {
      try {
        if (external && (external.mxVersion || external.max_version)) {
          return {
            version: external.mxVersion || external.max_version
          };
        }
      } catch (ex) {}
      return /\b(?:maxthon|mxbrowser)(?:[ \/]([0-9.]+))?/;
    }
  ],
  ["qq", /\bm?qqbrowser\/([0-9.]+)/],
  ["green", "greenbrowser"],
  ["tt", /\btencenttraveler ([0-9.]+)/],
  ["liebao",
    function(ua) {
      if (ua.indexOf("liebaofast") >= 0) {
        return /\bliebaofast\/([0-9.]+)/;
      }
      if (ua.indexOf("lbbrowser") === -1) {
        return false;
      }
      var version;
      try {
        if (external && external.LiebaoGetVersion) {
          version = external.LiebaoGetVersion();
        }
      } catch (ex) {}
      return {
        version: version || NA_VERSION
      };
    }
  ],
  ["tao", /\btaobrowser\/([0-9.]+)/],
  ["coolnovo", /\bcoolnovo\/([0-9.]+)/],
  ["saayaa", "saayaa"],
  // 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
  ["baidu", /\b(?:ba?idubrowser|baiduhd)[ \/]([0-9.x]+)/],
  // 后面会做修复版本号，这里只要能识别是 IE 即可。
  ["ie", re_msie],
  ["mi", /\bmiuibrowser\/([0-9.]+)/],
  // Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
  ["opera",
    function(ua) {
      var re_opera_old = /\bopera.+version\/([0-9.ab]+)/;
      var re_opera_new = /\bopr\/([0-9.]+)/;
      return re_opera_old.test(ua) ? re_opera_old : re_opera_new;
    }
  ],
  ["oupeng", /\boupeng\/([0-9.]+)/],
  ["yandex", /yabrowser\/([0-9.]+)/],
  // 支付宝手机客户端
  ["ali-ap",
    function(ua) {
      if (ua.indexOf("aliapp") > 0) {
        return /\baliapp\(ap\/([0-9.]+)\)/;
      } else {
        return /\balipayclient\/([0-9.]+)\b/;
      }
    }
  ],
  // 支付宝平板客户端
  ["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
  // 支付宝商户客户端
  ["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
  // 淘宝手机客户端
  ["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
  // 淘宝平板客户端
  ["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
  // 天猫手机客户端
  ["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
  // 天猫平板客户端
  ["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
  // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
  // UC 桌面版浏览器携带 Chrome 信息，需要放在 Chrome 之前。
  ["uc",
    function(ua) {
      if (ua.indexOf("ucbrowser/") >= 0) {
        return /\bucbrowser\/([0-9.]+)/;
      } else if (ua.indexOf("ubrowser/") >= 0) {
        return /\bubrowser\/([0-9.]+)/;
      } else if (/\buc\/[0-9]/.test(ua)) {
        return /\buc\/([0-9.]+)/;
      } else if (ua.indexOf("ucweb") >= 0) {
        // `ucweb/2.0` is compony info.
        // `UCWEB8.7.2.214/145/800` is browser info.
        return /\bucweb([0-9.]+)?/;
      } else {
        return /\b(?:ucbrowser|uc)\b/;
      }
    }
  ],
  ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
  // Android 默认浏览器。该规则需要在 safari 之前。
  ["android",
    function(ua) {
      if (ua.indexOf("android") === -1) {
        return;
      }
      return /\bversion\/([0-9.]+(?: beta)?)/;
    }
  ],
  ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
  // 如果不能被识别为 Safari，则猜测是 WebView。
  ["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
  ["firefox", /\bfirefox\/([0-9.ab]+)/],
  ["nokia", /\bnokiabrowser\/([0-9.]+)/]
];

// UserAgent Detector.
// @param {String} ua, userAgent.
// @param {Object} expression
// @return {Object}
//    返回 null 表示当前表达式未匹配成功。
function detect(name, expression, ua) {
  var expr = isFunction(expression) ? expression.call(null, ua) : expression;
  if (!expr) {
    return null;
  }
  var info = {
    name: name,
    version: NA_VERSION,
    codename: ""
  };
  var t = toString(expr);
  if (expr === true) {
    return info;
  } else if (t === "[object String]") {
    if (ua.indexOf(expr) !== -1) {
      return info;
    }
  } else if (isObject(expr)) { // Object
    if (expr.hasOwnProperty("version")) {
      info.version = expr.version;
    }
    return info;
  } else if (expr.exec) { // RegExp
    var m = expr.exec(ua);
    if (m) {
      if (m.length >= 2 && m[1]) {
        info.version = m[1].replace(/_/g, ".");
      } else {
        info.version = NA_VERSION;
      }
      return info;
    }
  }
}

var na = {
  name: "na",
  version: NA_VERSION
};
// 初始化识别。
function init(ua, patterns, factory, detector) {
  var detected = na;

  each(patterns, function(pattern) {
    if (pattern) {
      var d = detect(pattern[0], pattern[1], ua);
      if (d) {
        detected = d;
        return false;
      }
    }

  });
  factory.call(detector, detected.name, detected.version);
}

// 解析 UserAgent 字符串
// @param {String} ua, userAgent string.
// @return {Object}
var parse = function(ua, types) {
  ua = (ua || "").toLowerCase();
  var d = {};
  types = types || ['device', 'os', 'engine', 'browser'];

  if (types.indexOf('device') !== -1) {
    init(ua, DEVICES, function(name, version) {
      var v = parseFloat(version);
      if (name === 'other' && version.indexOf(' ') !== -1) {
        name = version.split(/\s+/);
        version = name[1] || '';
        name = name[0];
      }
      d.device = {
        name: name,
        version: v,
        fullVersion: version
      };
    }, d);
  }

  if (types.indexOf('os') !== -1) {
    init(ua, OS, function(name, version) {
      var v = parseFloat(version);
      d.os = {
        name: name,
        version: v,
        fullVersion: version
      };
    }, d);
  }
  if (types.indexOf('engine') !== -1) {
    var ieCore = IEMode(ua);

    init(ua, ENGINE, function(name, version) {
      var mode = version;
      // IE 内核的浏览器，修复版本号及兼容模式。
      if (ieCore) {
        version = ieCore.engineVersion || ieCore.engineMode;
        mode = ieCore.engineMode;
      }
      var v = parseFloat(version);
      d.engine = {
        name: name,
        version: v,
        fullVersion: version,
        mode: parseFloat(mode),
        fullMode: mode,
        compatible: ieCore ? ieCore.compatible : false
      };
    }, d);
  }
  if (types.indexOf('browser') !== -1) {
    init(ua, BROWSER, function(name, version) {
      var mode = version;
      // IE 内核的浏览器，修复浏览器版本及兼容模式。
      if (ieCore) {
        // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
        if (name === "ie") {
          version = ieCore.browserVersion;
        }
        mode = ieCore.browserMode;
      }
      var v = parseFloat(version);
      d.browser = {
        name: name,
        version: v,
        fullVersion: version,
        mode: parseFloat(mode),
        fullMode: mode,
        compatible: ieCore ? ieCore.compatible : false
      };
    }, d);
  }
  return d;
};


// NodeJS.
if (typeof process === "object" && process.toString() === "[object process]") {

  // 加载更多的规则。
  var morerule = module["require"]("./morerule");
  [].unshift.apply(DEVICES, morerule.DEVICES || []);
  [].unshift.apply(OS, morerule.OS || []);
  [].unshift.apply(BROWSER, morerule.BROWSER || []);
  [].unshift.apply(ENGINE, morerule.ENGINE || []);

} else {

  var userAgent = navigator.userAgent || "";
  //var platform = navigator.platform || "";
  var appVersion = navigator.appVersion || "";
  var vendor = navigator.vendor || "";
  external = win.external;

  detector = parse(userAgent + " " + appVersion + " " + vendor);
  win.detector = detector;

}


// exports `parse()` API anyway.
detector.parse = parse;

module.exports = detector;
