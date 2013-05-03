define("arale/detector/1.0.1/detector-debug", [ "./versioning-debug" ], function(require, exports, module) {
    var versioning = require("./versioning-debug");
    var detector = {};
    var userAgent = navigator.userAgent || "";
    var platform = navigator.platform || "";
    var vendor = navigator.vendor || "";
    var external = window.external;
    var re_msie = /\b(?:msie|ie) ([0-9.]+)/;
    function toString(object) {
        return Object.prototype.toString.call(object);
    }
    function isObject(object) {
        return toString(object) === "[object Object]";
    }
    function isFunction(object) {
        return toString(object) === "[object Function]";
    }
    function isArray(object) {
        return toString(object) === "[object Array]";
    }
    function each(object, factory, argument) {
        if (isArray(object)) {
            for (var i = 0, b, l = object.length; i < l; i++) {
                if (factory.call(object, object[i], i) === false) {
                    break;
                }
            }
        }
    }
    // 硬件设备信息识别表达式。
    // 使用数组可以按优先级排序。
    var DEVICES = [ [ "nokia", function(ua) {
        if (ua.indexOf("nokia ") !== -1) {
            return /\bnokia ([0-9]+)?/;
        } else if (/\bnokia[\d]/.test(ua)) {
            return /\bnokia(\d+)/;
        } else {
            return "nokia";
        }
    } ], [ "wp", function(ua) {
        return ua.indexOf("windows phone ") !== -1 || ua.indexOf("xblwp") !== -1 || ua.indexOf("zunewp") !== -1 || ua.indexOf("windows ce") !== -1;
    } ], [ "pc", "windows" ], [ "ipad", "ipad" ], [ "ipod", "ipod" ], [ "iphone", "iphone" ], [ "mac", "macintosh" ], [ "mi", function(ua) {
        if (ua.indexOf("mi-one plus") !== -1) {
            return {
                version: "1s"
            };
        } else {
            return /\bmi ([0-9.as]+)/;
        }
    } ], [ "aliyun", "aliyunos" ], [ "meizu", /\bm([0-9]+)\b/ ], [ "nexus", /\bnexus ([0-9.]+)/ ], [ "android", "android" ], [ "blackberry", "blackberry" ] ];
    // 操作系统信息识别表达式
    var OS = [ [ "wp", function(ua) {
        if (ua.indexOf("windows phone ") !== -1) {
            return /\bwindows phone (?:os )?([0-9.]+)/;
        } else if (ua.indexOf("xblwp") !== -1) {
            return /\bxblwp([0-9.]+)/;
        } else if (ua.indexOf("zunewp") !== -1) {
            return /\bzunewp([0-9.]+)/;
        }
        return "windows phone";
    } ], [ "windows", /\bwindows nt ([0-9.]+)/ ], [ "macosx", /\bmac os x ([0-9._]+)/ ], [ "ios", /\bcpu(?: iphone)? os ([0-9._]+)/ ], [ "yunos", /\baliyunos ([0-9.]+)/ ], [ "android", /\bandroid[ -]([0-9.]+)/ ], [ "chromeos", /\bcros i686 ([0-9.]+)/ ], [ "linux", "linux" ], [ "windowsce", /\bwindows ce(?: ([0-9.]+))?/ ], [ "symbian", /\bsymbianos\/([0-9.]+)/ ], [ "blackberry", "blackberry" ] ];
    //var OS_CORE = [
    //["windows-mobile", ""]
    //["windows", "windows"]
    //];
    /*
   * 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
   * @param {String} ua, userAgent string.
   * @return {Object}
   */
    function IEMode(ua) {
        if (!re_msie.test(ua)) {
            return null;
        }
        var m, engineMode, engineVersion, browserMode, browserVersion, compatible = false;
        // IE8 及其以上提供有 Trident 信息，
        // 默认的兼容模式，UA 中 Trident 版本不发生变化。
        if (ua.indexOf("trident/") !== -1) {
            m = /\btrident\/([0-9.]+)/.exec(ua);
            if (m && m.length >= 2) {
                // 真实引擎版本。
                engineVersion = m[1];
                v_version = m[1].split(".");
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
    var ENGINE = [ [ "trident", re_msie ], //["blink", /blink\/([0-9.+]+)/],
    [ "webkit", /\bapplewebkit\/([0-9.+]+)/ ], [ "gecko", /\bgecko\/(\d+)/ ], [ "presto", /\bpresto\/([0-9.]+)/ ] ];
    var BROWSER = [ /**
     * 360SE (360安全浏览器)
     **/
    [ "360", function(ua) {
        //if(!detector.os.windows) return false;
        if (external) {
            try {
                return external.twGetVersion(external.twGetSecurityID(window));
            } catch (e) {
                try {
                    return external.twGetRunPath.toLowerCase().indexOf("360se") !== -1 || !!external.twGetSecurityID(window);
                } catch (e) {}
            }
        }
        return /\b360(?:se|ee|chrome)/;
    } ], /**
     * Maxthon (傲游)
     **/
    [ "mx", function(ua) {
        //if(!detector.os.windows) return false;
        if (external) {
            try {
                return (external.mxVersion || external.max_version).split(".");
            } catch (e) {}
        }
        return /\bmaxthon(?:[ \/]([0-9.]+))?/;
    } ], /**
     * [Sogou (搜狗浏览器)](http://ie.sogou.com/)
     **/
    [ "sg", / se ([0-9.x]+)/ ], /**
     * TheWorld (世界之窗)
     * NOTE: 由于裙带关系，TW API 与 360 高度重合。若 TW 不提供标准信息，则可能会被识别为 360
     **/
    [ "tw", function(ua) {
        //if(!detector.os.windows) return false;
        if (external) {
            try {
                return external.twGetRunPath.toLowerCase().indexOf("theworld") !== -1;
            } catch (e) {}
        }
        return "theworld";
    } ], [ "green", "greenbrowser" ], [ "qq", /\bqqbrowser\/([0-9.]+)/ ], [ "tt", /\btencenttraveler ([0-9.]+)/ ], [ "lb", function(ua) {
        if (ua.indexOf("lbbrowser") === -1) {
            return false;
        }
        var version = "-1";
        if (window.external && window.external.LiebaoGetVersion) {
            try {
                version = window.external.LiebaoGetVersion();
            } catch (ex) {}
        }
        return {
            version: version
        };
    } ], [ "tao", /\btaobrowser\/([0-9.]+)/ ], [ "fs", /\bcoolnovo\/([0-9.]+)/ ], [ "sy", "saayaa" ], [ "baidu", /\bbidubrowser[ \/]([0-9.x]+)/ ], [ "mi", /\bmiuibrowser\/([0-9.]+)/ ], // 后面会做修复版本号，这里只要能识别是 IE 即可。
    [ "ie", re_msie ], [ "chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/ ], [ "safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\// ], [ "firefox", /\bfirefox\/([0-9.ab]+)/ ], [ "opera", /\bopera.+version\/([0-9.ab]+)/ ], [ "uc", function(ua) {
        return ua.indexOf("ucbrowser") !== -1 ? /\bucbrowser\/([0-9.]+)/ : /\bucweb([0-9.]+)/;
    } ] ];
    /**
   * UserAgent Detector.
   * @param {String} ua, userAgent.
   * @param {Object} expression
   * @return {Object}
   *    返回 null 表示当前表达式未匹配成功。
   */
    function detect(name, expression, ua) {
        if ("undefined" === typeof ua) {
            ua = userAgent;
        }
        var expr = isFunction(expression) ? expression.call(null, ua) : expression;
        if (!expr) {
            return null;
        }
        var info = {
            name: name,
            version: "-1",
            codename: ""
        };
        var t = toString(expr);
        if (expr === true) {
            return info;
        } else if (t === "[object String]") {
            if (ua.indexOf(expr) !== -1) {
                return info;
            }
        } else if (isObject(expr)) {
            // Object
            if (expr.hasOwnProperty("version")) {
                info.version = expr.version;
            }
            return info;
        } else if (expr.exec) {
            // RegExp
            var m = expr.exec(ua);
            if (m) {
                if (m.length >= 2 && m[1]) {
                    info.version = m[1].replace(/_/g, ".");
                } else {
                    info.version = "-1";
                }
                return info;
            }
        }
    }
    var na = {
        name: "na",
        version: "-1"
    };
    // 初始化识别。
    function init(ua, patterns, factory, detector) {
        var detected = na;
        each(patterns, function(pattern) {
            var d = detect(pattern[0], pattern[1], ua);
            if (d) {
                detected = d;
                return false;
            }
        });
        factory.call(detector, detected.name, detected.version);
    }
    /**
   * 解析 UserAgent 字符串
   * @param {String} ua, userAgent string.
   * @return {Object}
   */
    var parse = function(ua) {
        ua = (ua || "").toLowerCase();
        var d = {};
        init(ua, DEVICES, function(name, version) {
            var v = new versioning(version);
            d.device = {
                name: name,
                version: v
            };
            d.device[name] = v;
        }, d);
        init(ua, OS, function(name, version) {
            var v = new versioning(version);
            d.os = {
                name: name,
                version: v
            };
            d.os[name] = v;
        }, d);
        var ieCore = IEMode(ua);
        init(ua, ENGINE, function(name, version) {
            var mode = version;
            // IE 内核的浏览器，修复版本号及兼容模式。
            if (ieCore) {
                version = ieCore.engineVersion || ieCore.engineMode;
                mode = ieCore.engineMode;
            }
            var vv = new versioning(version);
            var vm = new versioning(mode);
            d.engine = {
                name: name,
                version: vv,
                mode: vm,
                compatible: ieCore ? ieCore.compatible : false
            };
            d.engine[name] = vv;
        }, d);
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
            var vv = new versioning(version);
            var vm = new versioning(mode);
            // Android 默认浏览器。
            if (ua.indexOf("android") !== -1 && name === "safari") {
                name = "android";
            }
            d.browser = {
                name: name,
                version: vv,
                mode: vm,
                compatible: ieCore ? ieCore.compatible : false
            };
            d.browser[name] = vv;
        }, d);
        return d;
    };
    detector = parse(userAgent);
    detector.detect = parse;
    module.exports = detector;
});

/**
 * Version Number
 * @author 闲耘 <hotoo.cn@gmail.com>
 *
 * @usage
 *    var version = new Versioning("1.2.3")
 *    version > 1
 *    version.eq(1)
 */
define("arale/detector/1.0.1/versioning-debug", [], function(require, exports, module) {
    // Semantic Versioning Delimiter.
    var delimiter = ".";
    var Version = function(version) {
        this._version = String(version);
    };
    function compare(v1, v2, complete) {
        v1 = String(v1);
        v2 = String(v2);
        if (v1 === v2) {
            return 0;
        }
        var v1s = v1.split(delimiter);
        var v2s = v2.split(delimiter);
        var len = Math[complete ? "max" : "min"](v1s.length, v2s.length);
        for (var i = 0; i < len; i++) {
            v1s[i] = "undefined" === typeof v1s[i] ? 0 : parseInt(v1s[i], 10);
            v2s[i] = "undefined" === typeof v2s[i] ? 0 : parseInt(v2s[i], 10);
            if (v1s[i] > v2s[i]) {
                return 1;
            }
            if (v1s[i] < v2s[i]) {
                return -1;
            }
        }
        return 0;
    }
    Version.compare = function(v1, v2) {
        return compare(v1, v2, true);
    };
    /**
   * @param {String} v1.
   * @param {String} v2.
   * @return {Boolean} true if v1 equals v2.
   *
   *    Version.eq("6.1", "6"); // true.
   *    Version.eq("6.1.2", "6.1"); // true.
   */
    Version.eq = function(v1, v2) {
        return compare(v1, v2, false) === 0;
    };
    /**
   * @param {String} v1.
   * @param {String} v2.
   * @return {Boolean} return true
   */
    Version.gt = function(v1, v2) {
        return compare(v1, v2, true) > 0;
    };
    Version.gte = function(v1, v2) {
        return compare(v1, v2, true) >= 0;
    };
    Version.lt = function(v1, v2) {
        return compare(v1, v2, true) < 0;
    };
    Version.lte = function(v1, v2) {
        return compare(v1, v2, true) <= 0;
    };
    Version.prototype = {
        // new Version("6.1").eq(6); // true.
        // new Version("6.1.2").eq("6.1"); // true.
        eq: function(version) {
            return Version.eq(this._version, version);
        },
        gt: function(version) {
            return Version.gt(this._version, version);
        },
        gte: function(version) {
            return Version.gte(this._version, version);
        },
        lt: function(version) {
            return Version.lt(this._version, version);
        },
        lte: function(version) {
            return Version.lte(this._version, version);
        },
        valueOf: function() {
            return parseFloat(this._version.split(delimiter).slice(0, 2).join(delimiter), 10);
        },
        /**
     * XXX: ""+ver 调用的转型方法是 valueOf，而不是 toString，这个有点悲剧。
     * 只能使用 String(ver) 或 ver.toString() 方法。
     * @param {Number} precision, 返回的版本号精度。默认返回完整版本号。
     * @return {String}
     */
        toString: function(precision) {
            return "undefined" === typeof precision ? this._version : this._version.split(delimiter).slice(0, precision).join(delimiter);
        }
    };
    module.exports = Version;
});
