var WIDTH = 800;
var HEIGHT = 359;

var INITIAL_PARTICLE_MASS = Math.PI * 10;
var INITIAL_PARTICLE_COUNT = 1;
var MAX_PARTICLES = 2000;
var PARTICLE_RADIUS = 3; // the image is 6x6
var DRAW_MOVEMENT = false;

var G = 12500;
var AIR_FRICTION = 0.25;
var BOUNCYNESS = 0.33;
var COMPACTNESS = 0.75;
var PARTICLE_DIE_MASS = 0.5;

var IMAGE_NAMES = ["time121.png", "time174.png", "time181.png", "time211.png", "time231.png", "timeUnknown1.png"];

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

		return this;
	},

	sub: function(x, y) {
		this.x -= x;
		this.y -= y;

		return this;
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
		var result = Math.atan(v.y / v.x);

		if (v.x < 0) {
			result += Math.PI;
		}

		return result;
	},

	setDirection: function(direction, length) {
		this.x = Math.cos(direction) * length;
		this.y = -Math.sin(direction) * length;

		return this;
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

var Particle = function(position, movement, mass) {
		this.position = position;
		this.lastPosition = position.clone();
		this.movement = movement;
		this.mass = mass;
		this.rotation = Math.random() * Math.PI * 2;
		this.rotationSpeed = Math.random() * 20;
		this.alive = true;
	};

Particle.prototype = {

	constructor: Particle,

	radius: function() {
		return Math.sqrt(this.mass / Math.PI);
	},

	force: function() {
		return this.mass * this.velocity();
	},

	velocity: function() {
		return this.movement.length();
	},

	move: function(duration) {
		// update the particles own rotation
		this.rotation += this.rotationSpeed * duration;
		this.rotationSpeed *= (1 - duration);

		// apply gravity to particle
		this.movement.sub(0, 1 / 2 * G * duration * duration);

		// apply air friction
		this.movement.multiplyScalar(1 - (AIR_FRICTION * duration));

		// store the last position of the particle
		this.lastPosition.set(this.position.x, this.position.y);

		// calculate the movement of the particle
		var vx = this.movement.x * duration;
		var vy = this.movement.y * duration;

		// set the new position
		this.position.add(vx, - vy);

		// check the path for impact
		var length = Math.floor(Math.sqrt(vx * vx + vy * vy)) + 1;

		for (var i = 0; i < length; i += 1) {
			var x = Math.round(this.lastPosition.x + vx * i / length);
			var y = Math.round(this.lastPosition.y - vy * i / length);

			// check impact on path
			if (sand.get(x, y) >= 0.5) {
				// there was an impact, update the particles position and calculate the impact
				// the position is set to the location prior of impact
				x = Math.round(this.lastPosition.x + vx * (i - 1) / length);
				y = Math.round(this.lastPosition.y - vy * (i - 1) / length);

				this.position.set(x, y);
				this.impact();
				break;
			}
		}

		if ((this.position.x < 0) || (this.position.x >= WIDTH) || (this.position.y >= HEIGHT)) {
			// the particle has left the screen
			this.alive = false;
		}
	},

	/**
	 * particle had impact 
	 */
	impact: function() {
		// calculate the vector for mirroring the movement of the particle
		var mirror = new Vector(0, 0);

		if ((sand.get(this.position.x - 1, this.position.y) >= 0.5) || (sand.get(this.position.x + 1, this.position.y) >= 0.5)) {
			mirror.add(1, 0);
		}

		if ((sand.get(this.position.x, this.position.y - 1) >= 0.5) || (sand.get(this.position.x, this.position.y + 1) >= 0.5)) {
			mirror.add(0, 1);
		}

		if ((mirror.x === 0) && (mirror.y === 0)) {
			mirror.set(1, 0);
		}

		// mirror along the normal
		mirror.set(mirror.y, mirror.x).normalize();

		if (!this.explode()) {
			// bounce off or die
			if (this.suggestDeath()) {
				return;
			}

			// mirror the movement of the particle along the mirror vector
			// v ' = 2 * (v . n) * n - v
			var vx = this.movement.x;
			var vy = this.movement.y;

			this.movement.dot(mirror);
			this.movement.multiplyScalar(2);
			this.movement.x *= mirror.x;
			this.movement.y *= mirror.y;
			this.movement.x -= vx;
			this.movement.y -= vy;

			// slow the particle down
			this.movement.multiplyScalar(BOUNCYNESS);
		}

		this.mass *= 0.5;
	},

	explode: function() {
		var radius = this.radius();
		var maxDist = radius * radius;
		var direction = this.movement.direction();
		var velocity = this.velocity();
		var totalMass = 0;
		
		// calculate the force needed for the explosion
		for (var iy = -radius; iy <= radius; iy += 1) {
			for (var ix = -radius; ix <= radius; ix += 1) {
				if (ix * ix + iy * iy <= maxDist) {
					totalMass += sand.get(this.position.x + ix, this.position.y + iy) * Math.PI;
				}
			}
		}

		if (totalMass <= 0) {
			// no mass!? abort
			return false;
		}

		// the force of the impact
		var impactForce = this.mass * velocity;
		
		if (impactForce <= totalMass) {
			// not enough force to trigger explosion
			return false;
		}
		
		var remainingForce = impactForce;
		
		// project the force to all particless
		for (var iy = -radius; iy <= radius; iy += 1) {
			for (var ix = -radius; ix <= radius; ix += 1) {
				if (ix * ix + iy * iy <= maxDist) {
					var force = impactForce / totalMass * (sand.get(this.position.x + ix, this.position.y + iy) * Math.PI);

					if (this.project(this.position.x + ix, this.position.y + iy, direction + (Math.random() - 0.5) * (Math.PI / 2), force)) {
						// the force was projected
						remainingForce -= force;
					}
				}
			}
		}
		
		
		if (remainingForce <= this.mass) {
			return false;
		}

		this.movement.setLength(remainingForce / this.mass);
		
		return true;
	},

	project: function(x, y, direction, force, projected) {
		if ((x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT)) {
			return false;
		}

		var grain = sand.get(x, y);

		if (!grain) {
			return false;
		}

		// track the particles path, it may project its force
		var movement = new Vector().setDirection(direction, 1);
		var position = new Vector(x, y).add(movement.x, movement.y);

		if (sand.get(position.x, position.y) > 0) {
			// there is a particle in the way, project the force
			//sand.draw(position.x, position.y, "orange");

			if (force / Math.PI < Math.PI) {
				// not enough force, abort
				return false;
			}

			var result = this.project(position.x, position.y, direction, force * COMPACTNESS, true);

			if (projected) {
				return result;
			}

			// this was the initial call, the force could not be projected
		}

		var mass = Math.PI * grain;
		
		movement.setLength(force / mass);
		position.set(x, y);

		var particle = new Particle(position, movement, mass);

		addParticle(particle);
		sand.add(position.x, position.y, 0.7, - 1);

		return true;
	},

	suggestDeath: function() {
		if (this.force() > Math.PI * 2) {
			return false;
		}

		// HELLO.
		sand.add(this.position.x, this.position.y, this.radius(), this.mass);
		this.alive = false;

		return true;
	},

	draw: function(context) {
		context.save();
		context.translate(this.position.x, this.position.y);

		if (DRAW_MOVEMENT) {
			// draw movement
			context.strokeStyle = "#aaaaff";
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(this.movement.x, - this.movement.y);
			context.stroke();
		}

		var scale = Math.max(this.radius() / PARTICLE_RADIUS, 0.5 / PARTICLE_RADIUS);
		context.scale(scale, scale);
		context.rotate(this.rotation);
		context.drawImage(images.particle, - PARTICLE_RADIUS, - PARTICLE_RADIUS);

		context.restore();
	}
};

var Sand = function(data) {
		this.sand = [];

		for (var y = 0; y < HEIGHT; y += 1) {
			for (var x = 0; x < WIDTH; x += 1) {
				var pos = x + y * WIDTH;
				this.sand[pos] = 1 - (data[pos * 4] / 255);
			}
		}

		//this.draw();
	};

Sand.prototype = {
	constructor: Sand,

	get: function(x, y) {
		x = Math.round(x);
		y = Math.round(y);

		if (x < 0) {
			x = 0;
		} else if (x >= WIDTH) {
			x = WIDTH - 1;
		}

		if (y < 0) {
			y = 0;
		} else if (y >= HEIGHT) {
			y = HEIGHT - 1;
		}

		return this.sand[x + y * WIDTH];
	},

	add: function(x, y, radius, value) {
		var fade = radius * 0.5;
		var innerRadius = radius - fade;
		var outerRadius = radius + fade;
		var inner = innerRadius * innerRadius;
		var outer = outerRadius * outerRadius;

		x = Math.round(x);
		y = Math.round(y);

		for (var iy = -Math.floor(outerRadius); iy <= Math.ceil(outerRadius); iy += 1) {
			for (var ix = -Math.floor(outerRadius); ix <= Math.ceil(outerRadius); ix += 1) {
				var posX = x + ix;
				var posY = y + iy;

				if ((posX >= 0) && (posY >= 0) && (posX < WIDTH) && (posY < HEIGHT)) {
					var dist = ix * ix + iy * iy;

					if (dist >= outer) {
						continue;
					}

					var pos = posX + posY * WIDTH;
					var v = 0;

					if (dist < inner) {
						v = value;
					} else {
						v = value - (value * (dist - inner) / (outer - inner));
					}

					this.sand[pos] = Math.max(0, Math.min(1, this.sand[pos] + v));
					var col = toHex(255 - this.sand[pos] * 255, 2);

					this.draw(posX, posY, "#" + col + col + col);
				}
			}
		}
	},

	set: function(x, y, sand) {
		this.add(x, y, 1, (!sand) ? -1 : sand);
		/*
		x = Math.round(x);
		y = Math.round(y);

		if ((x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT)) {
			return;
		}

		this.sand[x + y * WIDTH] = sand;

		var value = parseInt(255 - sand * 255, 10);

		canvasContext.save();
		canvasContext.fillStyle = "#" + toHex(value) + toHex(value) + toHex(value);
		canvasContext.fillRect(x, y, 1, 1);
		canvasContext.restore();
		*/
	},

	draw: function(x, y, style) {
		canvasContext.save();
		canvasContext.fillStyle = style;
		canvasContext.fillRect(x, y, 1, 1);
		canvasContext.restore();
	}


	/*,

	draw: function() {
		canvasContext.save();

		for (var y = 0; y < HEIGHT; y += 1) {
			for (var x = 0; x < WIDTH; x += 1) {
				var value = toHex(255 - this.sand[x + y * WIDTH] * 255);

				canvasContext.fillStyle = "#" + value + value + value;
				canvasContext.fillRect(x, y, 1, 1);
			}
		}

		canvasContext.restore();
	}*/
};

function init() {
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
	var content = document.getElementById("content");
	content.appendChild(canvas);
	document.addEventListener("mousedown", mouseDown, false);
	document.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("mouseup", mouseUp, false);
	content.appendChild(overlay);

	// the canvases are positioned absolute, add a div as placeholder	
	var div = document.createElement("div");
	div.id = "placeholder";
	div.style.width = WIDTH + "px";
	div.style.height = HEIGHT + "px";
	content.appendChild(div);

	// load the images
	initImage("catapult");
	initImage("arm");
	initImage("particle");

	// create the catapult
	catapult = new Catapult();

	// load the background image
	var image = new Image();
	image.onload = function(event) {
		// make the background titanium white where the happy castle lives
		canvasContext.fillStyle = "white";
		canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

		// draw the castle
		var x = WIDTH - 550;
		canvasContext.drawImage(image, x, 0);
		canvasContext.strokeStyle = "white";
		canvasContext.lineWidth = 3;
		canvasContext.strokeRect(x + 1, 1, 551, 393);

		// add some place for the catapult on the left
		var y = 270;
		canvasContext.fillStyle = "black";
		canvasContext.fillRect(0, y, x + 3, 395 - y);

		// init the sand
		sand = new Sand(canvasContext.getImageData(0, 0, WIDTH, HEIGHT).data);
	};
	image.src = IMAGE_NAMES[parseInt(Math.random() * IMAGE_NAMES.length, 10)];

	// start the animation loop
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

	runCollapseCheck();
	activatePendingParticles();

	document.getElementById("particles").innerHTML = particles.length;

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

function addParticle(particle) {
	pendingParticles.push(particle);
}

function activatePendingParticles() {
	for (var i = 0; i < pendingParticles.length; i += 1) {
		if (particles.length > MAX_PARTICLES) {
			break;
		}

		particles.push(pendingParticles[i]);
	}

	pendingParticles = [];
}

function updateParticles(duration) {
	for (var i = 0; i < particles.length; i += 1) {
		particles[i].move(duration);
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
	for (var i = 0; i < INITIAL_PARTICLE_COUNT; i += 1) {
		var direction = Math.random() * Math.PI * 2;
		var distance = Math.random() * 3;
		var position = catapult.position.clone();
		position.add(Math.cos(direction) * distance, - Math.sin(direction) * distance);
		var particle = new Particle(position, new Vector(-dragPos.x * 2, dragPos.y * 2), INITIAL_PARTICLE_MASS);

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
function mouseDown(event) {
	var v = new Vector(event.clientX - canvas.offsetLeft - catapult.position.x, event.clientY - canvas.offsetTop - catapult.position.y);

	if (v.length() < 30) {
		isMouseDown = true;
	}
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
	if (isMouseDown) {
		fire();
	}

	isMouseDown = false;
	dragPos = null;
}

function message(msg) {
	document.getElementById("message").innerHTML = msg;
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
