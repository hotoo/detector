// more rule test.

var expect = require("expect.js");
var detector = require("../src/detector");

var UAs = [
  ["Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML%2C like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13", {
    device: "nokia/n9",
    os: "meego/-1",
    browser: "nokia/8.5.0;8.5.0;o",
    engine: "webkit/534.13;534.13;o"
  }]
];

describe("detector", function() {

  var nav, ua, info, detect;
  for(var i=0,l=UAs.length; i<l; i++){
    nav = UAs[i][0];
    type = Object.prototype.toString.call(nav);
    if(type==="[object String]"){
      ua = nav;
      origin_ua = ua;
    }else if(type === "[object Object]"){
      ua = (nav.userAgent||"") + " " + (nav.appVersion||"") + " " + (nav.vendor||"");
      origin_ua = nav.userAgent;
    }else{
      continue;
    }
    info = UAs[i][1];
    detect = detector.parse(ua);
    for(var k in info){
      if(!info.hasOwnProperty(k)){continue;}
      (function(ua, detect, info, k){
        it("ua: " + origin_ua + " » detector "+k+": "+info[k], function() {

          var ext = "";
          if(k === "browser" || k === "engine"){
            ext = ";"+detect[k].fullMode+";"+(detect[k].compatible?"c":"o");
          }

          expect(detect[k].name+"/"+detect[k].fullVersion+ext).to.equal(info[k]);

        });
      })(ua, detect, info, k);
    }
  }
});
