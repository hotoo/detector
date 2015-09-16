module.exports = {
  DEVICES: [
    // [诺亚信](http://www.noain.com.cn/)
    ["noain", /\bnoain ([a-z0-9]+)/],
    // TODO: [华为荣耀](http://www.honor.cn/)
    ["huawei-honor", function(ua){
      if (/\bhonor/.test(ua)) {
        return /\b(honor)[ ]([a-z0-9]+)-([a-z0-9]+)\b/;
      } else if (/\bh\d+-l\d+/.test(ua)) {
        return /\b(h\d+-l\d+)/;
      }
    }],
    // [乐Phone](http://www.lephonemall.com/)
    ["lephone", /\blephone[_\- ]+([a-z0-9]+)/],
    // [华硕](https://www.asus.com.cn/Phones/)
    ["asus", /\basus_([a-z0-9]+)\b/],
    ["alcatel", /\balcatel\b/],
    ["一加", /\ba0001 build/],
    ["蓝米", /\blanmi[_\-]([a-z0-9]+)\b/],
    ["E派", /\bebest[_\- ]([a-z0-9]+)\b/],
    // HIKe
    ["hike", /\bhike[_\- ]([a-z0-9]+)\b/],
    ["qmi", /\bqmi build/],
    ["优米", /\bumi[\-]?([a-z0-9]+)/],
    ["嘉源", /\bcayon ([a-z0-9]+)/],
    ["intki", /\bintki[_\- ]([a-z0-9]+)/],
    ["星语", /\bxy[- ]([a-z0-9]+)/],
    ["欧奇", /\boku([a-z0-9]+)/],
    ["海派", /\bhaipai ([a-z0-9 ]+) build/],
    ["广信",
      function(ua) {
        if (/\bef98 build/.test(ua)) {
          return /\bef98 build/;
        }
        return /\bkingsun[_\- ]([a-z0-9]+)\b/;
      },
    ],

    ["神州", /\bhasee ([a-z0-9 ]+) build\b/],
    ["青橙", /\bgo ([a-z0-9\-]+) build\b/],
    ["海信",
      function(ua) {
        if (/\bhs[ \-]+([a-z0-9]+)/.test(ua)) {
          return /\bhs[ \-]+([a-z0-9]+)/;
        } else if (/ (e601m|t980) build/.test(ua)) {
          return / (e601m|t980) build/;
        }
    }],
    ["金立",
      function(ua) {
        if (/\b(?:gn|gionee)[ \-_]?([a-z0-9]+)[ \/]+/.test(ua)) {
          return /\b(?:gn|gionee)[ \-_]?([a-z0-9]+)[ \/]+/;
        } else if (/; a5 build/.test(ua)) {
          return /; (a5) build/;
        } else if (/; e6 build/.test(ua)) {
          return /; (e6) build/;
        }
      },
    ],

    ["eton", /\beton ([a-z0-9]+)/],
    ["bohp", /\bbohp[_\- ]([a-z0-9]+)/],
    ["小杨树", /; (mm110\d) build/],
    ["语信",
      function(ua) {
        if (/\byusun ([a-z0-9]+)/.test(ua)) {
          return /\byusun ([a-z0-9]+)/;
        } else if (/\bla\d-([a-z0-9]+) build/.test(ua)) {
          return /\b(la\d-([a-z0-9]+)) build/;
        } else if (/\bt21 build/.test(ua)) {
          return /\b(t21) build/;
        }
      },
    ],
    ["nubia", /\b(z7|nx\d{3}[a|j]) build/],
    ["爱讯达", /\bik build/],
    ["寰宇通", /\bxy\-a3/],
    ["mofut", /\bmofut ([a-z0-9]+) build/],
    // InFocus
    ["infocus", /\binfocus ([a-z0-9]+) build/],
    ["大唐",
      function(ua) {
        if (/\b(i318)_t3 build/.test(ua)) {
          return /\b(i318)_t3 build/;
        } else if (/\bdatang ([a-z0-9]+)/.test(ua)) {
          return /\bdatang ([a-z0-9]+)/;
        }
      },
    ],
    ["邦华", /\bboway ([a-z0-9]+)/],
    ["天迈", /\bt\-smart ([a-z0-9]+)/],
    ["大显", /\bht7100/],
    ["博瑞", /\bbror ([a-z0-9]+)/],
    ["lingwin",
      function(ua) {
        if (/\blingwin ([a-z0-9]+)/.test(ua)) {
          return /\blingwin ([a-z0-9]+)/;
        }
        return /lingwin /;
      },
    ],
    ["iusai", /\biusai ([a-z0-9]+)/],
    ["波导",
      function(ua) {
        if (/\bbird ([a-z0-9]+)/.test(ua)) {
          return /\bbird ([a-z0-9]+)/;
        } else if (/\bdoeasy ([a-z0-9]+) build/.test(ua)) {
          return /\bdoeasy ([a-z0-9]+) build/;
        }
      },
    ],
    ["德赛", /\bdesay ([a-z0-9]+)/],
    ["蓝魔", /\bramos([a-z0-9]+)/],
    ["美图", /\bmeitu(\d+) build/],
    ["opsson", /\bopsson ([a-z0-9]+)/],
    ["benwee", /\bbenwee ([a-z0-9]+)/],
    ["hosin", /\bhosin ([a-z0-9]+)/],
    ["smartisan", /\bsmartisan\b/],
    ["ephone", /ephone ([a-z0-9]+)/],
    ["佰事讯", /\b(wx9) build/],
    ["newman", /; newman ([a-z0-9]+) build/],
    // 康佳
    ["konka",
      function(ua) {
        if (/ (l823) build/.test(ua)) {
          return / (l823) build/;
        } else if (/\bkonka[_\-]([a-z0-9]+)/.test(ua)) {
          return /\bkonka[_\-]([a-z0-9]+)/;
        }
      },
    ],
    ["haier",
      function(ua) {
        if (/\b(?:haier|ht)[_-]([a-z0-9\-]+)\b/.test(ua)) {
          return /\b(?:haier|ht)[_-]([a-z0-9\-]+)\b/;
        }
      },
    ],
    ["moto",
      function(ua) {
        if (/\bmot[\-]([a-z0-9]+)/.test(ua)) {
          return /\bmot[\-]([a-z0-9]+)/;
        } else if (/ (xt\d{3}) build/.test(ua)) {
          return / (xt\d{3}) build/;
        }
      },
    ],
    // TCL
    ["tcl",
      function(ua) {
        if (/\btcl[ \-]([a-z0-9]+)/.test(ua)) {
          return /\btcl[ \-]([a-z0-9]+)/;
        } else if (/\btcl([a-z0-9]+)/.test(ua)) {
          return /\btcl([a-z0-9]+)/;
        }
      },
    ],
    ["天语",
      function(ua) {
        if (ua.indexOf("k-touch ") !== -1) {
          return /\bk\-touch ([a-z0-9 +]+)(?:build|\))/;
        } else if (ua.indexOf("k-touch_") !== -1) {
          return /\bk-touch_(a-z0-9)+/;
        } else if (/k[ \-]touch/.test(ua)) {
          return /k[ \-]touch ([a-z0-9]+)\b/;
        }
      },
    ],
    // sony.
    //["sonyericsson",
      //function(ua) {
        //if (/\b([l|s]t\d{2}[i]{1,2}|[s|l]\d{2}h|m\d{2}c) build/.test(ua)) {
          //return /\b([l|s]t\d{2}[i]{1,2}|[s|l]\d{2}h|m\d{2}c)/;
        //} else if (/\bmt([a-z0-9]+)/.test(ua)) {
          //return /\bmt([a-z0-9]+)/;
        //} else if (/ l\d{2}t build/.test(ua)) {
          //return / (l\d{2}t) build/;
        //} else if (/ c6\d{3} /.test(ua)) {
          //return / (c6\d{3}) /;
        //} else if (/\bx10([a-z0-9]+) build/.test(ua)) {
          //return /\b(x10([a-z0-9]+)) build/;
        //}
        //return /\bxm\d{2}t/;
      //},
    //],
    ["doov", /\bdoov[ _]([a-z0-9]+)/],
    ["天时达",
      function(ua) {
        if (/\bts(\d+)/.test(ua)) {
          return /\bts(\d+)/;
        } else if (/\b(t5688) /.test(ua)) {
          return /\b(t5688) /;
        }
      },
    ],
  ],
  OS: [
    ["smartisanos", /\bsmartisan os \- ([\d.]+)/],
    ["meego", /\bmeego\b/],
  ],
  BROWSER: [
    ["baiduboxapp",
      function(ua) {
        var back = 0;
        var a;
        if (/ baiduboxapp\//i.test(ua)) {
          if ((a = /([\d+.]+)_(?:diordna|enohpi)_/.exec(ua))) {
            a = a[1].split(".");
            back = a.reverse().join(".");
          } else if ((a = /baiduboxapp\/([\d+.]+)/.exec(ua))) {
            back = a[1];
          }

          return {
            version: back,
          };
        }
        return false;
      },
    ],
    ["googlebot", /\bgooglebot\/([0-9.]+)/],
    // 百度搜索引擎爬虫：无线、网页搜索
    // http://help.baidu.com/question?prod_en=master&class=498&id=1000550
    ["baiduspider", /\bbaiduspider\b(?:\/([0-9.]+))?/],
    // 百度搜索引擎爬虫：图片搜索
    ["baiduspider-image", /\bbaiduspider\-image\b(?:\/([0-9.]+))?/],
    // 百度搜索引擎爬虫：视频搜索
    ["baiduspider-video", /\bbaiduspider\-video\b(?:\/([0-9.]+))?/],
    // 百度搜索引擎爬虫：新闻搜索
    ["baiduspider-news", /\bbaiduspider\-news\b(?:\/([0-9.]+))?/],
    // 百度搜索引擎爬虫：百度收藏
    ["baiduspider-favo", /\bbaiduspider\-favo\b(?:\/([0-9.]+))?/],
    // 百度搜索引擎爬虫：百度联盟
    ["baiduspider-cpro", /\bbaiduspider\-cpro\b(?:\/([0-9.]+))?/],
    // 百度搜索引擎爬虫：商务搜索
    ["baiduspider-ads", /\bbaiduspider\-ads\b(?:\/([0-9.]+))?/],
    ["bingbot", /\bbingbot\/([0-9.]+)/],
    ["msnbot", /\bmsnbot-media ?\/([0-9.a-z]+)/],
    ["nuhkbot", /\bnuhk\/([0-9.]+)/],
    //["yammybot", /\byammybot\b/],
    //["openbot", /\bopenbot\b/],
    //["slurpbot", /\bslurp\b/],

    // Alexa ia_archiver.
    ["alexabot", /\bia_archiver\b|\balexabot\/([0-9.]+)/],
    ["curl", /\bcurl\/([0-9.]+)/],
  ],
  ENGINE: [],
};
