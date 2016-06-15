"use strict";

const Detector = require("./detector");
const WebRules = require("./web-rules");

const userAgent = navigator.userAgent || "";
//const platform = navigator.platform || "";
const appVersion = navigator.appVersion || "";
const vendor = navigator.vendor || "";
const ua = userAgent + " " + appVersion + " " + vendor;

const detector = new Detector(WebRules);

// 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
// @param {String} ua, userAgent string.
// @return {Object}
function IEMode(ua){
  if(!WebRules.re_msie.test(ua)){ return null; }

  let m;
  let engineMode;
  let engineVersion;
  let browserMode;
  let browserVersion;

  // IE8 及其以上提供有 Trident 信息，
  // 默认的兼容模式，UA 中 Trident 版本不发生变化。
  if(ua.indexOf("trident/") !== -1){
    m = /\btrident\/([0-9.]+)/.exec(ua);
    if (m && m.length >= 2) {
      // 真实引擎版本。
      engineVersion = m[1];
      const v_version = m[1].split(".");
      v_version[0] = parseInt(v_version[0], 10) + 4;
      browserVersion = v_version.join(".");
    }
  }

  m = WebRules.re_msie.exec(ua);
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

function WebParse (ua) {
  const d = detector.parse(ua);

  const ieCore = IEMode(ua);

  // IE 内核的浏览器，修复版本号及兼容模式。
  if(ieCore) {
    const engineName = d.engine.name;
    const engineVersion = ieCore.engineVersion || ieCore.engineMode;
    const ve = parseFloat(engineVersion);
    const engineMode = ieCore.engineMode;

    d.engine = {
      name: engineName,
      version: ve,
      fullVersion: engineVersion,
      mode: parseFloat(engineMode),
      fullMode: engineMode,
      compatible: ieCore ? ieCore.compatible : false,
    };
    d.engine[d.engine.name] = ve;

    const browserName = d.browser.name;
    // IE 内核的浏览器，修复浏览器版本及兼容模式。
    // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
    let browserVersion = d.browser.fullVersion;
    if(browserName === "ie"){
      browserVersion = ieCore.browserVersion;
    }
    const browserMode = ieCore.browserMode;
    const vb = parseFloat(browserVersion);
    d.browser = {
      name: browserName,
      version: vb,
      fullVersion: browserVersion,
      mode: parseFloat(browserMode),
      fullMode: browserMode,
      compatible: ieCore ? ieCore.compatible : false,
    };
    d.browser[browserName] = vb;
  }
  return d;
}

const Tan = WebParse(ua);
Tan.parse = WebParse;
module.exports = Tan;
