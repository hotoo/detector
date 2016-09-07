"use strict";

var Detector = require("./detector");
var WebRules = require("./web-rules");

var userAgent = navigator.userAgent || "";
//const platform = navigator.platform || "";
var appVersion = navigator.appVersion || "";
var vendor = navigator.vendor || "";
var ua = userAgent + " " + appVersion + " " + vendor;

var detector = new Detector(WebRules);

// 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
// @param {String} ua, userAgent string.
// @return {Object}
function IEMode(ua) {
  if (!WebRules.re_msie.test(ua)) {
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

  m = WebRules.re_msie.exec(ua);
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

function WebParse(ua) {
  var d = detector.parse(ua);

  var ieCore = IEMode(ua);

  // IE 内核的浏览器，修复版本号及兼容模式。
  if (ieCore) {
    var engineName = d.engine.name;
    var engineVersion = ieCore.engineVersion || ieCore.engineMode;
    var ve = parseFloat(engineVersion);
    var engineMode = ieCore.engineMode;

    d.engine = {
      name: engineName,
      version: ve,
      fullVersion: engineVersion,
      mode: parseFloat(engineMode),
      fullMode: engineMode,
      compatible: ieCore ? ieCore.compatible : false
    };
    d.engine[d.engine.name] = ve;

    var browserName = d.browser.name;
    // IE 内核的浏览器，修复浏览器版本及兼容模式。
    // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
    var browserVersion = d.browser.fullVersion;
    if (browserName === "ie") {
      browserVersion = ieCore.browserVersion;
    }
    var browserMode = ieCore.browserMode;
    var vb = parseFloat(browserVersion);
    d.browser = {
      name: browserName,
      version: vb,
      fullVersion: browserVersion,
      mode: parseFloat(browserMode),
      fullMode: browserMode,
      compatible: ieCore ? ieCore.compatible : false
    };
    d.browser[browserName] = vb;
  }
  return d;
}

var Tan = WebParse(ua);
Tan.parse = WebParse;
module.exports = Tan;