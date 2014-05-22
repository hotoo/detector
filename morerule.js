module.exports = {
  DEVICES: [],
  OS: [
    ["meego", /\bmeego\b/]
  ],
  BROWSER: [
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
    ["curl", /\bcurl\/([0-9.]+)/]
  ],
  ENGINE: []
};
