define(function(require) {

  var expect = require("expect");
  var detector = require('detector');

  var UAs = [
    // Windows 7, IE9
    ["Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/9.0;9.0;o",
      //      name/version;mode;compatible
      //                        c: compatible; o: origin, not compatible.
      engine: "trident/5.0;5.0;o"
    }],
    // Windows 7, IE9(兼 容模式)
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/9.0;7.0;c",
      engine: "trident/5.0;3.0;c"
    }],
    // Windows 7, IE8
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // Windows 7, IE8(兼容模式)
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0;7.0;c",
      engine: "trident/4.0;3.0;c"
    }],
    // Windows XP, IE8
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "ie/8.0;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    // Windows XP, IE8(兼容模式)
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "ie/8.0;7.0;c",
      engine: "trident/4.0;3.0;c"
    }],
    // Windows XP, IE7
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "ie/7.0;7.0;o",
      engine: "trident/3.0;3.0;o"
    }],
    // Windows XP, IE6
    ["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "ie/6.0;6.0;o",
      engine: "trident/2.0;2.0;o"
    }],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17", {
      device: "mac/-1",
      os: "macosx/10.7.5",
      browser: "chrome/24.0.1312.56;24.0.1312.56;o",
      engine: "webkit/537.17;537.17;o"
    }],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.99 Safari/537.22", {
      device: "mac/-1",
      os: "macosx/10.8.3",
      browser: "chrome/25.0.1364.99;25.0.1364.99;o",
      engine: "webkit/537.22;537.22;o"
    }],
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "chrome/26.0.1410.43;26.0.1410.43;o",
      engine: "webkit/537.31;537.31;o"
    }],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) CriOS/26.0.1410.50 Mobile/10B329 Safari/8536.25 (C0106E13-AA1D-4473-A60E-814F80A82BD7)", {
      device: "iphone/-1",
      os: "ios/6.1.3",
      browser: "chrome/26.0.1410.50;26.0.1410.50;o",
      engine: "webkit/536.26;536.26;o"
    }],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25", {
      device: "iphone/-1",
      os: "ios/6.1.3",
      browser: "safari/6.0;6.0;o",
      engine: "webkit/536.26;536.26;o"
    }],
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0;8.0;o",
      engine: "trident/4.0;4.0;o"
    }],
    //GreenBrowser.
    ["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.0",
      browser: "green/-1;6.0;o",
      engine: "trident/2.0;2.0;o"
    }],
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "green/-1;7.0;o",
      engine: "trident/3.0;3.0;o"
    }],
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "green/-1;7.0;o",
      engine: "trident/3.0;3.0;o"
    }],
    ["Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG SGH-i917)", {
      device: "wp/-1",
      os: "wp/7.5",
      browser: "ie/9.0;9.0;o",
      engine: "trident/5.0;5.0;o"
    }],
  ];

  describe('detector', function() {

    var ua, info, detect;
    for(var i=0,l=UAs.length; i<l; i++){
        ua = UAs[i][0];
        info = UAs[i][1];
        detect = detector.detect(ua);
        for(var k in info){
          if(!info.hasOwnProperty(k)){continue;}
          (function(ua, detect, info, k){
            it('detector '+k+": "+info[k], function() {

              var ext = "";
              if(k === "browser" || k === "engine"){
                ext = ";"+String(detect[k].mode)+";"+(detect[k].compatible?"c":"o");
              }

              expect(detect[k].name+"/"+String(detect[k].version)+ext).to.equal(info[k]);

            });
          })(ua, detect, info, k);
        }
    }
  });

});
