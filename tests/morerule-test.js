// more rule test.

var expect = require("expect.js");
var detector = require("../detector");

var UAs = [
  ["Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML%2C like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13", {
    device: "nokia/n9",
    os: "meego/-1",
    browser: "nokia/8.5.0;8.5.0;o",
    engine: "webkit/534.13;534.13;o"
  }],

  // Search Engine Bots.
  ["Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", {
    device: "na/-1",
    os: "na/-1",
    browser: "googlebot/2.1;2.1;o",
    engine: "na/-1;-1;o"
  }],
  ["Googlebot/2.1 (+http://www.googlebot.com/bot.html; MSIE 8.0; Windows NT 6.1; Win64; x64; Trident/4.0; .NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; firefox)", {
    device: "pc/-1",
    os: "windows/6.1",
    browser: "googlebot/2.1;8.0;o", // IE 8.0, Trident 4.0.
    engine: "trident/4.0;4.0;o"
  }],

  ["Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)", {
    device: "na/-1",
    os: "na/-1",
    browser: "baiduspider/2.0;2.0;o",
    engine: "na/-1;-1;o"
  }],

  ["Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)", {
    device: "na/-1",
    os: "na/-1",
    browser: "bingbot/2.0;2.0;o",
    engine: "na/-1;-1;o"
  }],
  ["Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/534+ (KHTML,  like Gecko) MsnBot-Media /1.0b", {
    device: "pc/-1",
    os: "windows/6.2",
    browser: "msnbot/1.0b;1.0b;o",
    engine: "webkit/534+;534+;o"
  }],
  ["msnbot-media/1.1 (+http://search.msn.com/msnbot.htm)", {
    device: "na/-1",
    os: "na/-1",
    browser: "msnbot/1.1;1.1;o",
    engine: "na/-1;-1;o"
  }],
  ["Nuhk/3.0 (linktest; +http://www.neti.ee/bot)", {
    device: "na/-1",
    os: "na/-1",
    browser: "nuhkbot/3.0;3.0;o",
    engine: "na/-1;-1;o"
  }],
  ["Nuhk/2.4 (+http://www.neti.ee/cgi-bin/abi/otsing.html)", {
    device: "na/-1",
    os: "na/-1",
    browser: "nuhkbot/2.4;2.4;o",
    engine: "na/-1;-1;o"
  }],
  ["Nuhk/2.4 ( http://www.neti.ee/cgi-bin/abi/Otsing/Nuhk/)", {
    device: "na/-1",
    os: "na/-1",
    browser: "nuhkbot/2.4;2.4;o",
    engine: "na/-1;-1;o"
  }],

  ["Mozilla/5.0 (compatible; Alexabot/1.0; +http://www.alexa.com/help/certifyscan; certifyscan@alexa.com)", {
    device: "na/-1",
    os: "na/-1",
    browser: "alexabot/1.0;1.0;o",
    engine: "na/-1;-1;o"
  }],
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
