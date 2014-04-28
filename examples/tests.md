
# 测试工具

----

## 输入

请将 userAgent 字符串粘贴到下面的输入框中，每行一个 userAgent 字符串。

<textarea id="userAgents" style="width:99%;height:200px"></textarea>
<button type="button" id="btn-analytics">分析</button>

## 结果

<div id="output"></div>

<style>
.error{background-color:#f33; color:#0f0;}
</style>

<script>
seajs.use(['$', 'detector'], function($, detector){
  var ua = navigator.userAgent;
  var ipt = $("#userAgents");
  var btn = $("#btn-analytics");
  var opt = $("#output");

  ipt.val(ua);
  opt.html(ouputs(parses(ua)));

  btn.on("click", function(){
    opt.html(ouputs(parses(ipt.val())));
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
      if(!ua || RE_BLANK.test(ua)){continue;}
      rst[i] = [ua, detector.parse(ua)];
    }

    return rst;
  }

  // format output.
  function ouputs(result){
    var str = '<table><thead><tr><th>userAgent</th>' +
      '<th>Device</th>'+
      '<th>OS</th>'+
      '<th>Browser</th>'+
      '<th>Engine</th>'+
      '</tr></thead><tbody>';

    for(var i=0,ua,rst,l=result.length; i<l; i++){
      ua = result[i][0];
      rst = result[i][1];
      var isNA_device = rst.device.name === 'na';
      var isNA_os = rst.os.name === 'na';
      var isNA_browser = rst.browser.name === 'na';
      var isNA_engine = rst.engine.name === 'na';

      str += '<tr><th>' + ua + '</th>';
      str += '<td' + (isNA_device ? ' class="error"' : '') + '>' + rst.device.name + '<br/>' + rst.device.fullVersion + '</td>';
      str += '<td' + (isNA_os ? ' class="error"' : '') + '>' + rst.os.name + '<br/>' + rst.os.fullVersion + '</td>';
      str += '<td' + (isNA_browser ? ' class="error"' : '') + '>' + rst.browser.name + '<br/>' + rst.browser.fullVersion + '</td>';
      str += '<td' + (isNA_engine ? ' class="error"' : '') + '>' + rst.engine.name + '<br/>' + rst.engine.fullVersion + '</td>';
      str += '</tr>';
    }

    return str;
  }

});
</script>
