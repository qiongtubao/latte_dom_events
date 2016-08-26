
(function(define) {'use strict'
define("latte_dom/c/commands/drop.js", ["require", "exports", "module", "window"],
function(require, exports, module, window) {
//https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
(function() {
		var V = require("../../v/index.js");
		var createFunc = function(data, funcName) {
			return function(event) {
				var callback = data.get(funcName);
				callback && callback.call(data, V.event);
			};
		}
		
		var removeDefault = function(event) {
			V.event.preventDefault();
		}
	this.after = function(data, dom, controller) {
		var dropName = dom.attr("latte-drop");
		if(dropName) {
			/**
				绑定在目标Dom
				当拖拽到目标Dom时触发
			*/
			controller.bind("view", "dragover", removeDefault);
			controller.bind("view", "dragleave", removeDefault);
			controller.bind("view", "dragenter", removeDefault);
			controller.bind("view", "drop", removeDefault);
			var dropFunc = createFunc(data, dropName);
			controller.bind("view","drop", dropFunc);
		}
		var drag = dom.attr("latte-drag");
		if(drag) {
			/**
				绑定在拖拽
				在dragstart  与dragEnd 之间移动的时候都会触发

			*/
			dom.attr("draggable", true);
			var dragFunc = createFunc(data, drag);
			controller.bind("view", "drag", dragFunc);
		}
		var dragstart = dom.attr("latte-dragstart");
		if(dragstart) {
			/**
				绑定在拖拽目标上
				当开始拖拽的时候触发
			*/
			dom.attr("draggable", true);
			var dragStartFunc = createFunc(data, dragstart);
			controller.bind("view", "dragstart", dragStartFunc);
		}

		var dragend = dom.attr("latte-dragend");
		if(dragend) {
			/**
				绑定在拖拽目标上
				当拖拽结束时候触发
			*/
			dom.attr("draggable", true);
			var dragEndFunc = createFunc(data, dragend);
			controller.bind("view", "dragend", dragEndFunc);
		}

		var dragover = dom.attr("latte-dragover");
		if(dragover) {
			/**
				绑定在目标上
				当拖拽节点在目标容器上方的时候触发
			*/
			var dragoverFunc = createFunc(data, dragover);
			controller.bind("view", "dragover", dragoverFunc);
		}
		var dragleave = dom.attr("latte-dragleave");
		if(dragleave) {
			/**
				绑定在目标上
				当拖拽从目标容器上方离开的时候触发
			*/
			var dragleaveFunc = createFunc(data, dragleave);
			controller.bind("view", "dragleave", dragleaveFunc);
		}


	}
}).call(module.exports);

});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
define("latte_dom/c/commands/events.js", ["require", "exports", "module", "window"],
function(require, exports, module, window) {
			/**
				<button latte-class="{{glass}}"></button>
				data : {
					glass: ""
				}
			*/
				var LatteObject = require("../../m/data")
					, latte_lib = require("latte_lib")
					, V = require("../../v/index.js");
				var Command = {};
				(function() {
						var minMove = 100, maxDeviation = 20;
						var getX = function(e) {
							return e.pageX;
						}
						var getY = function(e) {
							return e.pageY;
						}
						var events = {
							right: function(e) {
								if(getX(e.end) - getX(e.start) > minMove && Math.abs(getY(e.end) - getY(e.start)) < maxDeviation) {
									return true;
								}
								return false;
							},
							left: function(e) {
								if(getX(e.start) -  getX(e.end) > minMove && Math.abs(getY(e.end) - getY(e.start)) < maxDeviation) {
									return true;
								}
								return false;
							},
							up: function(e) {
								if(getY(e.start) - getY(e.end) > minMove && Math.abs(getX(e.end) - getX(e.start)) < maxDeviation) {
									return true;
								}	
								return false;
							},
							down: function(e) {
								if(getY(e.end) - getY(e.start)> minMove && Math.abs(getX(e.end) - getX(e.start)) < maxDeviation) {
									return true;
								}
								return false;
							}
						};
						var hasEvents = function(data, dom,  controller) {
							var name = dom.attr("latte-leftEvent");
							var o = [];
							for(var i in events) {
								(function() {
									var e = dom.attr("latte-"+i+"Event");
									if(e) {
										o.push({
											test: events[i],
											doEvent: function(event) {
												var callback = data.get(e); 
												callback && callback.call(data, event);
											}
										});
									}
								})(i);
							}
							return o.length >0 ? o : null;
						}
					this.after = function(data, dom, controller) {
					
						var events = hasEvents(data, dom, controller);
						var moveEvent = dom.attr("latte-moveEvent");
						if(events || moveEvent) {
							
							var isDown =false;
							var move = {
								start:{

								},
								end:{

								},
								now: {

								}
							};
							
							dom.on("mousedown", function() {
								isDown = true;
								var e = V.event;
								move.now = move.start = e;
								e.time = Date.now();
							}, true);
							dom.on("mousemove", function() {							
								if(isDown) {
									var callback = data.get(moveEvent); 
									callback && callback.call(data, move, V.event);
									move.now = V.event;
									move.now.time  = Date.now()
								}
							});
							dom.on("mouseup", function() {
								if(isDown) {
									isDown = false;
									var e = V.event;
									e.time = Date.now()
									move.end = e;
								}
								events && events.forEach(function(o) {
									if(o.test(move)) {
										o.doEvent(move);
									}
								});
							});
						}

						
					};
					
				}).call(Command);
				
				module.exports = Command;
});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
(function(define) {'use strict'
define("latte_dom/c/commands/keys.js", ["require", "exports", "module", "window"],
function(require, exports, module, window) {
(function() {

	var keycodes = {
	  BACKSPACE: 8,
	  TAB: 9,
	  ENTER: 13,
	  COMMAND: 15,
	  SHIFT: 16,
	  CONTROL: 17,
	  ALTERNATE: 18,
	  PAUSE: 19,
	  CAPS_LOCK: 20,
	  NUMPAD: 21,
	  ESCAPE: 27,
	  SPACE: 32,
	  PAGE_UP: 33,
	  PAGE_DOWN: 34,
	  END: 35,
	  HOME: 36,

	  //arrows
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,

	  INSERT: 45,
	  DELETE: 46,

	  //numbers
	  NUMBER_0: 48,
	  NUMBER_1: 49,
	  NUMBER_2: 50,
	  NUMBER_3: 51,
	  NUMBER_4: 52,
	  NUMBER_5: 53,
	  NUMBER_6: 54,
	  NUMBER_7: 55,
	  NUMBER_8: 56,
	  NUMBER_9: 57,

	  //letters
	  A: 65,
	  B: 66,
	  C: 67,
	  D: 68,
	  E: 69,
	  F: 70,
	  G: 71,
	  H: 72,
	  I: 73,
	  J: 74,
	  K: 75,
	  L: 76,
	  M: 77,
	  N: 78,
	  O: 79,
	  P: 80,
	  Q: 81,
	  R: 82,
	  S: 83,
	  T: 84,
	  U: 85,
	  V: 86,
	  W: 87,
	  X: 88,
	  Y: 89,
	  Z: 90,

	  LEFT_WINDOW_KEY: 91,
	  RIGHT_WINDOW_KEY: 92,
	  SELECT_KEY: 93,

	  //number pad
	  NUMPAD_0: 96,
	  NUMPAD_1: 97,
	  NUMPAD_2: 98,
	  NUMPAD_3: 99,
	  NUMPAD_4: 100,
	  NUMPAD_5: 101,
	  NUMPAD_6: 102,
	  NUMPAD_7: 103,
	  NUMPAD_8: 104,
	  NUMPAD_9: 105,
	  NUMPAD_MULTIPLY: 106,
	  NUMPAD_ADD: 107,
	  NUMPAD_ENTER: 108,
	  NUMPAD_SUBTRACT: 109,
	  NUMPAD_DECIMAL: 110,
	  NUMPAD_DIVIDE: 111,

	  //function keys
	  F1: 112,
	  F2: 113,
	  F3: 114,
	  F4: 115,
	  F5: 116,
	  F6: 117,
	  F7: 118,
	  F8: 119,
	  F9: 120,
	  F10: 121,
	  F11: 122,
	  F12: 123,
	  F13: 124,
	  F14: 125,
	  F15: 126,

	  NUM_LOCK: 144,
	  SCROLL_LOCK: 145,

	  //punctuation
	  SEMICOLON: 186,
	  EQUAL: 187,
	  COMMA: 188,
	  MINUS: 189,
	  PERIOD: 190,
	  SLASH: 191,
	  BACKQUOTE: 192,
	  LEFTBRACKET: 219,
	  BACKSLASH: 220,
	  RIGHTBRACKET: 221,
	  QUOTE: 222
	};
	var fkeycodes = {};
	for(var i in keycodes) {
		fkeycodes[keycodes[i]] = i;
	}
	var  V = require("../../v/index.js");
	
	this.after = function(data, dom, controller) {
		var Controller = require("../controller.js");
		var keyEventsName = dom.attr("latte-keys");
		if(keyEventsName) {
			var addEvents = function(now, old) {
				if(old) {
					Controller.remove(dom, old);
				}

				var keys = [];
				var keyDown = function(event) {

					var keyCode = fkeycodes[V.event.keyCode];
					console.log(V.event.keyCode);
					if(!keyCode) {
						throw new Error("no keyCode "+event.keyCode);
					}
					if(keys.indexOf(keyCode) == -1) {
						keys.push(keyCode);
					}
					var event = now.get(keys.join("+"));
					event && event.call(now);
				};
				var keyUp = function(event) {
					var keyCode = fkeycodes[V.event.keyCode];
					if(!keyCode) {
						throw new Error("no keyCode "+event.keyCode);
					}
					var index = keys.indexOf(keyCode);
					if(index != -1) {
						keys.splice(index, 1);
					}
				};
				controller.bind("view", "keydown", keyDown);
				controller.bind("view", "keyup", keyUp);
				//Controller.create(dom, now);
			};
			addEvents(data.get(keyEventsName));
			controller.bind("data", keyEventsName, addEvents);
		}	
	}
}).call(module.exports);
});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });