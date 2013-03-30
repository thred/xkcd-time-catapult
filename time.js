var G = 10000;
var WIDTH = 800;
var HEIGHT = 359;
var INITIAL_PARTICLE_SIZE = 1;
var IMAGE_NAMES = ["time121.png", "time174.png", "time181.png", "time211.png", "time231.png"];

var canvas;
var overlay;
var canvasContext;
var overlayContext;
var canvasData;
var catapult;
var lastTime = new Date().getTime() / 1000;
var images = {};
var pendingParticles = [];
var particles = [];
var isMouseDown = false;
var dragPos;
var ready = true;

var Vector = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};

Vector.prototype = {

	constructor: Vector,

	set: function(x, y) {
		this.x = x;
		this.y = y;

		return this;
	},

	add: function(x, y) {
		this.x += x;
		this.y += y;
	},

	sub: function(x, y) {
		this.x -= x;
		this.y -= y;
	},

	multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;

		return this;
	},

	divideScalar: function(s) {
		if (s !== 0) {
			this.x /= s;
			this.y /= s;
		} else {
			this.set(0, 0);
		}

		return this;
	},

	direction: function() {
		var v = this.clone().normalize();

		return Math.tan(v.x / v.y);
	},

	setDirection: function(direction, length) {
		this.x = Math.cos(direction) * length;
		this.y = -Math.sin(direction) * length;
	},

	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	setLength: function(l) {
		var oldLength = this.length();

		if (oldLength !== 0 && l !== oldLength) {
			this.multiplyScalar(l / oldLength);
		}

		return this;

	},

	normalize: function() {
		return this.divideScalar(this.length());
	},

	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},

	clone: function() {
		return new Vector(this.x, this.y);
	}

};

var Catapult = function() {
		this.particles = [];
		this.position = new Vector(128, 258);
		this.theta = -Math.PI / 3;
	};

Catapult.prototype = {

	constructor: Catapult,

	draw: function(context) {
		context.save();
		context.translate(this.position.x, this.position.y);
		context.drawImage(images.catapult, - 24, - 24);
		context.rotate(this.theta);
		context.drawImage(images.arm, - 14, - 3);
		context.restore();
	}

};

var Particle = function(position, velocity, scale) {
		this.position = position;
		this.lastPosition = position.clone();
		this.velocity = velocity;
		this.scale = scale;
		this.rotation = Math.random() * Math.PI * 2;
		this.rotationSpeed = Math.random() * 20;
		this.alive = true;
	};

Particle.prototype = {

	constructor: Particle,

	move: function(duration) {
		//canvasData = canvasContext.getImageData(0, 0, WIDTH, HEIGHT);
		
		this.rotation += this.rotationSpeed * duration;
		this.rotationSpeed *= (1 - duration);

		this.velocity.sub(0, 1 / 2 * G * duration * duration);

		this.lastPosition.set(this.position.x, this.position.y);

		var vx = this.velocity.x * duration;
		var vy = this.velocity.y * duration;

		this.position.add(vx, - vy);

		var length = Math.floor(Math.sqrt(vx * vx + vy * vy)) + 1;
		var update = false;

		for (var i = 0; i < length; i += 1) {
			var x = Math.round(this.lastPosition.x + vx * i / length);
			var y = Math.round(this.lastPosition.y - vy * i / length);

			if (isSand(x, y)) {
				this.position.set(x, y);
				this.impact(x, y);
				update = true;

				break;
			}
		}

		if ((this.scale < 0.1) || (this.position.x < 0) || (this.position.x > WIDTH) || (this.position.y > HEIGHT)) {
			this.alive = false;
		}

		return update;
	},

	impact: function(x, y) {
		var mirror = new Vector(0, 0);

		if ((!isSand(x - 1, y)) || (!isSand(x + 1, y))) {
			mirror.add(1, 0);
		}

		if ((!isSand(x, y - 1)) || (!isSand(x, y + 1))) {
			mirror.add(0, 1);
		}

		if ((mirror.x === 0) && (mirror.y === 0)) {
			mirror.set(1, 0);
		}

		mirror.set(mirror.y, mirror.x).normalize();

		// v ' = 2 * (v . n) * n - v

		var vx = this.velocity.x;
		var vy = this.velocity.y;

		this.velocity.dot(mirror);
		this.velocity.multiplyScalar(2);
		this.velocity.x *= mirror.x;
		this.velocity.y *= mirror.y;
		this.velocity.x -= vx;
		this.velocity.y -= vy;
		this.velocity.multiplyScalar(0.3);

		canvasContext.save();
		canvasContext.strokeStyle = "white";
		canvasContext.lineWidth = 6 * this.scale;
		canvasContext.lineCap = "round";
		canvasContext.beginPath();
		canvasContext.moveTo(this.lastPosition.x, this.lastPosition.y);
		canvasContext.lineTo(this.position.x, this.position.y);
		canvasContext.stroke();
		canvasContext.restore();

		this.scale *= 0.5;

		if (this.scale > 0.1) {
			for (var i = 0; i < 5; i += 1) {
				// for a cool effect make this > 1;
				explode(this, this.scale * 0.2);
			}
		}
	},

	draw: function(context) {
		context.save();
		context.translate(this.position.x, this.position.y);
		context.scale(this.scale, this.scale);
		context.rotate(this.rotation);
		context.drawImage(images.particle, - 3, - 3);
		context.restore();
	}
};

function init() {
	canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.position = "absolute";
	canvas.style.zIndex = 1;

	overlay = document.createElement("canvas");
	overlay.id = "overlay";
	overlay.width = WIDTH;
	overlay.height = HEIGHT;
	overlay.style.position = "absolute";
	overlay.style.zIndex = 2;

	var content = document.getElementById("content");

	content.appendChild(canvas);
	document.addEventListener("mousedown", mouseDown, false);
	document.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("mouseup", mouseUp, false);
	content.appendChild(overlay);

	var div = document.createElement("div");
	div.id = "placeholder";
	div.style.width = WIDTH + "px";
	div.style.height = HEIGHT + "px";
	content.appendChild(div);

	initImage("catapult");
	initImage("arm");
	initImage("particle");

	canvasContext = canvas.getContext("2d");
	overlayContext = overlay.getContext("2d");

	catapult = new Catapult();

	var image = new Image();
	image.onload = function(event) {
		canvasContext.fillStyle = "white";
		canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

		var x = WIDTH - 550;
		canvasContext.drawImage(image, x, 0);
		canvasContext.strokeStyle = "white";
		canvasContext.lineWidth = 3;
		canvasContext.strokeRect(x + 1, 1, 551, 393);

		var y = 270;
		canvasContext.fillStyle = "black";
		canvasContext.fillRect(0, y, x + 3, 395 - y);

		canvasData = canvasContext.getImageData(0, 0, WIDTH, HEIGHT);
	};
	
	image.src = IMAGE_NAMES[parseInt(Math.random() * IMAGE_NAMES.length, 10)];

	run();
}

function initImage(name) {
	var image = new Image();
	image.src = name + ".png";
	images[name] = image;
}

function run() {
	requestAnimationFrame(run);

	var time = new Date().getTime() / 1000;
	var duration = time - lastTime;

	lastTime = time;
	
	if (duration > 0.1) {
		duration = 0.1;
	}
	
	activatePendingParticles();

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

function isSand(x, y) {
	if ((x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT)) {
		return false;
	}

	return canvasData.data[(x + y * WIDTH) * 4] < 128;
}

function addParticle(particle) {
	pendingParticles.push(particle);
}

function activatePendingParticles() {
	for (var i = 0; i < pendingParticles.length; i += 1) {
		if (particles.length > 50) {
			break;
		}

		particles.push(pendingParticles[i]);
	}

	pendingParticles = [];
}

function updateParticles(duration) {
	for (var i = 0; i < particles.length; i += 1) {
		var update = particles[i].move(duration);

		if (update) {
			canvasData = canvasContext.getImageData(0, 0, WIDTH, HEIGHT);
		}

		particles[i].draw(overlayContext);
	}
}

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
	for (var i = 0; i < 10; i += 1) {
		var direction = Math.random() * Math.PI * 2;
		var distance = Math.random() * 4 * INITIAL_PARTICLE_SIZE;
		var position = catapult.position.clone();
		position.add(Math.cos(direction) * distance, - Math.sin(direction) * distance);
		var particle = new Particle(position, new Vector(-dragPos.x * 2, dragPos.y * 2), INITIAL_PARTICLE_SIZE);

		addParticle(particle);
	}
}

function explode(particle, scale) {
	var length = particle.velocity.length();
	var velocity = new Vector(length * 2 * (Math.random() - 0.5), length * 2 * (Math.random() - 0.5));

	addParticle(new Particle(particle.position.clone(), velocity, scale));
}

function mouseDown(event) {
	isMouseDown = true;
}

function mouseMove(event) {
	if (isMouseDown) {
		event.preventDefault();
		dragPos = {
			x: event.clientX - canvas.offsetLeft - catapult.position.x,
			y: event.clientY - canvas.offsetTop - catapult.position.y
		};
	}
}

function mouseUp(event) {
	fire();
	isMouseDown = false;
	dragPos = null;
}

function message(msg) {
	document.getElementById("message").innerHTML = msg;
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
