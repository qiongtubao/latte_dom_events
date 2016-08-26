var latte_lib = latte.require("latte_lib");
  var latte_dom = latte.require("latte_dom");
  var dragged ;
  var data = latte_lib.object.create({
  	keys: {
  		C: function() {
  			console.log("C");
  		}
  	}
  });
  
  var demo = latte_dom.define("demo", data);