/**
 * Version Number
 * @author 闲耘 <hotoo.cn@gmail.com>
 *
 * @usage
 *    var version = new Versioning("1.2.3")
 *    version > 1
 *    version.eq(1)
 */

define(function(require, exports, module){

  // Semantic Versioning Delimiter.
  var delimiter = ".";

  var Version = function(version){
    this._version = String(version);
  };

  function compare(v1, v2, complete){
    v1 = String(v1);
    v2 = String(v2);
    if(v1 === v2){return 0;}
    var v1s = v1.split(delimiter);
    var v2s = v2.split(delimiter);
    var len = Math[complete ? "max" : "min"](v1s.length, v2s.length);
    for(var i=0; i<len; i++){
      v1s[i] = "undefined"===typeof v1s[i] ? 0 : parseInt(v1s[i], 10);
      v2s[i] = "undefined"===typeof v2s[i] ? 0 : parseInt(v2s[i], 10);
      if(v1s[i] > v2s[i]){return 1;}
      if(v1s[i] < v2s[i]){return -1;}
    }
    return 0;
  }

  Version.compare = function(v1, v2){
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
  Version.eq = function(v1, v2){
    return compare(v1, v2, false) === 0;
  };

  /**
   * @param {String} v1.
   * @param {String} v2.
   * @return {Boolean} return true
   */
  Version.gt = function(v1, v2){
    return compare(v1, v2, true) > 0;
  };

  Version.gte = function(v1, v2){
    return compare(v1, v2, true) >= 0;
  };

  Version.lt = function(v1, v2){
    return compare(v1, v2, true) < 0;
  };

  Version.lte = function(v1, v2){
    return compare(v1, v2, true) <= 0;
  };

  Version.prototype = {
    // new Version("6.1").eq(6); // true.
    // new Version("6.1.2").eq("6.1"); // true.
    eq: function(version){
      return Version.eq(this._version, version);
    },

    gt: function(version){
      return Version.gt(this._version, version);
    },

    gte: function(version){
      return Version.gte(this._version, version);
    },

    lt: function(version){
      return Version.lt(this._version, version);
    },

    lte: function(version){
      return Version.lte(this._version, version);
    },

    valueOf: function(){
      return parseFloat(
        this._version.split(delimiter).slice(0,2).join(delimiter),
        10);
    },

    // XXX: ""+ver 调用的转型方法是 valueOf，而不是 toString，这个有点悲剧。
    // 只能使用 String(ver) 或 ver.toString() 方法。
    toString: function(){
      return this._version;
    }
  };


  module.exports = Version;
});
