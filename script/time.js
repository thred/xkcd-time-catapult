/**
 * Copyright 2013 Manfred Hantschel
 * 
 * This file is part of xkcd Time Catapult.
 * 
 * xkcd Time Catapult is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * xkcd Time Catapult is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with xkcd Time Catapult. If not, see <http://www.gnu.org/licenses/>.
 */

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (window.requestAnimationFrame === undefined) {
		window.requestAnimationFrame = function(callback) {
			var currTime = Date.now(),
				timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	window.cancelAnimationFrame = window.cancelAnimationFrame || function(id) {
		window.clearTimeout(id);
	};
}());

var running = false;
var lastTime = new Date().getTime() / 1000;

function start() {
	running = true;
	lastTime = new Date().getTime() / 1000;
	run();
}

function stop() {
	running = false;
}

function run() {
	if (!running) {
		return;
	}

	requestAnimationFrame(run);

	var time = new Date().getTime() / 1000;
	var duration = time - lastTime;

	lastTime = time;

	var Main = require("Main");
	Main.step.call(Main, time, duration);
}

require(["Main"], function(Main) {
	Main.init();
	Main.reload(true);
});
