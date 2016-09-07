"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NA_VERSION = "-1";
var NA = {
  name: "na",
  version: NA_VERSION
};

function typeOf(type) {
  return function (object) {
    return Object.prototype.toString.call(object) === "[object " + type + "]";
  };
}
var isString = typeOf("String");
var isRegExp = typeOf("RegExp");
var isObject = typeOf("Object");
var isFunction = typeOf("Function");

function each(object, factory) {
  for (var i = 0, l = object.length; i < l; i++) {
    if (factory.call(object, object[i], i) === false) {
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
  var expr = isFunction(expression) ? expression.call(null, ua) : expression;
  if (!expr) {
    return null;
  }
  var info = {
    name: name,
    version: NA_VERSION,
    codename: ""
  };
  if (expr === true) {
    return info;
  } else if (isString(expr)) {
    if (ua.indexOf(expr) !== -1) {
      return info;
    }
  } else if (isObject(expr)) {
    if (expr.hasOwnProperty("version")) {
      info.version = expr.version;
    }
    return info;
  } else if (isRegExp(expr)) {
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

// 初始化识别。
function init(ua, patterns, factory, detector) {
  var detected = NA;
  each(patterns, function (pattern) {
    var d = detect(pattern[0], pattern[1], ua);
    if (d) {
      detected = d;
      return false;
    }
  });
  factory.call(detector, detected.name, detected.version);
}

var Detector = function () {
  function Detector(rules) {
    _classCallCheck(this, Detector);

    this._rules = rules;
  }

  // 解析 UserAgent 字符串
  // @param {String} ua, userAgent string.
  // @return {Object}


  _createClass(Detector, [{
    key: "parse",
    value: function parse(ua) {
      ua = (ua || "").toLowerCase();
      var d = {};

      init(ua, this._rules.device, function (name, version) {
        var v = parseFloat(version);
        d.device = {
          name: name,
          version: v,
          fullVersion: version
        };
        d.device[name] = v;
      }, d);

      init(ua, this._rules.os, function (name, version) {
        var v = parseFloat(version);
        d.os = {
          name: name,
          version: v,
          fullVersion: version
        };
        d.os[name] = v;
      }, d);

      var ieCore = this.IEMode(ua);

      init(ua, this._rules.engine, function (name, version) {
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
        d.engine[name] = v;
      }, d);

      init(ua, this._rules.browser, function (name, version) {
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
        d.browser[name] = v;
      }, d);
      return d;
    }

    // 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
    // @param {String} ua, userAgent string.
    // @return {Object}

  }, {
    key: "IEMode",
    value: function IEMode(ua) {
      if (!this._rules.re_msie.test(ua)) {
        return null;
      }

      var m = void 0;
      var engineMode = void 0;
      var engineVersion = void 0;
      var browserMode = void 0;
      var browserVersion = void 0;

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

      m = this._rules.re_msie.exec(ua);
      browserMode = m[1];
      var v_mode = m[1].split(".");
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
        compatible: engineVersion !== engineMode
      };
    }
  }]);

  return Detector;
}();

module.exports = Detector;