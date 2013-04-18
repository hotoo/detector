# 演示文档

---

<pre id="web-console"></pre>
<script type="text/javascript">
function log(){
    //document.getElementById("web-console").innerHTML += Array.prototype.join.call(arguments, " ") + "\n";
}
</script>

````javascript
seajs.use('detector', function(detector){
      alert("兼容模式:"+detector.browser.compatible)
});
````
