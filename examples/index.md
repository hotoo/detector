# 演示文档

---

<pre id="web-console"></pre>
<script type="text/javascript">
function log(){
    document.getElementById("web-console").innerHTML += Array.prototype.join.call(arguments, " ") + "\n";
}
</script>

````javascript
seajs.use('detector', function(detector){
    log("UA:", navigator.userAgent);
    log("platform:", navigator.platform);
    log("vendor:", navigator.vendor);
    log("external:", window.external);
    log(JSON && JSON.stringify(detector));
    log('<hr />');
    log("device:", detector.device.name, detector.device.version);
    log("os:", detector.os.name, detector.os.version);
    log("browser:", detector.browser.name, detector.browser.version);
    log("engine:", detector.engine.name, detector.engine.version);
    log(detector.browser.version >= 25);
    log(detector.engine.version.gt(537.3));
    log(detector.browser.compatible);
});
````
