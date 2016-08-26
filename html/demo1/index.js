var latte_lib = latte.require("latte_lib");
  var latte_dom = latte.require("latte_dom");
  var data = latte_lib.object.create({
  	drop: function(event) {
  		console.log(event.dataTransfer.files);
  	}
  });
  
  var demo = latte_dom.define("demo", data);