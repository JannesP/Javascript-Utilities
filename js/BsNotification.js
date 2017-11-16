/**
 * MIT License
 * 
 * Copyright (c) 2017 Jannes Peters (https://github.com/JannesP/)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
if (jannesp == undefined) var jannesp = {};
/**
 * This class requires jQuery(defined as '$') and bootstrap 4 along with the bootstrap.js. 
 */
jannesp.BsNotification = new function() {
	/**
	 * from: https://stackoverflow.com/a/5077091
	 */
	if (!String.prototype.format) {
		String.prototype.format = function () {
			var args = arguments;
			return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
				if (m == "{{") { return "{"; }
				if (m == "}}") { return "}"; }
				return args[n];
			});
		};
	}
	
	const self = this;
	const activeNotis = {};
	self.settings = {
		uptime: 5000,
		margin: "1em"
	};
	
	const notiRoot = $("<div></div>")
		.css("width", "100%")
		.css("height", "100%")
		.css("position", "fixed")
		.css("z-index", Number.MAX_SAFE_INTEGER.toString() - 1)
		.css("top", "0")
		.css("left", "0");
	
	self.Type = {
		SUCCESS: "success",
		INFO: "info",
		WARNING: "warning",
		DANGER: "danger"
	};
	
	let rootElement = $("<div></div>")
		.attr("id", "jannes");
	
	const arrange = function() {
		let currHeight = 0;
		for (var key in activeNotis) {
			let noti = activeNotis[key];
			noti.css("top", currHeight + "px");
			currHeight += $(noti).outerHeight(true);
		}
	}
	
	self.show = function(heading, text, type, time) {
		if (time == undefined) time = self.settings.uptime;
		
		let createNotification = function(heading, text, type) {
			let className = "alert-" + type;
			let element = $("<div class='alert' role='alert'></div>");
			element.addClass(className);
			element.append(
				$("<button type='button' class='close' data-dismiss='alert' aria-label='Close'>")
					.append($("<span aria-hidden='true'>&times;</span>"))
			);
			if (heading != null && heading != "") {
				element.append($("<strong></strong>").text(heading + " "));
			}
			if (text != null && text != "") {
				element.append($("<span></span>").text(text));
			}
			element.css("width", "calc(100% - " + self.settings.margin + " - " + self.settings.margin + ")")
				.css("position", "fixed")
				.css("z-index", Number.MAX_SAFE_INTEGER.toString() - 1)
				.css("left", "0")
				.css("margin", "{0} {0} 0 {0}".format(self.settings.margin))
				.css("margin-botton", "0");
			element.alert('close');
			return element;
		}
		let noti = createNotification(heading, text, type);
		$("body").append(noti);
		let timerId = setTimeout(function() {
			if (noti) {
				noti.alert('close');
			}
		}, time);
		noti.on('close.bs.alert', function() {
			clearTimeout(timerId);
			delete activeNotis[timerId];
			arrange();
		});
		activeNotis[timerId] = noti;
		arrange();
		return timerId;
	}
	
	self.close = function(notiId) {
		if (activeNotis[notiId]) {
			activeNoti[notiId].alert('close');
		}
	}
	
	self.closeAll = function() {
		for (var key in activeNotis) {
			let noti = activeNotis[key];
			noti.alert('close');
		}
	}
}();
Object.freeze(jannesp.BsNotificationUtil);
