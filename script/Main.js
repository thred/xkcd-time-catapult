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

define("Main", ["Global", "Util", "Button", "Vector", "Catapult", "Sand", "Particle"], function(Global, Util, Button, Vector, Catapult, Sand, Particle) {
	Global.BUTTONS = {
		reload: new Button("reload-button", [{
			src: "asset/button-reload.png",
			value: 0
		}],
		0, function(value) {
			require("Main").reload();
		}),

		speed: new Button("speed-button", [{
			src: "asset/button-normal.png",
			value: 1
		}, {
			src: "asset/button-slow.png",
			value: 1 / 4
		}, {
			src: "asset/button-slower.png",
			value: 1 / 10
		}, {
			src: "asset/button-slowest.png",
			value: 1 / 60
		}]),

		gravity: new Button("gravity-button", [{
			src: "asset/button-gravity-earth.png",
			value: {
				name: "Earth",
				g: 9.81,
				densityAtmosphere: 1.2041
			}
		}, {
			src: "asset/button-gravity-moon.png",
			value: {
				name: "Luna",
				g: 1.62,
				densityAtmosphere: 0
			}
		}, {
			src: "asset/button-gravity-mars.png",
			value: {
				name: "Mars",
				g: 3.69,
				densityAtmosphere: 0.020
			}
		}, {
			src: "asset/button-gravity-venus.png",
			value: {
				name: "Venus",
				g: 8.87,
				densityAtmosphere: 65
			}
		}, {
			src: "asset/button-gravity-jupiter.png",
			value: {
				name: "Jupiter",
				g: 24.79,
				densityAtmosphere: 0.16
			}
		}], 0, function(value) {
			require("Global").setupParticleConstants(require("Main").xkcdImage.sizeOfPixel, Global.BUTTONS.gravity.value(), Global.BUTTONS.particle.value());
		}),

		particle: new Button("particle-button", [{
			src: "asset/button-particle-sand.png",
			value: {
				name: "Sand",
				density: 2000,
				friction: 0.4,
				absorbsion: 0.15,
				bouncyness: 0.01
			}
		}, {
			src: "asset/button-particle-iron.png",
			value: {
				name: "Iron",
				density: 7874,
				friction: 0.8,
				absorbsion: 0.01,
				bouncyness: 0.01
			}
		}, {
			src: "asset/button-particle-wood.png",
			value: {
				name: "Wood",
				density: 470,
				friction: 0.25,
				absorbsion: 0.033,
				bouncyness: 0.25
			}
		}, {
			src: "asset/button-particle-snow.png",
			value: {
				name: "Snow",
				density: 300,
				friction: 1.05,
				absorbsion: 0.10,
				bouncyness: 0.00
			}
		}, {
			src: "asset/button-particle-rubber.png",
			value: {
				name: "Rubber",
				density: 1100,
				friction: 0.9,
				absorbsion: 0.05,
				bouncyness: 0.75
			}
		}, {
			src: "asset/button-particle-polystyrene.png",
			value: {
				name: "Polystyrene",
				density: 105,
				friction: 0.5,
				absorbsion: 0.15,
				bouncyness: 0.1
			}
		}], 0, function(value) {
			require("Global").setupParticleConstants(require("Main").xkcdImage.sizeOfPixel, Global.BUTTONS.gravity.value(), Global.BUTTONS.particle.value());
		}),

		collapsing: new Button("collapsing-button", [{
			src: "asset/button-collapsing-on.png",
			value: true
		}, {
			src: "asset/button-collapsing-off.png",
			value: false
		}], 0, function(value) {
			require("Global").COLLAPSING = value;
		}),

		boulderSize: new Button("boulder-size-button", [{
			src: "asset/button-boulder-small.png",
			value: 2
		}, {
			src: "asset/button-boulder-medium.png",
			value: 4
		}, {
			src: "asset/button-boulder-large.png",
			value: 6
		}], 1),

		boulderCount: new Button("boulder-count-button", [{
			src: "asset/button-boulder-one.png",
			value: 1
		}, {
			src: "asset/button-boulder-few.png",
			value: 3
		}, {
			src: "asset/button-boulder-many.png",
			value: 8
		}], 0)
	};

	return {
		canvas: null,
		overlay: null,
		canvasContext: null,
		overlayContext: null,
		catapult: null,
		imageLoading: 0,
		imageReady: 0,

		fpsAverage: 0,
		fpsTime: Math.floor(new Date().getTime() / 100),

		init: function() {
			var self = this;

			// the canvases are positioned absolute, add a div as placeholder	
			var placeholder = document.getElementById("placeholder");
			placeholder.style.width = Global.WIDTH + "px";
			placeholder.style.height = Global.HEIGHT + "px";

			function onMouseDown(event) {
				var offset = Util.getOffset(self.canvas);

				if (self.catapult.start("mouse", event.clientX - offset.left, event.clientY - offset.top)) {
					event.preventDefault();
				}
			}

			function onMouseMove(event) {
				var offset = Util.getOffset(self.canvas);

				if (self.catapult.move("mouse", event.clientX - offset.left, event.clientY - offset.top)) {
					event.preventDefault();
				}
			}

			function onMouseUp(event) {
				var offset = Util.getOffset(self.canvas);

				if (self.catapult.release("mouse", event.clientX - offset.left, event.clientY - offset.top)) {
					event.preventDefault();
				}
			}

			document.addEventListener("mousedown", onMouseDown, false);
			document.addEventListener("mousemove", onMouseMove, false);
			document.addEventListener("mouseup", onMouseUp, false);

			function onTouchStart(event) {
				var offset = Util.getOffset(self.canvas);
				var touches = event.changedTouches;

				for (var i = 0; i < touches.length; i += 1) {
					if (self.catapult.start(touches[i].identifier, touches[i].pageX - offset.left, touches[i].pageY - offset.top)) {
						event.preventDefault();
					}
				}
			}

			function onTouchMove(event) {
				var offset = Util.getOffset(self.canvas);
				var touches = event.changedTouches;

				for (var i = 0; i < touches.length; i += 1) {
					if (self.catapult.move(touches[i].identifier, touches[i].pageX - offset.left, touches[i].pageY - offset.top)) {
						event.preventDefault();
					}
				}
			}

			function onTouchEnd(event) {
				var offset = Util.getOffset(self.canvas);
				var touches = event.changedTouches;

				for (var i = 0; i < touches.length; i += 1) {
					if (self.catapult.release(touches[i].identifier, touches[i].pageX - offset.left, touches[i].pageY - offset.top)) {
						event.preventDefault();
					}
				}
			}
			
			function onTouchCancel(event) {
				var touches = event.changedTouches;

				for (var i = 0; i < touches.length; i += 1) {
					self.catapult.cancel(touches[i].identifier);
				}
			}

			document.addEventListener("touchstart", onTouchStart, false);
			document.addEventListener("touchmove", onTouchMove, false);
			document.addEventListener("touchend", onTouchEnd, false);
			document.addEventListener("touchcancel", onTouchCancel, false);
			document.addEventListener("touchleave", onTouchCancel, false);

			function onHashChange(event) {
				var hash = location.hash.replace("#", "");
				
				if ((!self.xkcdImage) || (self.xkcdImage.name != hash)) {
					self.reload(true);
				}
			}
			
			window.addEventListener("hashchange", onHashChange, false);
			
			// create the catapult
			this.catapult = new Catapult();

			// load the images
			this.initImage("catapult");
			this.initImage("arm");
			this.initImage("particle");

			for (var name in Global.BUTTONS) {
				Global.BUTTONS[name].update();
			}
		},

		reload: function(byHash) {
			stop();

			Global.clearParticles();

			this.isMouseDown = false;
			this.dragPos = null;

			var content = document.getElementById("content");

			if (this.canvas) {
				content.removeChild(this.canvas);
			}

			if (this.overlay) {
				content.removeChild(this.overlay);
			}

			// create the canvas for the background (the sand)
			this.canvas = document.createElement("canvas");
			this.canvas.id = "canvas";
			this.canvas.width = Global.WIDTH;
			this.canvas.height = Global.HEIGHT;
			this.canvas.style.position = "absolute";
			this.canvas.style.zIndex = 256;
			this.canvasContext = this.canvas.getContext("2d");

			// create the canvas for the foreground (the flying particles)
			this.overlay = document.createElement("canvas");
			this.overlay.id = "overlay";
			this.overlay.width = Global.WIDTH;
			this.overlay.height = Global.HEIGHT;
			this.overlay.style.position = "absolute";
			this.overlay.style.zIndex = 257;
			this.overlayContext = this.overlay.getContext("2d");

			// put the canvases on the document and place the mouse listeners
			var placeholder = document.getElementById("placeholder");
			content.insertBefore(this.overlay, placeholder);
			content.insertBefore(this.canvas, this.overlay);

			// init the images
			this.xkcdImage = this.findXkcdImage(byHash);

			location.hash = this.xkcdImage.name;

			Global.setupParticleConstants(this.xkcdImage.sizeOfPixel, Global.BUTTONS.gravity.value(), Global.BUTTONS.particle.value());
			this.catapult.launchVelocityPerPixel = this.xkcdImage.launchVelocityPerPixel;

			this.initImage("base", this.xkcdImage.base.src);
			this.initImage("xkcd", this.xkcdImage.src);
		},

		findXkcdImage: function(byHash) {
			if (byHash) {
				var hash = location.hash.replace("#", "");

				if (hash) {
					for (var i = 0; i < Global.XKCD_IMAGES.length; i += 1) {
						if (hash == Global.XKCD_IMAGES[i].name) {
							return Global.XKCD_IMAGES[i];
						}
					}
				}
			}

			var result;

			do {
				result = Global.XKCD_IMAGES[parseInt(Math.random() * Global.XKCD_IMAGES.length, 10)];
			}
			while (result.secret);

			return result;
		},

		initImage: function(name, src) {
			var self = this;
			src = src || ("asset/" + name + ".png");

			var image = new Image();

			this.imageLoading += 1;
			image.onload = function(event) {
				self.imageReady += 1;

				if (self.imageReady == self.imageLoading) {
					self.imagesReady.call(self);
				}

			};
			image.src = src;
			Global.IMAGES[name] = image;
		},

		imagesReady: function() {
			// we use some titanium white for the background
			this.canvasContext.fillStyle = "white";
			this.canvasContext.fillRect(0, 0, Global.WIDTH, Global.HEIGHT);

			// draw the castle
			var x = Global.WIDTH - 550;
			this.canvasContext.drawImage(Global.IMAGES.xkcd, x, 0);
			this.canvasContext.strokeStyle = "white";
			this.canvasContext.lineWidth = 3;
			this.canvasContext.strokeRect(x + 1, 1, 551, 393);

			var oneMeter = 1 / Global.PARTICLE_SIZE_OF_PIXEL;
			var toDraw = (oneMeter > 50) ? 1 : (oneMeter > 30) ? 5 : 10;

			var y = this.xkcdImage.baseOffsetY;

			// Util.message(Global.XKCD_IMAGES.indexOf(this.xkcdImage) + ", " + this.findBlack(x + 3) + ", " + this.findWhite(x + 3));
			// add the base for the catapult
			x -= Global.IMAGES.base.width - 3;
			this.canvasContext.drawImage(Global.IMAGES.base, x, y + this.xkcdImage.base.yOffset);

			// place the catapult
			x = 132;
			y = this.findBlack(x);

			this.catapult.position.set(x, y - 12);

			// draw the scale
			this.canvasContext.save();
			this.canvasContext.translate(Global.WIDTH - 80 - oneMeter * toDraw, Global.HEIGHT - 32);
			this.canvasContext.font = "normal 10px Lucida,Helvetica,sans-serif";
			this.canvasContext.textAlign = "center";
			this.canvasContext.fillStyle = "gray";
			this.canvasContext.strokeStyle = "gray";
			this.canvasContext.lineWidth = 1;
			this.canvasContext.lineCap = "round";
			this.canvasContext.beginPath();
			this.canvasContext.moveTo(0, 0);
			this.canvasContext.lineTo(oneMeter * toDraw, 0);
			this.canvasContext.stroke();

			for (var i = 0; i <= toDraw; i += 1) {
				this.canvasContext.beginPath();
				this.canvasContext.moveTo(i * oneMeter, - 2);
				this.canvasContext.lineTo(i * oneMeter, 2);
				this.canvasContext.stroke();
			}

			for (i = 0; i <= 1; i += 1) {
				this.canvasContext.beginPath();
				this.canvasContext.moveTo(i * oneMeter * toDraw, - 8);
				this.canvasContext.lineTo(i * oneMeter * toDraw, 8);
				this.canvasContext.stroke();
				this.canvasContext.fillText((i * toDraw) + " m", i * oneMeter * toDraw, 20);
			}

			if (toDraw !== 5) {
				this.canvasContext.beginPath();
				this.canvasContext.moveTo(0.5 * oneMeter * toDraw, - 4);
				this.canvasContext.lineTo(0.5 * oneMeter * toDraw, 4);
				this.canvasContext.stroke();
			}

			this.canvasContext.restore();

			// init the sand
			Global.SAND = new Sand(this.canvasContext, Global.WIDTH, Global.HEIGHT);

			// start the animation loop
			start();
		},

		findWhite: function(x) {
			var data = this.canvasContext.getImageData(x, 0, 1, Global.HEIGHT).data;
			var y = Global.HEIGHT - 1;

			while (data[(y - 1) * 4] < 128) {
				y -= 1;
			}

			return y;
		},

		findBlack: function(x) {
			var data = this.canvasContext.getImageData(x, 0, 1, Global.HEIGHT).data;
			var y = 5;

			while (data[(y - 1) * 4] > 128) {
				y += 1;
			}

			return y;
		},

		step: function(time, dt) {
			this.fpsAverage = (this.fpsAverage * 3 + dt) / 4;

			if (Math.floor(time * 10) !== this.fpsTime) {
				Util.messageTo("fps", (1 / this.fpsAverage).toFixed(1));
				this.fpsTime = Math.floor(time * 10);
			}

			if (dt > 0.1) {
				dt = 0.1;
			}

			dt *= Global.BUTTONS.speed.value();

			Util.messageTo("pendingParticles", Global.PENDING_PARTICLES.length);

			Global.activatePendingParticles();
			Global.SAND.update(dt);

			Util.messageTo("particles", Global.PARTICLES.length);

			this.overlayContext.clearRect(0, 0, Global.WIDTH, Global.HEIGHT);
			this.catapult.draw(this.overlayContext);

			var statistics = Global.updateParticles(dt, this.overlayContext);

			Util.messageTo("movingMass", statistics.movingMass.toFixed(1));
			Util.messageTo("maxVelocity", statistics.maxVelocity.toFixed(1));

			Global.removeDeadParticles();
		},

		checkboxChanged: function(checkbox) {
			var value = checkbox.checked;

			if (checkbox.id == "draw-compactness-checkbox") {
				Global.DRAW_COMPACTNESS = value;
				Global.SAND.allUpdated();
			} else if (checkbox.id == "draw-movement-checkbox") {
				Global.DRAW_MOVEMENT = value;
			} else if (checkbox.id == "draw-projections-checkbox") {
				Global.DRAW_PROJECTIONS = value;
				Global.SAND.clearProjections();
			} else if (checkbox.id == "collapsing-checkbox") {
				Global.COLLAPSING = value;
			}
		}
	};
});