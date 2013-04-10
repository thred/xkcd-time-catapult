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

define("Main", ["Global", "Util", "Vector", "Catapult", "Sand", "Particle"], function(Global, Util, Vector, Catapult, Sand, Particle) {
	return {
		canvas: null,
		overlay: null,
		canvasContext: null,
		overlayContext: null,
		catapult: null,
		collapseCheck: [],
		isMouseDown: false,
		dragPos: null,
		imageLoading: 0,
		imageReady: 0,

		speedMultiplierIndex: 0,
		boulderSizeIndex: 0,
		boulderCountIndex: 1,

		init: function() {
			var self = this;
			
			// the canvases are positioned absolute, add a div as placeholder	
			var placeholder = document.getElementById("placeholder");
			placeholder.style.width = Global.WIDTH + "px";
			placeholder.style.height = Global.HEIGHT + "px";

			document.addEventListener("mousedown", function(event) {
				var offset = Util.getOffset(self.canvas);
				var left = event.clientX - offset.left;
				var top = event.clientY - offset.top;
				var v = new Vector(left - self.catapult.position.x, top - self.catapult.position.y);

				if (v.length() < 30) {
					self.isMouseDown = true;
				}
			}, false);
			document.addEventListener("mousemove", function(event) {
				if (self.isMouseDown) {
					event.preventDefault();

					var offset = Util.getOffset(self.canvas);
					var left = event.clientX - offset.left;
					var top = event.clientY - offset.top;

					self.dragPos = {
						x: left - self.catapult.position.x,
						y: top - self.catapult.position.y
					};
				}
			}, false);
			document.addEventListener("mouseup", function(event) {
				if (self.isMouseDown) {
					self.fire();
				}

				self.isMouseDown = false;
				self.dragPos = null;
			}, false);

			// create the catapult
			this.catapult = new Catapult();

			// load the images
			this.initImage("catapult");
			this.initImage("arm");
			this.initImage("particle");
			this.initImage("base");
		},

		reload: function() {
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
			content.insertBefore(this.canvas, placeholder);

			this.initImage("xkcd", Global.XKCD_IMAGES[parseInt(Math.random() * Global.XKCD_IMAGES.length, 10)].src);
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

			// find the height for the base
			var y = this.findBase(x + 3);

			// add the base for the catapult
			x -= Global.IMAGES.base.width - 3;
			this.canvasContext.drawImage(Global.IMAGES.base, x, y - 56);

			// place the catapult
			x = 132;
			y = this.findBase(x);

			this.catapult.position.set(x, y - 12);

			// init the sand
			Global.SAND = new Sand(this.canvasContext);

			// start the animation loop
			start();
		},

		findBase: function(x) {
			var data = this.canvasContext.getImageData(x, 0, 1, Global.HEIGHT).data;
			var y = Global.HEIGHT - 1;

			while (data[(y - 1) * 4] < 128) {
				y -= 1;
			}

			return y;
		},

		step: function(time, duration) {
			duration *= Global.SPEED_BUTTON.value();

			Util.messageTo("pendingParticles", Global.PENDING_PARTICLES.length);

			Global.activatePendingParticles();

			Util.messageTo("particles", Global.PARTICLES.length);

			this.overlayContext.clearRect(0, 0, Global.WIDTH, Global.HEIGHT);
			this.catapult.draw(this.overlayContext);
			
			Global.updateParticles(duration, this.overlayContext);
			Global.removeDeadParticles();

			var drag = this.dragPos;

			if (drag) {
				this.overlayContext.save();
				this.overlayContext.strokeStyle = "#884422";
				this.overlayContext.lineWidth = 3;
				this.overlayContext.translate(this.catapult.position.x, this.catapult.position.y);
				this.overlayContext.beginPath();
				this.overlayContext.moveTo(0, 0);
				this.overlayContext.lineTo(drag.x, drag.y);
				this.overlayContext.stroke();
				this.overlayContext.restore();
			}
		},

		fire: function() {
			for (var i = 0; i < Global.BOULDER_COUNT_BUTTON.value(); i += 1) {
				var direction = Math.random() * Math.PI * 2;
				var distance = (i > 0) ? Math.random() * Global.BOULDER_SIZE_BUTTON.value() / Math.PI / Global.PARTICLE_RADIUS : 0;
				var position = this.catapult.position.clone();
				position.add(Math.cos(direction) * distance, - Math.sin(direction) * distance);
				var particle = new Particle(position, new Vector(-this.dragPos.x * 3, this.dragPos.y * 3), Global.BOULDER_SIZE_BUTTON.value());

				Global.addParticle(particle);
			}
		}
	};
});