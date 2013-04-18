
define(function(require, exports, module) {

  var versioning = require("versioning");

  var detector = {};

  var userAgent = navigator.userAgent || "";
  var platform = navigator.platform || "";
  var vendor = navigator.vendor || "";
  var external = window.external;

  function _type(object){
    return Object.prototype.toString.call(object);
  }
  function isObject(object){
    return Object.prototype.toString.call(object) === '[object Object]';
  }
  function isFunction(object){
    return Object.prototype.toString.call(object) === '[object Function]';
  }
  function isArray(object){
    return Object.prototype.toString.call(object) === '[object Array]';
  }
  function each(object, factory, argument){
    if(isArray(object)){
      for(var i=0,b,l=object.length; i<l; i++){
        if(factory.call(object, object[i], i) === false){break;}
      }
    }
  }

  // 硬件设备信息识别表达式。
  // 使用数组可以按优先级排序。
  var DEVICES = [
    ["pc", "windows"],
    ["ipad", "ipad"],
    ["ipod", "ipod"],
    ["iphone", "iphone"],
    ["mac", "macintosh"],
    ["android", "android"],
    ["nokia", /nokia([^\/ ])/]
  ];
  // 操作系统信息识别表达式
  var OS = [
    // TODO: identify windows ce/mobile
    ["windows", /windows nt ([0-9.]+)/],
    ["macosx", /mac os x ([0-9._]+)/],
    ["ios", /cpu(?: iphone)? os ([0-9._]+)/],
    ["android", /android ([0-9.]+)/],
    ["chromeos", /cros i686 ([0-9.]+)/],
    ["linux", "linux"],
    // XXX: /windows ce(?: ([0-9.]+))?/
    ["windowsce", userAgent.indexOf('windows ce ') > 0 ? (/windows ce ([0-9.]+)/) : 'windows ce'],
    ["symbian", /symbianos\/([0-9.]+)/],
    ["blackberry", 'blackberry']
  ];
  var ENGINE = [
    ["trident", function(ua){
      // IE8 及其以上提供有 Trident 信息
      if(ua.indexOf("trident/") > 0){
        return /trident\/([0-9.]+)/;
      }
      var m = /msie ([0-9.]+)/.exec(ua);
      if(!m){return null;}
      var v = m[1].split(".");
      v[0] = parseInt(v[0], 10) - 4;
      return v;
    }],
    ["blink", /blink\/([0-9.+]+)/],
    ["webkit", /applewebkit\/([0-9.+]+)/],
    ["gecko", /gecko\/(\d+)/],
    ["presto", /presto\/([0-9.]+)/]
  ];
  var BROWSER = [
    /**
     * 360SE (360安全浏览器)
     **/
    ['360', function() {
      //if(!detector.os.windows) return false;
      if(external) {
        try {
          return external.twGetVersion(external.twGetSecurityID(window));
        } catch(e) {
          try {
            return external.twGetRunPath.toLowerCase().indexOf('360se') !== -1 || !!external.twGetSecurityID(window);
          } catch(e) {}
        }
      }
      return (/360(?:se|ee|chrome)/);
    }],
    /**
     * Maxthon (傲游)
     **/
    ["mx", function() {
      //if(!detector.os.windows) return false;
      if(external) {
        try {
          return (external.mxVersion || external.max_version).split('.');
        } catch(e) {}
      }
      return userAgent.indexOf('maxthon ') !== -1 ? (/maxthon ([0-9.]+)/) : 'maxthon';
    }],
    /**
     * [Sogou (搜狗浏览器)](http://ie.sogou.com/)
     **/
    ["sg", / se (\d)\./],
    /**
     * TheWorld (世界之窗)
     * NOTE: 由于裙带关系，TW API 与 360 高度重合。若 TW 不提供标准信息，则可能会被识别为 360
     **/
    ["tw", function() {
      //if(!detector.os.windows) return false;
      if(external) {
        try {
          return external.twGetRunPath.toLowerCase().indexOf('theworld') !== -1;
        } catch(e) {}
      }
      return 'theworld';
    }],
    ["green", "greenbrowser"],
    ["qq", /qqbrowser\/([0-9.]+)/],
    ["tt", /tencenttraveler ([0-9.]+)/],
    ["lb", "lbbrowser"],
    ["tao", /taobrowser\/([0-9.]+)/],
    ["ie", /msie ([0-9.]+)/],
    ["chrome", / (?:chrome|crios)\/([0-9.]+)/],
    ["safari", /version\/([0-9.]+( ?:beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
    ["firefox", /firefox\/([0-9.ab]+)/],
    ["opera", /opera.+version\/([0-9.ab]+)/]
  ];

  var detected = -1, notDetected = 0;

  /**
   * UserAgent Detector.
   * @param {String} ua, userAgent.
   * @param {Object} expression
   * @return {Object}
   *    返回 null 表示当前表达式未匹配成功。
   */
  function detect(name, expression, ua){
    if("undefined" === typeof ua){ua = userAgent;}
    var expr = isFunction(expression) ? expression.call(null, ua) : expression;
    if(!expr){return null;}
    var info = {
      name: name,
      version: "-1",
      codename: ""
    };
    var t = _type(expr);
    if(expr === true){
      return info;
    }else if(t === "[object String]"){
      if(ua.indexOf(expr) !== -1){
        return info;
      }
    }else if(t === "[object Array]"){
      info.name = name;
      info.version = expr.join(".");
      return info;
    }else if(isObject(expr)){ // Object
      if(expr.hasOwnProperty("name")){
        info.name = expr.name || name;
      }
      if(expr.hasOwnProperty("version")){
        info.version = expr.version;
      }
      return info;
    }else if(expr.exec){ // RegExp
      var m = expr.exec(ua);
      if(m){
        info.version = m[1].replace(/_/g, ".");
        return info;
      }
    }
  }

  var unknow = {name:"na", version:"-1"};
  // 初始化识别。
  function init(ua, patterns, factory, detector){
    var detected = unknow;
    each(patterns, function(pattern){
      var d = detect(pattern[0], pattern[1], ua);
      if(d){
        detected = d;
        return false;
      }
    });
    factory.call(detector, detected.name, detected.version);
  }


  var parse = function(ua){
    ua = (ua || "").toLowerCase();
    var d = {};
    init(ua, DEVICES, function(name, version){
      var v = new versioning(version);
      d.device = {
        name: name,
        version: v
      };
      d.device[name] = v;
    }, d);
    init(ua, OS, function(name, version){
      var v = new versioning(version);
      d.os = {
        name: name,
        version: v
      };
      d.os[name] = v;
    }, d);
    init(ua, ENGINE, function(name, version){
      var v = new versioning(version);
      d.engine = {
        name: name,
        version: v
      };
      d.engine[name] = v;
    }, d);
    init(ua, BROWSER, function(name, version){
      var v = new versioning(version);
      d.browser = {
        name: name,
        version: v
      };
      d.browser[name] = v;
      d.browser.compatible = !!d.engine.trident &&
        !d.engine.version.eq(document.documentMode - 4);
    }, d);
    return d;
  };

  detector = parse(userAgent);
  detector.detect = parse;

  window.detector = detector;
  module.exports = detector;
});
