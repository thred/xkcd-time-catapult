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
	function Sand(context, width, height) {
		this.context = context;
		this.width = width;
		this.height = height;

		this.sand = [this.width * this.height];
		this.projections = [this.width * this.height];
		this.imageData = context.getImageData(0, 0, this.width, this.height);
		this.data = this.imageData.data;

		for (var y = 0; y < this.height; y += 1) {
			for (var x = 0; x < this.width; x += 1) {
				var pos = x + y * this.width;
				this.sand[pos] = 1 - (this.data[pos * 4] / 255);
				this.projections[pos] = 0;
			}
		}

		this.allUpdated();
		this.compact();
		this.update();
	}

	Sand.prototype = {
		constructor: Sand,

		compact: function() {
			var self = this;

			function compactSand(x, y) {
				var pos = x + y * self.width;
				var value = self.sand[pos];

				if (value >= 1) {
					var compactValue = (self.sand[pos - self.width - 1] + 0.003 + self.sand[pos - self.width] + 0.003 + self.sand[pos - self.width + 1] + 0.003) / 3;

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

				for (var y = 1; y < this.height - 1; y += 1) {
					for (var x = 1; x < this.width - 1; x += 1) {
						modified |= compactSand(x, y);
						modified |= compactSand(this.width - 1 - x, this.height - 1 - x);
					}
				}
			}
			while (modified);

			this.allUpdated();
		},

		get: function(x, y) {
			x = Math.round(x);
			y = Math.round(y);

			if (x < 0) {
				x = 0;
			} else if (x >= this.width) {
				x = this.width - 1;
			}

			if (y < 0) {
				y = 0;
			} else if (y >= this.height) {
				y = this.height - 1;
			}

			return this.sand[x + y * this.width];
		},

		getMass: function(x, y) {
			return this.get(x, y) * Global.PARTICLE_MASS_PER_PIXEL;
		},

		addMass: function(x, y, mass) {
			if (mass <= 0) {
				return;
			}

			var self = this;
			var radius = 0.751501 * Math.pow(mass / Global.PARTICLE_DENSITY, 1 / 3) / Global.PARTICLE_SIZE_OF_PIXEL;
			var grain = Math.min(mass / Global.PARTICLE_DENSITY, 1);

			Util.forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
				var pos = posX + posY * self.width;

				self.sand[pos] += value;
			});

			this.updated(Math.floor(x - radius), Math.floor(y - radius), Math.ceil(x + radius), Math.ceil(y + radius));
		},

		removeMass: function(x, y, mass) {
			if (mass <= 0) {
				return;
			}

			var self = this;
			var radius = 0.751501 * Math.pow(mass / Global.PARTICLE_DENSITY, 1 / 3) / Global.PARTICLE_SIZE_OF_PIXEL;
			var grain = Math.min(mass / Global.PARTICLE_DENSITY, 1);

			Util.forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
				var pos = posX + posY * self.width;

				self.sand[pos] -= value;
			});

			this.updated(Math.floor(x - radius), Math.floor(y - radius), Math.ceil(x + radius), Math.ceil(y + radius));
		},

		setProjection: function(x, y) {
			x = Math.round(x);
			y = Math.round(y);

			if ((x < 0) || (y < 0) || (x >= this.width) || (y >= this.height)) {
				return;
			}

			this.projections[x + y * this.width] = 1;
			this.updated(x, y, x, y);
		},

		clearProjections: function() {
			for (var i = 0; i < this.width * this.height; i += 1) {
				this.projections[i] = 0;
			}

			this.allUpdated();
		},

		updated: function(minX, minY, maxX, maxY) {
			this.minX = Math.min(minX, this.minX);
			this.minY = Math.min(minY, this.minY);
			this.maxX = Math.max(maxX, this.maxX);
			this.maxY = Math.max(maxY, this.maxY);
		},

		allUpdated: function() {
			this.minX = 0;
			this.minY = 0;
			this.maxX = this.width;
			this.maxY = this.height;
		},

		resetUpdated: function() {
			this.minX = this.width;
			this.minY = this.height;
			this.maxX = 0;
			this.maxY = 0;
		},

		update: function(dt) {
			var time = new Date().getTime();

			var minX = Math.max(0, this.minX);
			var minY = Math.max(0, this.minY);
			var maxX = Math.min(this.width, this.maxX + 1);
			var maxY = Math.min(this.height, this.maxY + 1);
			var width = maxX - minX;
			var height = maxY - minY;

			this.resetUpdated();

			if ((width > 0) && (height > 0)) {
				var updateAll = (width >= this.width) && (height >= this.height);
				var projectionDecrement = dt / 0.25;

				for (var y = minY; y < maxY; y += 1) {
					var i = y * this.width + minX;
					var pos = i * 4 + 3;

					for (var x = minX; x < maxX; x += 1) {
						var value = this.sand[i];

						if (updateAll) {
							this.data[pos - 3] = 0;
							this.data[pos - 2] = 0;
							this.data[pos - 1] = 0;
						}

						if (Global.DRAW_COMPACTNESS) {
							this.data[pos - 3] = (value > 1) ? (1 - 1 / (value * value)) * 0xff : 0;
						}

						if (Global.DRAW_PROJECTIONS) {
							var projection = this.projections[i];

							if (projection > 0) {
								projection = this.projections[i] = Math.max(projection - projectionDecrement, 0);

								if (Global.DRAW_COMPACTNESS) {
									this.data[pos - 3] = 0xff * projection + this.data[pos - 3] * (1 - projection);
								} else {
									this.data[pos - 3] = 0xff * projection;
								}
								this.data[pos - 2] = 0xff * projection;
								this.updated(x, y, x, y);
							}
						}

						this.data[pos] = Math.max(0, Math.min(1, value)) * 0xff;

						i += 1;
						pos += 4;
					}
				}

				this.context.putImageData(this.imageData, 0, 0, minX, minY, width, height);

				//Util.message(minX + ", "+  minY + ", " + width + ", " + height);
			}

			//Util.message(new Date().getTime() - time);
		}
	};

	return Sand;
});