
# 测试工具

----

## 输入

请将 userAgent 字符串粘贴到下面的输入框中，每行一个 userAgent 字符串。

<textarea id="userAgents" style="width:99%;height:200px"></textarea>

<button type="button" id="btn-analytics" style="margin:10px 0; width:100%;">分析</button>


----

## 结果

Markdown:

<textarea id="output-md" readonly style="width:99%;height:100px"></textarea>

Preview:

<div id="output-html"></div>

<style>
.error{background-color:#f33; color:#0f0;}
</style>

<script>
seajs.use(['jquery', '../detector'], function($, detector){
  var ua = navigator.userAgent;
  var ipt = $("#userAgents");
  var btn = $("#btn-analytics");
  var opt_html = $("#output-html");
  var opt_md = $("#output-md");

  ipt.val(ua);
  var o = outputs(parses(ua));
  opt_html.html(o.html);
  opt_md.val(o.markdown);

  btn.on("click", function(){
    var o = outputs(parses(ipt.val()));
    opt_html.html(o.html);
    opt_md.val(o.markdown);
  });

  // parse all userAgent strings.
  // @param {String} userAgents, each line is a userAgent string.
  // @return {Array} `[[userAgent, result], ...]`
  function parses(userAgents){
    var uas = userAgents.split(/\r\n|\r|\n/);
    var rst = [];
    var RE_BLANK = /^\s*$/;

    for(var i=0,ua,l=uas.length; i<l; i++){
      ua = uas[i];
      rst[i] = [ua, detector.parse(ua)];
    }

    return rst;
  }

  // format output.
  function outputs(result){
    var html = '<table><thead><tr><th>userAgent</th>' +
      '<th>Device</th>'+
      '<th>OS</th>'+
      '<th>Browser</th>'+
      '<th>Engine</th>'+
      '</tr></thead><tbody>';
    var md = '| userAgent | Device | OS | Browser | Engine |\n'+
             '|-----------|--------|----|---------|--------|\n';

    for(var i=0,ua,rst,l=result.length; i<l; i++){
      ua = result[i][0];
      rst = result[i][1];
      var isNA_device = rst.device.name === 'na';
      var isNA_os = rst.os.name === 'na';
      var isNA_browser = rst.browser.name === 'na';
      var isNA_engine = rst.engine.name === 'na';

      html += '<tr><th>' + ua + '</th>';
      html += '<td' + (isNA_device ? ' class="error"' : '') + '>' + rst.device.name + '<br/>' + rst.device.fullVersion + '</td>';
      html += '<td' + (isNA_os ? ' class="error"' : '') + '>' + rst.os.name + '<br/>' + rst.os.fullVersion + '</td>';
      html += '<td' + (isNA_browser ? ' class="error"' : '') + '>' + rst.browser.name + '<br/>' + rst.browser.fullVersion + '</td>';
      html += '<td' + (isNA_engine ? ' class="error"' : '') + '>' + rst.engine.name + '<br/>' + rst.engine.fullVersion + '</td>';
      html += '</tr>';

      md += '| ' + ua + ' | ' +
        rst.device.name + '/' + rst.device.fullVersion + ' | ' +
        rst.os.name+  '/' + rst.os.fullVersion + ' | ' +
        rst.browser.name + '/' + rst.browser.fullVersion + ' | ' +
        rst.engine.name + '/' + rst.engine.fullVersion + ' | ';

    }

    return {
      html: html,
      markdown: md
    };
  }

});
</script>
