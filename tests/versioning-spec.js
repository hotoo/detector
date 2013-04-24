define(function(require) {

  var expect = require("expect");
  var versioning = require('versioning');

  describe('versioning', function() {

    // 静态方法。
    it("versioning.compare(v1, v2)", function(){
      expect(versioning.compare("6.0", "6")).to.equal(0);
      expect(versioning.compare("6.1", "6")).to.equal(1);
      expect(versioning.compare("6.1", "6.2")).to.equal(-1);
    });

    it("versioning.eq(v1, v2)", function() {
      expect(versioning.eq("6.0", 6)).to.equal(true);
      expect(versioning.eq("6.0", "6")).to.equal(true);
    });

    it("versioning.gt(v1, v2)", function(){
      expect(versioning.gt("6.1", "6")).to.equal(true);
    });

    it("versioning.gte(v1, v2)", function(){
      expect(versioning.gte("6.1", "6")).to.equal(true);
      expect(versioning.gte("6.1", "6.1")).to.equal(true);
    });

    it("versioning.lt(v1, v2)", function(){
      expect(versioning.lt("6", "6.1")).to.equal(true);
      expect(versioning.lt("6.1", "6.2")).to.equal(true);
      expect(versioning.lt("6.1", "6.02")).to.equal(true);
    });

    it("versioning.lte(v1, v2)", function(){
      expect(versioning.lte("6", "6")).to.equal(true);
      expect(versioning.lte("6", "6.0")).to.equal(true);
      expect(versioning.lte("6", "6.1")).to.equal(true);
      expect(versioning.lte("6.1", "6.2")).to.equal(true);
      expect(versioning.lte("6.1", "6.02")).to.equal(true);
    });

    // 实例化对象。
    var v = "6.0";
    var ver = new versioning(v);

    it('new versioning("'+v+'").eq(v)', function(){
      expect(ver.eq(6)).to.equal(true);
      expect(ver.eq(6.0)).to.equal(true);
      expect(ver.eq("6")).to.equal(true);
      expect(ver.eq("6.0")).to.equal(true);
      expect(ver.eq("7")).to.equal(false);
      expect(ver.eq("6.1")).to.equal(false);
      expect(ver.eq("6.0.0")).to.equal(true);
      expect(ver.eq("6.0.1")).to.equal(true);
    });

    it('new versioning("'+v+'").gt(v)', function(){
      expect(ver.gt(5)).to.equal(true);
      expect(ver.gt("5")).to.equal(true);
      expect(ver.gt("5.0")).to.equal(true);
      expect(ver.gt("5.9")).to.equal(true);
      expect(ver.gt(6)).to.equal(false);
      expect(ver.gt(6.0)).to.equal(false);
      expect(ver.gt(6.1)).to.equal(false);
      expect(ver.gt("6")).to.equal(false);
      expect(ver.gt("6.0")).to.equal(false);
      expect(ver.gt("6.0.0")).to.equal(false);
      expect(ver.gt("6.0.1")).to.equal(false);
      expect(ver.gt("6.1")).to.equal(false);
      expect(ver.gt("7")).to.equal(false);
    });

    it('new versioning("'+v+'").gte(v)', function(){
      expect(ver.gte(5)).to.equal(true);
      expect(ver.gte("5")).to.equal(true);
      expect(ver.gte("5.0")).to.equal(true);
      expect(ver.gte("5.9")).to.equal(true);
      expect(ver.gte("5.9.9")).to.equal(true);
      expect(ver.gte(6)).to.equal(true);
      expect(ver.gte(6.0)).to.equal(true);
      expect(ver.gte(6.1)).to.equal(false);
      expect(ver.gte("6")).to.equal(true);
      expect(ver.gte("6.0")).to.equal(true);
      expect(ver.gte("6.0.0")).to.equal(true);
      expect(ver.gte("6.0.1")).to.equal(false);
      expect(ver.gte("6.1")).to.equal(false);
      expect(ver.gte("7")).to.equal(false);
    });

    it('new versioning("'+v+'").lt(v)', function(){
      expect(ver.lt(5)).to.equal(false);
      expect(ver.lt("5")).to.equal(false);
      expect(ver.lt("5.0")).to.equal(false);
      expect(ver.lt("5.9")).to.equal(false);
      expect(ver.lt(6)).to.equal(false);
      expect(ver.lt(6.0)).to.equal(false);
      expect(ver.lt(6.1)).to.equal(true);
      expect(ver.lt("6")).to.equal(false);
      expect(ver.lt("6.0")).to.equal(false);
      expect(ver.lt("6.0.0")).to.equal(false);
      expect(ver.lt("6.0.1")).to.equal(true);
      expect(ver.lt("6.1")).to.equal(true);
      expect(ver.lt("7")).to.equal(true);
    });

    it('new versioning("'+v+'").lte(v)', function(){
      expect(ver.lte(5)).to.equal(false);
      expect(ver.lte("5")).to.equal(false);
      expect(ver.lte("5.0")).to.equal(false);
      expect(ver.lte("5.9")).to.equal(false);
      expect(ver.lte("5.9.9")).to.equal(false);
      expect(ver.lte(6)).to.equal(true);
      expect(ver.lte(6.0)).to.equal(true);
      expect(ver.lte(6.1)).to.equal(true);
      expect(ver.lte("6")).to.equal(true);
      expect(ver.lte("6.0")).to.equal(true);
      expect(ver.lte("6.0.0")).to.equal(true);
      expect(ver.lte("6.0.1")).to.equal(true);
      expect(ver.lte("6.1")).to.equal(true);
      expect(ver.lte("7")).to.equal(true);
    });

    it('new versioning("'+v+'").valueOf()', function(){
      var v = 0+ver;
      expect(typeof v).to.equal("number");
      expect(v).to.equal(6);

      expect(typeof ver.valueOf()).to.equal("number");
      expect(ver.valueOf()).to.equal(6);

      expect(typeof Number(ver)).to.equal("number");
      expect(Number(ver)).to.equal(6);
    });

    it('new versioning("'+v+'").toString()', function(){
      // XXX: ""+ver 调用的转型方法是 valueOf，而不是 toString，这个有点悲剧。
      //var v = ""+ver;
      //expect(typeof v).to.equal("string");
      //expect(v).to.equal("6.0"); // "6"

      expect(typeof ver.toString()).to.equal("string");
      expect(ver.toString()).to.equal("6.0");

      expect(typeof String(ver)).to.equal("string");
      expect(String(ver)).to.equal("6.0");
    });

    it('new versioning("'+v+'") == v', function(){
      expect(ver == 6).to.equal(true); // 不要使用全等符(===)
      expect(ver.valueOf() === 6).to.equal(true); // 显式类型转换可以使用全等符(===)
      expect(Number(ver) === 6).to.equal(true); // 显式类型转换可以使用全等符(===)
    });
  });

});
