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

var WIDTH = 800;
var HEIGHT = 390;

var MAX_PARTICLES = 2048;
var PARTICLE_RADIUS = 3; // the image is 6x6
var DRAW_MOVEMENT = false;

var G = 667.384;
var N = 98.0665;
var AIR_FRICTION = 0.25;
var ABSORBSION = 0.08;
var BOUNCYNESS = 0.80;
var STICKYNESS = 0.50;
var FRICTION = 1;
var THRESHOLD = 0.50;
var PARTICLE_DIE_MASS = 0.5;

var IMAGES = [{
	src: "asset/a228595caf108b46e53f4fe276ebac8fa1545928b650742b0812298d5dfde441.png"
}, {
	src: "asset/c918850ed18afe2c3f3acbeef9c799aba5b10a8efeb45a2f026565383f0a72bc.png"
}, {
	src: "asset/05457c91f50c216f6071ae194b4d1822770e1792b0c73eb0fba3cbbdeb616ec2.png"
}, {
	src: "asset/dcbe928012a06ae5118d4cd3850a4f1bcc0a7e4e86b2c04751fe79370cbb35bc.png"
}, {
	src: "asset/9996f99ec0e08c63b8f50c9900c73ba37417fdeef2a17888748cc0c078370b82.png"
}, {
	src: "asset/37eba4d7ce0239d5d8b8aac659f464569debe088399ec70f6ac54036a82640a5.png"
}, {
	src: "asset/8beeb30463e7b617e56403c7d7cf8b907e9e9425b230c3d548111efc661e3704.png"
}, {
	src: "asset/f70e2db46c301161eaf42922b0cec40ca1f31c21a9fddbfd6fb9998c897e8eb8.png"
}, {
	src: "asset/0493eb220532c578eb97448040f2814ec73d0ef2ec69de9f63453f14c2cf08fb.png"
}, {
	src: "asset/8c2c62dc515a4feaaaaea1e726ba169144ef890d0c740ac753e9e8e235a1961d.png"
}, {
	src: "asset/37b57969648828672b05f3b5662138f2150c9f4af17230b51ca6455991a1a319.png"
}, {
	src: "asset/0fbc49c2fe5d22f935d437e0049aa969bedc831b8445e064ee2b4da85baa1d70.png"
}, {
	src: "asset/c80a91d3fe5695c4040e63f675d1063f0578e849c0c5969a0414348e78601d5a.png"
}, {
	src: "asset/6d1b782354540b035cc732c214b8b47a442fcd1e6d9565699d24ec2b13b8e652.png"
}, {
	src: "asset/840355510c22bac0a6e52ec0945997b670d8ad1053465d1929d4320ca4150488.png"
}];
//var IMAGE_NAMES = ["test.png"];

var SPEEDS = [{
	src: "asset/button-normal.png",
	multiplier: 1
},{
	src: "asset/button-slow.png",
	multiplier: 1/4
},{
	src: "asset/button-slower.png",
	multiplier: 1/10
},{
	src: "asset/button-slowest.png",
	multiplier: 1/60
}];

var BOULDER_SIZES = [{
	src: "asset/button-boulder-small.png",
	mass: Math.PI * 10
},{
	src: "asset/button-boulder-medium.png",
	mass: Math.PI * 20
},{
	src: "asset/button-boulder-large.png",
	mass: Math.PI * 40
}];

var BOULDER_COUNTS = [{
	src: "asset/button-boulder-one.png",
	count: 1
},{
	src: "asset/button-boulder-few.png",
	count: 3
},{
	src: "asset/button-boulder-many.png",
	count: 8
}];


// Precalculated mirror vectors according to following schema (+ ist the impact location):
//     y
//     ^   
//     |
//     1
// --8-+-2--> x
//     4
//     |
// If bit is set, there is sand!
var MIRROR_NORMALS = [
new Vector(0, - 1).normalize(), // 0
new Vector(0, - 1).normalize(), // 1
new Vector(-1, 0).normalize(), // 2
new Vector(-1, - 1).normalize(), // 3
new Vector(0, 1).normalize(), // 4
new Vector(0, 1).normalize(), // 5
new Vector(-1, 1).normalize(), // 6
new Vector(-1, 0).normalize(), // 7
new Vector(1, 0).normalize(), // 8
new Vector(1, - 1).normalize(), // 9
new Vector(0, 1).normalize(), // 10
new Vector(0, - 1).normalize(), // 11
new Vector(1, 1).normalize(), // 12
new Vector(1, 0).normalize(), // 13
new Vector(0, - 1).normalize(), // 14
new Vector(1, 0).normalize()]; // 15

var canvas;
var overlay;
var canvasContext;
var overlayContext;
var sand;
var catapult;
var lastTime = new Date().getTime() / 1000;
var images = {};
var pendingParticles = [];
var particles = [];
var collapseCheck = [];
var isMouseDown = false;
var dragPos;
var imageLoading = 0;
var imageReady = 0;
var running = false;

var speedMultiplierIndex = 0;
var boulderSizeIndex = 0;
var boulderCountIndex = 1;

function init() {
	// the canvases are positioned absolute, add a div as placeholder	
	var placeholder = document.getElementById("placeholder");
	placeholder.style.width = WIDTH + "px";
	placeholder.style.height = HEIGHT + "px";

	document.addEventListener("mousedown", mouseDown, false);
	document.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("mouseup", mouseUp, false);

	// create the catapult
	catapult = new Catapult();

	// load the images
	initImage("catapult");
	initImage("arm");
	initImage("particle");
	initImage("base");
	
	reload();
}

function reload() {
	stop();
	
	pendingParticles = [];
	particles = [];
	isMouseDown = false;
	dragPos = null;

	var content = document.getElementById("content");

	if (canvas) {
		content.removeChild(canvas);
	}
	
	if (overlay) {
		content.removeChild(overlay);
	}
	
	// create the canvas for the background (the sand)
	canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.position = "absolute";
	canvas.style.zIndex = 256;
	canvasContext = canvas.getContext("2d");

	// create the canvas for the foreground (the flying particles)
	overlay = document.createElement("canvas");
	overlay.id = "overlay";
	overlay.width = WIDTH;
	overlay.height = HEIGHT;
	overlay.style.position = "absolute";
	overlay.style.zIndex = 257;
	overlayContext = overlay.getContext("2d");
	
	// put the canvases on the document and place the mouse listeners
	var placeholder = document.getElementById("placeholder");
	content.insertBefore(overlay, placeholder);
	content.insertBefore(canvas, placeholder);
	
	initImage("xkcd", IMAGES[parseInt(Math.random() * IMAGES.length, 10)].src);
}

function initImage(name, src) {
	src = src || ("asset/" + name + ".png");

	var image = new Image();

	imageLoading += 1;
	image.onload = function(event) {
		imageReady += 1;

		if (imageReady == imageLoading) {
			imagesReady();
		}

	};
	image.src = src;
	images[name] = image;
}

function imagesReady() {
	// we use some titanium white for the background
	canvasContext.fillStyle = "white";
	canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

	// draw the castle
	var x = WIDTH - 550;
	canvasContext.drawImage(images.xkcd, x, 0);
	canvasContext.strokeStyle = "white";
	canvasContext.lineWidth = 3;
	canvasContext.strokeRect(x + 1, 1, 551, 393);

	// find the height for the base
	var y = findBase(x + 3);

	// add the base for the catapult
	x -= images.base.width - 3;
	canvasContext.drawImage(images.base, x, y - 56);

	// place the catapult
	x = 132;
	y = findBase(x);

	catapult.position.set(x, y - 12);

	// init the sand
	sand = new Sand(canvasContext.getImageData(0, 0, WIDTH, HEIGHT).data);
	
	// start the animation loop
	start();
}

function findBase(x) {
	var data = canvasContext.getImageData(x, 0, 1, HEIGHT).data;
	var y = HEIGHT - 1;

	while (data[(y - 1) * 4] < 128) {
		y -= 1;
	}

	return y;
}

function start() {
	running = true;
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

	if (duration > 0.1) {
		duration = 0.1;
	}
	
	duration *= SPEEDS[speedMultiplierIndex].multiplier;

	runCollapseCheck();

	messageTo("pendingParticles", pendingParticles.length);

	activatePendingParticles();

	messageTo("particles", particles.length);

	overlayContext.clearRect(0, 0, WIDTH, HEIGHT);
	catapult.draw(overlayContext);
	updateParticles(duration);
	removeDeadParticles();

	var drag = dragPos;

	if (drag) {
		overlayContext.save();
		overlayContext.strokeStyle = "#884422";
		overlayContext.lineWidth = 3;
		overlayContext.translate(catapult.position.x, catapult.position.y);
		overlayContext.beginPath();
		overlayContext.moveTo(0, 0);
		overlayContext.lineTo(drag.x, drag.y);
		overlayContext.stroke();
		overlayContext.restore();
	}
}

/**
 * Add a particle to the pending particles 
 */
function addParticle(particle) {
	pendingParticles.push(particle);
}

/**
 * Activates pending particles 
 */
function activatePendingParticles() {
	for (var i = 0; i < pendingParticles.length; i += 1) {
		if (particles.length >= MAX_PARTICLES) {
			// maximum particles reached, save the rest for later
			break;
		}

		// create particle
		particles.push(pendingParticles[i]);
	}

	// remove executed particles
	pendingParticles.splice(0, i);
}

/**
 * Update and draw the particles
 */
function updateParticles(duration) {
	for (var i = 0; i < particles.length; i += 1) {
		particles[i].move(duration);
		particles[i].draw(overlayContext);
	}
}

/**
 * Remove dead particles
 */
function removeDeadParticles() {
	var i = 0;
	while (i < particles.length) {
		if (!particles[i].alive) {
			particles.splice(i, 1);
		} else {
			i += 1;
		}
	}
}

function fire() {
	for (var i = 0; i < BOULDER_COUNTS[boulderCountIndex].count; i += 1) {
		var direction = Math.random() * Math.PI * 2;
		var distance = (i > 0) ? Math.random() * BOULDER_SIZES[boulderSizeIndex].mass / Math.PI / PARTICLE_RADIUS : 0;
		var position = catapult.position.clone();
		position.add(Math.cos(direction) * distance, - Math.sin(direction) * distance);
		var particle = new Particle(position, new Vector(-dragPos.x * 3, dragPos.y * 3), BOULDER_SIZES[boulderSizeIndex].mass);

		addParticle(particle);
	}
}

function addCollapseCheck(x, y) {
	x = Math.round(x);
	y = Math.round(y) - 1;

	if ((x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT)) {
		return false;
	}

	if ((sand.get(x, y)) && (!sand.get(x, y + 1))) {
		var value = collapseCheck[x] || y;


		if (y >= value) {
			collapseCheck[x] = y;
		}
	}
}

function runCollapseCheck() {
	var lastCollapseCheck = collapseCheck;

	collapseCheck = [];
	/*
	for (var x = 0; x < WIDTH; x += 1) {
		var y = lastCollapseCheck[x];

		if (!y) {
			continue;
		}

		if (Math.random() > 0.2) {
			sand.get(x - 1, y - 1, 0);
		}
		if (Math.random() > 0.2) {
			sand.get(x + 1, y - 1, 0);
		}

		while (y >= 0) {
			if ((sand.get(x, y)) && (!sand.get(x, y + 1))) {
				var position = new Vector(x, y);
				var particle = new Particle(position, new Vector(), 1);

				addParticle(particle);

				sand.set(position.x, position.y, 0);
				addCollapseCheck(position.x, position.y);
			}

			y -= 1;
		}

	}
	*/
}
/*
function explode(particle, mass) {
	var length = particle.movement.length();
	var movement = new Vector(length * 2 * (Math.random() - 0.5), length * 2 * (Math.random() - 0.5));

	addParticle(new Particle(particle.position.clone(), movement, mass));
}
*/

function changeSpeed() {
	speedMultiplierIndex = (speedMultiplierIndex + 1) % SPEEDS.length;
	document.getElementById("speed-button").src = SPEEDS[speedMultiplierIndex].src;
}

function changeBoulderSize() {
	boulderSizeIndex = (boulderSizeIndex + 1) % BOULDER_SIZES.length;
	document.getElementById("boulder-size-button").src = BOULDER_SIZES[boulderSizeIndex].src;
}

function changeBoulderCount() {
	boulderCountIndex = (boulderCountIndex + 1) % BOULDER_COUNTS.length;
	document.getElementById("boulder-count-button").src = BOULDER_COUNTS[boulderCountIndex].src;
}

function mouseDown(event) {
	var offset = getOffset(canvas);
	var left = event.clientX - offset.left;
	var top = event.clientY - offset.top;
	var v = new Vector(left - catapult.position.x, top - catapult.position.y);

	if (v.length() < 30) {
		isMouseDown = true;
	}
}

function mouseMove(event) {
	if (isMouseDown) {
		event.preventDefault();

		var offset = getOffset(canvas);
		var left = event.clientX - offset.left;
		var top = event.clientY - offset.top;

		dragPos = {
			x: left - catapult.position.x,
			y: top - catapult.position.y
		};
	}
}

function mouseUp(event) {
	if (isMouseDown) {
		fire();
	}

	isMouseDown = false;
	dragPos = null;
}

function getOffset(element) {
	var x = 0;
	var y = 0;
	
	while ((element) && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
		x += element.offsetLeft - element.scrollLeft;
		y += element.offsetTop - element.scrollTop;
		element = element.offsetParent;
	}
	return {
		top: y,
		left: x
	};
}

function message(msg) {
	messageTo("message", msg);
}

function messageTo(name, msg) {
	var elem = document.getElementById(name);

	if (elem) {
		elem.innerHTML = msg;
	}
}

function forEachPixelInCircle(x, y, radius, f) {
	// squaring the circle
	var offsetX = x - Math.round(x);
	var offsetY = y - Math.round(y);
	var innerRadius = radius - 0.5;
	var outerRadius = radius + 0.5;
	var qInnerRadius = innerRadius * innerRadius;
	var qOuterRadius = outerRadius * outerRadius;

	// start painting the center
	forEachPixelInCircleSquare(x, y, 0, 0, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

	for (var r = 1; r < Math.ceil(outerRadius); r += 1) {
		// moving radial out
		forEachPixelInCircleSquare(x, y, 0, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
		forEachPixelInCircleSquare(x, y, - r, 0, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
		forEachPixelInCircleSquare(x, y, r, 0, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
		forEachPixelInCircleSquare(x, y, 0, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

		for (var h = 1; h < r; h += 1) {
			forEachPixelInCircleSquare(x, y, - h, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
			forEachPixelInCircleSquare(x, y, h, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

			forEachPixelInCircleSquare(x, y, - r, - h, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
			forEachPixelInCircleSquare(x, y, - r, h, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

			forEachPixelInCircleSquare(x, y, r, - h, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
			forEachPixelInCircleSquare(x, y, r, h, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

			forEachPixelInCircleSquare(x, y, - h, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
			forEachPixelInCircleSquare(x, y, h, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
		}

		// painting the corners
		forEachPixelInCircleSquare(x, y, - r, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
		forEachPixelInCircleSquare(x, y, r, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
		forEachPixelInCircleSquare(x, y, - r, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
		forEachPixelInCircleSquare(x, y, r, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
	}
}

function forEachPixelInCircleSquare(x, y, ix, iy, offsetX, offsetY, qInnerRadius, qOuterRadius, f) {
	var posX = Math.round(x + ix);
	var posY = Math.round(y + iy);

	if ((posX < 0) || (posY < 0) || (posX >= WIDTH) || (posY >= HEIGHT)) {
		// outside of scope
		return;
	}

	var qDist = (ix + offsetX) * (ix + offsetX) + (iy + offsetY) * (iy + offsetY);

	if (qDist >= qOuterRadius) {
		// outside of circle
		return;
	}

	f(posX, posY, (qDist < qInnerRadius) ? 1 : (qDist - qOuterRadius) / (qInnerRadius - qOuterRadius));
}

function toHex(d, padding) {
	var hex = parseInt(d, 10).toString(16);

	if (padding) {
		while (hex.length < padding) {
			hex = "0" + hex;
		}
	}

	return hex;
}

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