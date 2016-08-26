var latte_lib = latte.require("latte_lib");
  var latte_dom = latte.require("latte_dom");
  var dragged ;
  var data = latte_lib.object.create({
  	dropA: function(event) {
  		console.log("A",event);
  	},
    dragAstart: function(event) {
      console.log("dragA", event);
      dragged = event.target;
      dragged.style.opacity =.5;
    },
    dragAend: function(event) {
      event.target.style.opacity = "";
    },
  	dropB: function(event) {
  		console.log("B",event);
      console.log(dragged.children);
      //dragged.children.length;
      for(var i = 0, len = dragged.children.length ; i < len; i++) {
        (function(o) {
          dragged.removeChild(o);
          event.target.appendChild(o);
        })(dragged.children[i]);
      }

  	}
  });
  
  var demo = latte_dom.define("demo", data);