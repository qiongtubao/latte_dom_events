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