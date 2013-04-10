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

define("Util", ["Global"], function(Global) {
	return {
		getOffset: function(element) {
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
		},

		message: function(msg) {
			this.messageTo("message", msg);
		},

		messageTo: function(name, msg) {
			var elem = document.getElementById(name);

			if (elem) {
				elem.innerHTML = msg;
			}
		},

		forEachPixelInCircle: function(x, y, radius, f) {
			// squaring the circle
			var offsetX = x - Math.round(x);
			var offsetY = y - Math.round(y);
			var innerRadius = radius - 0.5;
			var outerRadius = radius + 0.5;
			var qInnerRadius = innerRadius * innerRadius;
			var qOuterRadius = outerRadius * outerRadius;

			// start painting the center
			this.forEachPixelInCircleSquare(x, y, 0, 0, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

			for (var r = 1; r < Math.ceil(outerRadius); r += 1) {
				// moving radial out
				this.forEachPixelInCircleSquare(x, y, 0, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
				this.forEachPixelInCircleSquare(x, y, - r, 0, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
				this.forEachPixelInCircleSquare(x, y, r, 0, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
				this.forEachPixelInCircleSquare(x, y, 0, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

				for (var h = 1; h < r; h += 1) {
					this.forEachPixelInCircleSquare(x, y, - h, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
					this.forEachPixelInCircleSquare(x, y, h, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

					this.forEachPixelInCircleSquare(x, y, - r, - h, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
					this.forEachPixelInCircleSquare(x, y, - r, h, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

					this.forEachPixelInCircleSquare(x, y, r, - h, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
					this.forEachPixelInCircleSquare(x, y, r, h, offsetX, offsetY, qInnerRadius, qOuterRadius, f);

					this.forEachPixelInCircleSquare(x, y, - h, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
					this.forEachPixelInCircleSquare(x, y, h, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
				}

				// painting the corners
				this.forEachPixelInCircleSquare(x, y, - r, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
				this.forEachPixelInCircleSquare(x, y, r, - r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
				this.forEachPixelInCircleSquare(x, y, - r, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
				this.forEachPixelInCircleSquare(x, y, r, r, offsetX, offsetY, qInnerRadius, qOuterRadius, f);
			}
		},

		forEachPixelInCircleSquare: function(x, y, ix, iy, offsetX, offsetY, qInnerRadius, qOuterRadius, f) {
			var posX = Math.round(x + ix);
			var posY = Math.round(y + iy);

			if ((posX < 0) || (posY < 0) || (posX >= Global.WIDTH) || (posY >= Global.HEIGHT)) {
				// outside of scope
				return;
			}

			var qDist = (ix + offsetX) * (ix + offsetX) + (iy + offsetY) * (iy + offsetY);

			if (qDist >= qOuterRadius) {
				// outside of circle
				return;
			}

			f(posX, posY, (qDist < qInnerRadius) ? 1 : (qDist - qOuterRadius) / (qInnerRadius - qOuterRadius));
		},

		toHex: function(d, padding) {
			var hex = parseInt(d, 10).toString(16);

			if (padding) {
				while (hex.length < padding) {
					hex = "0" + hex;
				}
			}

			return hex;
		}
	};
});