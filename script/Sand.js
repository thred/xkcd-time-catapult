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

define("Sand", ["Global", "Util"], function(Global, Util) {
	function Sand(context) {
		this.context = context;
		this.sand = [Global.WIDTH * Global.HEIGHT];
		this.projections = [Global.WIDTH * Global.HEIGHT];
		this.imageData = context.getImageData(0, 0, Global.WIDTH, Global.HEIGHT);
		this.data = this.imageData.data;

		for (var y = 0; y < Global.HEIGHT; y += 1) {
			for (var x = 0; x < Global.WIDTH; x += 1) {
				var pos = x + y * Global.WIDTH;
				this.sand[pos] = 1 - (this.data[pos * 4] / 255);
				this.projections[pos] = 0;
			}
		}

		this.compact();
		this.update();
	}

	Sand.prototype = {
		constructor: Sand,

		compact: function() {
			var self = this;

			function compactSand(x, y) {
				var pos = x + y * Global.WIDTH;
				var value = self.sand[pos];

				if (value >= 1) {
					var compactValue = (self.sand[pos - Global.WIDTH - 1] + 0.005 + self.sand[pos - Global.WIDTH] + 0.002 + self.sand[pos - Global.WIDTH + 1] + 0.002) / 3;

					if (value < compactValue) {
						self.sand[pos] = compactValue;
						return true;
					}
				}

				return false;
			}

			var modified;

			do {
				modified = false;

				for (var y = 1; y < Global.HEIGHT - 1; y += 1) {
					for (var x = 1; x < Global.WIDTH - 1; x += 1) {
						modified |= compactSand(x, y);
						modified |= compactSand(Global.WIDTH - 1 - x, Global.HEIGHT - 1 - x);
					}
				}
			}
			while (modified);
		},

		get: function(x, y) {
			x = Math.round(x);
			y = Math.round(y);

			if (x < 0) {
				x = 0;
			} else if (x >= Global.WIDTH) {
				x = Global.WIDTH - 1;
			}

			if (y < 0) {
				y = 0;
			} else if (y >= Global.HEIGHT) {
				y = Global.HEIGHT - 1;
			}

			return this.sand[x + y * Global.WIDTH];
		},

		getMass: function(x, y) {
			return this.get(x, y) * Global.PARTICLE_MASS_PER_PIXEL;
		},

		addMass: function(x, y, mass) {
			if (mass <= 0) {
				return;
			}

			var self = this;
			var radius = 0.751501 * Math.pow(mass / Global.PARTICLE_DENSITY, 1 / 3);
			var grain = Math.min(mass / Global.PARTICLE_DENSITY, 1);

			Util.forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
				var pos = posX + posY * Global.WIDTH;

				self.sand[pos] += value;
			});
		},

		removeMass: function(x, y, mass) {
			if (mass <= 0) {
				return;
			}

			if (mass <= 0) {
				return;
			}

			var self = this;
			var radius = 0.751501 * Math.pow(mass / Global.PARTICLE_DENSITY, 1 / 3);
			var grain = Math.min(mass / Global.PARTICLE_DENSITY, 1);

			Util.forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
				var pos = posX + posY * Global.WIDTH;

				self.sand[pos] -= value;
			});
		},

		setProjection: function(x, y) {
			x = Math.round(x);
			y = Math.round(y);

			if ((x < 0) || (y < 0) || (x >= Global.WIDTH) || (y >= Global.HEIGHT)) {
				return;
			}

			this.projections[x + y * Global.WIDTH] = 1;
		},

		update: function(dt) {
			var time = new Date().getTime();
			var projectionDecrement = dt / 0.2;
			var color = [0, 0, 0];
			var pos = 0;

			for (var i = 0; i < Global.WIDTH * Global.HEIGHT; i += 1) {
				//this.colorCode(color, i, projectionDecrement);
				var value = this.sand[i];

				if (value <= 0) {
					this.data[pos++] = 255;
					this.data[pos++] = 255;
					this.data[pos++] = 255;
					this.data[pos++] = 255;
					continue;
				} else if (value <= 1) {
					this.data[pos++] = this.data[pos++] = this.data[pos++] = 255 - value * 255;
				} else if (Global.DRAW_COMPACTNESS) {
					value = 1 / value;
					value *= value;

					this.data[pos++] = (1 - value) * 255;
					this.data[pos++] = this.data[pos++] = 0;
				} else {
					this.data[pos++] = this.data[pos++] = this.data[pos++] = 0;
				}

				if (Global.DRAW_PROJECTIONS) {
					var projection = this.projections[i];

					if (projection > 0) {
						this.projections[i] = Math.max(projection - projectionDecrement, 0);

						this.data[pos - 3] = 0xff * projection + this.data[pos - 3] * (1 - projection);
						this.data[pos - 2] = 0xff * projection + this.data[pos - 2] * (1 - projection);
					}
				}

				this.data[pos++] = 255;
			}

			this.context.putImageData(this.imageData, 0, 0);
		}
	};

	return Sand;
});