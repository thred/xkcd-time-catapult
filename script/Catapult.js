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

define("Catapult", ["Global", "Util", "Vector", "Particle"], function(Global, Util, Vector, Particle) {
	function Catapult() {
		this.particles = [];
		this.position = new Vector();
		this.theta = -Math.PI / 3;
	}

	Catapult.prototype = {
		aim: function(vector) {
			this.fireVector = vector;

			if (vector) {
				this.computeVelocity(vector);
			}
		},

		computeVelocity: function(vector) {
			return vector.length() * this.launchVelocityPerPixel;
		},

		fire: function(vector) {
			var radiusInPixel = Global.BUTTONS.boulderSize.value();
			var mass = 0.75 * Math.PI * Math.pow(radiusInPixel * Global.PARTICLE_SIZE_OF_PIXEL, 3) * Global.PARTICLE_DENSITY;
			var count = Global.BUTTONS.boulderCount.value();

			Util.messageTo("launchMass", (mass * count).toFixed(1));

			for (var i = 0; i < Global.BUTTONS.boulderCount.value(); i += 1) {
				var direction = Math.random() * Math.PI * 2;
				var distance = (i > 0) ? Math.random() * radiusInPixel : 0;
				var position = this.position.clone();

				position.add(Math.cos(direction) * distance, - Math.sin(direction) * distance);

				var movement = new Vector(-vector.x, vector.y);

				movement.setLength(this.computeVelocity(vector) / Global.PARTICLE_SIZE_OF_PIXEL);

				var particle = new Particle(position, movement, mass);

				Global.addParticle(particle, true);
			}
		},

		draw: function(context) {
			context.save();
			context.translate(this.position.x, this.position.y);
			context.drawImage(Global.IMAGES.catapult, - 24, - 24);
			context.save();
			context.rotate(this.theta);
			context.drawImage(Global.IMAGES.arm, - 14, - 3);
			context.restore();

			if (this.fireVector) {
				context.save();

				var direction = this.fireVector.direction();

				context.rotate(this.fireVector.direction());

				context.lineCap = "round";

				context.strokeStyle = "black";
				context.lineWidth = 4;
				context.beginPath();
				context.moveTo(0, 0);
				context.lineTo(this.fireVector.length(), 0);
				context.stroke();

				context.strokeStyle = "#ff8844";
				context.lineWidth = 3;
				context.beginPath();
				context.moveTo(0, 0);
				context.lineTo(this.fireVector.length(), 0);
				context.stroke();

				context.font = "bold 16px Lucida,Helvetica,sans-serif";
				context.textAlign = "center";
				context.fillStyle = "#ff8844";
				context.strokeStyle = "black";
				context.lineWidth = 1;
				context.fontWeight = "bold";

				context.save();
				context.translate(50, 0);

				var speed = this.computeVelocity(this.fireVector).toFixed(1) + " m/s";
				var dir;

				if (direction >= Math.PI / 2) {
					dir = (-(direction - Math.PI) / Math.PI * 180).toFixed(1) + "°";
					context.rotate(Math.PI);
				}
				else {
					dir = (direction / Math.PI * 180).toFixed(1) + "°";
				}

				context.strokeText(speed, 0, - 10);
				context.fillText(speed, 0, - 10);
				context.strokeText(dir, 0, 20);
				context.fillText(dir, 0, 20);

				context.restore();
				context.restore();
			}

			context.restore();
		}
	};

	return Catapult;
});