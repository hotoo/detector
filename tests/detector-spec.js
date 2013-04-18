define(function(require) {

  var detector = require('../src/detector');

  var UAs = [
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17", {
      device: "mac/-1",
      os: "macosx/10.7.5",
      browser: "chrome/24.0.1312.56",
      engine: "webkit/537.17"
    }],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.99 Safari/537.22", {
      device: "mac/-1",
      os: "macosx/10.8.3",
      browser: "chrome/25.0.1364.99",
      engine: "webkit/537.22"
    }],
    ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "chrome/26.0.1410.43",
      engine: "webkit/537.31"
    }],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) CriOS/26.0.1410.50 Mobile/10B329 Safari/8536.25 (C0106E13-AA1D-4473-A60E-814F80A82BD7)", {
      device: "iphone/-1",
      os: "ios/6.1.3",
      browser: "chrome/26.0.1410.50",
      engine: "webkit/536.26"
    }],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25", {
      device: "iphone/-1",
      os: "ios/6.1.3",
      browser: "safari/6.0",
      engine: "webkit/536.26"
    }],
    ["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
      device: "pc/-1",
      os: "windows/6.1",
      browser: "ie/8.0",
      engine: "trident/4.0"
    }],
    //GreenBrowser.
    ["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.0",
      browser: "green/-1",
      engine: "trident/2.0"
    }],
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "green/-1",
      engine: "trident/3.0"
    }],
    ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; GreenBrowser)", {
      device: "pc/-1",
      os: "windows/5.1",
      browser: "green/-1",
      engine: "trident/3.0"
    }]
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

              expect(detect[k].name+"/"+String(detect[k].version)).to.equal(info[k]);

            });
          })(ua, detect, info, k);
        }
    }
  });

});
