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

var Sand = function(data) {
		this.sand = [WIDTH * HEIGHT];

		for (var y = 0; y < HEIGHT; y += 1) {
			for (var x = 0; x < WIDTH; x += 1) {
				var pos = x + y * WIDTH;
				this.sand[pos] = 1 - (data[pos * 4] / 255);
			}
		}
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

	add: function(x, y, mass) {
		if (mass <= 0) {
			return;
		}

		this.set(x, y, mass + this.get(x, y));
	},

	remove: function(x, y, mass) {
		if (mass <= 0) {
			return;
		}

		this.set(x, y, - mass - this.get(x, y));
	},

	set: function(x, y, mass) {
		var self = this;

		if (mass === 0) {
			return;
		}

		var radius = Math.sqrt(Math.abs(mass / Math.PI));
		var grain = (mass < 0) ? Math.max(mass, - 1) : Math.min(mass, 1);

		forEachPixelInCircle(x, y, radius, function(posX, posY, value) {
			var pos = posX + posY * WIDTH;

			self.sand[pos] = Math.max(0, Math.min(1, self.sand[pos] + grain * value));

			// draw the new value onto the canvas
			var col = toHex(255 - self.sand[pos] * 255, 2);

			self.draw(posX, posY, "#" + col + col + col);
		});
	},

	draw: function(x, y, style) {
		canvasContext.save();
		canvasContext.fillStyle = style;
		canvasContext.fillRect(x, y, 1, 1);
		canvasContext.restore();
	}
};
