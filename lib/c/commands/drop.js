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
