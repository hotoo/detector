"use strict";

const NA_VERSION = "-1";
const NA = {
  name: "na",
  version: NA_VERSION,
};

function typeOf(type){
  return function(object) {
    return Object.prototype.toString.call(object) === "[object " + type + "]";
  };
}
const isString = typeOf("String");
const isRegExp = typeOf("RegExp");
const isObject = typeOf("Object");
const isFunction = typeOf("Function");

function each(object, factory){
  for(let i = 0, l = object.length; i < l; i++){
    if(factory.call(object, object[i], i) === false){
      break;
    }
  }
}

// UserAgent Detector.
// @param {String} ua, userAgent.
// @param {Object} expression
// @return {Object}
//    返回 null 表示当前表达式未匹配成功。
function detect(name, expression, ua) {
  const expr = isFunction(expression) ? expression.call(null, ua) : expression;
  if (!expr) { return null; }
  const info = {
    name: name,
    version: NA_VERSION,
    codename: "",
  };
  if (expr === true) {
    return info;
  }else if(isString(expr)) {
    if(ua.indexOf(expr) !== -1){
      return info;
    }
  } else if (isObject(expr)) {
    if(expr.hasOwnProperty("version")){
      info.version = expr.version;
    }
    return info;
  } else if (isRegExp(expr)) {
    const m = expr.exec(ua);
    if (m) {
      if(m.length >= 2 && m[1]) {
        info.version = m[1].replace(/_/g, ".");
      }else{
        info.version = NA_VERSION;
      }
      return info;
    }
  }
}

// 初始化识别。
function init(ua, patterns, factory, detector){
  let detected = NA;
  each(patterns, function(pattern) {
    const d = detect(pattern[0], pattern[1], ua);
    if (d) {
      detected = d;
      return false;
    }
  });
  factory.call(detector, detected.name, detected.version);
}


class Detector {
  constructor (rules) {
    this._rules = rules;
  }

  // 解析 UserAgent 字符串
  // @param {String} ua, userAgent string.
  // @return {Object}
  parse (ua) {
    ua = (ua || "").toLowerCase();
    const d = {};

    init(ua, this._rules.device, function(name, version) {
      const v = parseFloat(version);
      d.device = {
        name: name,
        version: v,
        fullVersion: version,
      };
      d.device[name] = v;
    }, d);

    init(ua, this._rules.os, function(name, version){
      const v = parseFloat(version);
      d.os = {
        name: name,
        version: v,
        fullVersion: version,
      };
      d.os[name] = v;
    }, d);

    const ieCore = this.IEMode(ua);

    init(ua, this._rules.engine, function(name, version) {
      let mode = version;
      // IE 内核的浏览器，修复版本号及兼容模式。
      if(ieCore){
        version = ieCore.engineVersion || ieCore.engineMode;
        mode = ieCore.engineMode;
      }
      const v = parseFloat(version);
      d.engine = {
        name: name,
        version: v,
        fullVersion: version,
        mode: parseFloat(mode),
        fullMode: mode,
        compatible: ieCore ? ieCore.compatible : false,
      };
      d.engine[name] = v;
    }, d);

    init(ua, this._rules.browser, function(name, version) {
      let mode = version;
      // IE 内核的浏览器，修复浏览器版本及兼容模式。
      if(ieCore){
        // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
        if(name === "ie"){
          version = ieCore.browserVersion;
        }
        mode = ieCore.browserMode;
      }
      const v = parseFloat(version);
      d.browser = {
        name: name,
        version: v,
        fullVersion: version,
        mode: parseFloat(mode),
        fullMode: mode,
        compatible: ieCore ? ieCore.compatible : false,
      };
      d.browser[name] = v;
    }, d);
    return d;
  }

  // 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
  // @param {String} ua, userAgent string.
  // @return {Object}
  IEMode (ua) {
    if(!this._rules.re_msie.test(ua)){ return null; }

    let m;
    let engineMode;
    let engineVersion;
    let browserMode;
    let browserVersion;

    // IE8 及其以上提供有 Trident 信息，
    // 默认的兼容模式，UA 中 Trident 版本不发生变化。
    if(ua.indexOf("trident/") !== -1) {
      m = /\btrident\/([0-9.]+)/.exec(ua);
      if (m && m.length >= 2) {
        // 真实引擎版本。
        engineVersion = m[1];
        const v_version = m[1].split(".");
        v_version[0] = parseInt(v_version[0], 10) + 4;
        browserVersion = v_version.join(".");
      }
    }

    m = this._rules.re_msie.exec(ua);
    browserMode = m[1];
    const v_mode = m[1].split(".");
    if (typeof browserVersion === "undefined") {
      browserVersion = browserMode;
    }
    v_mode[0] = parseInt(v_mode[0], 10) - 4;
    engineMode = v_mode.join(".");
    if (typeof engineVersion === "undefined") {
      engineVersion = engineMode;
    }

    return {
      browserVersion: browserVersion,
      browserMode: browserMode,
      engineVersion: engineVersion,
      engineMode: engineMode,
      compatible: engineVersion !== engineMode,
    };
  }

}

module.exports = Detector;
